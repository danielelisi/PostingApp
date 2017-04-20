/**
 * Created by danielelisi on 2017-04-19.
 */
$(document).ready(function() {

    console.log("LINKED TO CHATROOM.HTML");

    var displayDiv = document.getElementById("display");
    var sendButton = document.getElementById("sendButton");
    var msgInput = document.getElementById("msgInput");

    $.ajax({
        url: "/chatroom/info",
        type: "POST",
        success: function (response) {

            document.getElementById("chatTitle").innerHTML = response.title;
            var username = response.username;
            var chatId = response.id;

            var socket = io();
            socket.emit("join chat", chatId);

            socket.on("create message", function (messageObj) {
                var newDiv = document.createElement("p");
                newDiv.innerHTML = messageObj.username +": " + messageObj.message;
                displayDiv.appendChild(newDiv);
            });

            sendButton.addEventListener("click", function () {
                var messageObj = {
                    username: username,
                    message: msgInput.value,
                    chatID: chatId
                };

                socket.emit("send message", messageObj)
            });
        }
    });
});