// src/graphql/client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import fetch from 'cross-fetch';
import Cookies from 'js-cookie';
import {  errorLink } from './apolloLink';
// Create an HTTP link using the GraphQL API URL from environment variables
const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:8000/graphql',
    fetch,
});

// Set up authentication context
const authLink = setContext((_, { headers }) => {
    // Check if we are on the client-side to access sessionStorage
    const token = Cookies.get('accessToken') || '';
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '', // Add token to the Authorization header if it exists
        },
    };
});

// Initialize Apollo Client
const client = new ApolloClient({
    link: errorLink.concat(authLink).concat(httpLink),  // Combine authLink and httpLink
    cache: new InMemoryCache(),       // Use an in-memory cache for Apollo Client
    ssrMode: typeof window === 'undefined', // Enable SSR mode only on the server
});

export default client;
