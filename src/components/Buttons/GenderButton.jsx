import React from 'react';
import { TbGenderMale, TbGenderDemigirl } from 'react-icons/tb'; // assuming these are the icons you're using

const GenderButton = ({ gender, setListKey, listKey }) => {
    const isBoy = gender === 'boy';
    const icon = isBoy ? <TbGenderMale /> : <TbGenderDemigirl />;
    const activeClass = isBoy ? 'bg-french-pass-800 text-french-pass-50 text-white' : 'bg-pastel-pink-800 text-white';
    const inactiveClass = isBoy ? 'bg-french-pass-50 hover:bg-french-pass-300 text-white' : 'text-pink-600 bg-pastel-pink-100 hover:bg-pastel-pink-300';

    return (
        <button onClick={() => setListKey(gender)} className={`p-4 m-4 rounded-full ${listKey === gender ? activeClass : inactiveClass}`}>
            {icon}
        </button>
    );
};

export default GenderButton;
