import React, { useState } from 'react';
import './App.css';


import names from '../src/names.json'


// icons
import { FcCheckmark, FcCancel } from 'react-icons/fc';
import { FaBabyCarriage } from 'react-icons/fa';
import { BsFillPersonFill, BsSearch } from 'react-icons/bs'
import { RiCheckboxMultipleLine } from 'react-icons/ri'
import { MdCancel } from 'react-icons/md'
import { CiAirportSign1 } from 'react-icons/ci'
import { AiOutlineCheckCircle } from 'react-icons/ai'


// Be able to find partners
// show matching matching partners
//  show dashboard of partners and names you like

function App() {
  const [nameIndex, setNameIndex] = useState(1)

  const [navState, setNavState] = useState('Home')

  const [likedNames, setLikedNames] = useState([])
  const [disLikedNames, setDisLikedNames] = useState([])

  console.log(likedNames)
  console.log(disLikedNames)

  const handleclick = (event) => {

    if (event === 'liked') {

      setLikedNames(current => [...current, names.names[nameIndex]])
      setNameIndex(nameIndex + 1)


    }
    if (event === 'disliked') {
      setDisLikedNames(current => [...current, names.names[nameIndex]])
      setNameIndex(nameIndex + 1)

    }

    // update liked or disliked
    // increate name counter

  }



  return (
    <div className="flex h-full w-full items-center flex-col">
      <nav className='flex items-center justify-center'>
        <div onClick={() => setNavState('Home')} className='flex items-center mr-4 p-4 cursor-pointer'> <FaBabyCarriage /> <button className='ml-2'>Home</button> </div>
        <div onClick={() => setNavState('Partner')} className='flex items-center m-4 p-4 cursor-pointer'><BsFillPersonFill /><button className='ml-2'>Partners</button></div>
        <div onClick={() => setNavState('Matches')} className='flex items-center m-4 p-4 cursor-pointer'><RiCheckboxMultipleLine /><button className='ml-2'>Matches</button></div>

      </nav>

      {navState === 'Home' ?
        <div className="mt-12 h-1/4 w-3/4 md:w-1/2 rounded-lg xl:w-1/4 flex shadow-xl  justify-center flex-row">
          <div onClick={() => handleclick('disliked')} className='w-1/12 items-center justify-center flex flex-col cursor-pointer hover:bg-red-100 rounded-lg'><FcCancel /></div>
          <div className='w-10/12 justify-center items-center flex flex-col'>
            <h1 className='-mt-4 text-sm'>Name</h1>
            <h3 className='text-5xl'>{names.names[nameIndex]}</h3>
          </div>
          <div onClick={() => handleclick('liked')} className='w-1/12 items-center justify-center   rounded-lg flex flex-col cursor-pointer hover:bg-green-100'><FcCheckmark /></div>
        </div>
        : navState === 'Partner' ?
          // partner container
          <div className="mt-12 min-h-1/4 w-3/4 md:w-1/2 rounded-lg xl:w-1/4 flex shadow-xl  justify-start items-center flex-col">
            <div className='border-b-2 p-4 w-full' >
              <div className='flex flex-col jusify-center items-center m-auto' >
                <h4>send an invite</h4>
                <div className='flex flex-row w-3/4 items-center'>
                  <BsSearch className='mr-2' />
                  <input placeholder='enter an email' className='flex-grow shadow p-4 outline-none rounded-lg' type='email'></input>
                  <button type='submit' className='ml-2 p-4 rounded-lg shadow cursor-pointer'>send</button>
                </div>
              </div>
            </div>
            <div className='w-full' >
              <div className='flex flex-col items-center'>
                <h4>connected partners</h4>
                <div className='w-3/4 m-2 p-4 shadow rounded-lg flex items-center'>
                  <span className='mr-2'><AiOutlineCheckCircle className='text-green-500' /></span>
                  <span className='flex-grow'>email.test1234@gmail.com</span>
                  <span><MdCancel className='text-red-400 hover:text-red-800 cursor-pointer' /></span>
                </div>
                <div className='w-3/4 m-2 p-4 shadow rounded-lg flex items-center'>
                  <span className='mr-2'><CiAirportSign1 className='text-yellow-400' /></span>
                  <span className='flex-grow'>jane.doe@gmail.com</span>
                  <span><MdCancel className='text-red-400 hover:text-red-800 cursor-pointer' /></span>
                </div>
                <div className='w-3/4 m-2 p-4 shadow rounded-lg flex items-center'>
                  <span className='mr-2'><CiAirportSign1 className='text-yellow-400' /></span>
                  <span className='flex-grow'>charlie.brown@gmail.com</span>
                  <span><MdCancel className='text-red-400 hover:text-red-800 cursor-pointer' /></span>
                </div>
              </div>
            </div>
          </div>
          : navState === 'Matches' ?
            <div className="mt-12 min-h-1/4 w-3/4 md:w-1/2 rounded-lg xl:w-1/4 flex shadow-xl  justify-center flex-row">
              <div className='w-full flex flex-row'>
                <div className='w-1/2 flex justify-start items-center flex-col'> Liked
                  <div className='flex  flex-wrap text-center'>{likedNames.map((name) =>
                    <span className='p-4 shadow m-2'> {name} </span>
                  )}</div>
                </div>
                <div className='w-1/2 flex flex-col justify-start items-center'> Disliked
                  <div className='flex  flex-wrap text-center'>{disLikedNames.map((name) =>
                    <span className='p-4 m-2 shadow'> {name} </span>
                  )}</div>

                </div>
              </div>
            </div>
            :
            <></>
      }
    </div >
  );
}

export default App;
