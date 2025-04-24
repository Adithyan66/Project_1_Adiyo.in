

// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginSuccess } from '../../../store/slices/userSlice';
// import { setLoginPopup } from '../../../store/slices/authModalSlice.js';
// const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


// function GoogleSignIn() {
//     const dispatch = useDispatch();
//     const user = useSelector(state => state.user);

//     useEffect(() => {
//         google.accounts.id.initialize({
//             client_id: GOOGLE_CLIENT_ID,
//             callback: handleCredentialResponse,
//         });
//         google.accounts.id.renderButton(
//             document.getElementById('google-signin-button'),
//             { theme: 'outline', size: 'large' }
//         );
//     }, []);

//     function handleCredentialResponse(response) {
//         axios.post(
//             'http://localhost:3333/user/google-login',
//             { token: response.credential },
//             { withCredentials: true }
//         )
//             .then((res) => {

//                 dispatch(loginSuccess({
//                     user: res.data.user,
//                     token: res.data.token,
//                     role: res.data.role
//                 }));
//                 toast.success(res.data.message);
//                 dispatch(setLoginPopup(false));
//             })
//             .catch((err) => {
//                 toast.error(err.response?.data?.message || 'Login failed');
//                 dispatch(setLoginPopup(false));
//                 console.error('Error:', err);
//             });
//     }

//     return <div id="google-signin-button"></div>;
// }

// export default GoogleSignIn;










import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../../store/slices/userSlice';
import { setLoginPopup } from '../../../store/slices/authModalSlice.js';
import { googleLogin } from '../../../services/authService.js';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GoogleSignIn() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
        });
        google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { theme: 'outline', size: 'large' }
        );
    }, []);

    const handleCredentialResponse = async (response) => {
        try {
            const res = await googleLogin(response.credential)

            dispatch(loginSuccess({
                user: res.data.user,
                token: res.data.token,
                role: res.data.role
            }));
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            console.error('Error:', err);
        } finally {
            dispatch(setLoginPopup(false));
        }
    };

    return <div id="google-signin-button"></div>;
}

export default GoogleSignIn;
