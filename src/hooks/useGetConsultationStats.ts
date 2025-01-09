import { GetConsultationStats } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetConsultationStats = (patientId?: string, phlebotomist?: string) => {
    return useQuery(GetConsultationStats, {
        variables: {
            patientId,
            phlebotomist,
        },
        client,
    });
}; 