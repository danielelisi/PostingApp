/**
 * Created by danielelisi on 2017-04-15.
 */
console.log("LINKED TO POSTS.HTML");

// Variables initialization
var titleInput = document.getElementById("titleInput");
var descInput = document.getElementById("descInput");
var statusDiv = document.getElementById("status");


// $.ajax({
//     type: "POST",
//     url: "/posts/load",
//     success: function(response) {
//         console.log(response);
//     }
// });

document.getElementById("createButton").addEventListener("click", function () {
    $.ajax({
        type: "POST",
        url: "/posts/create",
        data: {
            title: titleInput.value,
            desc: descInput.value
        },
        success: function(response) {
            statusDiv.innerHTML = response.msg;


        }
    });
});

