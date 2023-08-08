import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { UserContext } from '../../context/UserContext';
import RoomServices from '../../services/RoomServices';
// import SignServices from "../services/SignServices";
import Rooms from './Rooms';
import Users from '../Users';

import {
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Slider,
  Typography,
  Grid,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import UserServices from '../../services/UserServices';

import RefreshIcon from '@mui/icons-material/Refresh';

const CreateRoom = ({ roomName, onRoomNameChange, roomCapacity, onRoomCapacityChange, handleCreateRoomClick }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    handleClose();
    handleCreateRoomClick();
  };
  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        + Create
      </Button>
      <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
        <DialogTitle>Create a new room</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            autoFocus
            label="Name"
            value={roomName}
            onChange={onRoomNameChange}
          />
          <br />
          <TextField margin="dense" fullWidth label="Room password" />
          <br />
          <Slider
            aria-label="Capacity"
            min={2}
            max={16}
            defaultValue={roomCapacity}
            onChange={onRoomCapacityChange}
            valueLabelDisplay="auto"
            valu
            step={1}
          />
          <DialogContentText>Room Capacity</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const RoomFilter = ({ query, setQuery }) => {
  const searchBarStyle = {
    // border: '1px solid red'
  };
  const inputStyle = {
    lineHeight: '2.4em',
    borderRadius: '5px',
  };
  return (
    <form style={searchBarStyle}>
      <input
        style={inputStyle}
        size={50}
        type="search"
        id="roomSearch"
        placeholder="Search the room name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};

const UserFilter = ({ query, setQuery }) => {
  const inputStyle = {
    lineHeight: '2.4em',
    borderRadius: '5px',
  };
  return (
    <form>
      <input
        style={inputStyle}
        size={20}
        id="userSearch"
        placeholder="Search user"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};

const Home = ({ onLogOutSuccess, onEnterRoomSuccess }) => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [roomCapacity, setRoomCapacity] = useState(2);
  const [users, setUsers] = useState([]);
  // const [roomPassword, setRoomPassword] = useState("");
  const [errorMsg, setError] = useState('');
  const [roomQuery, setRoomQuery] = useState('');
  const [debouncedRoomQuery] = useDebounce(roomQuery, 500);
  const [userQuery, setUserQuery] = useState('');
  const [debouncedUserQuery] = useDebounce(userQuery, 500);

  const homeContainerStyle = {
    padding: '5px',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: "space-around",
    gap: '10px',
  };

  const homeRoomsStyle = {
    // border: '1px solid red',
    flexGrow: 2,
  };

  const homeUsersStyle = {
    // border: '1px solid red',
    flexGrow: 1,
  };

  // const userInfoStyle = {
  //     border: '1px solid red'
  // }

  const handleCreateRoomClick = async () => {
    if (!roomName) {
      setError('Please enter a valid room name');
      return;
    }
    RoomServices.createRoom(user.username, roomName, roomCapacity)
      .then((returnedRoom) => {
        // console.log(returnedRoom);
        setRooms(rooms.concat(returnedRoom));
        onEnterRoomSuccess(returnedRoom);
        navigate('/room');
      })
      .catch((error) => {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 404) {
          console.log('404', data);
        } else if (status === 401) {
          alert(data.concat('. Redirect to sign in page'));
          console.log('401', data);
          onLogOutSuccess();
          navigate('/login');
        } else if (status === 400) {
          alert(data.concat('. Please login again'));
          console.log('400', data);
          onLogOutSuccess();
          navigate('/login');
        } else {
          console.log(error.response);
        }
      });
  };
  const handleJoinRoomClick = (rid) => {
    RoomServices.joinRoom(user.username, rid)
      .then((returnedRoom) => {
        console.log(returnedRoom);
        onEnterRoomSuccess(returnedRoom);
        navigate('/room');
      })
      .catch((error) => {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 404) {
          alert(data);
          setRooms((rooms) => rooms.filter((room) => room.rid !== rid));
          console.log('404', data);
        } else if (status === 401) {
          alert(data.concat('. Redirect to sign in page'));
          console.log('401', data);
          onLogOutSuccess();
          navigate('/login');
        } else if (status === 400) {
          alert(data.concat('. Please login again'));
          console.log('400', data);
          onLogOutSuccess();
          navigate('/login');
        } else if (status === 403) {
          alert(data);
          getRooms();
          console.log('403', data);
        } else {
          console.log(error.response);
        }
      });
  };

  // const handleLogOutClick = () => {
  //     SignServices
  //         .LogOut()
  //         .then(data => {
  //             console.log(data);
  //             onLogOutSuccess();
  //         })
  //         .catch(error => console.log(error));
  // }

  const getRooms = async () => {
    try {
      const returnedRooms = await RoomServices.getAllRooms();
      console.log(returnedRooms);
      setRooms(returnedRooms);
    } catch (error) {
      console.log(error);
      const status = error.response.status;
      const data = error.response.data;
      if (status === 401) {
        alert(data.concat('. Redirect to login page'));
        console.log('401', data);
        onLogOutSuccess();
        navigate('/');
      } else {
        console.log(data);
      }
    }
  };

  const getUsers = async () => {
    const returnedUsers = await UserServices.getAllUsers();
    console.log(returnedUsers);
    setUsers(returnedUsers);
  };

  useEffect(() => {
    const getInfo = async () => {
      await Promise.allSettled([getRooms(), getUsers()]);
    };
    getInfo();
    return () => {};
  }, []);

  // TODO: Avoid size shifting when switch to another page
  return (
    <Container maxWidth="lg" sx={homeContainerStyle}>
      <div style={homeRoomsStyle}>
        {errorMsg && <p>{errorMsg}</p>}
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Grid xs={4}>
            <Typography variant="h4">Rooms</Typography>
          </Grid>
          <Grid
            xs={8}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 0.1,
              alignItems: 'center',
            }}
          >
            <RoomFilter query={roomQuery} setQuery={setRoomQuery} />
            <CreateRoom
              roomName={roomName}
              onRoomNameChange={(e) => setRoomName(e.target.value)}
              roomCapacity={roomCapacity}
              onRoomCapacityChange={(e) => setRoomCapacity(e.target.value)}
              handleCreateRoomClick={handleCreateRoomClick}

            />
            <Button
              variant="contained"
              sx={{ backgroundColor: 'lightgreen' }}
              onClick={getRooms}
            >
              <RefreshIcon />
            </Button>
          </Grid>
        </Grid>
        <Rooms
          rooms={rooms}
          handleJoinRoomClick={handleJoinRoomClick}
          roomQuery={debouncedRoomQuery}
        />
      </div>
      <div style={homeUsersStyle}>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Grid xs={4}>
            <Typography variant="h4">Users</Typography>
          </Grid>
          <Grid
            xs={8}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 0.1,
              alignItems: 'center',
            }}
          >
            <UserFilter query={userQuery} setQuery={setUserQuery} />
            <Button
              variant="contained"
              sx={{ backgroundColor: 'lightgreen' }}
              onClick={getUsers}
            >
              <RefreshIcon />
            </Button>
          </Grid>
        </Grid>
        {/* <Typography>Users will be displayed here</Typography> */}
        <Grid sx={{ mx: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Users users={users} userQuery={debouncedUserQuery} />
        </Grid>
      </div>
    </Container>
  );
};

export default Home;
