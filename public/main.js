var io = io();
var userInput = document.getElementById('message');
var messages = document.getElementById('messages');
var messagesCount = 0;
var SETTINGS = {};

function isTextSelected(element) {
  return !!element.value.substring(element.selectionStart, element.selectionEnd).length
}

io.on('settings', function (settings) {
  SETTINGS = settings;
});

io.on('message', function (message) {
  var lastMessage = document.querySelector('#messages p:last-child');

  messagesCount++;

  if (messagesCount > SETTINGS.MAX_MESSAGES) {
    lastMessage.remove();
  }

  messages.innerHTML = `<p>${message}</p>` + messages.innerHTML;
});

userInput.addEventListener('keypress', function (e) {
  if (e.keyCode === 13) {
    io.emit('message', e.target.value);

    userInput.value = '';
    messagesCount++;

    e.preventDefault();
  } else {
    if (userInput.value.length > SETTINGS.MESSAGE_MAX_LENGTH && !isTextSelected(userInput)) {
      e.preventDefault();
    }
  }
});
