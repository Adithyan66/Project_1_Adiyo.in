// import React from 'react'
// import Navbar from "../../components/common/Navbar"
// import Footer from "../../components/common/Footer"
// import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
// import PersonalInformation from '../../components/customer/profile/PersonalInformation'

// function UserProfilePage() {
//     return (
//         <div>
//             <Navbar />
//             <div className="px-[10%] py-6 flex mt-35">
//                 <ProfileSideBar />
//                 <PersonalInformation />
//             </div>
//             <Footer />
//         </div>
//     )
// }

// export default UserProfilePage






import React from 'react'
import Navbar from "../../components/common/Navbar"
import Footer from "../../components/common/Footer"
import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
import PersonalInformation from '../../components/customer/profile/PersonalInformation'

function UserProfilePage() {
    return (
        <div>
            <Navbar />
            <div className="md:px-[10%] md:py-6 py-2 flex flex-col md:flex-row mt-16 md:mt-35">
                <div className="md:w-1/4">
                    <ProfileSideBar />
                </div>
                <div className="w-full md:w-3/4 mt-14 md:mt-0">
                    <PersonalInformation />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default UserProfilePage