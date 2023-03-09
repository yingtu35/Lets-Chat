import axios from "axios";

const UserInRoom = () => {
    const request = axios.post("/user-in-room");
    return request.then(response => response.data);
}

const UserAuth = () => {
    const request = axios.get("/user/auth");
    return request.then(response => response.data);
}

export default {UserInRoom, UserAuth};