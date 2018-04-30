const express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io')(server),
      db = require('quick.db'),
      port = process.env.PORT,
      tools = require('./functions.js'),
      Discord = require('discord.js'),
      client = new Discord.Client({ fetchAllMembers: true }),
      discord = require('./discord.js')(client);

// Listen To Port
server.listen(port, function() {
  console.log(`Listening at port ${port}`);
})

// Routing
app.use(express.static('public'));

// Pages 
app.get("/", function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
})

app.get("/new", function(request, response) {
    response.sendFile(__dirname + '/public/new.html');
})

app.get("/view", function(request, response) {
    response.sendFile(__dirname + '/public/view.html');
})

app.get("/request", function(request, response) {
    response.sendFile(__dirname + '/public/request.html');
})

app.get("/requests", function(request, response) {
    response.sendFile(__dirname + '/public/requests.html');
})

app.get("/indexnew", function(request, response) {
    response.sendFile(__dirname + '/public/indexnew.html');
})

app.get("/suggest", function(request, response) {
    response.sendFile(__dirname + '/public/suggest.html');
})

app.get("/suggestions", function(request, response) {
    response.sendFile(__dirname + '/public/suggestions.html');
})

io.on('connection', function(socket) {
  
  // Request Entries
  socket.on('requestEntries', async function() {
    console.log('New Data Request');
    let entries = await db.fetch('entries');
    if (!entries) entries = {};
    entries = Object.values(entries);
    entries = entries.filter(e => e.approved && e.type !== 'request');
    entries = entries.reverse();
    socket.emit('requestEntriesCallback', entries);
  })
  
  socket.on('submitCode', async function(data) {
    let key = await tools.generateKey('entries');
    if (typeof data !== 'object') return;
    data.key = key;
    data.approved = true;
    data.views = 0;
    data.rating = 0;
    data.tags = [];
    await db.set('entries', data, { target: key });
    socket.emit('submitCodeCallback', key);
    client.emit('newItem', key);
  })
  
  socket.on('requestView', async function(key) {
    let res = await db.fetch('entries', { target: key });
    socket.emit('requestViewCallback', res);
  })
  
  socket.on('requestRandom', async function() {
    let entries = await db.fetch('entries');
    if (!entries) entries = {};
    entries = Object.values(entries);
    entries = entries.filter(e => e.approved && e.type !== 'request');
    let res = entries[Math.floor(Math.random()*entries.length)];
    socket.emit('requestRandomCallback', res.key);
  })
  
  socket.on('submitRequest', async function(data) {
    let key = await tools.generateKey('entries');
    data.type = 'request';
    data.status = false;
    data.key = key;
    await db.set('entries', data, { target: key });
    socket.emit('submitRequestCallback', key);
    client.emit('newRequest', key);
  })
  
  socket.on('requestRequests', async function(data) {
    let entries = await db.fetch('entries');
    if (!entries) entries = {};
    entries = Object.values(entries);
    entries = entries.filter(e => e.type === 'request');
    entries = entries.reverse();
    socket.emit('requestRequestsCallback', entries);
  })
  
  socket.on('submitSuggestion', async function(data) {
    let key = await tools.generateKey('entries');
    data.type = 'suggestion';
    data.status = false;
    data.key = key;
    await db.set('entries', data, { target: key });
    socket.emit('submitSuggestionCallback', key);
    client.emit('newSuggestion', key);
  })
  
  socket.on('requestSuggestions', async function(data) {
    let entries = await db.fetch('entries');
    if (!entries) entries = {};
    entries = Object.values(entries);
    entries = entries.filter(e => e.type === 'suggestion');
    entries = entries.reverse();
    socket.emit('requestSuggestions', entries);
  })
  
})
