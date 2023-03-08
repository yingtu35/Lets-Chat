import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import RoomServices from "../services/RoomServices";

const Room = ({room, onLeaveRoomSuccess}) => {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [rid, setRid] = useState(room.rid);
    const [roomName, setRoomName] = useState(room.name);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

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

    return (
        <>
        <div>
            <h2>{rid} {roomName}</h2>
            {messages.map(message => <p>User: some message</p>)}
            <input />
            <button>Send</button>
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