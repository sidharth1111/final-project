import React from 'react';

import UsersList from "../components/UsersList";

const Users = () => {
    const USERS = [
        {
            id: 1,
            name: "Paris",
            image: "https://media-cdn.tripadvisor.com/media/photo-c/1280x250/17/15/6d/d6/paris.jpg",
            places: 2
        }
]
    return <UsersList items={USERS}/>;
}

export default Users;