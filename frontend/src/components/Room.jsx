import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import RoomServices from "../services/RoomServices";
import { io } from "socket.io-client"

let socket;

const Room = ({room, onLeaveRoomSuccess}) => {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [rid, setRid] = useState(room.rid);
    const [roomName, setRoomName] = useState(room.name);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const handleLeaveRoomClick = () => {
        RoomServices
            .leaveRoom(user.username, rid)
            .then(data => {
                console.log(data);
                onLeaveRoomSuccess();
                navigate("/");
            })
            .catch(error => {
                console.log(error);
            })
    }

    const sendMessage = () => {
        console.log(message);
        setMessage('');
    }

    useEffect(() => {
        console.log(window.location.hostname);
        socket = io();

        socket.on("message", (data => {
            console.log(data.username, data.message);
        }))

        return () => socket.disconnect(); 
    }, [])
    


    return (
        <>
        <div>
            <h2>{rid} {roomName}</h2>
            {messages.map(message => <p>User: some message</p>)}
            <div>
            <input type="text" 
                   rows="3"
                   value={message} 
                   placeholder="message"
                   onChange = {(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
            </div>
        </div>
        <button onClick={handleLeaveRoomClick}>Leave Room</button>
        <div>
            <h2>Users in this room</h2>
            {users.map(user => <p>Username</p>)}
        </div>
        </>
    )
}

export default Room;