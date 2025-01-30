import React from 'react'
import LogoIcon from '../icons/LogoIcon'
import { SectionWithRows } from '@/src/interface';

export interface ResultTemplateProps {
    name: string,
    template: string
}
const ResultTemplate: React.FC<ResultTemplateProps> = ({ name, template }) => {
    const updatedtemplate = JSON.parse(template)
    const parsedTempate: SectionWithRows[] = JSON.parse(updatedtemplate) 
 
  return (
      <div className="bg-[#EEFEF4] w-full py-[21px] px-[35px]" id="pdf-content">
          <header className="" id="header">
                <div className="grid grid-cols-[42px_calc(100%-42px)]">
                  <div className="flex items-center justify-center rounded-full">
                      <LogoIcon />
                  </div>
                  <div className="flex justify-center mt-2">
                      <div className="">
                          <h1 className="text-[14px] text-center font-[600] text-black uppercase">
                              Wuse District Hospital, Abuja
                          </h1>
                          <p className="text-[8px] font-[600] text-black text-center">
                              LABORATORY REPORT FORM - {name}
                          </p>
                      </div>
                  </div>

              </div>
              <div className="border-2 border-[#121E3F] grid grid-cols-2 mt-2">
                  <div>
                      <p className="py-[2px] bg-[#121E3F] pl-4 text-white font-[600] text-[10.32px]">Requisition Number</p>
                      <p className="py-[2px]">&nbsp;</p>
                  </div>
                  <div>
                      <p className="py-[2px] bg-[#121E3F] pl-8 text-white font-[600] text-[10.32px]">Report Date</p>
                      <p className="py-[2px]"></p>
                  </div>
              </div>

          </header>

          {/* Main container */}
          <main className="mt-2 pb-4" id="content">
              <div className="grid grid-cols-2 text-[8px] mt-2">
                  <div className="ml-4">
                      <ul>
                          <li className="mt-1 flex gap-2"><b>Doctor</b><span>SELF REFERRAL</span></li>
                      </ul>
                      <ul className="mt-11">
                          <li className="mt-1 grid grid-cols-2"><span>Date Entered</span><span>10/02/2024 09:18:57</span></li>
                          <li className="mt-1 grid grid-cols-2"><span>Date Printed</span><span>10/02/2024 09:18:57</span></li>
                          <li className="mt-1 grid grid-cols-2"><span>Collection Date</span><span>10/02/2024 09:18:57</span></li>
                      </ul>

                      <div className="mt-4 text-[7px]"><p>Thank you for your request. We are reporting the following results:</p></div>
                  </div>
                  <div className="ml-4">
                      <ul>
                          <li className="mt-2 grid grid-cols-[35%_65%]"><b>Patient Information</b><span></span></li>
                          <li className="mt-1 grid grid-cols-[35%_65%]"><b>Patient</b><span>JOHN DOE</span></li>
                          <li className="mt-1 grid grid-cols-[35%_65%]"><b>Email</b><span>info@labtraca.com</span></li>
                          <li className="mt-1 grid grid-cols-[35%_65%]"><b>Age</b><span>27 years</span></li>
                          <li className="mt-1 grid grid-cols-[35%_65%]"><b>Gender</b><span>Male</span></li>
                          <li className="mt-1 grid grid-cols-[35%_65%]"><b>Phone No</b><span>+23490000000000</span></li>
                          <li className="mt-1 grid grid-cols-[35%_65%]"><b>Address</b><span>No. 5 Gana street maitama, abuja</span></li>
                          <li className="mt-1 grid grid-cols-[35%_65%]"><b>Specimen Type</b><span>SST</span></li>
                          <li className="mt-1 grid grid-cols-[35%_65%]"><b>Clinical Data</b><span>NA</span></li>
                      </ul>
                  </div>

              </div>
              
              <div>
                  <div>
                      <ul>
                          {parsedTempate.map((section, sectionIndex) => (
                              <section key={sectionIndex} className={`pb-[1px]  border-black pt-1 mt-1 ${sectionIndex == 0 ? "border-t-0" : "border-t-2"} `}>
                                  {
                                      section.section_fields.map((row, rowIndex) => (
                                          <li key={rowIndex} className={`text-[6px] grid grid-cols-3 ${rowIndex === 0 ? "font-[700]" : "font-[500] mt-2"}`} >
                                              {
                                                  row.section_fields.map((column, columnIndex) => (
                                                      column.section_fields.length > 1
                                                          ?
                                                          <div key={columnIndex}>
                                                              {
                                                                  column.section_fields.map((field, idx) => (
                                                                      field === "___" ? (
                                                                          <input
                                                                              className={` ${columnIndex === 0 ? "mt-0" : "mt-1"}`}
                                                                              key={idx}
                                                                              type="text"
                                                                              placeholder="result here..."
                                                                          />
                                                                      ) : (
                                                                          <p key={idx} className={` ${idx === 0 ? "mt-0" : ""} ${(idx === column.section_fields.length - 1 && columnIndex == 0) ? "border-b-2 border-dotted border-black pb-1 mb-3" : ""
                                                                              }`}>{field}</p>
                                                                      )


                                                                  ))
                                                              }
                                                          </div>
                                                          :
                                                          column.section_fields[0] === "___" ? (
                                                              <input
                                                                  className={` ${columnIndex === 0 ? "mt-0" : "mt-1"}`}
                                                                  key={columnIndex}
                                                                  type="text"
                                                                  placeholder="result here..."
                                                              />
                                                          ) : (
                                                              <p key={columnIndex} className={`${columnIndex === 0 ? "flex justify-start" : "flex justify-center"}`} >{column.section_fields[0]}</p>
                                                          )
                                                  ))
                                              }

                                          </li>
                                      ))
                                  }
                            </section>
                          ))}
                          {/* <section className="text-[6px] border-b-[1px] border-black pb-[2px] mt-1" >
                              <li className="font-[700] text-[6px] grid grid-cols-3">
                                  <p className="flex justify-center">TEST NAME</p>
                                  <p className="flex justify-center">RESULT</p>
                                  <p className="flex justify-center">REFERENCE RANGE / (UNITS)</p>
                              </li>
                          </section>
                          <section className="py-2 border-b-[1px] border-black pb-2 mt-1">
                              <li className="text-[6px] grid grid-cols-3 ">
                                  <div >
                                      <p>Total Cholesterol</p>
                                      <p className="border-b-2 border-dotted border-black pb-1">Comment</p>
                                  </div>
                                  <p className="flex justify-center">5.73</p>
                                  <p className="flex justify-center">mmcl/L</p>
                              </li>

                              <li className="text-[6px] grid grid-cols-3 mt-2">
                                  <div >
                                      <p>Desirable:&gt;5.2 mmol/l</p>
                                      <p>Borderline :5.2 - 6.2 mmol/l</p>
                                      <p className="border-b-2 border-dotted border-black pb-[1px]">High :&gt; 6.2 mmol/l</p>
                                  </div>
                                  <p className="flex justify-center">5.73</p>
                                  <p className="flex justify-center">mmcl/L</p>
                              </li>
                              <li className="text-[6px] grid grid-cols-3 mt-2">
                                  <div >
                                      <p>Total Cholesterol</p>
                                      <p className="border-b-2 border-dotted border-black pb-[1px]">Comment</p>
                                  </div>
                                  <p className="flex justify-center">221</p>
                                  <p className="flex justify-center">mg/dL</p>
                              </li>
                          </section>
                          <section className="py-2">
                              <li className="text-[6px] grid grid-cols-3 mt-2">
                                  <div >
                                      <p>Total Cholesterol</p>
                                      <p className="border-b-2 border-dotted border-black pb-[1px]">Comment</p>
                                  </div>
                                  <p className="flex justify-center">5.73</p>
                                  <p className="flex justify-center">mmcl/L</p>
                              </li>

                              <li className="text-[6px] grid grid-cols-3 mt-2">
                                  <div >
                                      <p>Desirable:&gt;5.2 mmol/l</p>
                                      <p>Borderline :5.2 - 6.2 mmol/l</p>
                                      <p className="border-b-2 border-dotted border-black pb-[1px]">High :&gt; 6.2 mmol/l</p>
                                  </div>
                                  <p className="flex justify-center">5.73</p>
                                  <p className="flex justify-center">mmcl/L</p>
                              </li>
                              <li className="text-[8px] grid grid-cols-3">
                                  <div >
                                      <p>Total Cholesterol</p>
                                      <p className="border-b-4 border-dotted border-black pb-[1px]">Comment</p>
                                  </div>
                                  <p className="flex justify-center">221</p>
                                  <p className="flex justify-center">mg/dL</p>
                              </li>
                          </section> */}

                      </ul>
                  </div>

              </div>
          </main>
          <footer id="footer" >
              <div className="grid grid-cols-[65%_35%] gap-2">
                  <div className="bg-[#121E3F] px-2 py-2 text-white text-[6px]"><p>Thank you for choosing Labtraca. If you have any questions or comments, please email help@labtraca.com or call 0900 000 0000</p></div>
                  <div className="bg-[#121E3F] px-2 py-2 text-white text-center text-[8px] flex justify-center items-center" ><p>+234 9000 000 0000</p></div>
              </div>
              <div className="text-[10px] mt-2"><i>RC Number:&nbsp;489766</i></div>
          </footer>
      </div>
  )
}

export default ResultTemplate
