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
          role
          facilityName
          facilityType
          facilityPercentage
        }
        staff{
          id
          role
        }
        patient{
          id
          dateOfBirth
          gender
        }
        phlebotomist{
          id
          dob
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
        deletedAt
        deletedBy
        staff{
            id
            gender
        }
        patient{
          id
          gender
          dateOfBirth
        }
        facilityAdmin{
            id
            facilityName
            facilityType
        }  

        doctor{
          id
          gender
        }

        phlebotomist{
          id
          gender
        }
      }
  }
}
`;

export const GetPhlebotomistByProximity = gql`
  query getPhlebotomistByProximity($requestId: String!) {
    getPhlebotomistByProximity(requestId: $requestId) {
      usersCount
      users{
        id
        distance
        logisticsEstimate
        user  {
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
          verificationCode
          approvedAt
          createdAt
          deletedAt
          deletedBy
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
          percentageIncrease
          minimumIncrease
      }

    }
  }

`;

export const GetAllPackage = gql`
  query getAllPackages($limit: Int,  $offset: Int){
    getAllPackages(limit: $limit, offset: $offset){
        packagesCount
        packages{     
            id
            description
            packageName
            percentageIncrease
            minimumIncrease
            }
        
    } 
  }
`;

export const GetAllAssignment = gql`
  query getAllAssignment{
    getAllAssignment{
        assignmentCount
        assignments{
            id
            request{
                id
                requestStatus
                phlebotomist{
                    id
                }
            }
            assignedBy {
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
            distance     
        }
    }
}
`;

export const GetAssignmentByTaskId = gql`
  query getAssignmentByTaskId($taskId: ID!){
    getAssignmentByTaskId(taskId: $taskId){
        id
        isAccepted
        assignedBy{
                id
                staff{
                    id
                }
            }
            assigned{
                id
                firstName
                lastName
                email
                phoneNumber
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
            distance
    }
}
`;

export const GetPackageById = gql`
  query getPackageById($id: ID!) {
    getPackageById(id: $id) {
      id
      packageName
      testCount
      tests{
          id
          name
          code
          description
      }
      facilitesCount
      facilityPackages{
          id
          price
          facilityPrice
          facility{
              id
          }
      }

    }
  }

`;


export const GetAvailableTestByFacility = gql`
  query getAvailableTestByFacility($facilityId: ID!, $limit: Int, $offset: Int
  ) {
      getAvailableTestByFacility(facilityId: $facilityId, limit: $limit, offset: $offset) {
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
              facilityPrice
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

export const GetRecentTestRequest = gql`
  query getAllRequestsByFacility($facilityId: ID!, $limit: Int, $offset: Int,){
    getAllRequestsByFacility(facilityId: $facilityId, limit: $limit, offset: $offset){
        testRequestCount
        testRequests{
            id
            request{
                id
                patient{
                    id
                    user{
                        id
                        firstName
                        lastName
                        email
                        phoneNumber
                    }
                } 
            }
            test{
                id
                name
            }
            facility{
                id
            }
            facilityDistance
            facilityEarning
            patientName
            patientAge
            package{
                id
            }
            testResult
            resultDate
            status
          }
    }

}

`;
export const GetAllRequest = gql`
  query getAllRequests($limit: Int, $offset: Int,){
    getAllRequests(limit: $limit, offset: $offset){
      requestsCount
      requests {
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

export const GetRequestByPatient = gql`
query getRequestByPatient($patientId: ID!, $limit: Int, $offset: Int,){
    getRequestByPatient(patientId: $patientId, limit: $limit, offset: $offset){
      requestsCount
      requests {
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
        totalPaymentSum
        coveredAmount
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

  }
`;

export const GetConsultationsByPatient = gql`
query getConsultationsByPatient($patientId: ID!, $limit: Int, $offset: Int){
    getConsultationsByPatient(patientId: $patientId, limit: $limit, offset: $offset){
        consultationCount
        consultations{
            id
            patient{
                id
            }
            doctor{
                id
            }
            status
            purpose
            medicalhistory
            attachments
            otherdetails
            requestedDoctorType
            requestedDuration
            consultationTime
            consultationStartedAt
            consultationEndedAt
            totalPaymentSum
            total
        }
    }
}
`;

export const GetRequestStats = gql`
  query getRequestStatsByUser($patientId: ID, $phlebotomist: ID){
    getRequestStatsByUser(patientId: $patientId, phlebotomist: $phlebotomist){
        completed
        ongoing
        pending
        cancelled
        scheduled
        unpaid
    }

  }
`;

export const GetConsultationStats = gql`
  query getConsultationStatsByUser($patientId: ID, $doctor: ID){
    getConsultationStatsByUser(patientId: $patientId, doctor: $doctor){
        completed
        ongoing
        pending
        cancelled
        scheduled
        unpaid
    }

  }
`;

export const getAllTestRequestsByFacility = gql`
  query getAllRequestsByFacility($facilityId: ID!, $limit: Int, $offset: Int) {
      getAllRequestsByFacility(facilityId: $facilityId, limit: $limit, offset: $offset) {
          testRequestCount
          testRequests {
              id
              test{
                  id
                  name
              }
              facility{
                  id
                  facilityName
              }}
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

export const GetPayments = gql`
  query getAllPayment($limit: Int!, $offset: Int!){
      getAllPayment(limit: $limit, offset: $offset){
          paymentsCount
          payments{
              id
              paidby{
                id
                email
                firstName
                lastName
              }
              paidFor
              paymentPlan
              paymentType
              amountPaid
              amountCharged
              paymentChannel
              paymentId
              referrence
              invoice
              paymentDetails
              description
              createdAt
              requestSet{
                id
              }
            }



      }
  }
`;

export const GetPayouts = gql`
  query getAllPayment($limit: Int!, $offset: Int!){
      getAllPayment(limit: $limit, offset: $offset){
          paymentsCount
          payments{
              id
              paidby{
                id
                email
                firstName
                lastName
              }
              paidFor
              paymentPlan
              paymentType
              amountPaid
              amountCharged
              paymentChannel
              paymentId
              referrence
              invoice
              paymentDetails
              description
              }



      }
  }
`;

export const GetCharges = gql`
  query getCharges{
    getCharges{
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
                firstName
                lastName
            }
        }
        admin{
            id
            user{
                id
                email
                firstName
                lastName
            }       
        }
    }
  }
`;