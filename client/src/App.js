import React, { useState, useEffect, createContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import ResponsiveAppBar from './components/NavBar';
import Copyright from './components/Copyright';
import Footer from './components/Footer';
import Home from './components/Home';
import Sign from './components/Sign';
import Room from './components/Room';
import RoomServices from './services/RoomServices';
import UserServices from './services/UserServices';

export const UserContext = createContext(null);

function App() {
  const [curUser, setCurUser] = useState(null);
  const [curRoom, setCurRoom] = useState(null);

  const onLogInSuccess = (returnedUser) => {
    setCurUser(returnedUser);
  };

  const onLogOutSuccess = () => {
    setCurUser(null);
  };

  const onSignUpSuccess = (returnedUser) => {
    setCurUser(returnedUser);
  };

  const onEnterRoomSuccess = (returnedRoom) => {
    setCurRoom(returnedRoom);
  };

  const onLeaveRoomSuccess = () => {
    setCurRoom(null);
  };

  useEffect(() => {
    UserServices.UserAuth()
      .then((user) => {
        console.log(user);
        setCurUser(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (curUser) {
      RoomServices.getUserRoom(curUser.username)
        .then((room) => {
          console.log(room);
          setCurRoom(room);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [curUser]);

  return (
    <UserContext.Provider value={curUser}>
      <div className="App">
        <Router>
          <ResponsiveAppBar user={curUser} onLogOutSuccess={onLogOutSuccess} />
          <Routes>
            <Route
              path="/"
              element={
                curRoom ? (
                  <Navigate to={'/room'} />
                ) : curUser ? (
                  <Home
                    onLogOutSuccess={onLogOutSuccess}
                    onEnterRoomSuccess={onEnterRoomSuccess}
                  />
                ) : (
                  <Sign
                    onLogInSuccess={onLogInSuccess}
                    onSignUpSuccess={onSignUpSuccess}
                  />
                )
              }
            />
            <Route path="/login" element={<Navigate to={'/'} />} />
            <Route
              path="/room"
              element={
                curRoom ? (
                  <Room
                    room={curRoom}
                    onLeaveRoomSuccess={onLeaveRoomSuccess}
                  />
                ) : (
                  <Navigate to={'/'} />
                )
              }
            />
            <Route path='/*' element={<Navigate to={"/"} />} />
          </Routes>
        </Router>
        <Copyright />
      </div>
    </UserContext.Provider>
  );
}

export default App;
