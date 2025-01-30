import { GetTestRequestById } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetTestRequestById = (id: string) => {
    return useQuery(GetTestRequestById, {
        variables: {
            id
        },
        client,
    });
};