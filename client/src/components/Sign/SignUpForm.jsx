import { useState } from 'react';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import SignServices from '../../services/SignServices';
import Validation from '../../utils/Validation';

const SignUpForm = ({ onSignUpSuccess }) => {
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [cfmPwd, setCfmPwd] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirth] = useState('');

  const [pwdVis, setPwdVis] = useState(false);
  const [cfmPwdVis, setCfmPwdVis] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [cfmPwdError, setCfmPwdError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [birthdayError, setBirthError] = useState('');

  const signUpFormStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    height: '25px',
    margin: '5px 0',
  };

  const signUpButtonStyle = {
    height: '50px',
    backgroundColor: 'lightgreen',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '5px',
  };

  const handleSignUpClick = async (e) => {
    e.preventDefault();
    // check every input
    const isValidEmail = Validation.validateEmail(email, setEmailError);
    const isValidName = Validation.validateUsername(name, setNameError);
    const isValidPwd = Validation.validatePassword(pwd, setPwdError);
    const isValidCfmPwd = Validation.validateCfmPwd(
      pwd,
      cfmPwd,
      setCfmPwdError
    );
    const isValidBirthday = Validation.validateBirthday(
      birthday,
      setBirthError
    );

    if (
      !isValidEmail ||
      !isValidName ||
      !isValidPwd ||
      !isValidCfmPwd ||
      !isValidBirthday
    ) {
      return;
    }
    SignServices.SignUp(email, name, pwd, birthday)
      .then((returnedUser) => {
        console.log(returnedUser);
        onSignUpSuccess(returnedUser);
      })
      .catch((error) => {
        // console.log(error.response.data);
        const errorMessage = error.response.data;
        setErrorMessage(errorMessage);
      });
  };

  const handleValueChange = (value, setValue, setValueError) => {
    setValue(value);
    setValueError('');
  };
  return (
    <form style={signUpFormStyle}>
      <div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
      <div>
        <label htmlFor="new_email">Email</label>
        <br />
        <input
          style={inputStyle}
          type="email"
          id="new_email"
          value={email}
          placeholder="xyz@abc.com"
          onChange={(e) =>
            handleValueChange(e.target.value, setEmail, setEmailError)
          }
        />
        <br />
        {emailError && <small>{emailError}</small>}
      </div>
      <div>
        <label htmlFor="new_username">Username</label>
        <br />
        <input
          style={inputStyle}
          type="text"
          id="new_username"
          value={name}
          placeholder="username"
          onChange={(e) =>
            handleValueChange(e.target.value, setName, setNameError)
          }
        />
        <br />
        {nameError && <small>{nameError}</small>}
      </div>
      <div>
        <label htmlFor="new_pwd">
          Password{' '}
          <AiOutlineEyeInvisible
            style={{ cursor: 'pointer' }}
            onClick={() => setPwdVis(!pwdVis)}
          />
        </label>
        <br />
        <input
          style={inputStyle}
          type={pwdVis ? 'text' : 'password'}
          id="new_pwd"
          value={pwd}
          placeholder="password"
          onChange={(e) =>
            handleValueChange(e.target.value, setPwd, setPwdError)
          }
        />
        <br />
        {pwdError && <small>{pwdError}</small>}
      </div>
      <div>
        <label htmlFor="cfm_pwd">
          Confirm password{' '}
          <AiOutlineEyeInvisible
            style={{ cursor: 'pointer' }}
            onClick={() => setCfmPwdVis(!cfmPwdVis)}
          />
        </label>
        <br />
        <input
          style={inputStyle}
          type={cfmPwdVis ? 'text' : 'password'}
          id="cfm_pwd"
          value={cfmPwd}
          placeholder="confirm your password"
          onChange={(e) =>
            handleValueChange(e.target.value, setCfmPwd, setCfmPwdError)
          }
        />
        <br />
        {cfmPwdError && <small>{cfmPwdError}</small>}
      </div>
      <div>
        <label htmlFor="new_birthday">Birthday (Optional)</label>
        <br />
        <input
          style={inputStyle}
          type="text"
          id="new_birthday"
          value={birthday}
          placeholder="YYYY-MM-DD"
          onChange={(e) =>
            handleValueChange(e.target.value, setBirth, setBirthError)
          }
        />
        <br />
        {birthdayError && <small>{birthdayError}</small>}
      </div>
      <button
        style={signUpButtonStyle}
        type="submit"
        onClick={handleSignUpClick}
      >
        Sign up
      </button>
    </form>
  );
};

export default SignUpForm;
