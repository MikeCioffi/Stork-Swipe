import React from 'react';
import { SlLike, SlDislike } from 'react-icons/sl'

const NameCard = ({ item, actionType, friendActions, toggleActionStatus, userData }) => {
    return (item &&
        <div
            className={
                item.gender === 'boy'
                    ? 'relative xs:p-6 w-full p-10 lg:w-1/4 m-2 rounded-lg min-w-fit border-4 bg-french-pass-50 border-french-pass-200 '
                    : 'relative xs:p-6 w-full p-10 lg:w-1/4 m-2 rounded-lg min-w-fit border-4 bg-pastel-pink-50'
            }
        >
            <div className='flex justify-center items-center'>
                <div className='w-1/2 text-2xl '>{item.name}</div>
                <div className='flex flex-wrap justify-center w-1/2'>
                    {friendActions && friendActions.length > 0
                        ? friendActions.map((friend) =>
                            friend.data.map(action => {
                                if (action === item.name && friend.email !== userData.email) {
                                    return (
                                        <div className='flex justify-center items-center bg-gray-50 opacity-100 text-gray-500 rounded-full h-6 w-6 mr-2 ml-2'>
                                            <img src={friend.url} alt={friend.email} className='rounded-full shadow-md' />
                                        </div>
                                    );
                                }
                                return null;
                            })
                        )
                        : null}
                </div>
                <button
                    onClick={() => toggleActionStatus(item.nameid, actionType)}
                    className={`cursor-pointer  rounded-lg`}
                >
                    {actionType === 'dislike' ? (
                        <SlDislike className='text-gray-300 text-2xl  hover:text-red-600' />
                    ) : (
                        <SlLike className='text-gray-300 hover:text-green-600' />
                    )}
                </button>
            </div>
        </div>
    );
};

export default NameCard;
