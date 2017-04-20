/**
 * Created by danielelisi on 2017-04-15.
 */

console.log("LINKED TO POSTSLIST.HTML");

// Variables initialization
var titleInput = document.getElementById("titleInput");
var descInput = document.getElementById("descInput");
var statusDiv = document.getElementById("status");

var listPostDiv = document.getElementById("listPosts");

document.getElementById("logoutButton").addEventListener("click", function () {
    $.ajax({
        url: "/logout",
        type: "POST",
        success: function(response) {
            if(response === "success") {
                location.reload();
            }
        }
    });
});


$.ajax({
    type: "POST",
    url: "/postCRUD",
    data: {
        status: "read"
    },
    success: function (response) {

        for (var i = 0; i < response.length; i++) {
            var newDiv = document.createElement("div");
            var newInfo = document.createElement("h5");
            var newTitle = document.createElement("h2");
            var newDesc = document.createElement("h4");
            var chatButton = document.createElement("button");
            var enterPost = document.createElement("button");


            newDiv.className = "postDiv";
            newInfo.innerHTML = "User: " + response[i].username + " created this post on: " + response[i].time_created;
            newTitle.innerHTML = response[i].title;
            newDesc.innerHTML = response[i].description;

            // assign post db id to the div
            enterPost.postId = response[i].id;
            enterPost.innerHTML = "Enter Post Replies";
            enterPost.addEventListener("click", function () {
                location.href = "/posts/" + this.postId;
            });

            // Live Chatroom
            chatButton.chatId = response[i].id;
            chatButton.innerHTML = "Enter Post Livechat";
            chatButton.addEventListener("click", function() {
                location.href = "/chatroom/" + this.chatId;
            });

            listPostDiv.appendChild(newDiv);
            newDiv.appendChild(newInfo);
            newDiv.appendChild(newTitle);
            newDiv.appendChild(newDesc);
            newDiv.appendChild(enterPost);
            newDiv.appendChild(chatButton);
        }
    }
});

document.getElementById("createButton").addEventListener("click", function () {
    $.ajax({
        type: "POST",
        url: "/postCRUD",
        data: {
            status: "create",
            title: titleInput.value,
            desc: descInput.value
        },
        success: function(response) {
            statusDiv.innerHTML = response.msg;

            var newDiv = document.createElement("div");
            var newInfo = document.createElement("h5");
            var newTitle = document.createElement("h2");
            var newDesc = document.createElement("h4");
            var chatButton = document.createElement("button");
            var enterPost = document.createElement("button");


            newDiv.className = "postDiv";
            newInfo.innerHTML = "User: " + response.username + " created this post on: " + response.time;
            newTitle.innerHTML = titleInput.value;
            newDesc.innerHTML = descInput.value;

            enterPost.postId = response.postId;
            enterPost.innerHTML = "Enter Post Replies";
            enterPost.addEventListener("click", function () {
                location.href = "/posts/" + this.postId;
            });

            // Livechat button
            chatButton.chatId = response.postId;
            chatButton.innerHTML = "Enter Post Livechat";
            chatButton.addEventListener("click", function () {
                location.href = "/chatroom/" + this.chatId;
            });


            listPostDiv.insertBefore(newDiv, listPostDiv.childNodes[0]);
            newDiv.appendChild(newInfo);
            newDiv.appendChild(newTitle);
            newDiv.appendChild(newDesc);
            newDiv.appendChild(enterPost);
            newDiv.appendChild(chatButton);

            titleInput.value = "";
            descInput.value = "";
        }
    });
});

