const Footer = () => {
    const footerContainerStyle = {
        border: "1px solid red",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    }

    return (
        <div style={footerContainerStyle}>
            <h1>I am a Footer</h1>
        </div>
    )
}

export default Footer;