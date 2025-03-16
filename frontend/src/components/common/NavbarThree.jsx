import React from 'react'
import logo from "../../assets/images/Adiyo.in.svg"
import { useNavigate } from 'react-router';

function NavbarThree() {

    const navigate = useNavigate()

    return (

        <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-4 sm:px-6 lg:px-8 p-3">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <div className="flex-shrink-0 ml-[15px] hover:cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <img src={logo} alt="Adiyo.in" className="h-8 ml-40" />
                    </div>

                </div>

            </div>
        </nav>
    );
}

export default NavbarThree
