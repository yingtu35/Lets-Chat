import { useState } from "react";
import SignServices from "../services/SignServices";

const SignUpForm = ({onSignUpSuccess}) => {
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirth] = useState("");
    const handleSignUpClick = async (e) => {
        e.preventDefault();
        
        SignServices
            .SignUp(email, name, pwd, birthday)
            .then(returnedUser => {
                console.log(returnedUser);
                onSignUpSuccess(returnedUser);
            })
    };
    return(
        <form>
            <label htmlFor="new_email">Email</label><br/>
            <input type="email" 
                   id="new_email"
                   value={email} 
                   placeholder="xyz@abc.com"
                   onChange={(e) => setEmail(e.target.value)} /><br/>
            <label htmlFor="new_username">Username</label><br/>
            <input type="text" 
                   id="new_username" 
                   value={name}
                   placeholder="username"
                   onChange={(e) => setName(e.target.value)} /><br/>
            <label htmlFor="new_pwd">Password</label><br/>
            <input type="password" 
                   id="new_pwd"
                   value={pwd}
                   placeholder="password"
                   onChange={(e) => setPwd(e.target.value)} /><br/>
            <label htmlFor="new_birthday">Birthday (Optional)</label><br/>
            <input type="text" 
                   id="new_birthday"
                   value={birthday}
                   placeholder="1997-03-05"
                   onChange={(e) => setBirth(e.target.value)} /><br/>
            <button type="submit" onClick={handleSignUpClick}>Sign up</button>
        </form>
    );
};

const SignInForm = ({onLogInSuccess}) => {
    const [username, setName] = useState("");
    const [password, setPwd] = useState("");

    const handleSignInClick = async (e) => {
        e.preventDefault();

        SignServices
            .SignIn(username, password)
            .then(returnedUser => {
                console.log(returnedUser);
                onLogInSuccess(returnedUser);
            })
            .catch(error =>{
                console.log(error)
            })
    };

    return (
        <form>
            <label htmlFor="signin_username">Username</label><br/>
            <input type="text" 
                   id="signin_username" 
                   placeholder="username"
                   value={username}
                   onChange={(e) => setName(e.target.value)} /><br/>
            <label htmlFor="signin_pwd">Password</label><br/>
            <input type="password" 
                   id="signin_pwd"
                   placeholder="password"
                   value={password}
                   onChange={(e) => setPwd(e.target.value)} /><br/>
            <input type="checkbox" id="remember-check" />
            <label htmlFor="remember-check">Remember me</label><br/>
            <button type="submit" onClick={handleSignInClick}>Sign in</button>
        </form>
    )
}
const Sign = ({onLogInSuccess, onSignUpSuccess}) => {
    const [sign, setSign] = useState(true);
    
    return(
        <>
        <nav>
            <button onClick={() => setSign(true)}>Sign In</button>
            <button onClick={() => setSign(false)}>Sign Up</button>
        </nav>
        {sign
        ? <SignInForm onLogInSuccess={onLogInSuccess}/>
        : <SignUpForm onSignUpSuccess={onSignUpSuccess}/>}
        </>
    );
};

export default Sign;