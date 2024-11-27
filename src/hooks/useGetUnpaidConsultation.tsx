
import { GetFilteredConsultations } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetUnpaidConsultation = (filterStatus: string, limit: number, offset: number) => {
    return useQuery(GetFilteredConsultations, {
        variables: {
            filterStatus,
            limit,
            offset,
        },
        client,
    });
};

