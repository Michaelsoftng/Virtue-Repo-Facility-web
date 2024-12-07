import { GetAvailableTestByFacility } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetAvailableTestByFacility = (facilityId: string, limit: number) => {
    return useQuery(GetAvailableTestByFacility, {
        variables: {
            facilityId,
            limit
            
        },
        client,
    });
};


export const getFacilityTests = async (facilityId: string, limit: number, offset?: number) => {
    return await client.query({
        query: GetAvailableTestByFacility,
        variables: { facilityId, limit, offset },
    });
};

