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

const Room = ({room}) => {
    return(
        <div>
            <p>Room: {room.name}</p>
            <p>Current Users: {room.num_users}/{room.capacity}</p>
            <p>Host Id:{room.host_uid}</p>
            <button>Join room</button>
        </div>
    )    
}

const Rooms = ({rooms}) => {
    const [roomQuery, setRoomQuery] = useState("");

    const roomToShow = rooms.filter(room => room.name.toLowerCase().includes(roomQuery.toLowerCase()))
    return(
    <>
    <RoomFilter query={roomQuery} setQuery={setRoomQuery} />
    <div>
        {roomToShow.map(room => <Room key={room.rid} room={room} />)}
    </div>
    </>
    );
};

export default Rooms