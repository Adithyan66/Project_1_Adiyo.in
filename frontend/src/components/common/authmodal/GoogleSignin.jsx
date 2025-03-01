import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../../store/slices/userSlice'


function GoogleSignIn() {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {

        /* global google */

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
        console.log("Encoded JWT ID token:", response.credential);
        axios
            .post('http://localhost:3333/user/google-login', { token: response.credential })

            .then((res) => {

                console.log('Server response:', res.data.user);

                dispatch(loginSuccess({ user: res.data.user, token: res.data.token, role: res.data.role }));

                console.log("User:", user);


            })
            .catch((err) => {

                console.error('Error:', err);

            });
    }

    return <div id="google-signin-button"></div>;
}

export default GoogleSignIn;
