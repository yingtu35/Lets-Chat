import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { useDebounce } from 'use-debounce';
import { UserContext } from "../App";
import RoomServices from "../services/RoomServices";
// import SignServices from "../services/SignServices";
import Rooms from "./Rooms";

import { Container, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Slider, Box, Typography, Grid } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import UserServices from "../services/UserServices";

// TODO: checkout react hook form
const CreateRoom = ({roomName, onRoomNameChange, handleCreateRoomClick}) => {
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
        handleCreateRoomClick()
      }
    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>+ Create</Button>
            <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
                <DialogTitle>Create a new room</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" fullWidth autoFocus label="Name" value={roomName} onChange={onRoomNameChange} /><br/>
                    <TextField margin="dense" fullWidth label="Room password" /><br/>
                    <Slider aria-label="Capacity" min={2} max={16} defaultValue={2} valueLabelDisplay="auto" valu step={1} />
                    <DialogContentText>Room Capacity</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate}>Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const RoomFilter = ({query, setQuery}) => {
    const searchBarStyle = {
        // border: '1px solid red' 
    }
    const inputStyle = {
        lineHeight: "2.4em",
        borderRadius: "5px",
    }
    return(
    <form style={searchBarStyle}>
        <input style={inputStyle}
                size={50}
                type="search"
               id="roomSearch"
               placeholder="Search the room name"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
        />
    </form>
    )
}

const UserFilter = ({query, setQuery}) => {
    const inputStyle = {
        lineHeight: "2.4em",
        borderRadius: "5px",
    }
    return(
    <form>
        <input style={inputStyle}
                size={20}
               id="userSearch"
               placeholder="Search user"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
        />
    </form>
    )
}

const Home = ({onLogOutSuccess, onEnterRoomSuccess}) => {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState("");
    // const [roomPassword, setRoomPassword] = useState("");
    const [errorMsg, setError] = useState("");
    const [roomQuery, setRoomQuery] = useState("");
    const [debouncedRoomQuery] = useDebounce(roomQuery, 500)
    const [userQuery, setUserQuery] = useState("");
    const [debouncedUserQuery] = useDebounce(userQuery, 500)

    const homeContainerStyle = {
        padding: "5px",
        display: "flex",
        flexDirection: "row",
        // justifyContent: "space-around",
        gap: "10px"
    }

    const homeRoomsStyle = {
        border: "1px solid red",
        flexGrow: 2
    }

    const homeUsersStyle = {
        border: "1px solid red",
        flexGrow: 1
    }

    // const userInfoStyle = {
    //     border: '1px solid red'
    // }

    const handleCreateRoomClick = async () => {
        if (!roomName){
            setError("Please enter a valid room name");
            return;
        }
        RoomServices
            .createRoom(user.username, roomName)
            .then(returnedRoom => {
                console.log(returnedRoom);
                setRooms(rooms.concat(returnedRoom));
                onEnterRoomSuccess(returnedRoom);
                navigate("/room");
            })
            .catch(error => {
                const status = error.response.status;
                const data = error.response.data;
                if (status === 404) {
                    console.log('404', data)
                }
                else if (status === 401) {
                    alert(data.concat('. Redirect to sign in page'));
                    console.log('401', data)
                    onLogOutSuccess();
                    navigate('/login')
                }
                else if (status === 400) {
                    alert(data.concat(". Please login again"));
                    console.log('400', data);
                    onLogOutSuccess();
                    navigate('/login')
                }
                else {
                    console.log(error.response);
                }
            })
    };
    const handleJoinRoomClick = (rid) => {
        RoomServices
            .joinRoom(user.username, rid)
            .then(returnedRoom => {
                console.log(returnedRoom);
                onEnterRoomSuccess(returnedRoom);
                navigate("/room");
            })
            .catch(error => {
                const status = error.response.status;
                const data = error.response.data;
                if (status === 404) {
                    alert(data);
                    setRooms(rooms => rooms.filter(room => room.rid !== rid));
                    console.log('404', data)
                }
                else if (status === 401) {
                    alert(data.concat('. Redirect to sign in page'));
                    console.log('401', data)
                    onLogOutSuccess();
                    navigate('/login')
                }
                else if (status === 400) {
                    alert(data.concat(". Please login again"));
                    console.log('400', data)
                    onLogOutSuccess();
                    navigate('/login')
                }
                else if (status === 403) {
                    alert(data);
                    getRooms();
                    console.log('403', data)
                }
                else {
                    console.log(error.response);
                }
            })
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

    const getRooms = () => {
        RoomServices
        .getAllRooms()
        .then(returnedRooms => {
            setRooms(returnedRooms);
        })
        .catch(error => {
            console.log(error);
            const status = error.response.status;
            const data = error.response.data;
            if (status === 401) {
                alert(data.concat('. Redirect to login page'));
                console.log('401', data)
                onLogOutSuccess();
                navigate('/')
            }
            else{
                console.log(data);
            }
        });
    }

    // TODO: Testing needed
    const getActiveUsers = async () => {
        const users = await UserServices.getAllActiveUsers()
        console.log(users)
    }

    useEffect(() => {
        getRooms();
        return () => {}
      }, [])
    // TODO: Wrap CreateRoom into a modal, triggered by a button, and use react hook form for the input form
    // TODO: Create Users component for displaying all users, UserCard component for displaying user information, paginated needed
    return (
        <Container maxWidth="lg" sx={homeContainerStyle}>
            <div style={homeRoomsStyle}>
                {errorMsg && (
                    <p>{errorMsg}</p>
                )}
                <Grid sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Grid xs={4}>
                        <Typography variant="h4">Rooms</Typography>
                    </Grid>
                    <Grid xs={8} sx={{display: "flex", flexDirection: "row", gap: 0.1}}>
                        <RoomFilter query={roomQuery} setQuery={setRoomQuery} />
                        <CreateRoom roomName={roomName} 
                                        onRoomNameChange={(e) => setRoomName(e.target.value)}
                                        handleCreateRoomClick={handleCreateRoomClick} />                    
                    </Grid>
                </Grid>
                <Rooms rooms={rooms} handleJoinRoomClick={handleJoinRoomClick} roomQuery={debouncedRoomQuery} />
            </div>
            <div style={homeUsersStyle}>
                <Grid sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Grid xs={4}>
                        <Typography variant="h4">Users</Typography>
                    </Grid>
                    <Grid xs={8}>                
                        <UserFilter query={userQuery} setQuery={setUserQuery} />
                    </Grid>
                </Grid>
                <Typography>Users will be displayed here</Typography>
            </div>
        </Container>
    )
}

export default Home