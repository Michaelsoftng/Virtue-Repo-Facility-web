import { GetRequestByPatient } from '../graphql/queries';
import client from '@/lib/apolloClient';

export const getRequestByPatient = async (patientId: string, limit: number, offset: number) => {
    return await client.query({
        query: GetRequestByPatient,
        variables: { patientId, limit, offset },
    });
};