import { useState } from 'react';
import { Container } from '@mui/material';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const Sign = ({onLogInSuccess, onSignUpSuccess}) => {
    const [sign, setSign] = useState(true);

    const signContainerStyle = {
        margin: '100px auto',
        display: 'flex',
        flexDirection: 'row'
    };
    const signStyle = {
        backgroundColor: 'whitesmoke',
        border: '1px solid grey',
        borderRadius: '20px',
        boxShadow: '2px 2px',
        margin: '0 auto',
        width: '400px',
        padding: '20px'
    };

    const signBarStyle = {
        borderRadius: '5px',
        backgroundColor: 'lightgreen',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: '15px'
    };

    const signBarButtonStyle = {
        height: '40px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'black',
    };


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