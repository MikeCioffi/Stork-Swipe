import React, { useState } from 'react';
import NameCard from '../NameCard/NameCard';
import './NameSection.css'; // Import the CSS file for animations and styles

const NamesSection = ({ title, data = [], friendsData, actionType, toggleActionStatus, userData }) => {
    const [isLoaded] = useState(data.length > 0);

    const boysData = data.filter(item => item.gender === 'boy');
    const girlsData = data.filter(item => item.gender === 'girl');

    return (
        <div className={`min-h-1/4 w-full items-center m-auto p-5 rounded-xl shadow-lg bg-white mb-10 ${isLoaded ? 'animate-fade-in' : ''}`}>
            <div className='text-3xl font-bold w-full text-center p-5'>{title}</div>
            <div className='w-full'>
                <div className='text-2xl font-semibold p-3'>Boys</div>
                <div className='flex h-auto justify-start w-full items-center flex-row flex-wrap'>
                    {boysData.map((item, index) => (
                        <div key={item.nameid} className={`w-full md:w-1/4 xl:w-1/6 p-2 '}`}>
                            <NameCard
                                namekey={item.nameid}
                                item={item}
                                actionType={actionType}
                                friendActions={friendsData}
                                toggleActionStatus={toggleActionStatus}
                                userData={userData}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-full mt-5'>
                <div className='text-2xl font-semibold p-3'>Girls</div>
                <div className='flex h-auto justify-start w-full items-center flex-row flex-wrap'>
                    {girlsData.map((item, index) => (
                        <div key={item.nameid} className={`w-full md:w-1/4 xl:w-1/6 p-2 '}`}>
                            <NameCard
                                namekey={item.nameid}
                                item={item}
                                actionType={actionType}
                                friendActions={friendsData}
                                toggleActionStatus={toggleActionStatus}
                                userData={userData}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NamesSection;
