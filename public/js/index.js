var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (msg) {
  console.log('New msg', msg);
  var formattedTime = moment(msg.createdAt).format('h:mm');
  var ul = document.getElementById('messages');
  var li = document.createElement('li');
  var text = document.createTextNode(`${msg.from} ${formattedTime}: ${msg.text}`);
  li.appendChild(text);
  ul.appendChild(li);
});

socket.on('newLocationMessage', function (msg) {
  console.log(msg.url);
  var formattedTime = moment(msg.createdAt).format('h:mm');
  var ul = document.getElementById('messages');
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.href = msg.url;
  a.target = '_blank';
  a.textContent = 'My current location';
  var text = document.createTextNode(`${msg.from} ${formattedTime}: `)
  
  li.appendChild(text);
  li.appendChild(a);
  ul.appendChild(li);
});

var locationButton = document.getElementById('send-location');
locationButton.addEventListener('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by browser.');
  }

  locationButton.textContent = 'Sending location...';
  locationButton.disabled = true;
  
  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.textContent = 'Send location';
    locationButton.disabled = false;
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.textContent = 'Send location';
    locationButton.disabled = false;
    alert('Unable to fetch position.');
  });
});