import { Avatar, Typography, Grid } from "@mui/material";

const User = ({ user }) => {
  return (
    <Grid sx={{display: "flex", flexDirection: "row", alignItems: "center", gap: 1, backgroundColor: "ghostwhite", borderRadius: 1, padding: 0.5}}>
      <Avatar sx={{width: 24, height: 24}}>{user.charAt(0).toUpperCase()}</Avatar>
      <Typography variant="body1">{user}</Typography>
    </Grid>
  )
}

export default User;