import React from 'react';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';

const NameCard = ({ namekey, item, actionType, friendActions, toggleActionStatus, userData }) => {

    return (item &&
        <div key={namekey}
            className={`flex min-h-fit w-full p-3 md:w-1/4 xl:w-1/6 m-2 rounded-full border-4 ${item.gender === 'boy'
                ? 'bg-french-pass-50 border-french-pass-600'
                : 'bg-pastel-pink-50 border-pastel-pink-600'
                } overflow-hidden`} // Adjusted for overflow and removed fixed heights
        >
            <div className='flex w-full justify-around items-center'> {/* Added padding */}
                <div className='flex-grow  text-sm flex justify-start'>{item.name}</div>
                <div className='w-1/5 flex justify-around'>
                    {friendActions && friendActions.length > 0
                        ? friendActions.map((friend) =>
                            friend.data.map(action => {
                                if (action === item.name && friend.email !== userData.email) {
                                    return (
                                        <div key={friend.email} className='flex justify-center items-center '>
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
                        className="group cursor-pointer rounded-lg relative p-2"
                    >
                        <FaHeart
                            className={`absolute inset-0 text-red-300 text-2xl transition-opacity duration-200 ease-in-out ${actionType === 'like' ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 group-hover:opacity-0'
                                }`}
                        />
                        <FaHeartBroken
                            className={`absolute inset-0 text-red-300 text-2xl transition-opacity duration-200 ease-in-out ${actionType === 'like' ? 'opacity-100 group-hover:opacity-0' : 'opacity-0 group-hover:opacity-100'
                                }`}
                        />
                    </button>


                </div>


            </div>
        </div>
    );
};

export default NameCard;
