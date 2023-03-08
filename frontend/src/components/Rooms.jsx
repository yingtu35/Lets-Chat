import { useState } from "react"

const RoomFilter = ({query, setQuery}) => {
    return(
    <form>
        <label htmlFor="roomSearch">Search Room</label>
        <input id="roomSearch"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
        />
    </form>
    )
}

const RoomDisplay = ({room, handleJoinRoomClick}) => {
    return(
        <div>
            <p>Room: {room.name}</p>
            <p>Current Users: {room.num_users}/{room.capacity}</p>
            <p>Host Id:{room.host_uid}</p>
            <button onClick={() => handleJoinRoomClick(room.rid)}>Join room</button>
        </div>
    )    
}

const Rooms = ({rooms, handleJoinRoomClick}) => {
    const [roomQuery, setRoomQuery] = useState("");

    const roomToShow = rooms.filter(room => room.name.toLowerCase().includes(roomQuery.toLowerCase()))
    return(
    <>
    <RoomFilter query={roomQuery} setQuery={setRoomQuery} />
    <div>
        {roomToShow.map(room => <RoomDisplay key={room.rid} room={room} handleJoinRoomClick={handleJoinRoomClick} />)}
    </div>
    </>
    );
};

export default Rooms