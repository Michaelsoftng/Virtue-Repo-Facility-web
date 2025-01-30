
import { GetAllResultTemplatates } from '@/src/graphql/queries'
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetAllResultTemplates = (limit: number, offset: number) => {
    return useQuery(GetAllResultTemplatates, {
        variables: {
            limit,
            offset,
        },
        client,
    });
};

