var socket = io();

function scrollToBottom () {
  var messages = document.getElementById('messages');
  var newMessage = messages.lastChild;
  var messagesHeight = messages.clientHeight;
  var scrollTop = messages.scrollTop;
  var scrollHeight = messages.scrollHeight;
  var newMessageHeight = newMessage.clientHeight;
  var lastMessageHeight = 0;
  if (messages.children.length > 1) {
    lastMessageHeight = newMessage.previousSibling.clientHeight;
  }
  
  if (messagesHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    console.log('should scroll');
    messages.scrollTo(0, scrollHeight);
  }
}

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (msg) {
  console.log('New msg', msg);
  var formattedTime = moment(msg.createdAt).format('h:mm');
  var template = document.getElementById('message-template').innerHTML;
  var html = Mustache.render(template, {
    text: msg.text,
    from: msg.from,
    createdAt: formattedTime
  });

  var messages = document.getElementById('messages');
  var test = document.createElement('li');
  test.innerHTML = html;
  messages.appendChild(test);
  scrollToBottom()
});

socket.on('newLocationMessage', function (msg) {

  var formattedTime = moment(msg.createdAt).format('h:mm');
  var template = document.getElementById('location-message-template').innerHTML;
  var html = Mustache.render(template, {
    url: msg.url,
    from: msg.from,
    createdAt: formattedTime
  });

  var messages = document.getElementById('messages');
  var test = document.createElement('li');
  test.innerHTML = html;
  messages.appendChild(test);
  scrollToBottom()
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