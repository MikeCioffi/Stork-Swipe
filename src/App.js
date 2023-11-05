import React, { useCallback, useEffect, useState } from 'react';

// components
import NavBar from './components/NavBar/NavBar'; // Adjust the path according to your file structure

// buttons

// pages
import LoginPage from './components/Pages/Login'
import NamesPage from './components/Pages/NamePage';
import PartnerPage from './components/Pages/PartnerPage';
import MatchesPage from './components/Pages/MatchesPage';

import './App.css';
// icons


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
  const apiurl = "https://stork-swipe-backend.netlify.app/.netlify/functions/api/";
  // DEV
  // const apiurl = 'http://localhost:8080/api'


  const getListIndexs = useCallback(async (email) => {
    let sentEmail = ''

    if (email === null) {
      sentEmail = userData.email
    }
    else sentEmail = email
    await axios
      .get(`${apiurl}/listIndex/get/${sentEmail}`)
      .then(function (response) {
        console.log(response)
        setNewNameIndex(response.data[0])
      })
  }, [userData.email])

  console.log(newNameIndex)

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

    console.log(acceptID)
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

      updateLikedDislikedData();
    }

  }, [updateLikedDislikedData, navState, userData.email, isLoggedIn])




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
  useEffect(() => {
    const initializeUser = async () => {
      // Check if userData is populated and email has a value
      if (userData?.email) {
        try {
          const response = await axios.get(`${apiurl}/user/getOne/${userData.email}`);
          // If user doesn't exist, create new user
          if (response.data.length === 0) {
            await createUser();
          } else {
            // If user exists, maybe you want to do something with the existing user
            console.log('User already exists, getting list indexes...');
            getListIndexs(userData.email);

          }
        } catch (error) {
          console.error('Error in initializing user:', error);
        }
      }
    };

    const createUser = async () => {
      try {
        const response = await axios.post(`${apiurl}/user/post/`, {
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          image_url: userData.image_url
        });
        console.log('User created:', response);
        await axios.post(`${apiurl}/listIndex/create/${userData.email}`);
      } catch (error) {
        console.error('Error in creating user:', error);
      }
    };

    initializeUser();
  }, [userData, apiurl, getListIndexs]); // Only re-run the effect if userData or apiurl changes



  return (
    <div className="flex h-full w-full items-center flex-col">
      {isLoggedIn && <NavBar navState={navState} setNavState={setNavState} userData={userData} resetUser={resetUser} />}
      {isLoggedIn === false ?
        <LoginPage
          setUserData={setUserData}
          getListIndexs={getListIndexs}
          setIsLoggedIn={setIsLoggedIn}
        /> :
        (navState === 'Names' ?
          <NamesPage
            setListKey={setListKey}
            listKey={listKey}
            newNameIndex={newNameIndex}
            girlList={girlList}
            boyList={boyList}
            handleNameAction={handleNameAction}
          />
          : navState === 'Partner' ?
            <PartnerPage
              isLoggedIn={isLoggedIn}
              friendEmail={friendEmail}
              setFriendEmail={setFriendEmail}
              sendFriendRequest={sendFriendRequest}
              friends={friends}
              userData={userData}
              acceptFriend={acceptFriend}
              deleteFriend={deleteFriend}
            />
            : navState === 'Matches' ?
              <MatchesPage
                likedData={likedData}
                disLikedData={disLikedData}
                friendLikes={friendLikes}
                friendDisLikes={friendDisLikes}
                toggleActionStatus={toggleActionStatus}
                userData={userData}
              />
              :
              null
        )
      }
    </div>
  );

}

export default App;
