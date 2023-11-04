import React from 'react';
import malepic from '../../images/2.png'
import femalepic from '../../images/3.png'


const GenderButton = ({ gender, setListKey, listKey }) => {
    const isBoy = gender === 'boy';
    const icon = isBoy ? <img src={malepic} alt="Malebird Graphic" className="rounded-full h-20 w-20 object-cover" /> :
        <img src={femalepic} alt="Femalebird Graphic" className="rounded-full h-20 w-20 object-cover" />

    const activeClass = isBoy ? 'bg-french-pass-800 text-french-pass-50 text-white' : 'bg-pastel-pink-800 text-white';
    const inactiveClass = isBoy ? 'bg-french-pass-50 hover:bg-french-pass-300 text-white' : 'text-pink-600 bg-pastel-pink-100 hover:bg-pastel-pink-300';

    return (
        <button onClick={() => setListKey(gender)} className={`p-4 m-4 rounded-full ${listKey === gender ? activeClass : inactiveClass}`}>
            {icon}
        </button>
    );
};

export default GenderButton;
