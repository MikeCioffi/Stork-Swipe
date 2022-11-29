import React, { useEffect, useState } from 'react';
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
import { TbGenderDemigirl, TbGenderMale } from 'react-icons/tb'
import { SlLike, SlDislike } from 'react-icons/sl'


// 
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios"




// Be able to find partners
// show matching matching partners
//  show dashboard of partners and names you like

function App() {
  const [nameIndex, setNameIndex] = useState(0)
  const [listKey, setListKey] = useState('boy')
  const [navState, setNavState] = useState('Names')
  const [likedBoyNames, setLikedBoyNames] = useState([])
  const [likedGirlNames, setLikedGirlNames] = useState([])

  const [disLikedBoyNames, setDisLikedBoyNames] = useState([])
  const [disLikedGirlNames, setDisLikedGirlNames] = useState([])

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [userData, setUserData] = useState({
    "email": '',
    "first_name": '',
    "last_name": '',
    "image_url": ''

  })

  const resetUser = () => {
    setUserData({
      "email": '',
      "first_name": '',
      "last_name": '',
      "image_url": ''

    })
    setIsLoggedIn(false)
  }


  useEffect(() => {
    if (userData.email !== undefined) {
      matchUser()

    }
  }, [userData.email])


  const matchUser = async () => {
    if (userData.email !== undefined)
      if (userData.email.length > 0) {
        await axios
          .get(`http://localhost:3001/api/user/getOne/${userData.email}`, {
          })
          .then(function (response) {
            if ((response.data.length === 0)) {
              createUser()
            }

          })

          .catch(function (error) {
            console.log(error)
          })
      }
  }


  const createUser = async () => {
    await axios
      .post(`http://localhost:3001/api/user/post/`, {
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        image_url: userData.image_url
      })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  let upperListKey = listKey.toUpperCase()

  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };
  const handleclick = (event, listKey) => {
    if (event === 'liked' && listKey === 'boy') {
      setLikedBoyNames(current => [...current, names[listKey][nameIndex]])
      setNameIndex(nameIndex + 1)
    }
    if (event === 'liked' && listKey === 'girl') {
      setLikedGirlNames(current => [...current, names[listKey][nameIndex]])
      setNameIndex(nameIndex + 1)
    }
    if (event === 'disliked' && listKey === 'boy') {
      setDisLikedBoyNames(current => [...current, names[listKey][nameIndex]])
      setNameIndex(nameIndex + 1)
    }
    if (event === 'disliked' && listKey === 'girl') {
      setDisLikedGirlNames(current => [...current, names[listKey][nameIndex]])
      setNameIndex(nameIndex + 1)
    }


    // update liked or disliked
    // increate name counter

  }



  return (
    <div className="flex h-full w-full items-center flex-col">
      <nav className='flex items-center w-full justify-center'>

        <div onClick={() => setNavState('Names')} className={navState === 'Names' ?
          'flex items-center mr-2 p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-gray-300'
          : 'flex items-center mr-2 p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-transparent rounded-lg hover:bg-gray-50'}>
          <FaBabyCarriage /> <button className='ml-2'>Names</button> </div>
        <div onClick={() => setNavState('Partner')} className={navState === 'Partner' ?
          'flex items-center mr-2 p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-gray-300'
          : 'flex items-center mr-2 p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-transparent rounded-lg hover:bg-gray-50 '}>
          <BsFillPersonFill /><button className='ml-2'>Partners</button></div>
        <div onClick={() => setNavState('Matches')} className={navState === 'Matches' ?
          'flex items-center mr-2 p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-gray-300'
          : 'flex items-center mr-2 p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-transparent rounded-lg hover:bg-gray-50'}>
          <RiCheckboxMultipleLine /><button className='ml-2'>Matches</button>

        </div>
        <div className=''>
          {userData.email.length > 0 ?
            <button className='flex items-center mr-2 p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-transparent rounded-lg' onClick={() => resetUser()}>
              <img src={userData.image_url} referrerPolicy="no-referrer" alt="user's google profile" className='rounded-full mr-2 h-12 w-12'></img>
              <span>Sign Out</span></button> : <></>
          }
        </div>
      </nav >

      {isLoggedIn === false ?
        <div className="mt-12 h-1/4 w-11/12 md:w-1/2 rounded-lg xl:w-1/2 flex shadow-xl  justify-center items-center flex-col flex-wrap">
          <h3 className='mb-4 p-4 text-center'>Please login with your google account to decide on your favorite names!</h3>

          <GoogleLogin auto_select
            onSuccess={credentialResponse => {
              setIsLoggedIn(true)
              setNavState('Names')
              let tempUserData = parseJwt(credentialResponse.credential)
              setUserData({
                "email": tempUserData.email,
                "first_name": tempUserData.given_name,
                "last_name": tempUserData.family_name,
                "image_url": tempUserData.picture
              });


            }}
            onError={() => {
              console.log('Login Failed');
            }}
          /></div> :
        navState === 'Names' && isLoggedIn === true ?

          <div className="flex flex-col w-full justify-center items-center">
            <div className='flex w-full justify-center m-auto border-b-2 border-gray-100'>
              <button onClick={() => setListKey('boy')} className={listKey === 'boy' ?
                'p-4 m-4 bg-blue-300 rounded-full text-white' :
                'p-4 m-4 bg-blue-100 rounded-full text-white hover:bg-blue-200'}>
                <TbGenderMale /></button>
              <button onClick={() => setListKey('girl')} className={listKey === 'girl' ?
                'p-4 m-4  bg-pink-300 rounded-full text-white' :
                'p-4 m-4  bg-pink-100 rounded-full text-white hover:bg-pink-200'} >
                <TbGenderDemigirl /></button>

            </div>
            <div className="mt-12 h-48 w-11/12 md:w-1/2 rounded-lg xl:w-1/4 flex shadow-xl  justify-center flex-row flex-wrap">
              <button onClick={() => handleclick('disliked', listKey)} className='w-1/6 md:1/12 items-center justify-center flex flex-col cursor-pointer hover:bg-red-100 rounded-lg'><FcCancel /></button>
              <div className='w-2/3 md:10/12 justify-center items-center flex flex-col'>
                <h2 className='-mt-4 text-xs'>{upperListKey} NAME</h2>
                <h3 className='text-5xl'>{names[listKey][nameIndex]}</h3>
              </div>
              <button onClick={() => handleclick('liked', listKey)} className='w-1/6 md:1/12 items-center justify-center   rounded-lg flex flex-col cursor-pointer hover:bg-green-100'><FcCheckmark /></button>

            </div>
          </div>

          : navState === 'Partner' && isLoggedIn === true ?
            // partner container
            <div className="mt-4 min-h-1/4 w-3/4 md:w-1/2 rounded-lg xl:w-1/2 flex shadow-xl  justify-start items-center flex-col">
              <div className='border-b-2 border-gray-100 p-4 w-full' >
                <div className='flex flex-col jusify-center items-center m-auto' >
                  <h4>send an invite</h4>
                  <div className='flex flex-row md:flex-row w-full sm:w-3/4 items-center'>
                    <BsSearch className='mr-2' />
                    <input placeholder='enter an email' className='flex-grow shadow p-4 outline-none rounded-lg' type='email'></input>
                    <button type='submit' className='ml-2 p-2 pt-4 pb-4 md:p-4 rounded-lg shadow cursor-pointer'>send</button>
                  </div>
                </div>
              </div>
              <div className='w-full' >
                <div className='flex flex-col items-center'>
                  <h4>connected partners</h4>
                  <div className='w-full md:w-1/2 m-2 p-4 shadow rounded-lg flex items-center'>
                    <span className='mr-2'><AiOutlineCheckCircle className='text-green-500' /></span>
                    <span className='flex-grow'>email.test1234@gmail.com</span>
                    <span><MdCancel className='text-red-400 hover:text-red-800 cursor-pointer' /></span>
                  </div>
                  <div className='w-full md:w-1/2 m-2 p-4 shadow rounded-lg flex items-center'>
                    <span className='mr-2'><CiAirportSign1 className='text-yellow-400' /></span>
                    <span className='flex-grow'>jane.doe@gmail.com</span>
                    <span><MdCancel className='text-red-400 hover:text-red-800 cursor-pointer' /></span>
                  </div>
                  <div className='w-full md:w-1/2 m-2 p-4 shadow rounded-lg flex items-center'>
                    <span className='mr-2'><CiAirportSign1 className='text-yellow-400' /></span>
                    <span className='flex-grow'>charlie.brown@gmail.com</span>
                    <span><MdCancel className='text-red-400 hover:text-red-800 cursor-pointer' /></span>
                  </div>
                </div>
              </div>
            </div>
            : navState === 'Matches' ?
              <div className="mt-12 min-h-1/4 w-11/12 md:w-1/2 rounded-lg xl:w-1/2 flex shadow-xl  justify-center  flex-col sm:flex-row">
                <div className='md:w-1/2 flex justify-start items-center flex-col'> <div className='flex items-center'><SlLike className='mr-2' /> Liked</div>

                  <div className='flex w-full flex-wrap text-center justify-around'>{likedGirlNames.map((name) =>
                    <div className='p-4 w-5/12 mt-2 rounded-lg shadow-sm bg-pink-50 min-w-fit'> {name} </div>
                  )}</div>
                  <div className='flex w-full flex-wrap  text-center justify-around'> {likedBoyNames.map((name) =>
                    <div className='p-4 w-5/12 mt-2  rounded-lg shadow-sm bg-blue-50 min-w-fit'> {name} </div>
                  )}</div>
                </div>
                <div className='md:w-1/2 flex justify-start items-center flex-col'> <div className='flex items-center'><SlDislike className='mr-2' /> Dislike</div>

                  <div className='flex w-full flex-wrap text-center justify-around'> {disLikedGirlNames.map((name) =>
                    <div className='p-4 w-5/12 mt-2 rounded-lg shadow-sm bg-pink-50 min-w-fit'> {name} </div>
                  )}</div>
                  <div className='flex w-full flex-wrap text-center justify-around'> {disLikedBoyNames.map((name) =>
                    <div className='p-4 w-5/12 mt-2  rounded-lg shadow-sm bg-blue-50 min-w-fit'> {name} </div>
                  )}</div>
                </div>

              </div>
              :
              <></>
      }
    </div >
  );
}

export default App;
