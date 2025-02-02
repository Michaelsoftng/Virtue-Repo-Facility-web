import { GetUsersByType } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetUsersByType = (userType: string, offset: number, limit: number) => {
    return useQuery(GetUsersByType, {
        variables: {
            userType,
            offset,
            limit
        },
        client,
    });
};


export const getUsersByType = async (userType: string, limit: number, offset: number) => {
    return await client.query({
        query: GetUsersByType,
        variables: { userType, limit, offset },
    });
};


