const User = ({user}) => <p>{user.username} {user.email} {user.rid}</p>

const Users = ({users}) => {
    return(
    <div>
        {users.map(user => <User key={user.uid} user={user} />)}
    </div>
    );
};

export default Users