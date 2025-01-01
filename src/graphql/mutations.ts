// src/graphql/mutation.ts
import { gql } from '@apollo/client';

export const CreateUser = gql`
  mutation CreateUser(
    $first_name: String!,
    $last_name: String!,
    $email: String!,
    $phone_number: String!,
    $password: String!,
    $user_type: String!,
    $role: String!
    $facility_name: String
    $facility_type: String
    $facility_percentage: Int
  ) {
    CreateUser(
      firstName: $first_name,
      lastName: $last_name,
      email: $email,
      password: $password,
      phoneNumber: $phone_number,
      userType: $user_type,
      facilityName: $facility_name,
      facilityType: $facility_type,
      facilityPercentage: $facility_percentage,
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

export const ChangePassword = gql`
  mutation ChangeUserPassword(
      $old_password: String!, 
      $new_password1: String!, 
      $new_password2: String!) {
    ChangeUserPassword(
      oldPassword: $old_password, 
      newPassword1: $new_password1, 
      newPassword2: $new_password2) {
      
      success
      errors
    }
  }
`;

export const UpdateAccount = gql`
mutation UpdateUser($userId: String, $updateData: UpdateUserDataInput!) {
  UpdateUser(userId: $userId, updateData:$updateData
  ) {
    user {
      id
      firstName
      lastName
      email
      streetAddress
      streetAddress2
      city
      state
      country 
      postal
      latitude
      longitude
      facilityAdmin{
        facilityName
        id
    }
      staff{

            id
        }
    }

  }
}
`;

export const RevokeToken = gql`
  mutation revokeToken($refreshToken: String !){
    RevokeToken(
      refreshToken: $refreshToken
    ) {
      success,
      errors,

    }
  }
`;

export const DeleteUser = gql`
  mutation DeleteUser($id: String!) {
    DeleteUser(id: $id) {
          deleted

    }
  }

`;


export const ApproveAccount = gql`
  mutation ApproveAccount($approvingAdmin: String!, $userForApproval: String!) {
    ApproveAccount(approvingAdmin: $approvingAdmin, userForApproval: $userForApproval) {
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

export const CreatePackageManual = gql`
  mutation CreatePackageManual(
      $package_name: String!, 
      $description: String,
      $percentage_increase: Decimal!,
      $minimum_increase: Decimal!
      ) {
    CreatePackageManual(packageName: $package_name,
          description: $description,
          percentageIncrease: $percentage_increase,
          minimumIncrease: $minimum_increase) {
          package {
              id
              packageName
              description
              percentageIncrease
              minimumIncrease
          }
      }
  }
`
export const CreatePackageUpload = gql`
  mutation CreatePackageUpload(
      $file: String!, 
      ) {
    CreatePackageUpload(
      file: $file, 
      ) {
        packagesSkipped {
            id
            packageName
            description
            percentageIncrease
            minimumIncrease
        }
        packagesCreated {
            id
            packageName
            description
            percentageIncrease
            minimumIncrease
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
    $percentage_increase: Decimal!,
    $minimum_increase: Decimal!,
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
      methodology :$methodology,
      duration: $duration,
      percentageIncrease: $percentage_increase
      minimumIncrease: $minimum_increase
    ) {
        test {
          id
          name
          code
          testType
          group
          percentageIncrease
          minimumIncrease
        }
    }
  }
`;

export const CreateTestUpload = gql`
  mutation CreateTestUpload(
		$file: String!, 
		) {
  CreateTestUpload(
	file: $file, 
    ) {
    testsSkipped {
        name
        code
        id
    }
    testsCreated {
        name
        code
        id
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

export const DeletePackage = gql`
  mutation DeletePackage(
      $id: String, 
    ) {
    DeletePackage(
    id: $id, 
      code: $code, 
    ) {
      package {
        deletedStatus
        message
      }
    }
  }
`;

export const CreateAssignment = gql`
  mutation CreateAssignment(
      $assigned: ID!,
      $assignmentDate: DateTime!,
      $taskType: TaskTypeEnums!,
      $task: String!,
  ){
      CreateAssignment(
          assigned: $assigned, 
          assignmentDate: $assignmentDate,
          taskType: $taskType,
          task: $task,
      ){
          success{
              code
              message
          }
          errors{
              message
              code
          }
          assignment{
              assignedBy{
                  id
                  staff{
                      id
                  }
              }
              assigned{
                  id
                  doctor{
                      id
                  }
                  phlebotomist{
                      id
                  }
              }
              assignmentDate
              lastAssignmentTime
              taskObjectId
              
              
          }
    
      }
  }
`;

export const CreateFacilityTest = gql`
  mutation CreateFacilityTestManual(
      $test: ID!, 
      $facility: ID!, 
      $price: Int!, 
      $duration: String,
          $preparation: String,
      ) {
    CreateFacilityTestManual(
    test: $test, 
      facility: $facility, 
    price: $price, 
      preparation: $preparation, 
    duration:$duration
    ) {
      facilityTest {
        id
        test{
          id
          name
          code
          description
        }
        facility{
          id
          facilityName
          facilityType
        }
        price
        preparation
        duration
      }
  }
  }
`

export const UpdateCharges = gql`
  mutation UpdateCharges($admin: String!, $updateData: UpdateChargesDataInput!) {
  UpdateCharges(admin: $admin,
	updateData: $updateData
    ) {
    charges {
        serviceCharge
        chargePerDistance
        consultationCharge
        consultationDiscount
        partPayment
        doctorsPercentage
        phlebotomistPercentage
        budgetPerDistance
        referralBonusPercentage
        lastChangedBy{
            id
            user{
                id
                email
            }
        }
        admin{
            id
            user{
                id
                email
            }       
        }
    }
  }
  }
`;