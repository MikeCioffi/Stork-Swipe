import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import main from '../../images/main.png'
import fake from '../../images/2.png'

const LoginPage = ({ setUserData, getListIndexs, setIsLoggedIn }) => {

    const handleTryItOut = () => {
        setUserData({
            email: "fakeuser@storkswipe.com",
            first_name: "Fake",
            last_name: "User",
            image_url: fake
        });

    };
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
    // ...

    return (
        <div className="flex w-full flex-col items-center justify-center md:justify-center h-screen bg-gradient-to-br from-blue-400 to-red-200">
            {/* Split container */}
            <div className="flex flex-col lg:flex-row items-center h-auto justify-center w-11/12 md:w-1/2  bg-white rounded-xl  shadow-xl ">
                {/* Left side: Image */}
                <div className="w-full lg:w-1/2 flex justify-center items-center bg-transparent">
                    <img src={main} alt="Cool Graphic" className="rounded-lg max-w-full h-auto object-cover" />
                </div>

                {/* Right side: Welcome Message and Login */}
                <div className="w-full lg:w-1/2  flex flex-col justify-center p-6">
                    <div>
                        <h1 className="text-xl lg:text-3xl xl:text-3xl text-center font-bold text-gray-700">Welcome To Stork Swipe</h1>
                        <h3 className="text-lg text-center text-gray-500 px-4 m-10">Log in with your Google account to find your favorite names!</h3>
                    </div>
                    <div className="flex  flex-col items-center justify-center">
                        <GoogleLogin
                            className="auto_select"
                            onSuccess={credentialResponse => {
                                let tempUserData = parseJwt(credentialResponse.credential);
                                setUserData({
                                    "email": tempUserData.email,
                                    "first_name": tempUserData.given_name,
                                    "last_name": tempUserData.family_name,
                                    "image_url": tempUserData.picture
                                });

                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                        <button
                            onClick={handleTryItOut}
                            className="mt-4 bg-gradient-to-br
                             from-blue-400 to-red-200 hover:opacity-75
                              text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Try it out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );


};

export default LoginPage;
