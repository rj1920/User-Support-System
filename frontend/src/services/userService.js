import myAxios from "./helper";


export const signup = (user) => {
    return myAxios.post('/user/register', user)
    .then((res)=> res.data)
}


export const raiseTicket = (ticket) => {
    return myAxios.post('/user/tickets',ticket)
    .then((res) => res.data);
}


export const changeStatus = (ticketId,status) => {
    console.log(status);
    return myAxios.put(`/user/tickets/${ticketId}`,{ status } )
    .then((res) => res.data);
}

export const login = (credentials) => {
    return myAxios.post('/login',credentials)
    .then((res) => res.data)
};


export const getUserByRole = (role) => {
    console.log(role)
    const encodedRole = encodeURIComponent(role);
    return myAxios.get(`/user/users/${encodedRole}`)
    .then((res) => res.data)
    .catch((error) => {
        console.error('Error fetching usser by role:', error);
        throw error;
    })
} 


export const getTicketByEmail = (createdBy) => {
    console.log(createdBy)
    const encodedCreatedBy = encodeURIComponent(createdBy);
    return myAxios.get(`/user/tickets/${encodedCreatedBy}`)
    .then((res) => res.data )
    .catch((error) => {
        console.error('Error fetching tickets by email:', error);
        throw error;
    })
};

