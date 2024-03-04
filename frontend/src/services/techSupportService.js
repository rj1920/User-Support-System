import myAxios from "./helper";

export const answerTicket = (ticketId,answer) => {
        return myAxios.put(`/techsupport/tickets/answer/${ticketId}`,{ answer })
        .then((res) => res.data)
};


export const closeTicket = (ticketId) => {
    return myAxios.put(`/techsupport/tickets/close/${ticketId}`)
    .then((res)=> res.data)
};

export const getAllTickets = () => {
    return myAxios.get("/techsupport/get")
    .then((res) => res.data)
};


