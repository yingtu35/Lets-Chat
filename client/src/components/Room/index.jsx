import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Message from './Message';
import RoomServices from '../../services/RoomServices';
import { io } from 'socket.io-client';
import { Container, Grid, Typography, Button, TextField } from '@mui/material';
import Users from '../Users';

let socket;



const Room = ({ room, onLeaveRoomSuccess }) => {
  const roomStyle = {
    // border: '1px solid red',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
  };

  // const roomLeftStyle = {
  //     border: "1px solid blue"
  // }

  // const roomRightStyle = {
  //     border: "1px solid green"
  // }

  // const roomTitleStyle = {
  //     border: '1px solid red',
  //     textAlign: "center",
  // }

  // const roomMessagesStyle = {
  //     border: '1px solid blue',
  //     height: "500px",
  //     width: "800px"
  // }

  // const messageInputFormStyle = {
  //     border: '1px solid green',
  // }

  // const roomUsersStyle = {
  //     border: '1px solid purple'
  // }

  // const leaveRoomButtonStyle = {
  //     border: '1px solid orange'
  // }

  const navigate = useNavigate();
  const user = useContext(UserContext);
  // const [rid, setRid] = useState(room.rid);
  // const [roomName, setRoomName] = useState(room.name);
  const [users, setUsers] = useState([]);
  const [numUsers, setNumUsers] = useState(1);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const handleLeaveRoomClick = () => {
    RoomServices.leaveRoom(user.username)
      .then((data) => {
        console.log(data);
        onLeaveRoomSuccess();
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        const status = error.response.status;
        const data = error.response.data;
        if (status === 401) {
          alert(data.concat('. Redirect to login page'));
          console.log('401', data);
          onLeaveRoomSuccess();
          navigate('/');
        } else if (status === 404) {
          alert(data.concat('. Redirect to home page'));
          console.log('404', data);
          onLeaveRoomSuccess();
          navigate('/');
        } else if (status === 403) {
          alert(data.concat('. Redirect to home page'));
          console.log('403', data);
          onLeaveRoomSuccess();
          navigate('/');
        } else {
          console.log(data);
        }
      });
  };

  const sendMessage = () => {
    console.log(message);
    socket.emit('chat', {
      username: user.username,
      message: message,
      rid: room.rid,
    });
    setMessage('');
  };

  const onKeyDown = (e) => {
    // * 13 is "Enter"
    if (e.keyCode === 13) {
      e.preventDefault();
      sendMessage();
    }
  };

  const createMessage = (username, message) => {
    // console.log(Date().toString())
    const newMessage = {
      username: username,
      msg: message,
      createdAt: Date().toString(),
    };
    // ! Why is has to use the updater function to correctly update messages
    setMessages((messages) => [...messages, newMessage]);
  };

  const handleUserJoin = (username) => {
    if (username !== user.username) {
      setUsers((users) => [...users, username]);
      setNumUsers((numUsers) => numUsers + 1);
      return;
    }
    // setUsers(users => [...users, username]);
  };

  const handleUserLeave = (username) => {
    if (username !== user.username) {
      setUsers((users) => users.filter((user) => user !== username));
      setNumUsers((numUsers) => numUsers - 1);
    }
  };

  useEffect(() => {
    socket = io();

    socket.on('message', (data) => {
      console.log(data.username, data.message);
      createMessage(data.username, data.message);
    });

    socket.on('join', (data) => {
      handleUserJoin(data.username);
      createMessage(data.username, data.message);
    });

    socket.on('leave', (data) => {
      // console.log(data.username, data.message);
      handleUserLeave(data.username);
      // setUsers(users => users.filter(user => user !== data.username));
      createMessage(data.username, data.message);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    RoomServices.getAllUsersInRoom()
      .then((returnedUsers) => {
        console.log(returnedUsers);
        // ! race condition between socket connection and getAllUsers function. Sometimes get duplicate username
        setUsers(() => returnedUsers.concat(user.username));
        setNumUsers((numUsers) => numUsers + returnedUsers.length);
      })
      .catch((error) => {
        console.log(error);
        const status = error.response.status;
        const data = error.response.data;
        if (status === 401) {
          alert(data.concat('. Redirect to login page'));
          console.log('401', data);
          onLeaveRoomSuccess();
          navigate('/');
        } else if (status === 404) {
          alert(data.concat('. Redirect to home page'));
          console.log('404', data);
          onLeaveRoomSuccess();
          navigate('/');
        } else {
          console.log(data);
        }
      });
  }, []);

  useEffect(() => {
    RoomServices.getAllMessages()
      .then((returnedMessages) => {
        console.log(returnedMessages);
        setMessages(returnedMessages);
      })
      .catch((error) => {
        console.log(error);
        const status = error.response.status;
        const data = error.response.data;
        if (status === 401) {
          alert(data.concat('. Redirect to login page'));
          console.log('401', data);
          onLeaveRoomSuccess();
          navigate('/');
        } else if (status === 404) {
          alert(data.concat('. Redirect to home page'));
          console.log('404', data);
          onLeaveRoomSuccess();
          navigate('/');
        } else {
          console.log(data);
        }
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={roomStyle}>
      <Grid item sx={{ display: 'flex', flexDirection: 'column', flexGrow: 2 }}>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Grid>
            <Typography variant="h4">{room.name}</Typography>
          </Grid>
          <Grid
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 0.5,
            }}>
            <Typography variant="h5">
              {numUsers}/{room.capacity}
            </Typography>
            <Button variant="contained" onClick={handleLeaveRoomClick}>
              Leave
            </Button>
          </Grid>
        </Grid>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column-reverse',
            border: '1px solid black',
            maxHeight: '70vh',
            overflow: 'auto',
          }}>
          <Grid>
            {messages.map((msg) => (
              <Message
                key={msg.msg_id}
                username={msg.username}
                msg={msg.msg}
                createdAt={msg.createdAt}
              />
            ))}
          </Grid>
        </Grid>
        <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
          <TextField
            sx={{ backgroundColor: 'white' }}
            autoFocus
            multiline
            fullWidth
            maxRows={3}
            value={message}
            placeholder="message"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Grid>
      </Grid>
      <Grid item sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
        <Grid>
          <Typography variant="h4">Users in room</Typography>
        </Grid>
        <Users users={users} />
      </Grid>
    </Container>
  );
};

export default Room;
