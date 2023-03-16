const Header = () => {
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
        margin: "0 5px"
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
        backgroundColor: "green",
        width: "50px",
        height: "50px"
    }

    return (
        <div style={headerStyle}>
            <div style={appTitleStyle}>
                <div style={logoImageStyle}></div>
                <h1 >Let's Chat</h1>
            </div>
            <div style={navBarStyle}>
                <button style={navItemStyle}>Dark Mode</button>
                <button style={navItemStyle}>Sign In</button>
                <div style={userInfoStyle}>
                    <div style={userImageStyle}></div>
                    <span>Username</span>
                </div>
            </div>
        </div>
    )
}

export default Header;