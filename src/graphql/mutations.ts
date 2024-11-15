// src/graphql/mutation.ts
import { gql } from '@apollo/client';

export const CreateUser = gql`
  mutation CreateUser(
    $email: String!,
    $phone_number: String!,
    $password: String!,
    $user_type: String!,
    $role: String!
    $facility_name: String
    $facility_type: String
    
  ) {
    CreateUser(
      email: $email,
      password: $password,
      phoneNumber: $phone_number,
      userType: $user_type,
      facilityName: $facility_name,
      facilityType: $facility_type,
      role: $role
    ) {
      user {
        id
        email
        phoneNumber
        facilityAdmin {
          id
          facilityName
          facilityType
        }
      }
      accessToken
      refreshToken
    }
  }
`;

export const VerifyAccount = gql`
  mutation VerifyAccount($user: String!, $token: Int!) {
    VerifyUserAccount(user: $user, token: $token) {
      success {
        message
        code
      }
      errors {
        message
        code
      }
      user {
        id,
          userType
      }
    }
  }

`;

export const LoginAccount = gql`
  mutation Login($email: String!, $password: String!) {
    TokenAuth(email: $email, password: $password) {
      success,
      errors,
      token,
      refreshToken,
      unarchiving,
      user {
        id,
        email
        firstName
        lastName
        userType
        staff {
          id
          role
        }
        facilityAdmin{
          id
          role
          facilityName
          facilityType
        }
        
      }
    }
}



`;

export const RefreshLogin = gql`
  mutation refreshToken($refreshToken: String !){
    RefreshToken(
      refreshToken: $refreshToken
    ) {
      success,
      errors,
      payload,
      token,
      refreshToken
    }
  }
`;

export const ResendVerificationCode = gql`
  mutation ResendVerificationCode($user: String!) {
    ResendVerificationCode(user: $user) {
      success {
        message
        code
      }
      errors {
        message
        code
      }
      user {
        id,
        userType
      }
    }
  }


`;

export const CreateTestManual = gql`
  mutation CreateTestManual(
		$name: String!, 
		$code: String!, 
		$description: String, 
		$test_type: String!,
        $group: String!,
        $normal_range: String, 
		$unit: String, 
		$preparation: String,
		$methodology: String,
		$duration: String,
		) {
    CreateTestManual(
      name: $name, 
        code: $code, 
      description: $description, 
      testType: $test_type,
        group: $group,
      normalRange: $normal_range, 
      unit: $unit,
        preparation: $preparation, 
      methodology:$methodology,
      duration:$duration,

      ) {
        test {
          id
          name
          code
          testType
          group
        }
    }
  }
`;


export const DeleteTest = gql`
mutation DeleteTest(
		$code: String, 
		$id: String, 
	) {
  DeleteTest(
	id: $id, 
    code: $code, 
	) {
    test {
      deletedStatus
      message
    }
}
}
`;