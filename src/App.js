import React, { useCallback, useEffect, useState } from 'react';

// components
import NamesSection from './components/NameSection/NameSection';

import './App.css';
// icons
import { FcCheckmark } from 'react-icons/fc';
import { FaBabyCarriage } from 'react-icons/fa';
import { BsFillPersonFill, BsSearch } from 'react-icons/bs'
import { RiCheckboxMultipleLine } from 'react-icons/ri'
import { MdOutlineCancel } from 'react-icons/md'
import { CiAirportSign1 } from 'react-icons/ci'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { TbGenderDemigirl, TbGenderMale } from 'react-icons/tb'
import { SlLike, SlDislike } from 'react-icons/sl'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios"

// Be able to find partners
// show matching matching partners
//  show dashboard of partners and names you like

function App() {

  const [newNameIndex, setNewNameIndex] = useState({})
  // can be boy or girl
  const [listKey, setListKey] = useState('boy')
  const [navState, setNavState] = useState('Names')
  const [likedData, setLikedData] = useState()
  const [disLikedData, setDisLikedData] = useState()
  const [friendEmail, setFriendEmail] = useState()
  const [nameList, setNameList] = useState(null)
  const [girlList, setGirlList] = useState(null)
  const [boyList, setBoyList] = useState(null)
  const [friends, setFriends] = useState([])

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState({
    "email": '',
    "first_name": '',
    "last_name": '',
    "image_url": ''

  })
  const [friendLikes, setFriendLikes] = useState([])
  const [friendDisLikes, setFriendDisLikes] = useState([])
  console.log(friendLikes)


  const resetUser = () => {
    setFriendLikes([])
    setUserData({
      "email": '',
      "first_name": '',
      "last_name": '',
      "image_url": ''

    })
    setIsLoggedIn(false)
  }
  // axios config
  // const apiurl = "https://44.196.127.59:8080/api";
  // DEV
  const apiurl = 'http://localhost:8080/api'


  const getListIndexs = useCallback(async (email) => {
    let sentEmail = ''

    if (email === null) {
      sentEmail = userData.email
    }
    else sentEmail = email
    await axios
      .get(`${apiurl}/listIndex/get/${sentEmail}`)
      .then(function (response) {
        setNewNameIndex(response.data[0])
      })
  }, [userData.email])


  const updateLikedDislikedData = useCallback(async () => {
    const result = await axios(`${apiurl}/name/action/all/${userData.email}`);
    const rawActions = result.data;
    let updatedLikedNames = [];
    let updatedDislikedNames = [];
    rawActions.forEach(action => {
      const actionInfo = {
        name: action.nameid.name,
        nameid: action.nameid._id,
        gender: action.gender
      };

      if (action.status === 'like') {
        updatedLikedNames.push(actionInfo);
      } else if (action.status === 'dislike') {
        updatedDislikedNames.push(actionInfo);
      }
    });

    // Sort first by gender, then by name
    const sortByGenderAndName = (a, b) => {
      if (a.gender < b.gender) return -1;
      if (a.gender > b.gender) return 1;
      return a.name.localeCompare(b.name);
    };

    updatedLikedNames.sort(sortByGenderAndName);
    updatedDislikedNames.sort(sortByGenderAndName);

    setLikedData(updatedLikedNames);
    setDisLikedData(updatedDislikedNames);
  }, [apiurl, userData.email, setLikedData, setDisLikedData])

  useEffect(() => {

    updateLikedDislikedData();

  }, [updateLikedDislikedData, navState, userData.email])




  //depending on list key, it increases the correct nameindex 


  useEffect(() => {
    const matchUser = async () => {
      if (userData.email !== undefined)
        if (userData.email.length > 0) {
          await axios
            .get(`${apiurl}/user/getOne/${userData.email}`, {
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
        .post(`${apiurl}/user/post/`, {
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          image_url: userData.image_url
        })
        .then(function (response) {
          console.log(response)
          axios.post(`${apiurl}/listIndex/create/${userData.email}`)
        })
        .catch(function (error) {
          console.log(error)
        })
    }

    if (userData.email !== undefined) {
      matchUser()
    }
  }, [userData])


  const getFriends = useCallback(async () => {
    setFriendDisLikes([]);
    setFriendLikes([]);

    try {
      // Get all friends using the new route
      const friendsResponse = await axios.get(`${apiurl}/getFriendsByUser/${userData.email}`);

      const getFriendsNames = async (email) => {
        const actionResponse = await axios.get(`${apiurl}/name/action/all/${email}`);

        const likes = actionResponse.data.filter(action => action.status === 'like').map(action => action.nameid.name);
        const dislikes = actionResponse.data.filter(action => action.status === 'dislike').map(action => action.nameid.name);

        const userResponse = await axios.get(`${apiurl}/user/getOne/${email}`);

        setFriendLikes(prevState => ([...prevState, {
          "email": email,
          "url": userResponse.data[0].image_url,
          "data": likes
        }]));

        setFriendDisLikes(prevState => ([...prevState, {
          "email": email,
          "url": userResponse.data[0].image_url,
          "data": dislikes
        }]));
      };

      // Loop through each friend and get their names
      friendsResponse.data.forEach((friend) => {
        if (friend.status === 'accepted') {
          const email = friend.email === userData.email ? friend.friend_email : friend.email;
          getFriendsNames(email);
        }
      });

      setFriends(friendsResponse.data);
    } catch (error) {
      console.log(error);
    }
  }, [userData.email]);



  const sendFriendRequest = async () => {
    await axios
      .post(`${apiurl}/friend/post`, {
        status: 'sent',
        email: userData.email,
        friend_email: friendEmail
      })
      .then(function (response) {
        getFriends()
        setFriendEmail('')
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const deleteFriend = async (deleteID) => {
    await axios
      .delete(`${apiurl}/friend/delete/${deleteID}`)
      .then(function (response) {

        getFriends()
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  const acceptFriend = async (acceptID) => {
    await axios
      .patch(`${apiurl}/friend/accept/${acceptID}`, {
        status: 'accept',
      })
      .then(function (response) {

        getFriends()
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const getAllNames = useCallback(async () => {
    await axios
      .get(`${apiurl}/name/getall`, {})
      .then(function (response) {
        setNameList(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])


  useEffect(() => {
    if (!nameList) {
      getAllNames();
    } else if (!girlList && !boyList) {
      setGirlList(nameList.filter(val => val.isfemale === true));
      setBoyList(nameList.filter(val => val.ismale === true));
    }
  }, [nameList, boyList, girlList, getAllNames]);


  useEffect(() => {
    if (isLoggedIn === true) {
      getFriends()
    }
  }, [getFriends, isLoggedIn])


  let upperListKey = listKey.toUpperCase()

  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };


  const toggleActionStatus = async (nameid, newStatus) => {
    console.log(nameid)
    try {
      const response = await axios.post(`${apiurl}/name/action/toggle`, {
        nameid: nameid,
        email: userData.email,
        status: newStatus // 'like' or 'dislike'
      });

      updateLikedDislikedData();

      // Assuming you want to refresh the likes/dislikes lists after toggling
      // You can call the function that fetches those lists here
      // For example: fetchData(); if fetchData is the function that gets the likes and dislikes.

      console.log("Toggle Response:", response);
    } catch (error) {
      console.log("Error toggling action:", error);
    }
  }



  const handleNameAction = async (nameId, action, gender) => {
    // action is either 'like' or 'dislike'
    // gender is either 'boy' or 'girl'


    await axios.post(`${apiurl}/name/action/post`, {
      nameid: nameId,
      status: action,
      email: userData.email,
      gender: gender,
    })
      .then((response) => {
        console.log(response);
        if (response.data.gender === 'boy') {
          setNewNameIndex(prevState => ({
            ...prevState,
            boyIndex: prevState.boyIndex + 1
          }));
        } else {
          setNewNameIndex(prevState => ({
            ...prevState,
            girlIndex: prevState.girlIndex + 1
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const YourDragComponent = ({ listKey, newNameIndex, girlList, boyList }) => {
    const [, ref] = useDrag({
      type: 'NAME_CARD', // Matching the accept type in useDrop of LikeZone
    });

    return (listKey === 'girl' ?
      <h3 ref={ref} className='text-5xl cursor-pointer'>{girlList[newNameIndex.girlIndex].name}</h3>
      :
      <h3 ref={ref} className='text-5xl cursor-pointer'>{boyList[newNameIndex.boyIndex].name}</h3>
    );
  };

  const LikeZone = ({ listKey, newNameIndex, girlList, boyList, handleNameAction }) => {
    // Setting up the Drop zone with a monitor to check if draggable item is over the zone
    const [{ isOver }, ref] = useDrop(() => ({
      accept: 'NAME_CARD',
      drop: () => {
        // Logic for handling drop event
        if (listKey === 'girl') {
          handleNameAction(girlList[newNameIndex.girlIndex]._id, 'like', listKey);
        } else {
          handleNameAction(boyList[newNameIndex.boyIndex]._id, 'like', listKey);
        }
      },
      // The collect function allows you to access the monitor instance to check for the isOver state
      collect: (monitor) => ({
        isOver: !!monitor.isOver(), // Using double-bang to ensure a boolean value
      }),
    }), [listKey, newNameIndex, girlList, boyList, handleNameAction]); // dependencies array to re-create the hook if these props change

    // Adding dynamic styling for when the draggable item is over the drop zone
    const backgroundColor = isOver ? 'bg-green-300' : 'bg-green-100';

    return (
      <div
        ref={ref}
        onClick={() => listKey === 'girl'
          ? handleNameAction(girlList[newNameIndex.girlIndex]._id, 'like', listKey)
          : handleNameAction(boyList[newNameIndex.boyIndex]._id, 'like', listKey)}
        className={`w-1/4 h-full transition-all md:1/12 items-center justify-center hover:bg-green-300 text-green-500 rounded-lg flex flex-col cursor-pointer ${backgroundColor}`}
      >
        <SlLike className='text-5xl' />
      </div>
    );
  };


  const DislikeZone = ({ listKey, newNameIndex, girlList, boyList, handleNameAction }) => {
    // Setting up the Drop zone with a monitor to check if draggable item is over the zone
    const [{ isOver }, ref] = useDrop(() => ({
      accept: 'NAME_CARD',
      drop: () => {
        // Logic for handling drop event
        if (listKey === 'girl') {
          handleNameAction(girlList[newNameIndex.girlIndex]._id, 'dislike', listKey);
        } else {
          handleNameAction(boyList[newNameIndex.boyIndex]._id, 'dislike', listKey);
        }
      },
      // The collect function allows you to access the monitor instance to check for the isOver state
      collect: (monitor) => ({
        isOver: !!monitor.isOver(), // Using double-bang to ensure a boolean value
      }),
    }), [listKey, newNameIndex, girlList, boyList, handleNameAction]); // dependencies array to re-create the hook if these props change

    // Adding dynamic styling for when the draggable item is over the drop zone
    const backgroundColor = isOver ? 'bg-red-300' : 'bg-red-100';

    return (
      <div
        ref={ref}
        onClick={() => listKey === 'girl'
          ? handleNameAction(girlList[newNameIndex.girlIndex]._id, 'dislike', listKey)
          : handleNameAction(boyList[newNameIndex.boyIndex]._id, 'dislike', listKey)}
        className={`w-1/4 h-full transition-all md:1/12 items-center justify-center text-red-500 hover:bg-red-300 rounded-lg flex flex-col cursor-pointer ${backgroundColor}`}
      >
        <SlDislike className='text-5xl' />
      </div>
    );
  };
  // Then use YourDragComponent inside DndProvider


  return (
    <div className="flex h-full w-full items-center flex-col">
      <nav className='flex items-center w-full sm:justify-center justify-around'>

        <div onClick={() => setNavState('Names')} className={navState === 'Names' ?
          'flex flex-col sm:flex-row items-center p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-gray-300'
          : 'flex  flex-col sm:flex-row items-center p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-transparent rounded-lg hover:bg-gray-50'}>
          <FaBabyCarriage /> <button className='ml-2'>Names</button> </div>
        <div onClick={() => setNavState('Partner')} className={navState === 'Partner' ?
          'flex flex-col sm:flex-row items-center p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-gray-300'
          : 'flex flex-col sm:flex-row items-center p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-transparent rounded-lg hover:bg-gray-50 '}>
          <BsFillPersonFill /><button className='ml-2'>Partners</button></div>
        <div onClick={() => setNavState('Matches')} className={navState === 'Matches' ?
          'flex flex-col sm:flex-row items-center  p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-gray-300'
          : 'flex flex-col sm:flex-row items-center  p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-transparent rounded-lg hover:bg-gray-50'}>
          <RiCheckboxMultipleLine /><button className='ml-2'>Matches</button>
        </div>
        {userData.email.length > 0 ?
          <div onClick={() => resetUser()} className='flex flex-col sm:flex-row items-center p-2   md:p-4 cursor-pointer  rounded-lg hover:bg-gray-50'>
            <button className='flex flex-col sm:flex-row items-center justify-center'>
              <img src={userData.image_url} referrerPolicy="no-referrer" alt="user's google profile" className='rounded-full mr-2 h-4 w-4 sm:h-6 sm:w-6'></img>
              <span>Sign Out</span></button>  <></>
          </div>
          :
          <>
          </>
        }
      </nav >

      {isLoggedIn === false ?
        <div className="mt-12 h-1/4 w-11/12 md:w-1/2 rounded-lg xl:w-1/2 flex shadow-md  justify-center items-center flex-col flex-wrap">
          <h3 className='mb-4 p-4 text-center'>Please login with your google account to decide on your favorite names!</h3>

          <GoogleLogin auto_select
            onSuccess={credentialResponse => {

              let tempUserData = parseJwt(credentialResponse.credential)
              setUserData({
                "email": tempUserData.email,
                "first_name": tempUserData.given_name,
                "last_name": tempUserData.family_name,
                "image_url": tempUserData.picture
              })
              getListIndexs(tempUserData.email)
              setIsLoggedIn(true)
                ;


            }}
            onError={() => {
              console.log('Login Failed');
            }}
          /></div> :
        navState === 'Names' && newNameIndex.boyIndex >= 0 && isLoggedIn === true ?


          <div className="flex flex-col w-full justify-around items-center">
            <div className='flex w-full justify-center m-auto border-b-2 border-gray-100'>

              <button onClick={() => setListKey('boy')} className={listKey === 'boy' ?
                'p-4 m-4 bg-french-pass-800 rounded-full text-french-pass-50' :
                'p-4 m-4 bg-french-pass-50 rounded-full text-white hover:bg-french-pass-200'}>
                <TbGenderMale /></button>
              <button onClick={() => setListKey('girl')} className={listKey === 'girl' ?
                'p-4 m-4  bg-pastel-pink-300 rounded-full text-white' :
                'p-4 m-4  bg-pastel-pink-100 rounded-full text-white hover:bg-pastel-pink-200'} >
                <TbGenderDemigirl /></button>

            </div>
            <div className='flex md:w-3/4 w-full mt-5 justify-around items-center'>

              <DndProvider backend={HTML5Backend}>
                <DislikeZone

                  listKey={listKey}
                  newNameIndex={newNameIndex}
                  girlList={girlList}
                  boyList={boyList}
                  handleNameAction={handleNameAction} />
                <div className="md:w-1/2 xl:w-1/2 xl:h-64 rounded-lg flex justify-center flex-row flex-wrap">

                  <div className='w-2/3 md:10/12 justify-center items-center flex flex-col'>
                    <h2 className='-mt-4 text-xs'>{upperListKey} NAME</h2>

                    <YourDragComponent
                      listKey={listKey}
                      newNameIndex={newNameIndex}
                      girlList={girlList}
                      boyList={boyList}
                    />
                  </div>

                </div>
                <LikeZone
                  listKey={listKey}
                  newNameIndex={newNameIndex}
                  girlList={girlList}
                  boyList={boyList}
                  handleNameAction={handleNameAction}
                />
              </DndProvider>

            </div>

          </div>
          : navState === 'Partner' && isLoggedIn === true ?
            // partner container
            <div className="mt-12 min-h-1/4 w-11/12  rounded-lg xl:w-1/2 flex shadow-md  justify-center  flex-col">
              <div className='border-b-2 border-gray-100 p-4 w-full' >
                <div className='flex flex-col jusify-center items-center m-auto' >
                  <h4 className='text-xs'>SEND AN INVITE</h4>
                  <div className='flex flex-row md:flex-row w-full sm:w-3/4 items-center'>
                    <BsSearch className='mr-2' />
                    <input value={friendEmail} onChange={e => setFriendEmail(e.target.value)} placeholder='enter an email' className='flex-grow shadow p-4 outline-none rounded-lg' type='email'></input>
                    <button type='submit' onClick={sendFriendRequest} className='ml-2 p-2 pt-4 pb-4 md:p-4 rounded-lg shadow cursor-pointer'>send</button>
                  </div>
                </div>
              </div>
              <div className='w-full' >
                <div className='flex flex-col items-center'>
                  {friends.map((friend) => {
                    return <>                   <h4 className='text-xs'>PARTNERS</h4>
                      <div className='w-11/12 lg:w-3/4 m-2 p-4 shadow rounded-lg flex items-center' key={friend._id}>

                        {friend.status === 'sent' ?
                          <div className='mr-2'><CiAirportSign1 className='text-yellow-500' /></div> :
                          <div className='mr-2'><AiOutlineCheckCircle className='text-green-500' /></div>}
                        {friend.friend_email === userData.email ?
                          <div className='flex-grow'>{friend.email}</div>
                          :
                          <div className='flex-grow'>{friend.friend_email}</div>}
                        {friend.status === 'sent' & friend.friend_email === userData.email ?
                          <div><FcCheckmark onClick={() => acceptFriend(friend._id)} className='text-green-400 mr-2 text-lg hover:text-green-800 cursor-pointer' /></div> : <></>
                        }
                        <div><MdOutlineCancel onClick={() => deleteFriend(friend._id)} className='text-red-400 hover:text-red-800 text-lg cursor-pointer' /></div>
                      </div>
                    </>
                  })}


                </div>
              </div>
            </div>

            : navState === 'Matches' ?
              <div className="flex-col mt-12 min-h-1/4 w-full rounded-lg flex  shadow-md justify-center ">

                <NamesSection
                  title="Liked"
                  data={likedData}
                  friendsData={friendLikes}
                  toggleAction={toggleActionStatus}
                  actionType="dislike"
                  icon={<SlLike className='mr-2 text-green-500' />}
                  userData={userData}
                />

                <NamesSection
                  title="Disliked"
                  data={disLikedData}
                  friendsData={friendDisLikes}
                  toggleAction={toggleActionStatus}
                  actionType="like"
                  icon={<SlDislike className='mr-2 text-red-500' />}
                  userData={userData}
                />

              </div>

              :
              <></>
      }
    </div >

  );
}

export default App;
