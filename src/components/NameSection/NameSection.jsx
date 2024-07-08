import React, { useState } from 'react';
import NameCard from '../NameCard/NameCard';
import './NameSection.css'; // Import the CSS file for animations and styles

const NamesSection = ({ title, data = [], friendsData, actionType, toggleActionStatus, userData }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [matches, setMatches] = useState([]);
    const [nonMatches, setNonMatches] = useState([]);

    console.log("friendData:", friendsData);
    console.log("data:", data);

    // This will run synchronously and update state immediately
    if (data.length > 0 && friendsData && friendsData.length > 0 && !isLoaded) {
        const matchResults = data.filter(item =>
            friendsData.some(friendGroup =>
                friendGroup.data.some(friendItem => friendItem === item.name)
            )
        );
        const nonMatchResults = data.filter(item =>
            !friendsData.some(friendGroup =>
                friendGroup.data.some(friendItem => friendItem === item.name)
            )
        );
        setMatches(matchResults);
        setNonMatches(nonMatchResults);
        setIsLoaded(true);
    }

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

    return (
        <div className={`min-h-1/4 w-full items-center m-auto p-5 rounded-xl shadow-lg bg-white mb-10 ${isLoaded ? 'animate-fade-in' : ''}`}>
            <div className='text-3xl font-bold w-full text-center p-5'>{title}</div>
            {isLoaded ? (
                <>
                    {matches.length > 0 && renderSection('Matches', matches)}
                    {nonMatches.length > 0 && renderSection('Non Matches', nonMatches)}
                </>
            ) : (
                <div className='text-center'>
                    <div className='spinner'></div> {/* Replace with your spinner component or styling */}
                    <p>Loading...</p>
                </div>
            )}
        </div>
    );
};

export default NamesSection;
