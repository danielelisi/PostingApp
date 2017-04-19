/**
 * Created by danielelisi on 2017-04-09.
 */

console.log("Linked to INDEX.HTML");

// Variables definitions
var usernameInput = document.getElementById("usernameInput");
var emailInput = document.getElementById("emailInput");
var passwordInput = document.getElementById("passwordInput");

var regButton = document.getElementById("registerButton");
var loginButton = document.getElementById("loginButton");
var statusDiv = document.getElementById("status");


document.getElementById("showRegButton").addEventListener("click", function () {
    usernameInput.style.display = "inline";
    emailInput.style.display = "inline";
    passwordInput.style.display = "inline";
    regButton.style.display = "inline";
    loginButton.style.display = "none";
});

document.getElementById("showLoginButton").addEventListener("click", function () {
    usernameInput.style.display = "none";
    emailInput.style.display = "inline";
    passwordInput.style.display = "inline";
    loginButton.style.display = "inline";
    regButton.style.display = "none";
});


regButton.addEventListener("click", function() {
    $.ajax({
        type: "POST",
        url: "/user/register",
        data: {
            username: usernameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        },
        success: function(response) {
            statusDiv.innerHTML = response.msg;
        }
    });
});

loginButton.addEventListener("click", function() {
    $.ajax({
        type: "POST",
        url: "/user/login",
        data: {
            email: emailInput.value,
            password: passwordInput.value
        },
        success: function(response) {
            if (response.status == "success") {
                location.href = "/posts"
            } else {
                statusDiv.innerHTML = response.msg;
            }
        }
    });
})

