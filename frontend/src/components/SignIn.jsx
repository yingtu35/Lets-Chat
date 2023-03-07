import { useState } from "react";
import SignServices from "../services/SignServices";

const SignIn = ({onLogInSuccess}) => {
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");

    const handleSignInClick = async (e) => {
        e.preventDefault();

        SignServices
            .SignIn(name, pwd)
            .then(returnedUser => {
                console.log(returnedUser);
                onLogInSuccess(returnedUser);
            })
            .catch(error =>{
                console.log(error)
            })
    };
    return(
        <>
        <form>
            <label htmlFor="name">Username</label><br/>
            <input type="text" 
                   id="name" 
                   placeholder="name"
                   value={name}
                   onChange={(e) => setName(e.target.value)} /><br/>
            <label htmlFor="pwd">Password</label><br/>
            <input type="password" 
                   id="pwd"
                   placeholder="password"
                   value={pwd}
                   onChange={(e) => setPwd(e.target.value)} /><br/>
            <input type="checkbox" id="remember-check" />
            <label htmlFor="remember-check">Remember me</label><br/>
            <button type="submit" onClick={handleSignInClick}>Sign in</button>
            {/* Should leads to a sign up page */}
            <p>new? Create an new account</p>
        </form>
        </>
    );
};

export default SignIn;