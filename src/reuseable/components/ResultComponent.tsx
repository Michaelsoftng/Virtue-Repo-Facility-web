import React from 'react'
import FileIcon from '../icons/FileIcon'
import MoreIcon from '../icons/MoreIcon'
import { TableData } from '@/src/types/TableData.type'

export interface ResultTypeProps {
    data: TableData
    onClick: (data: TableData) => void
};



const ResultComponent: React.FC<ResultTypeProps> = ({ data,  onClick }) => {
    return (
        <div className="py-6 px-4 bg-white shadow-md rounded w-[200px] hover:bg-[#08ac860e]" onClick={() => onClick(data)}>
            <div className="flex justify-between">
                <div className="mt-[-7px]">
                    <FileIcon />
                </div>
                 
                <MoreIcon />  
            </div>
            <div className="flex justify-between mt-6">
                <div>
                    <h2 className="font-bold text-[14px] text-black"> {data.patients[1]}</h2>
                    <p className="text-xs text-gray-400 font-semibold">{data.files} files</p>
                </div>
                <div className="flex justify-end items-end">
                    <p className="font-bold text-[12px] text-black">{data.size}</p>
                </div>

            </div>
        </div>
    )
}

export default ResultComponent
