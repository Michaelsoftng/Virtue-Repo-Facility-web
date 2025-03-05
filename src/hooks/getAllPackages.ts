import { GetAllPackage, GetFacilityPackages, SearchPackages } from '../graphql/queries';
import client from '@/lib/apolloClient';

export const getAllPackages = async (limit: number, offset: number) => {
    return await client.query({
        query: GetAllPackage,
        variables: { limit, offset },
    });
};

export const searchAllPackage = async (search: string, limit: number, offset: number) => {
    return await client.query({
        query: SearchPackages,
        variables: { search, limit, offset },
    });
};

export const getFacilityPackages = async (facilityId: string, limit: number, offset: number) => {
    return await client.query({
        query: GetFacilityPackages,
        variables: { facilityId, limit, offset },
    });
};

