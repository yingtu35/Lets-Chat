import { useState } from 'react';
import { Grid, Box, Pagination } from '@mui/material';
import RoomCard from './RoomCard';

const Rooms = ({ rooms, handleJoinRoomClick, roomQuery }) => {
  const roomsStyle = {
    minHeight: '75vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: '1px solid black',
    borderRadius: '10px',
    padding: '5px',
  };

  const [pageIndex, setPageIndex] = useState(0);
  const roomsPerPage = 6;

  const handlePageChange = (event, page) => {
    setPageIndex(page - 1);
  };
  // TODO: Use pagination for displaying a certain number of rooms in each page

  const roomsAfterFilter = rooms.filter((room) =>
    room.name.toLowerCase().includes(roomQuery.toLowerCase())
  );
  const roomsToShow = roomsAfterFilter.slice(
    pageIndex * roomsPerPage,
    (pageIndex + 1) * roomsPerPage
  );

  return (
    <div style={roomsStyle}>
      <Grid
        container
        spacing={2}
        className="rooms"
        sx={{
          my: 1,
        }}
      >
        {roomsToShow.map((room) => (
          <Grid key={room.rid} item xs={12} sm={6}>
            <RoomCard room={room} handleJoinRoomClick={handleJoinRoomClick} />
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid red',
          //   position: 'absolute',
        }}
      >
        <Pagination
          count={Math.max(Math.ceil(roomsAfterFilter.length / roomsPerPage), 1)}
          color="primary"
          defaultPage={1}
          onChange={handlePageChange}
        />
      </Box>
    </div>
  );
};

export default Rooms;
