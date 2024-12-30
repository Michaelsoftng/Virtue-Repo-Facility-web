import { GetRecentTestRequest } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetRecentTests = (facilityId: string, limit: number, offset: number) => {
    return useQuery(GetRecentTestRequest, {
        variables: {
            facilityId,
            limit,
            offset
        },
        client,
    });
};