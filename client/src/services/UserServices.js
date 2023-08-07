import axios from "axios";

const UserAuth = async () => {
    const response = await axios.get("/api/user/auth");
    return response.data;
}

const getAllUsers = async () => {
    const response = await axios.get("/api/users")
    return response.data
}

export default {UserAuth, getAllUsers};