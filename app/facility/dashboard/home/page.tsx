import React from 'react'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'
const Home = () => {
  return (
    <div>
        <FacilityHeader />
          <div className="grid grid-cols-[250px_calc(100%-250px)]">
            <FacilityMenu />
            <div className="bg-gray-300">
                fff
            </div>
        </div>
    </div>
  )
}

export default Home
