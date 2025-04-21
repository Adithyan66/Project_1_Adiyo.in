import { useState } from "react";
import { getWalletBalance } from "../../../services/walletService";

const useWalletPayment = () => {
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
                setWalletError("Unable to fetch wallet balance. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
            setWalletError("Unable to fetch wallet balance. Please try again.");
        } finally {
            setIsLoadingWallet(false);
        }
    };

    return {
        walletBalance,
        isLoadingWallet,
        walletError,
        fetchWalletBalance
    };
};

export default useWalletPayment;
