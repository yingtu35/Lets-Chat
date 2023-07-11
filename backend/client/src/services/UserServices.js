import axios from "axios";

const UserAuth = () => {
    const request = axios.get("/api/user/auth");
    return request.then(response => response.data);
}

export default {UserAuth};