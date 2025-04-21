



import { useState } from 'react';

const usePaymentMethods = () => {
    const [paymentMethod, setPaymentMethod] = useState('wallet');

    return {
        paymentMethod,
        setPaymentMethod
    };
};

export default usePaymentMethods;
