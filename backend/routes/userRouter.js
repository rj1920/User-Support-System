const express = require('express');
const atob = require('atob');
const appForUser = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let users = JSON.parse(fs.readFileSync('data/users.json'));
let tickets = JSON.parse(fs.readFileSync('data/tickets.json'));


appForUser.post('/register', (req,res) => {

    const { firstname, lastname, email, password, role} = req.body;

    const encodedPassword = Buffer.from(password).toString('base64');

    const newUser = { userId: uuidv4(), 
                      firstname, 
                      lastname, 
                      email, 
                      password : encodedPassword, 
                      role: 'support' };

    users.push(newUser);

    fs.writeFileSync('data/users.json', JSON.stringify(users));
    res.json(newUser);
});


appForUser.post('/tickets', (req,res) => {
    const { ticketname, description, createdBy } = req.body;
    console.log(req.body);
    const newTicket = { ticketId: uuidv4(),
                        ticketname,
                        description, 
                        createdBy, 
                        status: 'open', 
                        createdAt: new Date().toISOString(),
                        answer: "",
                        techSupportId: "" };

    if(req.file){
        newTicket.attachment = req.file.filename;
    }

    console.log(newTicket);
    tickets.push(newTicket);

    fs.writeFileSync('data/tickets.json', JSON.stringify(tickets));

    return res.status(201).json(newTicket);
});


appForUser.put('/tickets/:ticketId', (req,res) => {
    const { ticketId } = req.params;
    const { status }  = req.body;

    // console.log(status);

    const ticket = tickets.find(t => t.ticketId === ticketId);

    if(!ticket){
        return res.status(404).json({ message : 'Ticket not found' });
    }

    ticket.status = status;

    fs.writeFileSync('data/tickets.json', JSON.stringify(tickets));

    // console.log(ticket.status);
    return res.status(201).json(ticket.status);

});

appForUser.get('/tickets/:createdBy', (req, res) => {
    const { createdBy } = req.params;
    
    console.log(createdBy);
   
    const userTickets = tickets.filter(ticket => ticket.createdBy === createdBy);
    
    console.log(userTickets.length);

    if (userTickets.length === 0) {
        return res.status(404).json({ message: 'No tickets found for the user' });
    }

    return res.status(201).json(userTickets);
});


appForUser.get('/users/:role', (req, res) => {
    const { role } = req.params;
    
    console.log(role);
   
    const userDetails = users.filter(user => user.role === role);

    console.log(userDetails);

    if (userDetails.length === 0) {
        return res.status(404).json({ message: 'No tickets found for the user' });
    }

    return res.status(201).json(userDetails);
});




module.exports = appForUser;
