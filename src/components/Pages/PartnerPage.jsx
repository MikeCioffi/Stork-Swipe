import React, { useState, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';
import { CiAirportSign1 } from 'react-icons/ci';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import './PartnerPage.css'; // Import the CSS file for animations

const PartnerPage = ({ isLoggedIn, friendEmail, setFriendEmail, sendFriendRequest, friends, userData, acceptFriend, deleteFriend }) => {
    const [isEmailValid, setIsEmailValid] = useState(false);

    useEffect(() => {
        const validateEmail = (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        };

        setIsEmailValid(validateEmail(friendEmail));
    }, [friendEmail]);

    if (!isLoggedIn) return null;

    return (
        <div className="m-4 w-11/12 md:w-5/6 p-2 md:p-6 flex flex-col justify-around items-center rounded-xl shadow-lg bg-white animate-fade-in">
            <div className='border-b-2 border-gray-100 p-4 w-full'>
                <div className='flex flex-col justify-center items-center m-auto'>
                    <h4 className='text-xl md:text-4xl font-bold w-full text-center p-5'>Send an Invite</h4>
                    <div className="flex flex-col md:flex-row justify-center items-center w-full p-5 text-center text-gray-500">
                        <BsSearch className='opacity-0 md:opacity-100 mr-4 text-3xl font-bold' />
                        <input
                            value={friendEmail}
                            onChange={e => setFriendEmail(e.target.value)}
                            placeholder='ENTER AN EMAIL'
                            className='w-full lg:w-1/4 p-4 outline-none rounded-xl shadow-md focus:ring-2 focus:ring-primary' type='email'
                        />
                        <button
                            type='submit'
                            onClick={sendFriendRequest}
                            className={`w-full md:w-auto mt-2 md:mt-0 md:ml-2 p-2 pt-4 pb-4 md:p-4 rounded-xl cursor-pointer transition-transform transform ${isEmailValid ? 'bg-green-500 text-white shadow-md hover:bg-green-600 hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            disabled={!isEmailValid}
                        >
                            SEND
                        </button>
                    </div>
                </div>
            </div>
            <div className='w-full p-1 md:p-5'>
                <div className='flex flex-col justify-center items-center'>
                    <h4 className='text-xl md:text-4xl font-bold p-5 text-center w-full'>Partners</h4>
                    <div className='flex w-full justify-center items-center flex-wrap'>
                        {friends.map((friend, index) => (
                            <React.Fragment key={friend._id}>
                                <div className={`w-full p-1 md:p-5 m-2 shadow-lg rounded-xl flex items-center bg-white animate-slide-in delay-${index}`}>
                                    {friend.status === 'sent' ?
                                        <div className='w-1/6 flex justify-center text-md md:text-4xl'><CiAirportSign1 className='text-yellow-500' /></div> :
                                        <div className='w-1/6 flex justify-center text-md md:text-4xl'><AiOutlineCheckCircle className='text-green-500' /></div>}
                                    <div className='flex flex-grow justify-start text-xs md:text-2xl lg:text-4xl'>{friend.friend_email === userData.email ? friend.email : friend.friend_email}</div>
                                    {friend.status === 'sent' && friend.friend_email === userData.email ?
                                        <button onClick={() => acceptFriend(friend._id)} className='p-1 md:p-4 m-2 bg-green-100 flex rounded-xl justify-center text-green-800 md:text-3xl hover:bg-green-300 cursor-pointer transition-transform transform hover:scale-105'>Accept</button> : null
                                    }
                                    <button onClick={() => deleteFriend(friend._id)} className='p-1 md:p-4 rounded-xl flex justify-end text-red-800 bg-red-100 text-xxs hover:bg-red-300 md:text-3xl cursor-pointer transition-transform transform hover:scale-105'>Remove</button>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerPage;