import axios from "axios";

const UserInRoom = (username) => {
    const userInfo = {username};
    const request = axios.post("/user-in-room", userInfo);
    return request.then(response => response.data);
}

export default {UserInRoom};