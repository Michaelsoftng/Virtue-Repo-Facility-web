import { GetPhlebotomistByProximity } from '../graphql/queries';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';


export const useGetPhlebotomistByProximity = (requestId: string) => {
    return useQuery(GetPhlebotomistByProximity, {
        variables: {
            requestId: requestId
        },
        client,
    });
};