import { useEffect, useState } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai"
import Validation from "./Validation";
import SignServices from "../services/SignServices";

import { Container, Box } from "@mui/material";

const SignUpForm = ({onSignUpSuccess}) => {
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [cfmPwd, setCfmPwd] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirth] = useState("");

    const [pwdVis, setPwdVis] = useState(false);
    const [cfmPwdVis, setCfmPwdVis] = useState(false);

    const [nameError, setNameError] = useState("");
    const [pwdError, setPwdError] = useState("");
    const [cfmPwdError, setCfmPwdError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [birthdayError, setBirthError] = useState("");

    const signUpFormStyle = {        
        display: "flex",
        flexDirection: "column",
    }

    const inputStyle = {
        width: "100%", 
        boxSizing: "border-box",
        height: "25px",
        margin: "5px 0"
    }

    const signUpButtonStyle = {
        height: "50px",
        backgroundColor: "lightgreen",
        borderRadius: "10px",
        cursor: "pointer",
        marginTop: "5px"
    }

    const handleSignUpClick = async (e) => {
        e.preventDefault();
        // check every input
        const isValidEmail = Validation.validateEmail(email, setEmailError);
        const isValidName = Validation.validateUsername(name, setNameError);
        const isValidPwd = Validation.validatePassword(pwd, setPwdError);
        const isValidCfmPwd = Validation.validateCfmPwd(pwd, cfmPwd, setCfmPwdError);
        const isValidBirthday = Validation.validateBirthday(birthday, setBirthError);

        if (!isValidEmail || !isValidName || !isValidPwd || !isValidCfmPwd || !isValidBirthday) {
            return;
        }
        SignServices
            .SignUp(email, name, pwd, birthday)
            .then(returnedUser => {
                console.log(returnedUser);
                onSignUpSuccess(returnedUser);
            })
            .catch(error => {
                // TODO: Show error to the user
                console.log(error.response.data);
            })
    };

    const handleValueChange = (value, setValue, setValueError) => {
        setValue(value);
        setValueError("");
    }
    return(
        <form style={signUpFormStyle}>
            <div>
                <label htmlFor="new_email">Email</label><br/>
                <input
                    style={inputStyle}
                    type="email" 
                    id="new_email"
                    value={email} 
                    placeholder="xyz@abc.com"
                    onChange={(e) => handleValueChange(e.target.value, setEmail, setEmailError)} /><br/>
                {emailError && (<small>{emailError}</small>)}
            </div>
            <div>
                <label htmlFor="new_username">Username</label><br/>
                <input 
                    style={inputStyle}
                    type="text" 
                    id="new_username" 
                    value={name}
                    placeholder="username"
                    onChange={(e) => handleValueChange(e.target.value, setName, setNameError)}/><br/>
                {nameError && (<small>{nameError}</small>)}
            </div>
            <div>
                <label htmlFor="new_pwd">Password <AiOutlineEyeInvisible style={{cursor: "pointer"}} onClick={() => setPwdVis(!pwdVis)} /></label><br/>
                <input 
                    style={inputStyle}
                    type={pwdVis? "text" : "password"}  
                    id="new_pwd"
                    value={pwd}
                    placeholder="password"
                    onChange={(e) => handleValueChange(e.target.value, setPwd, setPwdError)} 
                />
                <br/>
                {pwdError && (<small>{pwdError}</small>)}
            </div>
            <div>
                <label htmlFor="cfm_pwd">Confirm password <AiOutlineEyeInvisible style={{cursor: "pointer"}} onClick={() => setCfmPwdVis(!cfmPwdVis)} /></label><br/>
                <input 
                    style={inputStyle}
                    type={cfmPwdVis? "text" : "password"} 
                    id="cfm_pwd"
                    value={cfmPwd}
                    placeholder="confirm your password"
                    onChange={(e) => handleValueChange(e.target.value, setCfmPwd, setCfmPwdError)} 
                />
                <br/>
                {cfmPwdError && (<small>{cfmPwdError}</small>)}
            </div>
            <div>
                <label htmlFor="new_birthday">Birthday (Optional)</label><br/>
                <input 
                    style={inputStyle}
                    type="text" 
                    id="new_birthday"
                    value={birthday}
                    placeholder="YYYY-MM-DD"
                    onChange={(e) => handleValueChange(e.target.value, setBirth, setBirthError)} 
                />
                <br/>            
                {birthdayError && (<small>{birthdayError}</small>)}
            </div>
            <button style={signUpButtonStyle} type="submit" onClick={handleSignUpClick}>Sign up</button>
        </form>
    );
};

