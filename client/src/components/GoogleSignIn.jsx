const GoogleSignIn = () => {
    return (
        <>
            <div id="g_id_onload"
                data-client_id="366291414162-q836fuv3tfc66s6ccqngh4imp0h6n6tm.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-callback="handleCredentialResponse"
                data-nonce=""
                data-itp_support="true">
            </div>

            <div className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="signin_with"
                data-size="large"
                data-locale="en-US"
                data-logo_alignment="left">
            </div>
        </>
    )
}

export default GoogleSignIn;