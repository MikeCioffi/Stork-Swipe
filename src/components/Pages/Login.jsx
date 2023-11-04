import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = ({ setUserData, getListIndexs, setIsLoggedIn }) => {
    const parseJwt = (token) => {
        try {
            // Split the JWT into its three parts and take the payload (the second part)
            const base64Url = token.split('.')[1];
            // Replace '-' with '+' and '_' with '/' to reverse Base64Url encoding
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            // Decode the Base64 string
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                // Encode each character's ASCII value into a hexadecimal string
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            // Parse the JSON string and return the parsed object
            return JSON.parse(jsonPayload);
        } catch (e) {
            // Handle errors, such as if the token is not valid
            console.error('Error parsing JWT', e);
            return null;
        }
    };
    return (
        <div className="mt-12 h-1/4 w-11/12 md:w-1/2 rounded-lg xl:w-1/2 flex shadow-md justify-center items-center flex-col flex-wrap">
            <h3 className='mb-4 p-4 text-center'>Please login with your google account to decide on your favorite names!</h3>
            <GoogleLogin auto_select
                onSuccess={credentialResponse => {
                    let tempUserData = parseJwt(credentialResponse.credential);
                    setUserData({
                        "email": tempUserData.email,
                        "first_name": tempUserData.given_name,
                        "last_name": tempUserData.family_name,
                        "image_url": tempUserData.picture
                    });
                    getListIndexs(tempUserData.email);
                    setIsLoggedIn(true);
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    );
};

export default LoginPage;
