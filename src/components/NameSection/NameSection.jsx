import React from 'react';
import NameCard from '../NameCard/NameCard';

const NamesSection = ({ title, data, friendsData, actionType, toggleActionStatus, userData }) => {


    return (data &&
        <div className="min-h-1/4 w-full  items-center m-auto p-5 rounded-md flex  justify-center flex-col mb-10">
            <div className='flex items-center text-3xl font-bold w-full text-center justify-center border-b-8 p-5 mb-5 border-gray-200'>{title}</div>


            <div className='flex h-auto justify-center w-full items-center flex-row flex-wrap'>
                {data.map((item) => (
                    <NameCard
                        namekey={item.nameid}
                        item={item}
                        actionType={actionType}
                        friendActions={friendsData}
                        toggleActionStatus={toggleActionStatus}
                        userData={userData}
                    />
                ))}
            </div>
        </div>
    );

};

export default NamesSection;
