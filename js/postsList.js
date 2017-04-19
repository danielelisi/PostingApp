/**
 * Created by danielelisi on 2017-04-15.
 */

console.log("LINKED TO POSTSLIST.HTML");

// Variables initialization
var titleInput = document.getElementById("titleInput");
var descInput = document.getElementById("descInput");
var statusDiv = document.getElementById("status");

var listPostDiv = document.getElementById("listPosts");


$.ajax({
    type: "POST",
    url: "/postCRUD",
    data: {
        status: "read"
    },
    success: function (response) {

        for (var i =0; i < response.length; i++) {
            var newDiv = document.createElement("div");
            var newInfo = document.createElement("h6");
            var newTitle = document.createElement("h2");
            var newDesc = document.createElement("h4");

            newDiv.className = "postDiv";
            newInfo.innerHTML = "User: " + response[i].username + " created this post on: " + response[i].timezone;
            newTitle.innerHTML = response[i].title;
            newDesc.innerHTML = response[i].description;

            listPostDiv.appendChild(newDiv);
            newDiv.appendChild(newInfo);
            newDiv.appendChild(newTitle);
            newDiv.appendChild(newDesc);

            // assign post db id to the div
            newDiv.postId = response[i].id;
            newDiv.addEventListener("click", function () {
                location.href = "/posts/" + this.postId;
            });
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
            var newInfo = document.createElement("h6");
            var newTitle = document.createElement("h2");
            var newDesc = document.createElement("h4");

            newDiv.className = "postDiv";
            newInfo.innerHTML = "User: " + response.username + " created this post on: " + response.time;
            newTitle.innerHTML = titleInput.value;
            newDesc.innerHTML = descInput.value;

            listPostDiv.appendChild(newDiv);
            newDiv.appendChild(newInfo);
            newDiv.appendChild(newTitle);
            newDiv.appendChild(newDesc);

            newDiv.postId = response.id;
            newDiv.addEventListener("click", function () {
                location.href = "/posts/" + this.postId;
            });
        }
    });
});

