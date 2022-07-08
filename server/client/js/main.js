const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');

// Get username and room form the urrl
const {username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true , 
})

const socket = io();

// Join chatroom

socket.emit('joinRoom', {username, room});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // scrolldown 
  chatMessages.scrollTop = chatMessages.scrollHeight ;

});

// message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  // emit message to the server
  socket.emit("chatMessage", msg);

  // clear 
  e.target.elements.msg.value = '' ;
  e.target.elements.msg.focus() ; 

});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<div class="message">
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
</div>`;
  document.querySelector(".chat-messages").appendChild(div);
}
