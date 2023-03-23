import { useContext } from "react"
import { UserContext } from "../App";
import SignServices from "../services/SignServices";
import { Button } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa"

const Header = ({onLogOutSuccess}) => {
    const user = useContext(UserContext);

    const headerStyle = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        border: '1px solid red'
    }

    const navBarStyle = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid green",
        margin: "0 10px 0 0 "
    }

    const navItemStyle = {
        margin: "0 5px",
        borderRadius: "10px",
        cursor: "pointer"
    }

    const userInfoStyle = {
        margin: "0 5px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    }

    const appTitleStyle = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid red"
    }

    const logoImageStyle = {
        backgroundColor: "green",
        width: "50px",
        height: "50px"
    }

    const userImageStyle = {
        width: "50px",
        height: "50px",
        cursor: "pointer"
    }

    const handleLogOutClick = () => {
        SignServices
            .LogOut()
            .then(data => {
                console.log(data);
                onLogOutSuccess();
            })
            .catch(error => console.log(error));
    }

    return (
        <div style={headerStyle}>
            <div style={appTitleStyle}>
                <div style={logoImageStyle}></div>
                <h1 >Let's Chat</h1>
            </div>
            <div style={navBarStyle}>
                <Button style={navItemStyle}>Dark Mode</Button>
                {user && <Button style={navItemStyle} onClick={handleLogOutClick}>Log Out</Button>}
                <div style={userInfoStyle}>
                    <FaUserCircle style={userImageStyle} />
                    {user && <span>{user.username}</span>}
                </div>
            </div>
        </div>
    )
}

export default Header;