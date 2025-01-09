import { GetConsultationsByPatient } from '../graphql/queries';
import client from '@/lib/apolloClient';

export const getConsultationsByPatient = async (patientId: string, limit: number, offset: number) => {
    return await client.query({
        query: GetConsultationsByPatient,
        variables: { patientId, limit, offset },
    });
};