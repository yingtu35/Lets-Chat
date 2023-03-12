import axios from "axios";

const SignIn = (username, password) => {
    const logInInfo = {username, password}
    const request = axios.post('/api/signin', logInInfo);
    return request.then(response => response.data)
}

const SignUp = (email, username, password, birthday) => {
    const signUpInfo = {email, username, password, birthday}
    const request = axios.post('/api/signup', signUpInfo);
    return request.then(response => response.data)
}

const LogOut = () => {
    const request = axios.post('/api/logout');
    return request.then(response => response.data);
}

export default {SignIn, SignUp, LogOut}