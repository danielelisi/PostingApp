/**
 * Created by danielelisi on 2017-04-19.
 */

console.log("LINKED TO POST.HTML")

var replyInput = document.getElementById("replyInput");
var sendButton = document.getElementById("sendButton");

var statusDiv = document.getElementById("status");
var repliesDiv = document.getElementById("displayReplies");

$.ajax({
    url: "/repliesCRUD",
    type: "POST",
    data: {
        status: "read"
    },
    success: function(response) {

        if (response.status === "success") {
            for (var i=0; i < response.replies.length; i++) {
                var newReply = document.createElement("p");
                newReply.innerHTML = response.replies[i].reply + " | created at: " + response.replies[i].time_created;
                repliesDiv.appendChild(newReply);
            }
        } else {
            statusDiv.innerHTML = response.msg;
        }
    }
});

sendButton.addEventListener("click", function () {
    $.ajax({
        url: "/repliesCRUD",
        type: "POST",
        data: {
            status: "create",
            reply: replyInput.value
        },
        success: function(response) {
            if (response.status === "success") {

                var newReply = document.createElement("p");
                newReply.innerHTML = response.username + ": > " + response.replyMsg + " | created at: " + response.time;
                repliesDiv.appendChild(newReply);

                statusDiv.innerHTML = "";
            } else {
                statusDiv.innerHTML = "Error occurred";
            }

        }
    });
});