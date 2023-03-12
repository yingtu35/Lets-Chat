import axios from "axios";

const getUserRoom = (username) => {
    const request = axios.get(`/api/rooms/${username}`);
    return request.then(response => response.data);
}

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
    const joinRoomInfo = {rid};
    // const fakeroomInfo = {
    //     username: '123',
    //     rid: rid
    // }
    const request = axios.post(`/api/rooms/${username}`, joinRoomInfo);
    return request.then(response => response.data);
}

const leaveRoom = (username) => {
    // const leaveRoomInfo = {rid};
    // const fakeInfo ={
    //     username: "daniel860305",
    //     rid: 3
    // }
    const request = axios.delete(`/api/rooms/${username}`);
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
    getUserRoom,
    createRoom, 
    getAllRooms, 
    joinRoom, 
    leaveRoom, 
    getAllUsersInRoom,
    getAllMessages
};