import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import RoomServices from "../services/RoomServices";
import { io } from "socket.io-client"

let socket;

const Message = ({username, msg, createdAt}) => {
    const messageStyle = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "10px"
    }
    return (
        <div style={messageStyle}>
            <span>{username}: {msg}</span>
            <span>{createdAt}</span>
        </div>
    )
}

const Room = ({room, onLeaveRoomSuccess}) => {
    const roomStyle = {
        border: '1px solid red',
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    }

    const roomLeftStyle = {
        border: "1px solid blue"
    }

    const roomRightStyle = {
        border: "1px solid green"
    }

    const roomTitleStyle = {
        border: '1px solid red',
        textAlign: "center",
    }

    const roomMessagesStyle = {
        border: '1px solid blue',
        height: "500px",
        width: "800px"
    }

    const messageInputFormStyle = {
        border: '1px solid green'
    }

    const roomUsersStyle = {
        border: '1px solid purple'
    }

    const leaveRoomButtonStyle = {
        border: '1px solid orange'
    }

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
                const status = error.response.status;
                const data = error.response.data;
                if (status === 401) {
                    alert(data.concat('. Redirect to login page'));
                    console.log('401', data)
                    onLeaveRoomSuccess();
                    navigate('/')
                }
                else if (status === 404) {
                    alert(data.concat('. Redirect to home page'));
                    console.log('404', data)
                    onLeaveRoomSuccess();
                    navigate('/')
                }
                else if (status === 403) {
                    alert(data.concat('. Redirect to home page'));
                    console.log('403', data)
                    onLeaveRoomSuccess();
                    navigate('/')
                }
                else {
                    console.log(data);
                }
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
            setUsers(returnedUsers.concat(user.username));
        })
        .catch(error => {
            console.log(error);
            // TODO: should redirect to login page
            const status = error.response.status;
            const data = error.response.data;
            if (status === 401) {
                alert(data.concat('. Redirect to login page'));
                console.log('401', data)
                onLeaveRoomSuccess();
                navigate('/')
            }
            else if (status === 404) {
                alert(data.concat('. Redirect to home page'));
                console.log('404', data)
                onLeaveRoomSuccess();
                navigate('/')
            }
            else {
                console.log(data);
            }
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
            const status = error.response.status;
            const data = error.response.data;
            if (status === 401) {
                alert(data.concat('. Redirect to login page'));
                console.log('401', data)
                onLeaveRoomSuccess();
                navigate('/')
            }
            else if (status === 404) {
                alert(data.concat('. Redirect to home page'));
                console.log('404', data)
                onLeaveRoomSuccess();
                navigate('/')
            }
            else {
                console.log(data);
            }
        })
    }, [])

    return (
        <div style={roomStyle}>
            <div style={roomLeftStyle}>
                <div style={roomTitleStyle}>
                    <h2 >{rid} {roomName}</h2>
                </div>
                <div style={roomMessagesStyle}>
                {messages.map(msg => <Message key={msg.msg_id} username={msg.username} msg={msg.msg} createdAt={msg.createdAt} />)}
                </div>
                <div style={messageInputFormStyle}>
                    <div style={{overflow: "hidden"}}>
                        <input
                            style={{width: "100%"}} 
                            type="text" 
                            rows="3"
                            value={message} 
                            placeholder="message"
                            onChange = {(e) => setMessage(e.target.value)} />
                    </div>
                    <button style={{float: "right"}} onClick={sendMessage}>Send</button>
                </div>
            </div>
            <div style={roomRightStyle}>
                <div style={roomUsersStyle}>
                    <h2>Users</h2>
                    {users.map(user => <p key={user}>{user}</p>)}
                </div>
                <div style={leaveRoomButtonStyle}>
                    <button onClick={handleLeaveRoomClick}>Leave Room</button>
                </div>
            </div>
        </div>
    )
}

export default Room;