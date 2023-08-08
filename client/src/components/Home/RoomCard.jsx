import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import { Grid } from '@mui/material';

const RoomCard = ({ room, handleJoinRoomClick }) => {
  return (
      <Card sx={{ minWidth: 275, backgroundColor: 'ghostwhite', borderRadius: 3 }}>
      <CardContent sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Grid>
            <Typography variant="h5" gutterBottom>
            {room.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }}>
            {room.num_users}/{room.capacity}
            </Typography>
          </Grid>
          <Grid>
            {room.num_users === room.capacity ?
            (<NoMeetingRoomIcon />) : (<MeetingRoomIcon />)}
          </Grid>
      </CardContent>
      <CardActions sx={{display: 'flex', flexDirection:'row-reverse'}}>
          <Button variant="contained" fullWidth disabled={room.num_users === room.capacity} onClick={() => handleJoinRoomClick(room.rid)}>Join</Button>
      </CardActions>
  </Card>
  );
};

export default RoomCard;