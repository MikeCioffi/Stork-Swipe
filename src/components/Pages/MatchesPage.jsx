import React from 'react';
import NamesSection from '../NameSection/NameSection';
import { SlLike, SlDislike } from 'react-icons/sl'


const MatchesPage = ({
    likedData, disLikedData, friendLikes, friendDisLikes, toggleActionStatus, userData
}) => (
    <div className="w-11/12 m-2 md:w-5/6 rounded-xl border-2 border-gray-400  bg-gray-50 flex-col min-h-1/4 flex   justify-center ">

        <NamesSection
            title="Liked"
            data={likedData}
            friendsData={friendLikes}
            toggleActionStatus={toggleActionStatus}
            actionType="dislike"
            icon={<SlLike className='mr-2 text-green-500' />}
            userData={userData}
        />

        <NamesSection
            title="Disliked"
            data={disLikedData}
            friendsData={friendDisLikes}
            toggleActionStatus={toggleActionStatus}
            actionType="like"
            icon={<SlDislike className='mr-2 text-red-500' />}
            userData={userData}
        />


    </div>
);

export default MatchesPage;
