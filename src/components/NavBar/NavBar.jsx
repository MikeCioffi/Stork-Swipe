import React from 'react';
import { FaBabyCarriage } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import { RiCheckboxMultipleLine } from 'react-icons/ri';
import { GiHamburgerMenu } from 'react-icons/gi';

const Navbar = ({ navState, setNavState, userData, resetUser }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleNavClick = (state) => {
        setNavState(state);
        setIsMobileMenuOpen(false); // Close the mobile menu
    };

    return (
        <nav className='relative flex items-center w-full text-md md:text-3xl lg:text-4xl p-6 bg-white border-b border-gray-200 h-20 md:h-24'>
            <div className='flex justify-start md:justify-center items-center w-full h-full'>
                <button
                    className='md:hidden p-4'
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <GiHamburgerMenu />
                </button>
                <div className={`fixed inset-0 top-20 bg-white z-10 text-center md:static md:flex md:items-center md:space-x-6 ${isMobileMenuOpen ? 'flex flex-col items-start space-y-6' : 'hidden'}`}>
                    <div
                        onClick={() => handleNavClick('Names')}
                        className={`${navState === 'Names' ? 'text-primary' : 'text-gray-600'} flex items-center w-5/6  p-6 md:w-full h-16 cursor-pointer transition-all duration-300 ease-in-out rounded-lg hover:bg-gray-100 hover:text-primary`}
                    >
                        <FaBabyCarriage />
                        <span className='ml-2'>
                            Names
                        </span>
                    </div>

                    <div
                        onClick={() => handleNavClick('Partner')}
                        className={`${navState === 'Partner' ? 'text-primary' : 'text-gray-600'} flex items-center w-5/6  p-6 md:w-full h-16 cursor-pointer transition-all duration-300 ease-in-out rounded-lg hover:bg-gray-100 hover:text-primary`}
                    >
                        <BsFillPersonFill />
                        <span className='ml-2'>
                            Partners
                        </span>
                    </div>

                    <div
                        onClick={() => handleNavClick('Matches')}
                        className={`${navState === 'Matches' ? 'text-primary' : 'text-gray-600'} flex items-center w-5/6  p-6 md:w-full h-16 cursor-pointer transition-all duration-300 ease-in-out rounded-lg hover:bg-gray-100 hover:text-primary`}
                    >
                        <RiCheckboxMultipleLine />
                        <span className='ml-2'>
                            Matches
                        </span>
                    </div>
                </div>
                {userData.email.length > 0 &&
                    <div
                        onClick={resetUser}
                        className='flex items-center h-16 p-4 cursor-pointer rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out absolute right-2'
                    >
                        <img src={userData.image_url} referrerPolicy="no-referrer" alt="user's profile" className='rounded-full h-8 w-8' />
                        <span className='ml-2 text-primary text-md md:text-xl lg:text-2xl'>Sign Out</span>
                    </div>
                }
            </div>
        </nav>
    );
};

export default Navbar;
