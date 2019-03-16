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
  var params = deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error.');
    }
  })
});

socket.on('disconnect', function () {
  console.log('Disconnected from server')
});

socket.on('updateUserList', function (users) {
  console.log('userslist: ', users);
  var oldList = document.getElementById('userList');
  var newList = document.createElement('ol');
  
  users.forEach((user) => {
    var li = document.createElement('li');
    li.textContent = user;
    newList.appendChild(li);
  });

  var userList = document.getElementById('users');
  userList.replaceChild(newList, oldList);
  newList.id = 'userList';
});

function autoScroll () {
  var messages = document.getElementById('messages');
  var newMessage = messages.lastElementChild;


  var newMessageStyles = getComputedStyle(newMessage);
  var newMessageMargin = parseInt(newMessageStyles.marginBottom)
  var newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  var visibleHeight = messages.offsetHeight;

  var containerHeight = messages.scrollHeight;

  var scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }

}

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
  autoScroll()
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
  autoScroll()
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