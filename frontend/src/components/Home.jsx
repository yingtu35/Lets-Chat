import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import RoomServices from "../services/RoomServices";
import SignServices from "../services/SignServices";
import Rooms from "./Rooms";

const CreateRoomForm = ({roomName, onRoomNameChange, handleCreateRoomClick}) => {
    return (
        <form>
            <label htmlFor="newRoom">Enter a new room name</label><br/>
            <input type="text" 
                   id="newRoom"
                   value={roomName}
                   onChange={onRoomNameChange} /><br/>
            <button type="submit"
                    onClick={handleCreateRoomClick}>
                Create a Room
            </button>
        </form>
    )
}

const Home = ({onLogOutSuccess, onEnterRoomSuccess}) => {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState("");
    const [errorMsg, setError] = useState("");

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

    const handleLogOutClick = () => {
        SignServices
            .LogOut()
            .then(data => {
                console.log(data);
                onLogOutSuccess();
            })
            .catch(error => console.log(error));
    }

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
        <>
        <div>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <button onClick={handleLogOutClick}>Log out</button>
        </div>
        {errorMsg && (
            <p>{errorMsg}</p>
        )}
        <CreateRoomForm roomName={roomName} 
                        onRoomNameChange={(e) => setRoomName(e.target.value)}
                        handleCreateRoomClick={handleCreateRoomClick} />
        <h2>All Rooms</h2>
        <Rooms rooms={rooms} handleJoinRoomClick={handleJoinRoomClick} />
        </>
    )
}

export default Home