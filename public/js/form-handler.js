var form = document.getElementById("message-form");
var input = document.getElementsByName("message")[0];

form.addEventListener("submit", function (e) {
  e.preventDefault();
  
  socket.emit("createMessage", {
    from: "User",
    text: input.value
  }, function () {

  });
});