import { useEffect, useState } from 'react';
import Validation from '../../utils/Validation';
import SignServices from '../../services/SignServices';

const SignInForm = ({onLogInSuccess}) => {
  const [username, setName] = useState('');
  const [password, setPwd] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [checkBox, setCheckBox] = useState(false);

  const socialSignInStyle = {
      display: 'flex',
      flexDirection: 'column'
  };

  const signInButtonStyle = {
      width: '100%',
      height: '50px',
      margin: '0 auto',
      backgroundColor: 'lightgreen',
      borderRadius: '10px',
      cursor: 'pointer'
  };
  
  const signInFormStyle = {        
      display: 'flex',
      flexDirection: 'column',
  };

  const signInSettingStyle = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: '5px'
  };

  const inputStyle = {
      width: '100%',
      boxSizing: 'border-box',
      height: '25px',
      margin: '5px 0',
      borderRadius: '5px'
  };

  const dividerStyle = {
      width: '90%',
      height: '1px',
      backgroundColor: 'grey',
      margin: '10px'
  };

  const isrememberMe = () => {
      if (checkBox && username !== '') {
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
          localStorage.setItem('checkbox', true);
      }
      else {
          localStorage.removeItem('username');
          localStorage.removeItem('password');
          localStorage.removeItem('checkbox');
      }
  };
  const handleSignInClick = async (e) => {
      e.preventDefault();
      // Check every input
      const validName = Validation.isRequired(username);
      const validPwd = Validation.isRequired(password);
      if (!validName) {
        setNameError('Username is required');
      }
      if (!validPwd) {
        setPwdError('Password is required');
      }
      if (!validName || !validPwd) {
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
            //   console.log(error.response.data);
            const errorMessage = error.response.data;
            setErrorMessage(errorMessage);
          });
  };

  const handleValueChange = (value, setValue, setValueError) => {
      setValue(value);
      setValueError('');
      setErrorMessage('');
  };

  const handleCredentialResponse = (response) => {
      console.log('ID token:', response.credential);
      SignServices
      .SignWithGoogle(response.credential)
      .then(returnedUser => {
          console.log(returnedUser);
          onLogInSuccess(returnedUser);
      })
      .catch(error =>{
          console.log(error.response.data);
      });
  };

  useEffect(() => {
      /*global google*/
      google.accounts.id.initialize({
          // eslint-disable-next-line no-undef
          client_id: process.env.REACT_APP_CLIENT_ID,
          callback: handleCredentialResponse
      });

      google.accounts.id.renderButton(
          document.getElementById('signInDiv'),
          { theme: 'outline', size: 'large', width: '395px'}
      );

      google.accounts.id.prompt();
    }, []);

  // Load remembered username and password
  useEffect(() => {
      if (localStorage.getItem('checkbox') && localStorage.getItem('username') && localStorage.getItem('password')) {
          setCheckBox(localStorage.getItem('checkbox'));
          setName(localStorage.getItem('username'));
          setPwd(localStorage.getItem('password'));
      }
  }, []);

  return (
      <div>
          <div style={{textAlign: 'center'}}>
              <h4>Social Login</h4>
          </div>
          <div style={socialSignInStyle}>
              <div id="signInDiv"></div>
              {/* <button style={signInButtonStyle}>Another Button</button> */}
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
              <div style={dividerStyle} />
          </div>
          <form style={signInFormStyle}>
              <div style={{textAlign: 'center'}}>
                  <h4>Login</h4>
              </div>
              <div>
                {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
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
                  <label style={{cursor: 'pointer'}}>
                      <input type="checkbox" 
                          id="remember-check" 
                          checked={checkBox? true:false}
                          onChange={() => setCheckBox(!checkBox)} />
                      <span>Remember me</span>
                  </label>
                  <label style={{cursor: 'pointer'}}>
                      <span>Forgot password?</span>
                  </label>   
              </div>
              <button style={signInButtonStyle} type="submit" onClick={handleSignInClick}>Sign in</button>
          </form>
      </div>
  );
};

export default SignInForm;