const SignInForm = ({onLogInSuccess}) => {
    const [username, setName] = useState("");
    const [password, setPwd] = useState("");
    const [nameError, setNameError] = useState("");
    const [pwdError, setPwdError] = useState("");
    const [checkBox, setCheckBox] = useState(false);

    const socialSignInStyle = {
        display: "flex",
        flexDirection: "column"
    }

    const signInButtonStyle = {
        width: "100%",
        height: "50px",
        margin: "0 auto",
        backgroundColor: "lightgreen",
        borderRadius: "10px",
        cursor: "pointer"
    }
    
    const signInFormStyle = {        
        display: "flex",
        flexDirection: "column",
    }

    const signInSettingStyle = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "5px"
    }

    const inputStyle = {
        width: "100%",
        boxSizing: "border-box",
        height: "25px",
        margin: "5px 0",
        borderRadius: "5px"
    }

    const dividerStyle = {
        width: "90%",
        height: "1px",
        backgroundColor: "grey",
        margin: "10px"
    }

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
            })
    };

    const handleValueChange = (value, setValue, setValueError) => {
        setValue(value);
        setValueError("");
    }

    const handleCredentialResponse = (response) => {
        console.log("ID token:", response.credential);
        SignServices
        .SignWithGoogle(response.credential)
        .then(returnedUser => {
            console.log(returnedUser);
            onLogInSuccess(returnedUser);
        })
        .catch(error =>{
            console.log(error.response.data);
        })
    }

    useEffect(() => {
        /*global google*/
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_CLIENT_ID,
            callback: handleCredentialResponse
        })

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large", width: "395px"}
        )

        google.accounts.id.prompt();
      }, [])

    // Load remembered username and password
    useEffect(() => {
        if (localStorage.getItem('checkbox') && localStorage.getItem('username') && localStorage.getItem('password')) {
            setCheckBox(localStorage.getItem('checkbox'));
            setName(localStorage.getItem('username'));
            setPwd(localStorage.getItem('password'));
        }
    }, [])

    return (
        <div>
            <div style={{textAlign: "center"}}>
                <h4>Social Login</h4>
            </div>
            <div style={socialSignInStyle}>
                <div id="signInDiv"></div>
                {/* <button style={signInButtonStyle}>Another Button</button> */}
            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
                <div style={dividerStyle} />
            </div>
            <form style={signInFormStyle}>
                <div style={{textAlign: "center"}}>
                    <h4>Login</h4>
                </div>
                <div>
                    <label htmlFor="signin_username">Username</label><br/>
                    <input
                        style={inputStyle} 
                        type="text" 
                        id="signin_username" 
                        placeholder="username"
                        value={username}
                        onChange={(e) => handleValueChange(e.target.value, setName, setNameError)} /><br/>
                    {nameError && <small>{nameError}</small>}
                </div>
                <div>
                    <label htmlFor="signin_pwd">Password</label><br/>
                    <input 
                        style={inputStyle} 
                        type="password" 
                        id="signin_pwd"
                        placeholder="password"
                        value={password}
                        onChange={(e) => handleValueChange(e.target.value, setPwd, setPwdError)} /><br/>
                    {pwdError && <small>{pwdError}</small>}
                </div>
                <div style={signInSettingStyle}>
                    <label style={{cursor: "pointer"}}>
                        <input type="checkbox" 
                            id="remember-check" 
                            checked={checkBox? true:false}
                            onChange={() => setCheckBox(!checkBox)} />
                        <span>Remember me</span>
                    </label>
                    <label style={{cursor: "pointer"}}>
                        <span>Forgot password?</span>
                    </label>   
                </div>
                <button style={signInButtonStyle} type="submit" onClick={handleSignInClick}>Sign in</button>
                {/* <GoogleSignIn /> */}
            </form>
        </div>
    )
}
const Sign = ({onLogInSuccess, onSignUpSuccess}) => {
    const [sign, setSign] = useState(true);

    const signContainerStyle = {
        margin: "100px auto",
        display: "flex",
        flexDirection: "row"
    }
    const signStyle = {
        backgroundColor: "whitesmoke",
        border: '1px solid grey',
        borderRadius: "20px",
        boxShadow: "2px 2px",
        margin: "0 auto",
        width: "400px",
        padding: "20px"
    }

    const signBarStyle = {
        borderRadius: "5px",
        backgroundColor: "lightgreen",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: "15px"
    }

    const signBarButtonStyle = {
        height: "40px",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        color: "black",
    }


    return(
        <Container style={signContainerStyle}>
            <div style={signStyle}>
                <nav style={signBarStyle}>
                    <button className="signBarButton" style={signBarButtonStyle} onClick={() => setSign(true)}>Sign In</button>
                    <button className="signBarButton" style={signBarButtonStyle} onClick={() => setSign(false)}>Sign Up</button>
                </nav>
                {sign
                ? <SignInForm onLogInSuccess={onLogInSuccess}/>
                : <SignUpForm onSignUpSuccess={onSignUpSuccess}/>}
            </div>
        </Container>
    );
};

export default Sign;