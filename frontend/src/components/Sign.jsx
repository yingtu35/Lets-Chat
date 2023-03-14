import { useEffect, useState } from "react";
import Validation from "./Validation";
import SignServices from "../services/SignServices";

const SignUpForm = ({onSignUpSuccess, onError}) => {
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirth] = useState("");
    const [nameError, setNameError] = useState("");
    const [pwdError, setPwdError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [birthdayError, setBirthError] = useState("");

    const handleSignUpClick = async (e) => {
        e.preventDefault();
        // check every input
        const isValidEmail = Validation.validateEmail(email, setEmailError);
        const isValidName = Validation.validateUsername(name, setNameError);
        const isValidPwd = Validation.validatePassword(pwd, setPwdError);
        const isValidBirthday = Validation.validateBirthday(birthday, setBirthError);

        if (!isValidEmail || !isValidName || !isValidPwd || !isValidBirthday) {
            return;
        }
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

    const handleValueChange = (value, setValue, setValueError) => {
        setValue(value);
        setValueError("");
    }
    return(
        <form>
            <div>
                <label htmlFor="new_email">Email</label><br/>
                <input type="email" 
                    id="new_email"
                    value={email} 
                    placeholder="xyz@abc.com"
                    onChange={(e) => handleValueChange(e.target.value, setEmail, setEmailError)} /><br/>
                {emailError && (<small>{emailError}</small>)}
            </div>
            <div>
                <label htmlFor="new_username">Username</label><br/>
                <input type="text" 
                    id="new_username" 
                    value={name}
                    placeholder="username"
                    onChange={(e) => handleValueChange(e.target.value, setName, setNameError)}/><br/>
                {nameError && (<small>{nameError}</small>)}
            </div>
            <div>
                <label htmlFor="new_pwd">Password</label><br/>
                <input type="password" 
                    id="new_pwd"
                    value={pwd}
                    placeholder="password"
                    onChange={(e) => handleValueChange(e.target.value, setPwd, setPwdError)} /><br/>
                {pwdError && (<small>{pwdError}</small>)}
            </div>
            <div>
                <label htmlFor="new_birthday">Birthday (Optional)</label><br/>
                <input type="text" 
                    id="new_birthday"
                    value={birthday}
                    placeholder="1997-03-05"
                    onChange={(e) => handleValueChange(e.target.value, setBirth, setBirthError)} /><br/>            
                {birthdayError && (<small>{birthdayError}</small>)}
            </div>
            <button type="submit" onClick={handleSignUpClick}>Sign up</button>
        </form>
    );
};

const SignInForm = ({onLogInSuccess, onError}) => {
    const [username, setName] = useState("");
    const [password, setPwd] = useState("");
    const [nameError, setNameError] = useState("");
    const [pwdError, setPwdError] = useState("");
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
        const isValidName = Validation.validateUsername(username, setNameError);
        const isValidPwd = Validation.validatePassword(password, setPwdError);
        if (!isValidName || !isValidPwd) {
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

    const handleValueChange = (value, setValue, setValueError) => {
        setValue(value);
        setValueError("");
    }

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
            <div>
                <label htmlFor="signin_username">Username</label><br/>
                <input type="text" 
                    id="signin_username" 
                    placeholder="username"
                    value={username}
                    onChange={(e) => handleValueChange(e.target.value, setName, setNameError)} /><br/>
                {nameError && <small>{nameError}</small>}
            </div>
            <div>
                <label htmlFor="signin_pwd">Password</label><br/>
                <input type="password" 
                    id="signin_pwd"
                    placeholder="password"
                    value={password}
                    onChange={(e) => handleValueChange(e.target.value, setPwd, setPwdError)} /><br/>
                {pwdError && <small>{pwdError}</small>}
            </div>
            <div>  
            <input type="checkbox" 
                   id="remember-check" 
                   checked={checkBox? true:false}
                   onChange={() => setCheckBox(!checkBox)} />
            <label htmlFor="remember-check">Remember me</label><br/>
            </div>
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