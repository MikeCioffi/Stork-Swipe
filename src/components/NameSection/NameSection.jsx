import React from 'react';
import NameCard from '../NameCard/NameCard';

const NamesSection = ({ title, data, friendsData, actionType, toggleAction, icon, userData }) => {

    return (data &&
        <div className="min-h-1/4 w-full  md:w-3/4 items-center m-auto p-5 rounded-md flex shadow-lg justify-center flex-col mb-10">
            <div className='flex items-center text-3xl font-bold p-5'>{title}</div>

            <div className='flex justify-center w-full items-center flex-row flex-wrap'>
                {data.map((item) => (
                    <NameCard
                        item={item}
                        actionType={actionType}
                        friendActions={friendsData}
                        toggleActionStatus={toggleAction}
                        userData={userData}
                    />
                ))}
            </div>
        </div>
    );

};

export default NamesSection;
