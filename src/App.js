import React, { useCallback, useEffect, useState } from 'react';

// components
import NamesSection from './components/NameSection/NameSection';
import NavBar from './components/NavBar/NavBar'; // Adjust the path according to your file structure

// buttons

// pages
import LoginPage from './components/Pages/Login'
import NamesPage from './components/Pages/NamePage';

import './App.css';
// icons
import { FcCheckmark } from 'react-icons/fc';
import { BsSearch } from 'react-icons/bs'
import { MdOutlineCancel } from 'react-icons/md'
import { CiAirportSign1 } from 'react-icons/ci'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { SlLike, SlDislike } from 'react-icons/sl'

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
          "name": userResponse.data[0].first_name + ' ' + userResponse.data[0].last_name,
          "data": likes
        }]));

        setFriendDisLikes(prevState => ([...prevState, {
          "email": email,
          "url": userResponse.data[0].image_url,
          "name": userResponse.data[0].first_name + ' ' + userResponse.data[0].last_name,

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


  return (
    <div className="flex h-full w-full items-center flex-col">
      <NavBar navState={navState} setNavState={setNavState} userData={userData} resetUser={resetUser} />

      {isLoggedIn === false ?
        <LoginPage
          setUserData={setUserData}
          getListIndexs={getListIndexs}
          setIsLoggedIn={setIsLoggedIn}
        /> :


        navState === 'Names' && newNameIndex.boyIndex >= 0 && isLoggedIn === true ?
          <NamesPage
            setListKey={setListKey}
            listKey={listKey}
            newNameIndex={newNameIndex}
            girlList={girlList}
            boyList={boyList}
            handleNameAction={handleNameAction} />



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
              <div className="m-2 w-5/6 rounded-xl border-4 border-gray-400  bg-gray-50 flex-col min-h-1/4 flex   justify-center ">

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
