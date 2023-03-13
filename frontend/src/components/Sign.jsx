import { useEffect, useState } from "react";
import SignServices from "../services/SignServices";

const SignUpForm = ({onSignUpSuccess, onError}) => {
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirth] = useState("");
    const handleSignUpClick = async (e) => {
        e.preventDefault();
        // check every input
        if (!email) {
            onError('Please enter a valid email')
            return;
        }
        if (!name) {
            onError('Please enter a valid username')
            return;
        }
        if (!pwd) {
            onError('Please enter a valid password')
            return;
        }
        // TODO: Should validate email and birthday format
        // if (!birthday) {
        //     onError('Please enter a valid birthday')
        //     return;
        // }

        SignServices
            .SignUp(email, name, pwd, birthday)
            .then(returnedUser => {
                console.log(returnedUser);
                onSignUpSuccess(returnedUser);
            })
            .catch(error => {
                console.log(error.response.data);
                onError(error.response.data);
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

const SignInForm = ({onLogInSuccess, onError}) => {
    const [username, setName] = useState("");
    const [password, setPwd] = useState("");
    const [checkBox, setCheckBox] = useState(false);

    const isrememberMe = () => {
        if (checkBox && username !== "") {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            localStorage.setItem('checkbox', true);
        }
        else {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            localStorage.removeItem('checkbox');
        }
    }
    const handleSignInClick = async (e) => {
        e.preventDefault();
        // Check every input
        if (!username) {
            onError('Please enter your username')
            return;
        }
        if (!password) {
            onError('Please enter your password')
            return;
        }
        isrememberMe();

        SignServices
            .SignIn(username, password)
            .then(returnedUser => {
                console.log(returnedUser);
                onLogInSuccess(returnedUser);
            })
            .catch(error =>{
                console.log(error.response.data);
                onError(error.response.data);
            })
    };

    // Load remembered username and password
    useEffect(() => {
        if (localStorage.getItem('checkbox') && localStorage.getItem('username') && localStorage.getItem('password')) {
            setCheckBox(localStorage.getItem('checkbox'));
            setName(localStorage.getItem('username'));
            setPwd(localStorage.getItem('password'));
        }
    }, [])

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
            <input type="checkbox" 
                   id="remember-check" 
                   checked={checkBox? true:false}
                   onChange={() => setCheckBox(!checkBox)} />
            <label htmlFor="remember-check">Remember me</label><br/>
            <button type="submit" onClick={handleSignInClick}>Sign in</button>
        </form>
    )
}
const Sign = ({onLogInSuccess, onSignUpSuccess}) => {
    const [errorMsg, setError] = useState('');
    const [sign, setSign] = useState(true);

    const onSwitchPage = (isSign) => {
        setSign(isSign);
        setError('');
    }
    
    return(
        <>
        <nav>
            <button onClick={() => onSwitchPage(true)}>Sign In</button>
            <button onClick={() => onSwitchPage(false)}>Sign Up</button>
        </nav>
        {errorMsg && (
            <p>{errorMsg}</p>
        )}
        {sign
        ? <SignInForm onLogInSuccess={onLogInSuccess} onError={setError}/>
        : <SignUpForm onSignUpSuccess={onSignUpSuccess} onError={setError}/>}
        </>
    );
};

export default Sign;