import { gql } from '@apollo/client';

export const GetUserById = gql`
  query getUserById($id: String!) {
    getUserById(id: $id) {
        firstName
        lastName
        email
        id
        phoneNumber
        approvalToken
    }
  }
`;


export const GetUsersCount = gql`
  query getUsersCount {
    getUsersCount{
      users
      doctors
      patients
      phlebotomists
      staffs
      facilities
      organisations
    }
  }


`;

export const GetUsersByType = gql`
query getUserByUserType($userType: String!) {
  getUserByUserType(userType: $userType) {
      usersCount
      users{
        firstName
        lastName
        email
        id
        phoneNumber
        approvalToken
        referralCode
        emailVerifiedAt
        streetAddress
        streetAddress2
        city
        state
        country
        postal
        latitude
        longitude
        referralBonus
        approvedAt
        createdAt
        staff{
            id
            
        }
        patient{
          id
        }
        facilityAdmin{
            id
            facilityName
            facilityType
        }  
      }
  }
}
`;


export const GetUserByEmail = gql`
  query getUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      firstName
      lastName
      email
      id
      phoneNumber
      approvalToken
      staff{
          id
          role

      }
     
    }
}

`;

export const GetAllTest = gql`
  query getAllTest($limit: Int, $offset: Int){
    getAllTest(limit: $limit, offset: $offset) {

      testCount
      tests{
          id
          name
          code
          testType
          group
          description
      }

    }
  }

`;