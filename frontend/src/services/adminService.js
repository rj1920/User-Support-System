import myAxios from "./helper";


export const assignTechSupport = (ticketId,techSupportId) => {
    return myAxios.put(`/admin/tickets/assign/${ticketId}`,{ techSupportId })
    .then((res) => res.data)
};


export const closeTicketStatus = (ticketId) => {
    console.log(ticketId);
    return myAxios.put(`/admin/tickets/close/${ticketId}`)
    .then((res) => res.data)
};





