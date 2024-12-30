import { GetAllAssignment } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetAllAssignments = (limit: number, offset: number) => {
    return useQuery(GetAllAssignment, {
        variables: {
            limit,
            offset
        },
        client,
    });
};

export const getAllAssignments = async (limit: number, offset: number) => {
    return await client.query({
        query: GetAllAssignment,
        variables: {limit, offset },
    });
};