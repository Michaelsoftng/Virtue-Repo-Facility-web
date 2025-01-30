import { GetResultTemplateById } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetResultTemplateById = (id: string) => {
    return useQuery(GetResultTemplateById, {
        variables: {
            id
        },
        client,
    });
};