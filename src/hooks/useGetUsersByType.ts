import { GetUsersByType } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetUsersByType = (userType: string) => {
    return useQuery(GetUsersByType, {
        variables: {
            userType: userType
        },
        client,
    });
};

