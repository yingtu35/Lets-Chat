import axios from "axios";

const createRoom = (username, roomName) => {
    const roomInfo = {
        username: username,
        room: roomName
    }
    const request = axios.post('/room', roomInfo);
    return request.then(response => response.data);
}

const joinRoom = (username, rid) => {
    const joinRoomInfo = {username, rid};
    const request = axios.post('/room-join', joinRoomInfo);
    return request.then(response => response.data);
}

const leaveRoom = (username, rid) => {
    const leaveRoomInfo = {username, rid};
    // const fakeInfo ={
    //     username: "daniel860305",
    //     rid: 3
    // }
    const request = axios.post('/room-leave', leaveRoomInfo);
    return request.then(response => response.data);
}

const getAllRooms = () => {
    const request = axios.get('/rooms');
    return request.then(response => response.data);
}

const getAllUsersInRoom = () => {
    const request = axios.get("/room/users");
    return request.then(response => response.data);
}

export default {createRoom, getAllRooms, joinRoom, leaveRoom, getAllUsersInRoom}