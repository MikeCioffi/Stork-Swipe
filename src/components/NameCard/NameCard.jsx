import React from 'react';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';

const NameCard = ({ namekey, item, actionType, friendActions, toggleActionStatus, userData }) => {
    return (item &&
        <div key={namekey}
            className={`flex min-h-fit w-full p-3 md:w-1/6 m-2 rounded-full border-8 ${item.gender === 'boy'
                ? 'bg-french-pass-50 border-french-pass-600'
                : 'bg-pastel-pink-50 border-pastel-pink-600'
                } overflow-hidden`} // Adjusted for overflow and removed fixed heights
        >
            <div className='flex w-full justify-around items-center'> {/* Added padding */}
                <div className='w-1/2 text-2xl flex justify-center'>{item.name}</div>
                <div className='w-1/5 flex justify-around'>
                    {friendActions && friendActions.length > 0
                        ? friendActions.map((friend) =>
                            friend.data.map(action => {
                                if (action === item.name && friend.email !== userData.email) {
                                    return (
                                        <div key={friend.email} className='flex justify-center items-center '> {/* Added key */}
                                            <img className='h-6 w-6 rounded-full' src={friend.url} alt={friend.email} />
                                        </div>
                                    );
                                }
                                return null;
                            })
                        )
                        : null}
                </div>
                <div className='w-1/4 flex justify-around'>
                    <button
                        onClick={() => toggleActionStatus(item.nameid, actionType)}
                        className={`cursor-pointer  rounded-lg`}
                    >
                        {actionType === 'dislike' ? (
                            <FaHeartBroken className='text-red-300 text-2xl hover:text-red-600' />

                        ) : (
                            <FaHeart className='text-red-300 text-2xl  hover:text-red-600' />

                        )}
                    </button>
                </div>


            </div>
        </div>
    );
};

export default NameCard;
