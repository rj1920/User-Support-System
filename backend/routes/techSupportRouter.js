const express = require('express');
const fs = require('fs');
const appForTechSupport = express.Router();

let tickets = JSON.parse(fs.readFileSync('data/tickets.json'));

appForTechSupport.put('/tickets/answer/:ticketId', (req, res) => {
    const { ticketId } = req.params;
    const { answer } = req.body;

    console.log(ticketId);
    const ticket = tickets.find(t => t.ticketId === ticketId);

    if(!ticket){
        return res.status(404).json({ message: 'Ticket Not Found' });
    }

    if (req.file) {
        ticket.attachment = req.file.filename;
    }
    console.log(ticket);
    ticket.answer = answer;
    console.log(ticket);

    fs.writeFileSync('data/tickets.json', JSON.stringify(tickets));

    res.json(ticket);

});


appForTechSupport.put('/tickets/close/:ticketId', (req,res) => {
    const { ticketId } = req.params;

    const ticket = tickets.find(t => t.ticketId === ticketId);

    if(!ticket){
        return res.status(404).json({ message: 'Ticket Not found'});
    }
console.log(ticket);

    ticket.status = 'closed';

    fs.writeFileSync('data/tickets.json', JSON.stringify(tickets));

    console.log(ticket);

    res.json(ticket);
});


appForTechSupport.get('/get', (req, res) => {
    return res.status(200).json(tickets);
})

module.exports = appForTechSupport;



