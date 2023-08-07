import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const RoomCard = ({ room, handleJoinRoomClick }) => {
    return (
        <Card sx={{ minWidth: 275, backgroundColor: "ghostwhite" }}>
        <CardContent>
            <Typography variant="h5" gutterBottom>
            {room.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }}>
            {room.num_users}/{room.capacity}
            </Typography>
            {/* <Typography variant="body2">{blog.url}</Typography> */}
        </CardContent>
        <CardActions sx={{display: "flex", flexDirection:"row-reverse"}}>
            <Button variant="contained" size="small" onClick={() => handleJoinRoomClick(room.rid)}>Join</Button>
        </CardActions>
    </Card>
    )
}

const Rooms = ({rooms, handleJoinRoomClick, roomQuery}) => {
    const roomsStyle = {        
        border: '1px solid red'
    }
    // TODO: Use pagination for displaying a certain number of rooms in each page

    const roomToShow = rooms.filter(room => room.name.toLowerCase().includes(roomQuery.toLowerCase()))
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

export default Rooms