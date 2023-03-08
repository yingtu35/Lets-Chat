import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home';
import Sign from './components/Sign';
import Room from './components/Room';
import UserServices from './services/UserServices';

export const UserContext = createContext(null)

function App() {
  const [curUser, setCurUser] = useState(null);
  const [curRoom, setCurRoom] = useState(null);

  const onLogInSuccess = (returnedUser) => {
    setCurUser(returnedUser);
  }
  
  const onLogOutSuccess = () => {
    setCurUser(null);
  }

  const onSignUpSuccess = (returnedUser) => {
    setCurUser(returnedUser);
  }

  const onEnterRoomSuccess = (returnedRoom) => {
    setCurRoom(returnedRoom);
  }

  const onLeaveRoomSuccess = () => {
    setCurRoom(null);
  }

  useEffect(() => {
    if (curUser) {
      UserServices
        .UserInRoom(curUser.username)
        .then(returnedRoom => {
          console.log(returnedRoom);
          setCurRoom(returnedRoom);
        })
        .catch(error => {
          console.log(error);
        })
    }
  }, [curUser])

  return (
    <UserContext.Provider value={curUser}>
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={curRoom 
                                  ? <Navigate to={"/room"} />
                                  : curUser
                                  ? <Home onLogOutSuccess={onLogOutSuccess}
                                          onEnterRoomSuccess={onEnterRoomSuccess} />
                                  : <Sign onLogInSuccess={onLogInSuccess} 
                                            onSignUpSuccess={onSignUpSuccess}/>}/>
          <Route path="/login" element={<Navigate to={"/"} />}/>
          <Route path="/room" element={curRoom
                                  ? <Room room={curRoom}
                                          onLeaveRoomSuccess={onLeaveRoomSuccess} />
                                  : <Navigate to={"/"} />} />
        </Routes>
      </Router>
    </div>
    </UserContext.Provider>
  );
}

export default App;
