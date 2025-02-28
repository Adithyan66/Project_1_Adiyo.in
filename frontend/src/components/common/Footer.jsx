import React from "react";
import logo from "../../assets/images/Adiyo.in.svg";
import visa from "../../assets/images/visa.png";
import mastercard from "../../assets/images/mastercard.png";
import paypal from "../../assets/images/paypal.png";
import applepay from "../../assets/images/applepay.png";
import gpay from "../../assets/images/gpay.png";

import facebook from "../../assets/images/facebook.png"
import twitter from "../../assets/images/twitter.svg"
import instagram from "../../assets/images/instagram.png"
import github from "../../assets/images/github.png"
function Footer() {
    return (
        <footer className="bg-gray-200 text-gray-700 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Top Section: Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Logo + Text + Social Icons (spanning 2 columns) */}
                    <div className="md:col-span-2">
                        <img src={logo} alt="Adiyo.in" className="h-10" />
                        <p className="mt-2 text-sm leading-relaxed">
                            We have clothes that suit your style and which you’re proud to wear....
                        </p>
                        {/* Social Media Icons Placeholder */}
                        <div className="mt-4 flex ">
                            <img
                                src={facebook}
                                alt="Social Media Links"
                                className="h-6 w-auto mr-3"
                            />
                            <img
                                src={instagram}
                                alt="Social Media Links"
                                className="h-6 w-auto mr-3"
                            />
                            <img
                                src={twitter}
                                alt="Social Media Links"
                                className="h-6 w-auto mr-3"
                            />
                            <img
                                src={github}
                                alt="Social Media Links"
                                className="h-6 w-auto"
                            />
                        </div>
                    </div>



                    {/* COMPANY */}
                    <div>
                        <h3 className="font-bold mb-2">COMPANY</h3>
                        <ul className="space-y-1 text-sm">
                            <li>About</li>
                            <li>Features</li>
                            <li>Works</li>
                            <li>Career</li>
                        </ul>
                    </div>

                    {/* HELP */}
                    <div>
                        <h3 className="font-bold mb-2">HELP</h3>
                        <ul className="space-y-1 text-sm">
                            <li>Customer Support</li>
                            <li>Delivery Details</li>
                            <li>Terms &amp; Conditions</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>

                    {/* FAQ */}
                    <div>
                        <h3 className="font-bold mb-2">FAQ</h3>
                        <ul className="space-y-1 text-sm">
                            <li>Account</li>
                            <li>Manage Deliveries</li>
                            <li>Orders</li>
                            <li>Payments</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section: Copyright + Payment Icons */}
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between border-t border-gray-300 pt-4">
                    <p className="text-sm text-gray-500">
                        Adiyo.in © 2020-2021. All Rights Reserved
                    </p>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <img src={visa} alt="Visa" className="h-10 w-auto" />
                        <img src={mastercard} alt="MasterCard" className="h-10 w-auto" />
                        <img src={paypal} alt="PayPal" className="h-10 w-auto" />
                        <img src={applepay} alt="Apple Pay" className="h-10 w-auto" />
                        <img src={gpay} alt="Google Pay" className="h-10 w-auto" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
