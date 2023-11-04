import React from 'react';
import { FaBabyCarriage } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import { RiCheckboxMultipleLine } from 'react-icons/ri';

const NavBar = ({ navState, setNavState, userData, resetUser }) => {
    return (
        <nav className='flex items-center w-full sm:justify-center justify-around text-2xl md:text-3xl lg:text-4xl'>
            {/* Added transition classes to each nav item for the border */}
            <div onClick={() => setNavState('Names')} className={`${navState === 'Names' ? 'border-gray-300' : 'border-transparent'} flex flex-col sm:flex-row items-center p-2 md:mr-4 md:p-4 cursor-pointer border-b-4 transition-all duration-300 ease-in-out rounded-lg hover:bg-gray-50`}>
                <FaBabyCarriage /><button className='ml-2'>Names</button>
            </div>

            <div onClick={() => setNavState('Partner')} className={`${navState === 'Partner' ? 'border-gray-300' : 'border-transparent'} flex flex-col sm:flex-row items-center p-2 md:mr-4 md:p-4 cursor-pointer border-b-4 transition-all duration-300 ease-in-out rounded-lg hover:bg-gray-50`}>
                <BsFillPersonFill /><button className='ml-2'>Partners</button>
            </div>

            <div onClick={() => setNavState('Matches')} className={`${navState === 'Matches' ? 'border-gray-300' : 'border-transparent'} flex flex-col sm:flex-row items-center p-2 md:mr-4 md:p-4 cursor-pointer border-b-4 transition-all duration-300 ease-in-out rounded-lg hover:bg-gray-50`}>
                <RiCheckboxMultipleLine /><button className='ml-2'>Matches</button>
            </div>

            {userData.email.length > 0 ?
                <div onClick={resetUser} className='flex flex-col sm:flex-row items-center p-2 md:p-4 cursor-pointer rounded-lg hover:bg-gray-50'>
                    <button className='flex flex-col sm:flex-row items-center justify-center'>
                        <img src={userData.image_url} referrerPolicy="no-referrer" alt="user's profile" className='rounded-full mr-2 h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16' />
                        <span>Sign Out</span>
                    </button>
                </div>
                : null
            }
        </nav>
    );
};

export default NavBar;
