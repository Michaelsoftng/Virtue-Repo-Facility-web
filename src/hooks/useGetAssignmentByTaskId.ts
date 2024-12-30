import { GetAssignmentByTaskId } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetAssignmentByTaskId = (taskId: string) => {
    return useQuery(GetAssignmentByTaskId, {
        variables: {
            taskId
        },
        client,
    });
};