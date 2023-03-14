const isRequired = value => value === '' ? false : true;

const isBetween = (length, min, max) => length < min || length > max ? false : true;

const isPasswordSecure = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^\\-&_\\*])(?=.{8,})");
    return re.test(password);
};

const validateEmail = (email, setEmailError) => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailformat)) {
        setEmailError("Email is not valid")
    } 
    return true;
}

const validateUsername = (username, setNameError) => {
    const min = 4;
    const max = 25;
    const special_ch = /(?=.+[!@#\$%\^\-&_\*])/;
    if (!isRequired(username)) {
        setNameError("Username is required")
        return;
    }
    if (!isBetween(username.length, min, max)) {
        setNameError(`Username must be between ${min} and ${max} characters`)
        return;
    }
    if (username.match(special_ch)) {
        setNameError("Username cannot have any special characters")
        return;
    }
    return true;

}

const validatePassword = (password, setPwdError) => {
    if (!isRequired(password)) {
        setPwdError("Password is required")
        return;
    }
    if (!isPasswordSecure(password)) {
        setPwdError("Password must be at least 8 characters long, with 1 lowercase character, 1 uppercase character, 1 number and 1 special character")
        return;
    }
    return true;
}

const validateBirthday = (birthday, setBirthError) => {
    const birthformat = /^\d{4}-\d{2}-\d{2}$/;
    if (birthday !== "" && !birthday.match(birthformat)) {
        setBirthError("Birthday should follow YYYY-MM-DD format")
        return;
    }
    return true;
}

export default {
    validateEmail,
    validateUsername,
    validatePassword,
    validateBirthday
}