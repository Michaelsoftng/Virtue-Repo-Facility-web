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
    password_confirmation: string,
    facility_name?: string,
    facility_type?: string,
    facility_percentage?: number,
    country: string
}

export interface IPasswordData {
    old_password: string
    new_password1: string
    new_password2: string
}

export interface IUpdateAccount {
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    role?: Role,
    password?: string,
    facilityName?: string
    facilityType?: string
    country?: string,
    state?: string,
    city?: string,
    postal?: string,
    streetAddress?: string,
    streetAddress2?: string,
    latitude: number,
    longitude: number,
}

export interface ICharges {
    serviceCharge?: number
    chargePerDistance?: number
    consultationCharge?: number
    consultationDiscount?: number
    partPayment?: number
    doctorsPercentage?: number
    phlebotomistPercentage?: number
    budgetPerDistance?: number
    referralBonusPercentage?: number
}

export interface IFacilityTest {
    test: string,
    facility: string,
    price?: number,
    duration?: string,
    preparation?: string,

}


export interface IResendVerification {
    email: string
}

export interface ILogin {
    email: string,
    password: string,
}



export interface IVerify {
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
    email: string
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


export interface ColumnWithRowsFields {
    section_style?: string,
    section_fields: string[],
}

export interface SingleColumnRow { section_style?: string, section_fields: string[] }

export interface RowWithColumnFields {
    section_style?: string, //tells us how to display this section
    section_fields: SingleColumnRow[]
}

export interface SectionWithRows {
    section_style?: string, //tells us how to display this section
    section_fields: RowWithColumnFields[]
}

export interface Template {
    template_name: string;
    sections: SectionWithRows[];
}


interface NestedPatient {
    id: string;
    gender?: string;
}

interface Patient {
    id: string;
    image?: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    patient: NestedPatient;
}

interface Test {
    id: string;
    name: string;
}

interface Package {
    id: string;
    packageName: string;
}

interface Request {
    sampleCollectionDate: string;
    samepleDropOffDate: string;
    sampleStatus: string;
    samplePickUpAddress: string;
}

interface TestRequest {
    id: string;
    request: Request;
    test: Test;
    patientName: string;
    patientAge: number;
    package: Package;
}

export interface Result {
    id: string;
    patient: Patient;
    testRequest: TestRequest;
    requisitionNumber: string;
    resultFields: string; // JSON string, consider parsing it into a structured type
    generatedPdfUrl: string;
    createdAt: string
}
