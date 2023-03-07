import { useState } from "react"
import RoomServices from "../services/RoomServices";

const Home = ({username, email, onLogOutSuccess, onCreateRoomSuccess}) => {
    const [roomName, setRoomName] = useState("");

    const handleCreateRoomClick = async (e) => {
        e.preventDefault();

        if (!username || !roomName){
            alert("Invalid username or roomName");
            return;
        }
        RoomServices
            .createRoom(username, roomName)
            .then(returnedRoom => {
                console.log(returnedRoom);
                onCreateRoomSuccess(returnedRoom);
            })
            .catch(error => {
                console.log(error.response);
            })
    };
    const handleJoinRoomClick = async (e) => {
        e.preventDefault();

        // const requestOptions = {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': "application/json"
        //     },
        //     body: JSON.stringify({
        //         username: name,
        //         email: email,
        //         room: room
        //     })
        // }
        // const response = await fetch("/room", requestOptions);
        // const data = await response.json();
        // console.log(data);
    };

    const handleLogOutClick = () => {
        onLogOutSuccess();
    }

    return (
        <>
        <div>
            <p>Username: {username}</p>
            <p>Email: {email}</p>
            <button onClick={handleLogOutClick}>Log out</button>
        </div>
        <form>
            <label htmlFor="newRoom">Enter a new room name</label><br/>
            <input type="text" 
                   id="newRoom"
                   value={roomName}
                   onChange={(e) => setRoomName(e.target.value)} /><br/>
            <button type="submit"
                    onClick={handleCreateRoomClick}>
                Create a Room
            </button>
        </form>
        {/* <form>
            <label htmlFor="room">Join an existing room:</label><br/>
            <input type="text" 
                   id="room"
                   onChange={(e) => setRoom(e.target.value)} /><br/>
            <button type="submit" onClick={handleJoinRoomClick}>Join a Room</button>
        </form> */}
        </>
    )
}

export default Home