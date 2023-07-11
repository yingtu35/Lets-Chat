import { useState } from "react"

const RoomFilter = ({query, setQuery}) => {
    const searchBarStyle = {
        border: '1px solid red'
    }
    const inputStyle = {
        width: "100%"
    }
    return(
    <form style={searchBarStyle}>
        <input style={inputStyle}
               id="roomSearch"
               placeholder="Search the room name"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
        />
    </form>
    )
}

const RoomDisplay = ({room, handleJoinRoomClick}) => {
    const roomInfoStyle = {
        border: '1px solid green',
        breakInside: "avoid",
        width: "500px"
    }
    return(
        <div>
            <div style={roomInfoStyle}>
                <p>rid: {room.rid}</p>
                <p>Room: {room.name}</p>
                <p>Current Users: {room.num_users}/{room.capacity}</p>
                <p>Host Id:{room.host_uid}</p>
                <button onClick={() => handleJoinRoomClick(room.rid)}>Join room</button>
            </div>
        </div>
    )    
}

const Rooms = ({rooms, handleJoinRoomClick}) => {
    const roomsStyle = {        
        border: '1px solid red'
    }
    const roomsTitleStyle = {
        border: '1px solid blue'
    }
    const roomsViewStyle = {
        columnCount: 2   
    }

    const [roomQuery, setRoomQuery] = useState("");

    const roomToShow = rooms.filter(room => room.name.toLowerCase().includes(roomQuery.toLowerCase()))
    return(
        <div style={roomsStyle}>
            <h2 style={roomsTitleStyle}>Join a Room</h2>
            <RoomFilter query={roomQuery} setQuery={setRoomQuery} />
            <div style={roomsViewStyle}>
                {roomToShow.map(room => <RoomDisplay key={room.rid} room={room} handleJoinRoomClick={handleJoinRoomClick} />)}
            </div>
        </div>
    );
};

export default Rooms