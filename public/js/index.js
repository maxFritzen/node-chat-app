var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (msg) {
  console.log('New msg', msg);
  var ul = document.getElementById('messages');
  var li = document.createElement('li');
  var text = document.createTextNode(`${msg.from}: ${msg.text}`);
  li.appendChild(text);
  ul.appendChild(li);
});
