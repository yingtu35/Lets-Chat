import { Grid } from '@mui/material';
import RoomCard from './RoomCard';

const Rooms = ({rooms, handleJoinRoomClick, roomQuery}) => {
    const roomsStyle = {        
        border: '1px solid red'
    };
    // TODO: Use pagination for displaying a certain number of rooms in each page

    const roomToShow = rooms.filter(room => room.name.toLowerCase().includes(roomQuery.toLowerCase()));
    return(
        <div style={roomsStyle}>
            <Grid
            container
            spacing={2}
            className="blogs"
            sx={{
            my: 1,
            }}
            >
                {roomToShow.map((room) => (
                <Grid key={room.rid} item xs={12} sm={6}>
                    <RoomCard room={room} handleJoinRoomClick={handleJoinRoomClick} />
                </Grid>
            ))}
        </Grid>
        </div>
    );
};

export default Rooms;