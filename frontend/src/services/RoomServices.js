import axios from "axios";

const createRoom = (username, roomName) => {
    const roomInfo = {
        username: username,
        room: roomName
    }
    // const fakeroomInfo = {
    //     username: 'daniel860305',
    //     room: roomName
    // }
    const request = axios.post('/api/rooms', roomInfo);
    return request.then(response => response.data);
}

const joinRoom = (username, rid) => {
    const joinRoomInfo = {username, rid};
    // const fakeroomInfo = {
    //     username: '123',
    //     rid: rid
    // }
    const request = axios.post('/api/room-join', joinRoomInfo);
    return request.then(response => response.data);
}

const leaveRoom = (username, rid) => {
    const leaveRoomInfo = {username, rid};
    // const fakeInfo ={
    //     username: "daniel860305",
    //     rid: 3
    // }
    const request = axios.post('/api/room-leave', leaveRoomInfo);
    return request.then(response => response.data);
}

const getAllRooms = () => {
    const request = axios.get('/api/rooms');
    return request.then(response => response.data);
}

const getAllUsersInRoom = () => {
    const request = axios.get('/api/room/users');
    return request.then(response => response.data);
}

const getAllMessages = () => {
    const request = axios.get('/api/room/messages');
    return request.then(response => response.data);
}

export default {
    createRoom, 
    getAllRooms, 
    joinRoom, 
    leaveRoom, 
    getAllUsersInRoom,
    getAllMessages
};