import axios from "axios";

const createRoom = (username, roomName) => {
    const roomInfo = {
        username: username,
        room: roomName
    }
    const request = axios.post('/room', roomInfo);
    return request.then(response => response.data);
}

export default {createRoom}