import React from 'react';
import NamesSection from '../NameSection/NameSection';
import { SlLike, SlDislike } from 'react-icons/sl';
import Spinner from '../Utils/Spinner'; // Import the spinner component


const MatchesPage = ({
    likedData, disLikedData, friendLikes, friendDisLikes, toggleActionStatus, userData
}) => {
    const isDataReady = likedData.length > 0 && disLikedData.length > 0 && friendLikes.length > 0 && friendDisLikes.length > 0;

    const getSortedData = (data, friendData) => {
        const matches = data.filter(item => friendData.some(friendItem => friendItem.nameid === item.nameid));
        const others = data.filter(item => !friendData.some(friendItem => friendItem.nameid === item.nameid));
        return [...matches, ...others];
    };

    let sortedLikedData = [];
    let sortedDisLikedData = [];

    if (isDataReady) {
        sortedLikedData = getSortedData(likedData, friendLikes);
        sortedDisLikedData = getSortedData(disLikedData, friendDisLikes);
    }

    if (!isDataReady) {
        return (
            <div className="text-center">
                <Spinner /> {/* Use the spinner component */}

            </div>
        );
    }

    return (
        <div className="w-11/12 flex flex-col justify-around items-center bg-white">
            <NamesSection
                title="Liked"
                data={sortedLikedData}
                friendsData={friendLikes}
                toggleActionStatus={toggleActionStatus}
                actionType="dislike"
                icon={<SlLike className='mr-2 text-green-500' />}
                userData={userData}
            />
            <NamesSection
                title="Disliked"
                data={sortedDisLikedData}
                friendsData={friendDisLikes}
                toggleActionStatus={toggleActionStatus}
                actionType="like"
                icon={<SlDislike className='mr-2 text-red-500' />}
                userData={userData}
            />
        </div>
    );
};

export default MatchesPage;
