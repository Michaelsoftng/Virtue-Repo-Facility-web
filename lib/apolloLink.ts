// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// Link to handle setting Authorization header
export const authLink = setContext(async (_, { headers }) => {
    const token = Cookies.get('accessToken');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});


export const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors?.some(e => e.message === 'INVALID_ACCESS_TOKEN')) {
        if (!isRefreshing) {
            isRefreshing = true;
            const refreshObservable = from(
                refreshToken().then(newToken => {
                    operation.setContext(({ headers = {} }) => ({
                        headers: {
                            ...headers,
                            authorization: `Bearer ${newToken}`,
                        },
                    }));
                    isRefreshing = false;
                    resolvePendingRequests();
                    return forward(operation);
                })
                .catch(error => {
                    isRefreshing = false;
                    pendingRequests = [];
                    console.error(error);
                })
            );

            return refreshObservable;
        }

        // Return an Observable that emits the result of the forward call once the refresh is complete
        return new Observable((observer) => {
            pendingRequests.push(() => {
                forward(operation).subscribe({
                    next: result => observer.next(result),
                    error: err => observer.error(err),
                    complete: () => observer.complete(),
                });
            });
        });
    }

    // In other cases, just forward the operation
    return forward(operation);
});
