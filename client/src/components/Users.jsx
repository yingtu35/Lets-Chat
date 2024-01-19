import { Avatar, Typography, Grid } from '@mui/material';

const User = ({ user }) => {
  return (
    <Grid sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, backgroundColor: 'ghostwhite', borderRadius: 1, padding: 0.5}}>
      <Avatar sx={{width: 24, height: 24}}>{user.charAt(0).toUpperCase()}</Avatar>
      <Typography variant="body1">{user}</Typography>
    </Grid>
  );
};

const Users = ({users, userQuery=''}) => {
    const usersToShow = users.filter(user => user.toLowerCase().includes(userQuery.toLowerCase()));
    return (
        usersToShow.map(user => <User key={user} user={user} />)
    );
};

export default Users;