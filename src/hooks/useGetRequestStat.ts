import { GetRequestStats } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetRequestStats = (patientId?: string, phlebotomist?: string) => {
    return useQuery(GetRequestStats, {
        variables: {
            patientId,
            phlebotomist,
        },
        client,
    });
};