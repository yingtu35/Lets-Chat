import { Grid, Typography } from '@mui/material';


const Message = ({ username, msg, createdAt }) => {
  const messageStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '10px',
    backgroundColor: 'white',
    padding: 1,
    borderRadius: 3,
  };
  return (
    <Grid sx={messageStyle}>
      <Typography>
        {username}: {msg}
      </Typography>
      <Typography>{createdAt}</Typography>
    </Grid>
  );
};

export default Message;