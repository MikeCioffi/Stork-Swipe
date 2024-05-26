import React from 'react';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip'; // Corrected import for Tooltip

const NameCard = ({ namekey, item, actionType, friendActions, toggleActionStatus, userData }) => {
    const capitalizeName = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    return (
        item && (
            <div
                key={namekey}
                className={`flex min-h-fit w-full p-5 rounded-xl ${item.gender === 'boy' ? 'bg-blue-100' : 'bg-pink-100'} overflow-hidden`} // Adjusted for overflow and background colors
            >
                <div className='flex w-full justify-around items-center'>
                    <div className='flex-grow text-sm md:text-lg text-center'>{capitalizeName(item.name)}</div>
                    <div className='w-1/5 flex justify-around'>
                        {friendActions && friendActions.length > 0
                            ? friendActions.map((friend) =>
                                friend.data.map(action => {
                                    if (action === item.name && friend.email !== userData.email) {
                                        return (
                                            <div key={friend.email} className='flex flex-col justify-center items-center' data-tooltip-id={`tooltip-${friend.email}`} data-tooltip-content={friend.email}>
                                                <img className='h-6 w-6 rounded-full' src={friend.url} alt={friend.email} />
                                                <span className='text-xs md:text-sm'>{friend.first_name}</span>
                                                <Tooltip id={`tooltip-${friend.email}`} />
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
                                className={`absolute inset-0 text-red-300 text-2xl transition-opacity duration-200 ease-in-out ${actionType === 'like' ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 group-hover:opacity-0'}`}
                            />
                            <FaHeartBroken
                                className={`absolute inset-0 text-red-300 text-2xl transition-opacity duration-200 ease-in-out ${actionType === 'like' ? 'opacity-100 group-hover:opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default NameCard;
