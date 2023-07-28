import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import RoomServices from "../services/RoomServices";
// import SignServices from "../services/SignServices";
import Rooms from "./Rooms";

// TODO: checkout react hook form
const CreateRoom = ({roomName, onRoomNameChange, handleCreateRoomClick}) => {
    const createRoomFormStyle = {
        border: '1px solid red',
        display: "flex",
        flexDirection: "column",
    }
    return (
        <div>
            <h2>Create a new room</h2>
            <form style={createRoomFormStyle}>
                <span>Room Name: </span>
                <input type="text"
                    placeholder="Enter a new room name" 
                    id="newRoom"
                    value={roomName}
                    onChange={onRoomNameChange} />
                <span>Room Password (Optional): </span>
                <input type="text"
                    placeholder="1 - 16 characters" 
                    id="newRoomPassword"
                />
                <span>Room Capacity: </span>
                <select name="newRoomCapacity" id="newRoomCapacity">
                    {Array(15).fill().map((x, i) => i+2).map(capacity => <option value={capacity} key={capacity}>{capacity}</option>)}
                </select>
                <button type="submit"
                        onClick={handleCreateRoomClick}>
                    Create a Room
                </button>
            </form>
        </div>
    )
}

const Home = ({onLogOutSuccess, onEnterRoomSuccess}) => {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState("");
    // const [roomPassword, setRoomPassword] = useState("");
    const [errorMsg, setError] = useState("");

    const homeContainerStyle = {
        border: "1px solid blue",
        padding: "5px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    }

    const homeRoomsStyle = {
        border: "1px solid red"
    }

    const homeUsersStyle = {
        border: "1px solid red"
    }

    // const userInfoStyle = {
    //     border: '1px solid red'
    // }

    const handleCreateRoomClick = async (e) => {
        e.preventDefault();

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

    useEffect(() => {
        getRooms();
        return () => {}
      }, [])

    return (
        <div style={homeContainerStyle}>
            <div style={homeRoomsStyle}>
                {/* <div style={userInfoStyle}>
                    <h3>This section should move to header in the future</h3>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <button onClick={handleLogOutClick}>Log out</button>
                </div> */}
                {errorMsg && (
                    <p>{errorMsg}</p>
                )}
                <CreateRoom roomName={roomName} 
                                onRoomNameChange={(e) => setRoomName(e.target.value)}
                                handleCreateRoomClick={handleCreateRoomClick} />
                <Rooms rooms={rooms} handleJoinRoomClick={handleJoinRoomClick} />
            </div>
            <div style={homeUsersStyle}>Users are displayed here</div>
        </div>
    )
}

export default Home