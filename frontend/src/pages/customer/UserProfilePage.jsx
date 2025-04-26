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






// import React from 'react'
// import Navbar from "../../components/common/Navbar"
// import Footer from "../../components/common/Footer"
// import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
// import PersonalInformation from '../../components/customer/profile/PersonalInformation'

// function UserProfilePage() {
//     return (
//         <div>
//             <Navbar />
//             <div className="md:px-[10%] md:py-6 py-2 flex flex-col md:flex-row mt-16 md:mt-35">
//                 <div className="md:w-1/4">
//                     <ProfileSideBar />
//                 </div>
//                 <div className="w-full md:w-3/4 mt-14 md:mt-0">
//                     <PersonalInformation />
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     )
// }

// export default UserProfilePage




// import React from 'react'
// import Navbar from "../../components/common/Navbar"
// import Footer from "../../components/common/Footer"
// import ProfileSideBar from '../../components/customer/profile/ProfileSideBar'
// import PersonalInformation from '../../components/customer/profile/PersonalInformation'

// function UserProfilePage() {
//     return (
//         <div>
//             <Navbar />
//             <div className="px-4 lg:px-[5%] xl:px-[10%] py-2 lg:py-6 flex flex-col lg:flex-row mt-16 lg:mt-20">
//                 <div className="lg:w-1/5 xl:w-1/4">
//                     <ProfileSideBar />
//                 </div>
//                 <div className="w-full lg:w-4/5 xl:w-3/4 mt-14 lg:mt-0 lg:pl-6">
//                     <PersonalInformation />
//                 </div>
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
            <div className="px-4 md:px-6 lg:px-8 xl:px-[10%] py-2 lg:py-6 flex flex-col lg:flex-row mt-16 lg:mt-20">
                <div className="lg:w-1/4 xl:w-1/4">
                    <ProfileSideBar />
                </div>
                <div className="w-full lg:w-3/4 xl:w-3/4 mt-14 lg:mt-0 lg:pl-4 xl:pl-6">
                    <PersonalInformation />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default UserProfilePage