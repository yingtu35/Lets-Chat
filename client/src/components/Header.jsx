import { useContext } from "react"
import { UserContext } from "../App";
import SignServices from "../services/SignServices";
import { Container, Box, Button } from "@mui/material"
import { FaUserCircle } from "react-icons/fa"

const Header = ({onLogOutSuccess}) => {
    const user = useContext(UserContext);

    const headerStyle = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // border: '1px solid red'
        // backgroundColor: "ghostwhite"
    }

    const navBarStyle = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid green",
        margin: "0 10px 0 0 "
    }

    // const navItemStyle = {
    //     margin: "0 5px",
    //     borderRadius: "10px",
    //     cursor: "pointer"
    // }

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
        // justifyContent: "flex-",
        alignItems: "center",
        // border: "1px solid red",
        gap: 1
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
        <Container sx={headerStyle}>
            <Box sx={appTitleStyle}>
                <div style={logoImageStyle}></div>
                <h1 >Let's Chat</h1>
            </Box>
            <div style={navBarStyle}>
                <Button variant="contained">Dark Mode</Button>
                {user && <Button variant="contained" onClick={handleLogOutClick}>Log Out</Button>}
                <div style={userInfoStyle}>
                    <FaUserCircle style={userImageStyle} />
                    {user && <span>{user.username}</span>}
                </div>
            </div>
        </Container>
    )
}

export default Header;