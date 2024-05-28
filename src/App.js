import React, { useCallback, useEffect, useState } from 'react';

// components
import NavBar from './components/NavBar/NavBar'; // Adjust the path according to your file structure

// pages
import LoginPage from './components/Pages/Login';
import NamesPage from './components/Pages/NamePage';
import PartnerPage from './components/Pages/PartnerPage';
import MatchesPage from './components/Pages/MatchesPage';

import './App.css';
import axios from "axios";

function App() {
  const [newNameIndex, setNewNameIndex] = useState({});
  const [listKey, setListKey] = useState('boy');
  const [navState, setNavState] = useState('Names');
  const [likedData, setLikedData] = useState([]);
  const [disLikedData, setDisLikedData] = useState([]);
  const [friendEmail, setFriendEmail] = useState('');
  const [nameList, setNameList] = useState(null);
  const [girlList, setGirlList] = useState(null);
  const [boyList, setBoyList] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    image_url: ''
  });
  const [friendLikes, setFriendLikes] = useState([]);
  const [friendDisLikes, setFriendDisLikes] = useState([]);

  const resetUser = () => {
    setFriendLikes([]);
    setUserData({
      email: '',
      first_name: '',
      last_name: '',
      image_url: ''
    });
    setIsLoggedIn(false);
  };

  const apiurl = "https://stork-swipe-backend.netlify.app/.netlify/functions/api/";
  const fetchInterval = 60000; // 1 minute

  const getListIndexs = useCallback(async (email) => {
    let sentEmail = email || userData.email;
    await axios.get(`${apiurl}/listIndex/get/${sentEmail}`)
      .then(response => setNewNameIndex(response.data[0]))
      .catch(error => console.log(error));
  }, [userData.email]);

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
      } else {
        updatedDislikedNames.push(actionInfo);
      }
    });

    updatedLikedNames.sort((a, b) => a.gender.localeCompare(b.gender) || a.name.localeCompare(b.name));
    updatedDislikedNames.sort((a, b) => a.gender.localeCompare(b.gender) || a.name.localeCompare(b.name));

    setLikedData(updatedLikedNames);
    setDisLikedData(updatedDislikedNames);
  }, [apiurl, userData.email]);

  const getFriends = useCallback(async () => {
    setFriendDisLikes([]);
    setFriendLikes([]);

    try {
      const friendsResponse = await axios.get(`${apiurl}/getFriendsByUser/${userData.email}`);

      const getFriendsNames = async (email) => {
        const actionResponse = await axios.get(`${apiurl}/name/action/all/${email}`);
        const likes = actionResponse.data.filter(action => action.status === 'like').map(action => action.nameid.name);
        const dislikes = actionResponse.data.filter(action => action.status === 'dislike').map(action => action.nameid.name);
        const userResponse = await axios.get(`${apiurl}/user/getOne/${email}`);

        setFriendLikes(prevState => ([...prevState, {
          email,
          url: userResponse.data[0].image_url,
          name: userResponse.data[0].first_name + ' ' + userResponse.data[0].last_name,
          data: likes
        }]));

        setFriendDisLikes(prevState => ([...prevState, {
          email,
          url: userResponse.data[0].image_url,
          name: userResponse.data[0].first_name + ' ' + userResponse.data[0].last_name,
          data: dislikes
        }]));
      };

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
    await axios.post(`${apiurl}/friend/post`, {
      status: 'sent',
      email: userData.email,
      friend_email: friendEmail
    }).then(() => {
      getFriends();
      setFriendEmail('');
    }).catch(error => console.log(error));
  };

  const deleteFriend = async (deleteID) => {
    await axios.delete(`${apiurl}/friend/delete/${deleteID}`)
      .then(() => getFriends())
      .catch(error => console.log(error));
  };

  const acceptFriend = async (acceptID) => {
    await axios.patch(`${apiurl}/friend/accept/${acceptID}`, { status: 'accept' })
      .then(() => getFriends())
      .catch(error => console.log(error));
  };

  const getAllNames = useCallback(async () => {
    await axios.get(`${apiurl}/name/getall`)
      .then(response => setNameList(response.data))
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    if (!nameList) {
      getAllNames();
    } else if (!girlList && !boyList) {
      setGirlList(nameList.filter(val => val.isfemale));
      setBoyList(nameList.filter(val => val.ismale));
    }
  }, [nameList, boyList, girlList, getAllNames]);

  useEffect(() => {
    if (isLoggedIn) {
      updateLikedDislikedData();
    }
  }, [updateLikedDislikedData, navState, userData.email, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      getFriends();
      const interval = setInterval(() => {
        getFriends();
      }, fetchInterval);
      return () => clearInterval(interval);
    }
  }, [getFriends, isLoggedIn]);

  const toggleActionStatus = async (nameid, newStatus) => {
    try {
      const response = await axios.post(`${apiurl}/name/action/toggle`, {
        nameid,
        email: userData.email,
        status: newStatus // 'like' or 'dislike'
      });

      updateLikedDislikedData();
      console.log("Toggle Response:", response);
    } catch (error) {
      console.log("Error toggling action:", error);
    }
  };

  const handleNameAction = async (nameId, action, gender) => {
    await axios.post(`${apiurl}/name/action/post`, {
      nameid: nameId,
      status: action,
      email: userData.email,
      gender
    }).then(response => {
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
    }).catch(error => console.log(error));
  };

  useEffect(() => {
    async function fetchListIndexes() {
      if (userData.email) {
        getListIndexs(userData.email);
      }
    }

    const initializeUser = async () => {
      if (userData?.email) {
        try {
          const response = await axios.get(`${apiurl}/user/getOne/${userData.email}`);
          if (response.data.length === 0) {
            console.log('User being created');
            await createUser();
          } else {
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
      await fetchListIndexes();
    };

    initializeUser();
  }, [userData, getListIndexs]);

  useEffect(() => {
    if (userData?.email) {
      setIsLoggedIn(true);
    }
  }, [userData]);

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
          /> : navState === 'Partner' ?
            <PartnerPage
              isLoggedIn={isLoggedIn}
              friendEmail={friendEmail}
              setFriendEmail={setFriendEmail}
              sendFriendRequest={sendFriendRequest}
              friends={friends}
              userData={userData}
              acceptFriend={acceptFriend}
              deleteFriend={deleteFriend}
            /> : navState === 'Matches' ?
              <MatchesPage
                likedData={likedData}
                disLikedData={disLikedData}
                friendLikes={friendLikes}
                friendDisLikes={friendDisLikes}
                toggleActionStatus={toggleActionStatus}
                userData={userData}
              /> : null
        )
      }
    </div>
  );
}

export default App;
