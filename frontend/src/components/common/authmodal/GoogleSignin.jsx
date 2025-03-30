

import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../../store/slices/userSlice';
import { setLoginPopup } from '../../../store/slices/authModalSlice.js';

function GoogleSignIn() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: '126702860628-8fng3hfq2itrvbrf73l53ralg11f814q.apps.googleusercontent.com',
            callback: handleCredentialResponse,
        });
        google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { theme: 'outline', size: 'large' }
        );
    }, []);

    function handleCredentialResponse(response) {
        axios
            .post(
                'http://localhost:3333/user/google-login',
                { token: response.credential },
                { withCredentials: true }
            )
            .then((res) => {

                dispatch(loginSuccess({
                    user: res.data.user,
                    token: res.data.token,
                    role: res.data.role
                }));
                toast.success(res.data.message);
                dispatch(setLoginPopup(false));
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || 'Login failed');
                dispatch(setLoginPopup(false));
                console.error('Error:', err);
            });
    }

    return <div id="google-signin-button"></div>;
}

export default GoogleSignIn;
