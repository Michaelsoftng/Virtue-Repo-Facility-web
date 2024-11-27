export enum UserType {
    Staff = 'staff',
    FacilityAdmin = 'facility_admin'

}

export enum Role {
    Admin = 'admin',
    SuperAdmin = 'superAdmin',
    Manager = 'manager',
    Staff = 'staff'
}
export interface IRegister {
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    role: Role,
    user_type: UserType,
    password: string,
    password_confirmation: string
    facility_name?: string
    facility_type?: string
    country: string
}
export interface IResendVerification{
    email: string
}

export interface ILogin {
    email: string,
    password: string,
}



export interface IVerify{
    digit1: string,
    digit2: string,
    digit3: string,
    digit4: string
}

export interface IVerifyAccount {
    user: string,
    token: number
}

export interface PatientType {
    __typename: "UserType"
    approvalToken: string | null
    email:string
    firstName: string | null
    id: string
    lastName: string | null
    phoneNumber: string
    patient: {
        id: string
        date_of_birth: string | null
    } | null
}

export interface FacilityType {
    __typename: "UserType"
    approvalToken: string | null
    email: string
    firstName: string | null
    id: string
    lastName: string | null
    phoneNumber: string
    facilityAdmin: {
        id: string
        facility_name: string
        facility_type: string
        role: string
    } | null
}