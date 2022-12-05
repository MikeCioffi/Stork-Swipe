import React, { useCallback, useEffect, useState } from 'react';
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


// 
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios"



// Be able to find partners
// show matching matching partners
//  show dashboard of partners and names you like

function App() {

  const [nameIndex, setNameIndex] = useState(0)
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

  console.log(friendLikes)


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


  //depending on list key, it increases the correct nameindex 

  const updateIndexOnKey = async () => {
    if (listKey === 'boy') {
      let newIndex = newNameIndex.boyIndex + 1
      console.log('increasing boy index')
      await axios.post(`${apiurl}/listIndex/update/${userData.email}`, {
        boyIndex: newIndex
        ,
        girlIndex: newNameIndex.girlIndex
      })
    }
    else if (listKey === 'girl') {
      let newIndex = newNameIndex.girlIndex + 1
      console.log('increasing girl index')

      await axios.post(`${apiurl}/listIndex/update/${userData.email}`, {
        girlIndex: newIndex
        ,
        boyIndex: newNameIndex.boyIndex
      })
    }
    getListIndexs(null)

  }




  const likeName = async (nameid) => {
    await axios
      .post(`${apiurl}/name/like/post`, {
        nameid: nameid,
        email: userData.email,
      })
      .then(function (response) {
        setNameIndex(nameIndex + 1)
        updateIndexOnKey()

        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const disLikeName = async (nameid) => {
    await axios
      .post(`${apiurl}/name/dislike/post`, {
        nameid: nameid,
        email: userData.email,
      })
      .then(function (response) {
        setNameIndex(nameIndex + 1)
        updateIndexOnKey()

        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }



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
    setFriendDisLikes([])
    setFriendLikes([])

    await axios
      .get(`${apiurl}/friend/getOne/${userData.email}`, {})
      .then(function (response) {
        // need to populate friend liked names
        const getFriendsNames = (async (email) => {
          await axios
            .get(`${apiurl}/name/like/getbyemail/${email}`, {})
            .then(function (response) {
              console.log('here')
              console.log(response)
              axios.get(`${apiurl}/user/getOne/${email}`, {})
                .then(function (userReponse) {
                  console.log('userResponse')
                  console.log(userReponse)
                  setFriendLikes(prevState => ([...prevState,
                  {
                    "email": email, "url": userReponse.data[0].image_url, "data": response.data
                  }]))
                })
            })
          await axios
            .get(`${apiurl}/name/dislike/getbyemail/${email}`, {})
            .then(function (response) {
              axios.get(`${apiurl}/user/getOne/${email}`, {})
                .then(function (userReponse) {
                  setFriendDisLikes(prevState => ([...prevState,
                  {
                    "email": email, "url": userReponse.data[0].image_url, "data": response.data
                  }]))
                })


            })


        })

        response.data.map((res) => {

          if (res.friend_email === userData.email && res.status === 'accepted') {

            return getFriendsNames(res.email)
          }

          else if (res.status === 'accepted') {

            return getFriendsNames(res.friend_email)
          }
          else return null


        })
        setFriends(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [userData.email])
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

  const getLikedNames = useCallback(async () => {
    await axios
      .get(`${apiurl}/name/like/getbyemail/${userData.email}`, {})
      .then(function (response) {
        setLikedData(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [userData.email])

  const getDisLikedNames = useCallback(async () => {
    await axios
      .get(`${apiurl}/name/dislike/getbyemail/${userData.email}`, {})
      .then(function (response) {
        setDisLikedData(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })

  }, [userData.email])
  // console.log(nameList)

  // function filter_names(filters) {
  //   const filtered_names = [];
  //   filters.forEach(filterValue => {
  //     filtered_names.push(...nameList.filter(val => val.areas.includes(filterValue)));
  //   });
  //   console.log(filtered_names);
  // };
  useEffect(() => {
    if (nameList === null) {
      getAllNames()
    }
    else if (nameList !== null & girlList === null & boyList === null) {
      var filters = [true];
      setGirlList(nameList.filter(val => filters.includes(val.isfemale)))
      setBoyList(nameList.filter(val => filters.includes(val.ismale)))
    }
  }
    , [nameList, boyList, getAllNames, girlList])

  useEffect(() => {
    if (isLoggedIn === true) {
      getFriends()
    }
  }, [getFriends, isLoggedIn])

  useEffect(() => {
    if (isLoggedIn === true) {
      getLikedNames()
      getDisLikedNames()
      if (newNameIndex === null) {


        getListIndexs(null)
      }
    }
  }, [getDisLikedNames, getLikedNames, getListIndexs, getFriends, userData.email, isLoggedIn, newNameIndex])

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
      //make api call to like a certain person
      likeName(boyList[newNameIndex.boyIndex]._id)
      updateIndexOnKey()
      getLikedNames()
    }
    if (event === 'liked' && listKey === 'girl') {
      likeName(girlList[newNameIndex.girlIndex]._id)
      updateIndexOnKey()
      getLikedNames()
    }
    if (event === 'disliked' && listKey === 'boy') {
      disLikeName(boyList[newNameIndex.boyIndex]._id)
      updateIndexOnKey()
      getDisLikedNames()
    }
    if (event === 'disliked' && listKey === 'girl') {
      disLikeName(girlList[newNameIndex.girlIndex]._id)
      updateIndexOnKey()
      getDisLikedNames()

    }

    // handle the like
    //  remove the dislike
    // get updated lists




    // update liked or disliked
    // increate name counter



  }
  const handleRevert = async (type, nameid, likeid) => {

    const removeLike = async (deleteID) => {
      await axios
        .delete(`${apiurl}/name/like/delete/${deleteID}`)
        .then(function (response) {
          getLikedNames()
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    }

    const removeDisLike = async (deleteID) => {
      await axios
        .delete(`${apiurl}/name/dislike/delete/${deleteID}`)
        .then(function (response) {
          getDisLikedNames()
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    }

    if (type === 'revertLike') {
      // first remove the like, then add a dislike
      removeLike(likeid)
      await axios
        .post(`${apiurl}/name/dislike/post`, {
          nameid: nameid,
          email: userData.email,
        })
        .then(function (response) {
          getLikedNames()
          getDisLikedNames()
        })
        .catch(function (error) {
          console.log(error)
        })
    }
    if (type === 'revertDislike') {
      // first remove the like, then add a dislike
      removeDisLike(likeid)
      await axios
        .post(`${apiurl}/name/like/post`, {
          nameid: nameid,
          email: userData.email,
        })
        .then(function (response) {
          getLikedNames()
          getDisLikedNames()
        })
        .catch(function (error) {
          console.log(error)
        })
    }
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
        <div onClick={() => resetUser()} className='flex items-center mr-2 p-2  md:mr-4 md:p-4 cursor-pointer border-b-2 border-transparent rounded-lg hover:bg-gray-50'>
          {userData.email.length > 0 ?
            <button className='flex items-center'>
              <img src={userData.image_url} referrerPolicy="no-referrer" alt="user's google profile" className='rounded-full mr-2 h-6 w-6'></img>
              <span>Sign Out</span></button> : <></>
          }
        </div>
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
          <div className="flex flex-col w-full justify-center items-center">
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
            <div className="mt-12 h-48 w-11/12 md:w-1/2 xl:w-1/2 xl:h-64 rounded-lg flex shadow-md  justify-center flex-row flex-wrap">
              <button onClick={() => handleclick('disliked', listKey)} className='w-1/6 md:1/12 items-center justify-center flex flex-col  text-red-500  cursor-pointer hover:bg-red-100 rounded-lg'><SlDislike /></button>
              <div className='w-2/3 md:10/12 justify-center items-center flex flex-col'>
                <h2 className='-mt-4 text-xs'>{upperListKey} NAME</h2>
                {listKey === 'girl' ?
                  // show girl names

                  <h3 className='text-5xl'>{girlList[newNameIndex.girlIndex].name}</h3>

                  // show boy names  
                  : <h3 className='text-5xl'>{boyList[newNameIndex.boyIndex].name}</h3>

                }
                {/* <button onClick={() => handleclick('skip', listKey)} className=''>skip</button> */}

              </div>
              <button onClick={() => handleclick('liked', listKey)} className='w-1/6 md:1/12 items-center justify-center text-green-500   rounded-lg flex flex-col cursor-pointer hover:bg-green-100'><SlLike /></button>

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
              <div className="mt-12 min-h-1/4 w-11/12  rounded-lg xl:w-1/2 flex shadow-md  justify-center  flex-col sm:flex-row">
                <div className='w-full sm:w-1/2 flex justify-start items-center flex-col'> <div className='flex items-center'><SlLike className='mr-2 text-green-500' /> Liked</div>

                  <div className='flex w-full flex-wrap text-center justify-  '>
                    {likedData.map((item) => <div key={item.likeid._id}
                      className={item.data.ismale === true ? 'relative p-4 w-full m-2 rounded-lg shadow-md min-w-fit bg-french-pass-50 ' :
                        'relative p-4  w-full m-2 rounded-lg shadow-md  min-w-fit bg-pastel-pink-50'}
                    > <div className='flex justify-center items-center'>
                        <div className='w-1/2' key={item.data._id}>
                          {item.data.name}
                        </div>
                        <div className='flex flex-wrap justify-center w-1/2'>
                          {friendLikes.length > 0 ?
                            friendLikes.map((friend) => (friend.data.map(like => {
                              if (like.data._id === item.data._id && friend.email !== userData.email) {
                                return <div className='flex justify-center items-center bg-gray-50 opacity-100 text-gray-500 rounded-full h-6 w-6 mr-2 ml-2'>
                                  <img src={friend.url} alt={friend.email} className='rounded-full shadow-md' />
                                </div>
                              } else {
                                return <></>
                              }
                            }))

                            ) : <></>}
                        </div>
                        <button onClick={() => handleRevert('revertLike', item.data._id, item.likeid._id)} className='cursor-pointer hover:text-red-100 rounded-lg'><SlDislike className='text-gray-300 hover:text-red-600' /></button>

                      </div>
                    </div>)}

                  </div>

                </div>
                <div className='w-full sm:w-1/2 flex justify-start items-center flex-col'> <div className='flex items-center'><SlDislike className='mr-2 text-red-500' /> Disliked</div>

                  <div className='flex w-full flex-wrap text-center justify-around'>
                    {disLikedData.map((item) => <div key={item.likeid._id}
                      className={item.data.ismale === true ? 'relative p-4  w-full m-2 rounded-lg shadow-md  min-w-fit bg-french-pass-50 ' :
                        ' relative p-4  w-full m-2 rounded-lg shadow-md  min-w-fit bg-pastel-pink-50 '}
                    > <div className='flex justify-center items-center'>
                        <div className='w-1/2' key={item.data._id}>
                          {item.data.name}
                        </div>
                        <div className='flex flex-wrap justify-around w-1/2'>
                          {friendDisLikes.length > 0 ?
                            friendDisLikes.map((friend) => friend.data.map((like) => {
                              if (like.data._id === item.data._id && friend.email !== userData.email) {
                                return <div className='flex justify-center items-center bg-gray-50 opacity-100 text-gray-500 rounded-full h-6 w-6'>
                                  <img src={friend.url} alt={friend.email} className='rounded-full shadow-md' />
                                </div>
                              } else {
                                return <></>
                              }
                            })

                            ) : <></>}
                        </div>
                        <button onClick={() => handleRevert('revertDislike', item.data._id, item.likeid._id)} className='cursor-pointer hover:text-red-100 rounded-lg'><SlLike className='text-gray-300 hover:text-green-600' /></button>

                      </div>
                    </div>)}
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
