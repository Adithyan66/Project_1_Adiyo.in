

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API_BASE_URL = import.meta.env.VITE_API_URL;




// const Customers = ({ setSelectedSection }) => {

//     const navigate = useNavigate()

//     const [customers, setCustomers] = useState([]);

//     useEffect(() => {
//         const fetchCustomerData = async () => {
//             try {
//                 const response = await axios.get(`${API_BASE_URL}/admin/customers-list`);
//                 console.log("Customer data:", response.data);
//                 // Assuming response.data.customers holds the customer array.
//                 setCustomers(response.data.customers);
//             } catch (error) {
//                 console.error("Error fetching customer data:", error);
//             }
//         };

//         fetchCustomerData();
//     }, []);

//     useEffect(() => {
//         console.log(customers[0]._id);

//     })

//     return (
//         <div className="w-full">
//             <h2 className="text-2xl font-bold mb-4">Customers</h2>
//             <div className="overflow-x-auto w-full">
//                 <table className="w-full text-left border-collapse">
//                     <thead>
//                         <tr className="bg-black text-white">
//                             <th className="py-3 px-4">Name</th>
//                             <th className="py-3 px-4">Customer ID</th>
//                             <th className="py-3 px-4">Registration Date</th>
//                             <th className="py-3 px-4">Total Orders</th>
//                             <th className="py-3 px-4">Total Amount Spent</th>
//                             <th className="py-3 px-4">Status</th>
//                             <th className="py-3 px-4"></th>

//                         </tr>
//                     </thead>
//                     <tbody className="bg-white">
//                         {customers.length > 0 ? (
//                             customers.map((customer) => (
//                                 <tr key={customer.id} className="border-b hover:bg-gray-50">
//                                     <td className="py-3 px-4 flex items-center space-x-2">
//                                         <img
//                                             src={`https://i.pravatar.cc/40?u=${customer.id}`}
//                                             alt="avatar"
//                                             className="w-8 h-8 rounded-full"
//                                         />
//                                         <span>{customer.username}</span>
//                                     </td>
//                                     <td className="py-3 px-4">{customer.userId}</td>
//                                     <td className="py-3 px-4">{customer.registrationDate}</td>
//                                     <td className="py-3 px-4">{customer.products}</td>
//                                     <td className="py-3 px-4">
//                                         ₹ {customer.sales ? customer.sales.toLocaleString() : 0}
//                                     </td>
//                                     <td className="py-3 px-4">
//                                         <span
//                                             className={`px-3 py-1 rounded-full text-sm font-medium ${customer.status === "Active"
//                                                 ? "bg-green-100 text-green-700"
//                                                 : "bg-red-100 text-red-700"
//                                                 }`}
//                                         >
//                                             {customer.status}
//                                         </span>
//                                     </td>
//                                     <td className="py-3 px-4">
//                                         <button
//                                             className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300"
//                                             onClick={() => navigate(`/admin/${customer._id}/customer-details/`)}
//                                         >
//                                             More
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="7" className="py-4 text-center">
//                                     No customers found.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default Customers;











import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Customers = ({ setSelectedSection }) => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/customers-list`);
                console.log("Customer data:", response.data);
                setCustomers(response.data.customers);
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        };

        fetchCustomerData();
    }, []);

    useEffect(() => {
        if (customers.length > 0) {
            console.log(customers[0]._id);
        }
    }, [customers]);

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Customers</h2>
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Customer ID</th>
                            <th className="py-3 px-4">Registration Date</th>
                            <th className="py-3 px-4">Total Orders</th>
                            <th className="py-3 px-4">Total Amount Spent</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <tr key={customer._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 flex items-center space-x-2">
                                        <img
                                            src={`https://i.pravatar.cc/40?u=${customer._id}`}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{customer.username}</span>
                                    </td>
                                    <td className="py-3 px-4">{customer.userId}</td>
                                    <td className="py-3 px-4">{customer.registrationDate}</td>
                                    <td className="py-3 px-4">{customer.products}</td>
                                    <td className="py-3 px-4">
                                        ₹ {customer.sales ? customer.sales.toLocaleString() : 0}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${customer.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300"
                                            onClick={() => navigate(`/admin/${customer._id}/customer-details/`)}
                                        >
                                            More
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-4 text-center">
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;