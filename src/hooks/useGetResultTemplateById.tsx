import { GetResultById, GetResultByTestRequest, GetResults, GetResultTemplateById } from '../graphql/queries';
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

export const getResultTemplateById = async (id: string) => {
    return await client.query({
        query: GetResultTemplateById,
        variables: { id},
    });
};

export const getResultById = async (id: string) => {
    return await client.query({
        query: GetResultById,
        variables: { id },
    });
};

export const useGetResultByTestRequestId = (id: string) => {
    return useQuery(GetResultByTestRequest, {
        variables: {
            id
        },
        client,
    });
};

export const getResultByTestRequestId = async (id: string) => {
    return await client.query({
        query: GetResultByTestRequest,
        variables: { id },
    });
};


export const getResults = async (limit: number, offset: number) => {

    return await client.query({
        query: GetResults,
        variables: {limit, offset },
    });
}
