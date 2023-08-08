import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const RoomCard = ({ room, handleJoinRoomClick }) => {
  return (
      <Card sx={{ minWidth: 275, backgroundColor: 'ghostwhite' }}>
      <CardContent>
          <Typography variant="h5" gutterBottom>
          {room.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }}>
          {room.num_users}/{room.capacity}
          </Typography>
          {/* <Typography variant="body2">{blog.url}</Typography> */}
      </CardContent>
      <CardActions sx={{display: 'flex', flexDirection:'row-reverse'}}>
          <Button variant="contained" size="small" onClick={() => handleJoinRoomClick(room.rid)}>Join</Button>
      </CardActions>
  </Card>
  );
};

export default RoomCard;