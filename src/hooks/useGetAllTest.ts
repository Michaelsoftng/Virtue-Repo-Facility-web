
import { GetAllTest } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetAllTest = (limit: number, offset: number) => {
    return useQuery(GetAllTest, {
        variables: {
            limit,
            offset,
        },
        client,
    });
};


export const getAllTests = async (limit: number, offset: number) => {
    return await client.query({
        query: GetAllTest,
        variables: { limit, offset },
    });
};
