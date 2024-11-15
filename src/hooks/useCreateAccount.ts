import { CreateUser } from '../graphql/mutations';
import client from '@/lib/apolloClient';
import { useMutation } from '@apollo/client';
import { IRegister } from '../interface';

export const useCreateAccount = (formData: IRegister) => {
    return useMutation(CreateUser, {
        variables: {
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phone_number,
            userType: formData.user_type,
            role: formData.role
        },
        client,
    });
};


// export const GetUser
