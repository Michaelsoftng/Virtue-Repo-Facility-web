/* eslint-disable @typescript-eslint/no-unused-vars */

import { ApolloLink, FetchResult } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';
import client from './apolloClient';
import { RefreshLogin } from '../src/graphql/mutations';
import { Observable, from } from 'rxjs';


let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

const resolvePendingRequests = () => {
    pendingRequests.forEach(callback => callback());
    pendingRequests = [];
};

export const refreshToken = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const { data } = await client.mutate({
        mutation: RefreshLogin,
        variables: { refreshToken },
    });

    if (data?.RefreshToken?.success) {
        const newToken = data.RefreshToken.token;
        const newRefreshToken = data.RefreshToken.refreshToken;

        // Update cookies with new tokens
        Cookies.set('accessToken', newToken, { expires: 1 / 24, path: '/' }); // 1 hour
        Cookies.set('refreshToken', newRefreshToken, { expires: 7, path: '/', secure: true });

        resolvePendingRequests();
        return newToken;
    } else {
        throw new Error('Failed to refresh token');
    }
};

// Helper function to handle redirects based on route
const handleRedirect = () => {
    const currentPath = window.location.pathname;

    if (currentPath.includes('facility')) {
        window.location.href = '/facility/login';
    } else if (currentPath.includes('admin')) {
        window.location.href = '/admin/login';
    } else {
        window.location.href = '/';
    }
};

// @ts-expect-error this is a type error and i am yet to figure it out
export const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    // List of public operations that don't require tokens
    const publicOperations = ['CreateUser', 'VerifyAccount', 'ResendVerificationCode'];
    

    // Skip token refresh logic for public operations
    if (publicOperations.includes(operation.operationName)) {
        return forward(operation);
    }

    const token = Cookies.get('accessToken');
    if (!token || graphQLErrors?.some(e => e.message === 'Your accessToken is invalid')) {
        if (!isRefreshing) {
            isRefreshing = true;

            // Create a new observable for token refresh
            const refreshObservable = new Observable<FetchResult>((observer) => {
                refreshToken()
                    .then(newToken => {
                        const refreshData = newToken.data?.RefreshToken;
                        if (refreshData?.success) {
                            const newAccessToken = refreshData.token;
                            const newRefreshToken = refreshData.token;
                            const minutes = 60;
                            const expiresIn = new Date();
                            expiresIn.setTime(expiresIn.getTime() + minutes * 60 * 1000); // 5 minutes in milliseconds
                            Cookies.set('accessToken', newAccessToken, { expires: expiresIn, path: '/' });
                            Cookies.set('refreshToken', newRefreshToken, { expires: 7, path: '/', secure: true });
                            
                            // Update operation headers with the new token
                            operation.setContext(({ headers = {} }) => ({
                                headers: {
                                    ...headers,
                                    authorization: `Bearer ${newToken}`,
                                },
                            }));

                            // Resolve pending requests
                            resolvePendingRequests();

                            // Forward the operation with the new token
                            forward(operation).subscribe({
                                next: result => observer.next(result),
                                error: err => observer.error(err),
                                complete: () => observer.complete(),
                            });
                        } else {
                            // Handle token refresh failure
                            handleRedirect();
                            observer.error(new Error('Token refresh failed. Redirecting to login.'));
                        }
                        
                    })
                    .catch(error => {
                        isRefreshing = false;
                        pendingRequests = [];
                        observer.error(error);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });

            // Return the refresh observable to handle the token refresh flow
            return refreshObservable;
        }

        // Queue the request until the refresh token operation is resolved
        return new Observable<FetchResult>((observer) => {
            pendingRequests.push(() => {
                // Forward the operation after refresh token logic is resolved
                forward(operation).subscribe({
                    next: result => observer.next(result),
                    error: err => observer.error(err),
                    complete: () => observer.complete(),
                });
            });
        });
    }

    // In other cases, just forward the operation as usual
    return forward(operation);
});


