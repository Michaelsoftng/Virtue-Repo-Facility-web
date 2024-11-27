import Image from "next/image";
import React from "react";

export interface TestDetails {
    test: string;
    patientName: string;
    patientAge: number;
    resultStatus: string;
    resultFile: string; // URL to the result file
}

export interface TestRequestType {
    patientImage: string;
    firstName: string;
    lastName: string;
    email: string;
    request: string;
    address: string;
    tests: TestDetails[];
    phlebotomistName: string;
    facilityName: string;
}

export interface TestRequestProps {
    isOpen: boolean;
    onClose: () => void;
    data: TestRequestType;
}

const TestRequestModal: React.FC<TestRequestProps> = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-11/12 max-w-4xl rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Test Request Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        ✕
                    </button>
                </div>
                <div className="p-4 space-y-6">
                    <div className="flex items-center space-x-4">
                        <Image
                            width={50}
                            height={50}
                            src={`/assets/images/utilities/${data.patientImage}`}
                            alt="Patient"
                            className="w-16 h-16 rounded-full border"
                        />
                        <div>
                            <h3 className="font-bold text-lg">{data.firstName} {data.lastName}</h3>
                            <p className="text-sm text-gray-500">{data.email}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-md font-medium">Test Request</h4>
                        <p className="text-gray-600">{data.request}</p>
                    </div>

                    <div>
                        <h4 className="text-md font-medium">Address</h4>
                        <p className="text-gray-600">{data.address}</p>
                    </div>

                    <div>
                        <h4 className="text-md font-medium">Tests</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2 text-left">Test</th>
                                        <th className="border px-4 py-2 text-left">Patient Name</th>
                                        <th className="border px-4 py-2 text-left">Age</th>
                                        <th className="border px-4 py-2 text-left">Result Status</th>
                                        <th className="border px-4 py-2 text-left">Result File</th>
                                        <th className="border px-4 py-2 text-left">Facility Name</th>
                                        <th className="border px-4 py-2 text-left">Facility Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.tests.map((test, index) => (
                                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="border px-4 py-2">{test.test}</td>
                                            <td className="border px-4 py-2">{test.patientName}</td>
                                            <td className="border px-4 py-2">{test.patientAge}</td>
                                            <td className="border px-4 py-2">{test.resultStatus}</td>
                                            <td className="border px-4 py-2">
                                                <a
                                                    href={test.resultFile}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View File
                                                </a>
                                            </td>
                                            <td className="border px-4 py-2">{data.facilityName}</td>
                                            <td className="border px-4 py-2">{data.address}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-md font-medium">Phlebotomist</h4>
                        <p className="text-gray-600">{data.phlebotomistName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestRequestModal;

// Example Usage
/*
<TestRequestModal
  isOpen={modalIsOpen}
  onClose={() => setModalIsOpen(false)}
  data={{
    patientImage: "patient.jpg",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    request: "Routine blood tests",
    address: "123 Test Lane, City, Country",
    tests: [
      {
        test: "Complete Blood Count",
        patientName: "John Doe",
        patientAge: 35,
        resultStatus: "Completed",
        resultFile: "/results/cbc.pdf"
      },
      {
        test: "Lipid Profile",
        patientName: "John Doe",
        patientAge: 35,
        resultStatus: "Pending",
        resultFile: "/results/lipid.pdf"
      },
      // Add more tests as needed
    ],
    phlebotomistName: "Jane Smith",
    facilityName: "HealthCare Lab",
  }}
/>
*/
