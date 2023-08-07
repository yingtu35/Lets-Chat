import User from "./User";

const Users = ({users, userQuery=""}) => {
    const usersToShow = users.filter(user => user.toLowerCase().includes(userQuery.toLowerCase()))
    return (
        usersToShow.map(user => <User key={user} user={user} />)
    )
};

export default Users