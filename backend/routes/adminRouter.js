const express = require('express');
const fs = require('fs');

const appForAdmin = express.Router();

let tickets = JSON.parse(fs.readFileSync('data/tickets.json'));

appForAdmin.put('/tickets/assign/:ticketId', (req,res) => {
    const { ticketId } = req.params;
    const { techSupportId } = req.body;


    const ticket = tickets.find(t => t.ticketId === ticketId);

    if(!ticket){
        return res.status(404).json({ message: 'Ticket Not Found'});
    }

    ticket.techSupportId = techSupportId;

    fs.writeFileSync('data/tickets.json', JSON.stringify(tickets));

    res.json(ticket);

});


appForAdmin.put('/tickets/close/:ticketId', (req,res) => {
    const { ticketId } = req.params;

    console.log(ticketId);
    const ticket = tickets.find(t => t.ticketId === ticketId);

    if(!ticket){
        return res.status(404).json({ message: 'Ticket Not Found'});
    }

    ticket.status = 'close';

    fs.writeFileSync('data/tickets.json', JSON.stringify(tickets));

    res.json(ticket);

    console.log(ticket);

});

module.exports = appForAdmin;