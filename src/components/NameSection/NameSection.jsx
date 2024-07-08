import React from 'react';
import NameCard from '../NameCard/NameCard';
import './NameSection.css'; // Import the CSS file for animations and styles
import Spinner from '../Utils/Spinner'; // Assuming you have a Spinner component


const NamesSection = ({ title, data = [], friendsData, actionType, toggleActionStatus, userData }) => {
    // Ensure the data and friendsData are loaded
    const isDataReady = data.length > 0 && friendsData && friendsData.length > 0;

    const getMatchesAndNonMatches = () => {
        if (!isDataReady) return { matches: [], nonMatches: [] };

        const matches = data.filter(item =>
            friendsData.some(friendGroup =>
                friendGroup.data.some(friendItem => friendItem === item.name)
            )
        );
        const nonMatches = data.filter(item =>
            !friendsData.some(friendGroup =>
                friendGroup.data.some(friendItem => friendItem === item.name)
            )
        );

        return { matches, nonMatches };
    };

    const { matches, nonMatches } = getMatchesAndNonMatches();

    const renderSection = (sectionTitle, sectionData) => (
        <div className='w-full'>
            <div className='text-2xl font-semibold p-3'>{sectionTitle}</div>
            <div className='flex h-auto justify-start w-full items-center flex-row flex-wrap'>
                {sectionData.map((item) => (
                    <div key={item.nameid} className={`w-full md:w-1/4 xl:w-1/6 p-2`}>
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
    );

    if (!isDataReady) {
        return (
            <div className='h-full flex text-center'>
                <Spinner />
            </div>
        );
    }

    return (
        <div className={`min-h-1/4 w-full items-center m-auto p-5 rounded-xl  bg-white mb-10 animate-fade-in`}>
            <div className='text-3xl font-bold w-full text-center p-5'>{title}</div>
            {matches.length > 0 && renderSection('Matches', matches)}
            {nonMatches.length > 0 && renderSection('Non Matches', nonMatches)}
        </div>
    );
};

export default NamesSection;
