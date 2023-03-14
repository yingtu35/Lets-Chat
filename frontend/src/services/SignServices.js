import axios from "axios";

const SignIn = (username, password) => {
    const logInInfo = {username, password}
    const request = axios.post('/api/session', logInInfo);
    return request.then(response => response.data)
}

const SignUp = (email, username, password, birthday) => {
    const signUpInfo = {email, username, password, birthday}
    const request = axios.post('/api/users', signUpInfo);
    return request.then(response => response.data)
}

const SignWithGoogle = (credential) => {
    const token = {credential}
    const request = axios.post('/api/session/google', token)
    return request.then(response => response.data);
}

const LogOut = () => {
    const request = axios.delete('/api/session');
    return request.then(response => response.data);
}

export default {SignIn, SignUp, SignWithGoogle, LogOut}