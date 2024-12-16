import React from 'react'
import { ImInfo } from 'react-icons/im'
import { useMutation } from '@apollo/client';
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { ApproveAccount } from '@/src/graphql/mutations';
// import Cookies from 'js-cookie';
import { useAuth } from '@/src/context/AuthContext'
import { decodeJwtEncodedId } from '@/src/utils/decode';

export interface AccountApproval {
    setLoading: (state: boolean) => void,
    accountId: string
}
const Approval: React.FC<AccountApproval> = ({ setLoading, accountId }) => {
    const { user } = useAuth()
    const Id = user?.id

    const [approveStaff] = useMutation(ApproveAccount, {
        client,
    });

    const handleApproveStaff = async () => {
        setLoading(true)
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { data } = await approveStaff({
                variables: {
                    userForApproval: accountId,
                    approvingAdmin: decodeJwtEncodedId(Id as string), // Pass decoded ID here
                },
                async onCompleted(data) {
                    if (data.ApproveAccount.success) {
                        toast.success(data?.ApproveAccount?.success?.message);
                        window.location.reload();
                    } else {
                        toast.error(data?.ApproveAccount?.errors?.message);
                    }

                },
                onError(e) {
                    toast.error(e.message);

                },
            });

        } catch (err) {
            console.error('Error approving account:', err);
        } finally {
            setLoading(false)

        }

    }


    return (
        <div className="bg-[#D3E5FE] border-2 border-[#1B4ACB] w-full flex justify-between px-6 py-2">
            <div className="flex gap-x-4 py-2">
                <div className="flex h-full items-center justify-center">
                    <ImInfo className="text-[#1B4ACB] font-bold" style={{ color: '#1B4ACB', fontSize: '24px', fontWeight: 'bold' }} />
                </div>

                <div className="text-[#1B4ACB]">
                    <h2 className="font-semibold text-[18px]">Account needs approval</h2>
                    <p className="text-[14px] mt-2">Approval is still pending on this account</p>
                </div>
            </div>
            <div className="flex h-full items-center justify-center py-3">
                <button onClick={handleApproveStaff} className="font-semibold bg-white border-2 border-gray-400 px-4 py-2 rounded text-[#525C76]">Approve account</button>
            </div>
        </div>
    )
}

export default Approval
