


import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../../store/slices/userSlice';
import { setLoginPopup } from '../../../store/slices/authModalSlice.js';
import { googleLogin } from '../../../services/authService.js';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GoogleSignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCredentialResponseWrapper = async (response) => {
            try {
                const res = await googleLogin(response.credential)

                if (res.data && res.data.token) {
                    localStorage.setItem('accessToken', res.data.token);
                }

                dispatch(loginSuccess({
                    user: res.data.user,
                    token: res.data.token,
                    role: res.data.role
                }));
                toast.success(res.data.message);
                localStorage.removeItem('referralCode');

                if (res.data.role === "admin") {
                    navigate("/admin/dashboard");
                } else if (res.data.role === "seller") {
                    navigate("/seller");
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'Login failed');
                console.error('Error:', err);
            } finally {
                dispatch(setLoginPopup(false));
            }
        };

        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponseWrapper,
        });
        google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { theme: 'outline', size: 'large' }
        );
    }, [dispatch, navigate]);


    return <div id="google-signin-button"></div>;
}

export default GoogleSignIn;
