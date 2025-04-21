


// import { useState, useEffect } from 'react';
// import { getWalletBalance } from '../../../services/walletService';

// const useWalletBalance = () => {
//     const [walletBalance, setWalletBalance] = useState(0);
//     const [isLoadingWallet, setIsLoadingWallet] = useState(true);
//     const [walletError, setWalletError] = useState(null);

//     const fetchWalletBalance = async () => {
//         console.log("dance");

//         setIsLoadingWallet(true);
//         setWalletError(null);
//         try {
//             const response = await getWalletBalance();
//             if (response.data.success) {
//                 setWalletBalance(response.data.balance);
//             } else {
//                 setWalletError('Unable to fetch wallet balance. Please try again.');
//             }
//         } catch (error) {
//             setWalletError('Unable to fetch wallet balance. Please try again.');
//         } finally {
//             setIsLoadingWallet(false);
//         }
//     };

//     useEffect(() => {
//         fetchWalletBalance();
//     }, []);

//     return { walletBalance, isLoadingWallet, walletError, fetchWalletBalance };
// };

// export default useWalletBalance;








import { useState, useEffect } from 'react';
import { getWalletBalance } from '../../../services/walletService';

const useWalletBalance = () => {
    const [walletBalance, setWalletBalance] = useState(0);
    const [isLoadingWallet, setIsLoadingWallet] = useState(true);
    const [walletError, setWalletError] = useState(null);

    const fetchWalletBalance = async () => {
        setIsLoadingWallet(true);
        setWalletError(null);
        try {
            const response = await getWalletBalance();
            if (response.data.success) {
                setWalletBalance(response.data.balance);
            } else {
                setWalletError('Unable to fetch wallet balance. Please try again.');
            }
        } catch (error) {
            setWalletError('Unable to fetch wallet balance. Please try again.');
        } finally {
            setIsLoadingWallet(false);
        }
    };

    // Only run once when component mounts
    useEffect(() => {
        fetchWalletBalance();
        // Removing the fetchWalletBalance from the dependency array
        // prevents the infinite loop
    }, []);

    return { walletBalance, isLoadingWallet, walletError, fetchWalletBalance };
};

export default useWalletBalance;