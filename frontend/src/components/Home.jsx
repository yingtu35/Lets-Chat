import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import RoomServices from "../services/RoomServices";
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

    const handleCreateRoomClick = async (e) => {
        e.preventDefault();

        if (!user.username || !roomName){
            alert("Invalid username or roomName");
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
                console.log(error.response);
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
                console.log(error);
            })
    };

    const handleLogOutClick = () => {
        onLogOutSuccess();
    }

    useEffect(() => {
        RoomServices
            .getAllRooms()
            .then(returnedRooms => setRooms(returnedRooms))
            .catch(error => console.log(error));
        return () => {}
      }, [])

    return (
        <>
        <div>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <button onClick={handleLogOutClick}>Log out</button>
        </div>
        <CreateRoomForm roomName={roomName} 
                        onRoomNameChange={(e) => setRoomName(e.target.value)}
                        handleCreateRoomClick={handleCreateRoomClick} />
        <h2>All Rooms</h2>
        <Rooms rooms={rooms} handleJoinRoomClick={handleJoinRoomClick} />
        </>
    )
}

export default Home