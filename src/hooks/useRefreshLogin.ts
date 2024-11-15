import { RefreshLogin } from '../graphql/mutations';
import client from '@/lib/apolloClient';
import { useMutation } from '@apollo/client';

export const useRefreshLogin = (refreshToken: string) => {
    return useMutation(RefreshLogin, {
        variables: {
            refreshToken
        },
        client,
    });
};


// export const GetUser
