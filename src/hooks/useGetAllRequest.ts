
import { GetAllRequest, GetRequestByPhlebotomist, GetTodaysRequest } from '@/src/graphql/queries'
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetAllRequest = (limit: number, offset: number) => {
    return useQuery(GetAllRequest, {
        variables: {
            limit,
            offset,
        },
        client,
    });
};

export const getTodaysRequest = async () => {
    return await client.query({
        query: GetTodaysRequest,
    });
};


export const getRequestByPhlebotomist = async (phlebotomistId: string, limit: number, offset: number) => {
    return await client.query({
        query: GetRequestByPhlebotomist,
        variables: { phlebotomistId, limit, offset }
    });
};

