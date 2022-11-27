import React, { useState } from 'react';
import './App.css';
import { FcCheckmark, FcCancel } from 'react-icons/fc';
import { FaBabyCarriage } from 'react-icons/fa';
import { BsFillPersonFill, BsSearch } from 'react-icons/bs'
import { RiCheckboxMultipleLine } from 'react-icons/ri'


// Be able to find partners
// show matching matching partners
//  show dashboard of partners and names you like

function App() {

  const [navState, setNavState] = useState('Home')



  return (
    <div className="flex h-full w-full items-center flex-col">
      <nav className='flex items-center justify-center'>
        <div onClick={() => setNavState('Home')} className='flex items-center mr-4 p-4 cursor-pointer'> <FaBabyCarriage /> <span className='ml-2'>Home</span> </div>
        <div onClick={() => setNavState('Partner')} className='flex items-center m-4 p-4 cursor-pointer'><BsFillPersonFill /><span className='ml-2'>Partners</span></div>
        <div onClick={() => setNavState('Matches')} className='flex items-center m-4 p-4 cursor-pointer'><RiCheckboxMultipleLine /><span className='ml-2'>Matches</span></div>

      </nav>

      {navState === 'Home' ?
        <div className="mt-12 h-1/4 w-3/4 md:w-1/2 rounded-lg xl:w-1/4 flex shadow-xl  justify-center flex-row">
          <div className='w-1/12 items-center justify-center flex flex-col cursor-pointer hover:bg-red-100 rounded-lg'><FcCancel /></div>
          <div className='w-10/12 justify-center items-center flex flex-col'>
            <h1 className='-mt-4 text-sm'>Name</h1>
            <h3 className='text-5xl'>Victoria</h3>
          </div>
          <div className='w-1/12 items-center justify-center  rounded-lg flex flex-col cursor-pointer hover:bg-green-100'><FcCheckmark /></div>
        </div>
        : navState === 'Partner' ?
          // partner container
          <div className="mt-12 h-1/4 w-3/4 md:w-1/2 rounded-lg xl:w-1/4 flex shadow-xl  justify-start items-center flex-col">
            <div className='border-b-2 p-4 w-full' >
              <div className='flex flex-col jusify-center items-center m-auto' >
                <h4>send an invite</h4>
                <div className='flex flex-row w-3/4 items-center'>
                  <BsSearch className='mr-2' />
                  <input placeholder='enter an email' className='flex-grow shadow p-2 outline-none' type='email'></input>
                  <span className='ml-2 p-2 rounded-lg shadow cursor-pointer'>send</span>
                </div>
              </div>
            </div>
            <div className='flex flex-col m-auto' >

              <div>connected partners</div>

            </div>

          </div>
          : navState === 'Matches' ?
            <div className="mt-12 h-1/4 w-3/4 md:w-1/2 rounded-lg xl:w-1/4 flex shadow-xl  justify-center flex-row">
              Matches
            </div>
            :
            <></>
      }
    </div>
  );
}

export default App;
