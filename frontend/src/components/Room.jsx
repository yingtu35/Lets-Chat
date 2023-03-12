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
            .leaveRoom(user.username)
            .then(data => {
                console.log(data);
                onLeaveRoomSuccess();
                navigate("/");
            })
            .catch(error => {
                // TODO: should redirect to login page
                console.log(error);
            })
    }

    const sendMessage = () => {
        console.log(message);
        socket.emit("chat", {
            username: user.username,
            message: message,
            rid: rid,
        })
        setMessage('');
    }

    const createMessage = (username, message) => {
        // console.log(Date().toString())
        const newMessage = {
            username: username,
            msg: message,
            createdAt: Date().toString()
        }
        // ! Why is has to use the updater function to correctly update messages
        setMessages(messages => [...messages, newMessage]);
    }

    const handleUserJoin = (username) => {
        if (username === user.username) {
            return;
        }
        setUsers(users => [...users, username]);
    }

    useEffect(() => {
        socket = io();

        socket.on("message", (data => {
            console.log(data.username, data.message);
            createMessage(data.username, data.message);
        }))

        socket.on("join", (data => {
            handleUserJoin(data.username);
            createMessage(data.username, data.message);
        }))

        socket.on("leave", (data => {
            console.log(data.username, data.message);
            setUsers(users => users.filter(user => user !== data.username));
            createMessage(data.username, data.message);
        }))

        return () => socket.disconnect(); 
    }, [])
    
    //TODO: Get messages history and all users in the room
    useEffect(() => {
        RoomServices
        .getAllUsersInRoom()
        .then(returnedUsers => {
            console.log(returnedUsers);
            setUsers(returnedUsers);
        })
        .catch(error => {
            console.log(error);
            // TODO: should redirect to login page
        })
    }, [])

    useEffect(() => {
        RoomServices
        .getAllMessages()
        .then(returnedMessages => {
            console.log(returnedMessages);
            setMessages(returnedMessages);
        })
        .catch(error => {
            // TODO: should redirect to login page
            console.log(error);
        })
    }, [])

    return (
        <>
        <div>
            <h2>{rid} {roomName}</h2>
            {messages.map(message => <p key={message.msg_id}>{message.username}: {message.msg} {message.createdAt}</p>)}
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
            {users.map(user => <p key={user}>{user}</p>)}
        </div>
        </>
    )
}

export default Room;