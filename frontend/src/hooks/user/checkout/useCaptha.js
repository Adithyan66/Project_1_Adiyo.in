

// import { useState } from 'react';

// const useCaptcha = () => {
//     const [captchaInput, setCaptchaInput] = useState('');
//     const [captchaText, setCaptchaText] = useState('R8T29C');

//     const generateNewCaptcha = () => {
//         const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
//         let result = '';
//         for (let i = 0; i < 6; i++) {
//             result += characters.charAt(
//                 Math.floor(Math.random() * characters.length)
//             );
//         }
//         setCaptchaText(result);
//         setCaptchaInput('');
//     };

//     const isCaptchaValid = (input) => input === captchaText;

//     return {
//         captchaInput,
//         setCaptchaInput,
//         captchaText,
//         generateNewCaptcha,
//         isCaptchaValid,
//     };
// };

// export default useCaptcha;






// src/hooks/use-captcha.js
import { useState } from 'react';

const useCaptcha = () => {
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaText, setCaptchaText] = useState("R8T29C");

    const generateNewCaptcha = () => {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCaptchaText(result);
        setCaptchaInput('');
    };

    return {
        captchaInput,
        setCaptchaInput,
        captchaText,
        generateNewCaptcha
    };
};

export default useCaptcha;
