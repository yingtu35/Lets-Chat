import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Users from './components/Users';
import Rooms from './components/Rooms';
import axios from 'axios'

function App() {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [curUser, setCurUser] = useState({});

  const onLogInSuccess = (returnedUser) => {
    setCurUser(returnedUser);
  }
  
  const onLogOutSuccess = () => {
    setCurUser({});
  }

  const onSignUpSuccess = (returnedUser) => {
    setCurUser(returnedUser);
    setUsers(users.concat(returnedUser));
  }

  const onCreateRoomSuccess = (returnedRoom) => {
    setRooms(rooms.concat(returnedRoom));
  }

  useEffect(() => {
    axios
      .get("/users")
      .then(response => {
        const users = response.data;
        setUsers(users);
      })
      .catch(error => {
        console.log(error);
      })
    return () => {}
  }, [])

  useEffect(() => {
    axios
      .get("/rooms")
      .then(response => {
        const rooms = response.data;
        setRooms(rooms);
      })
    return () => {}
  }, [])
  
  // useEffect(() => {
  //   fetch("/home")
  //   .then(res => res.json())
  //   .then((data) => {
  //     setName(data.name);
  //     setMsg(data.msg);
    
  //     return () => {}
  //   })
  // }, [])

  return (
    <div className="App">
      <h2>Sign In</h2>
      <SignIn onLogInSuccess={onLogInSuccess}/>
      <h2>Sign Up</h2>
      <SignUp onSignUpSuccess={onSignUpSuccess}/>
      <h2>Home</h2>
      <Home username={curUser.username} 
            email={curUser.email}
            onLogOutSuccess={onLogOutSuccess}
            onCreateRoomSuccess={onCreateRoomSuccess} />
      {/* <h2>All Users</h2>
      <Users users={users} /> */}
      <h2>All Rooms</h2>
      <Rooms rooms={rooms} />
      <div>

      </div>
    </div>
  );
}

export default App;
