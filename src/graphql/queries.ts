import { gql } from '@apollo/client';

export const GetUserById = gql`
  query getUserById($id: String!) {
    getUserById(id: $id) {
        firstName
        lastName
        email
        id
        phoneNumber
        approvedAt
        approvedBy
        streetAddress
        streetAddress2
        city
        state
        country
        postal
        latitude
        longitude
        referralBonus
        createdAt
        facilityAdmin{
          id
          facilityName
          facilityType
        }
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
        isDeleted
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

        doctor{
          id
          
        }

        phlebotomist{
          id
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

export const GetAvailableTestByFacility = gql`
  query getAvailableTestByFacility($facilityId: ID!, $limit: Int
  ) {
      getAvailableTestByFacility(facilityId: $facilityId, limit: $limit) {
          facilityTestCount
          facilityTests{
              test{
                  id
                  name
                  code
                  group
                  testType

              }
              price
              preparation
              duration
              facility{
                  id  
                  facilityName
                  facilityType
                  
                  user{
                      id
                      email
                      phoneNumber
                  }
              }
          
          }
    
    }
  }

`;

export const GetAllRequest = gql`
  query getAllRequests($limit: Int, $offset: Int,){
        getAllRequests(limit: $limit, offset: $offset){
            id
            samplePickUpAddress
            requestStatus
            requestDate
            sampleStatus
            total
            createdAt
            isPaid
            balance
            phlebotomist{
              id
              user{
                   firstName  
                   lastName
                   email

                }
            }
            patient{
                id
                user{
                   firstName  
                   lastName
                   email

                }
            }
            tests{
                id
                name
            }
        }

}

`;

export const GetRequest = gql`
query getRequest($id: ID, $patienId: ID,){
        getRequest(id: $id, patienId: $patienId){
            id
            samplePickUpAddress
            requestStatus
            sampleStatus
            samepleDropOffDate
            sampleCollectionDate
            requestDate
            isPaid
            total
            balance
            patient{
                id
                user{
                   firstName  
                   lastName
                   email
                   phoneNumber

                }
            }
            phlebotomist{
                id
                user{
                    id
                    firstName  
                   lastName
                   email
                   phoneNumber
                }
            }
            tests{
                id
                name
                code
            }
            payment{
                id
                amountPaid
                amountCharged
            }
            testRequest{
                id
                test{
                   id
                    name
                    code 
                }
                facility{
                    id
                    facilityName
                    user{
                      id
                      firstName  
                    lastName
                    email
                  }
                }
                patientName
                patientAge
                package{
                    id
                }
                testResult
                resultDate
            }
        }

}


`;


export const GetFilteredConsultations = gql`
  query getFilteredConsultations($filterStatus: String!, $limit: Int, $offset: Int){
      getFilteredConsultations(filterStatus: $filterStatus, limit: $limit, offset: $offset){
          consultationCount
          consultations {
              status
              patient{
                  id
                  user{
                  firstName  
                  lastName
                  email

                  }
              }
              doctor{
                  id
                  user{
                  firstName  
                  lastName
                  email

                  }
              }
              purpose
              medicalhistory
              attachments
              otherdetails
              requestedDoctorType
              requestedDuration
              consultationTime
              consultationStartedAt
              consultationEndedAt
              total
          }
      }
  }
`;


export const GetMinimalFilteredConsultations = gql`
  query getFilteredConsultations($filterStatus: String!, $limit: Int, $offset: Int){
      getFilteredConsultations(filterStatus: $filterStatus, limit: $limit, offset: $offset){
          consultationCount
          consultations {
              status
              patient{
                  id
                  user{
                  firstName  
                  lastName
                  email

                  }
              }
              doctor{
                  id
                  user{
                  firstName  
                  lastName
                  email

                  }
              }
             
              createdAt
              requestedDoctorType
              requestedDuration
              consultationTime
              consultationStartedAt
              consultationEndedAt
              total
          }
      }
  }
`;