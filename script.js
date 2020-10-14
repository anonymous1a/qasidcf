var db;
var d = new Date();
var userPass;
var adminPass;
var currentUser = "";
function setHeight() {
    var h = document.documentElement.clientHeight;
    var mainHeight = String(h - 118) + "px";
    document.getElementById("main").style.height = mainHeight;
}
//adding event listener
window.addEventListener("resize", setHeight);
var firebaseConfig = {
    apiKey: "AIzaSyDL6rPExd5cct8jjY1S4ygL-Ab__G1xBGA",
    authDomain: "webchat-a1.firebaseapp.com",
    databaseURL: "https://webchat-a1.firebaseio.com",
    projectId: "webchat-a1",
    storageBucket: "webchat-a1.appspot.com",
    messagingSenderId: "698805671580",
    appId: "1:698805671580:web:145d3f3158e4c8a1ec3f59"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//sign in anonymously
firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorMessage = error.message;
    alert("An Error Occoured\n" + errorMessage);
});
//getting database reference
db = firebase.database();
//storing passwords of both users
db.ref("/users/admin").once("value").then(function (snapshot) {
    let tempUser = snapshot.val();
    adminPass = tempUser.password + String(d.getDate());
});
db.ref("/users/user").once("value").then(function (snapshot) {
    let tempUser = snapshot.val();
    userPass = tempUser.password + String(d.getDate());
});
function verify() {
    var tempPass = document.getElementById("pass").value;
    if (tempPass === userPass) {
        currentUser = "user";
        home();

    }
    else if (tempPass === adminPass) {
        currentUser = "admin";
        home();

    }
    else {
        document.getElementById("incorrect").style.visibility = "visible";
    }
}
//sets the visibility of main as block
function home() {
    document.getElementById("locked").style.display = "none";
    document.getElementById("body").style.display = "block";
    //calling for the first time
    setHeight();
    db.ref("/users/" + currentUser).update({
        status: "online",
        lastSeen: "None"
    });
    document.getElementById("input").addEventListener("focus", function () {
        db.ref("/users/" + currentUser).update({
            status: "typing",
            lastSeen: "None"
        });
    });
    //when input loses function then make it offline
    document.getElementById("input").addEventListener("blur", function () {
        db.ref("/users/" + currentUser).update({
            status: "online",
            lastSeen: "None"
        });
    });
    //when entering home update second users last seen and status
    if (currentUser === "user") {
        db.ref("/users/admin").on("value", function (snapshot) {
            let tempUser = snapshot.val();
            if (tempUser.status === "offline") {
                document.getElementById("heart").style.color = "#ff4444";
                document.getElementById("status").innerHTML = tempUser.lastSeen;
            }
            else if (tempUser.status === "online") {
                document.getElementById("heart").style.color = "#00C851";
                document.getElementById("status").innerHTML = "Online";
            }
            else if (tempUser.status === "typing") {
                document.getElementById("heart").style.color = "#9933CC";
                document.getElementById("status").innerHTML = "Typing...";
            }
        });
    }
    else if (currentUser === "admin") {
        db.ref("/users/user").on("value", function (snapshot) {
            let tempUser = snapshot.val();
            if (tempUser.status === "offline") {
                document.getElementById("heart").style.color = "#ff4444";
                document.getElementById("status").innerHTML = tempUser.lastSeen;
            }
            else if (tempUser.status === "online") {
                document.getElementById("heart").style.color = "#00C851";
                document.getElementById("status").innerHTML = "Online";
            }
            else if (tempUser.status === "typing") {
                document.getElementById("heart").style.color = "#9933CC";
                document.getElementById("status").innerHTML = "Typing...";
            }
        });
    }
    //display all old messages
    //event listener that checks for any child that is added to an object
    db.ref("/messages").on("child_added", function (data) {
        var tempMessage = data.val();
        var para = document.createElement("p");
        var paraText = document.createTextNode(tempMessage.text);
        para.appendChild(paraText);
        para.setAttribute("title", tempMessage.time);
        if ((tempMessage.sender === "user" && currentUser === "user") || (tempMessage.sender === "admin" && currentUser === "admin")) {
            para.setAttribute("class", "right");
        }
        else {
            para.setAttribute("class", "left");
        }
        document.getElementById("main").appendChild(para);
document.querySelector('#main').scrollTo(0, document.querySelector('#main').scrollHeight);
    });
}
//updates status before leaving the site
window.addEventListener("unload", function (event) {
    var day;
    switch (d.getDay()) {
        case 0:
            day = "Sun";
            break;
        case 1:
            day = "Mon";
            break;
        case 2:
            day = "Tues";
            break;
        case 3:
            day = "Wed";
            break;
        case 4:
            day = "Thur";
            break;
        case 5:
            day = "Fri";
            break;
        case 6:
            day = "sat";
            break;
    }
    var lastSeen = day + " " + d.getDate() + "th" + " " + d.getHours() + ":" + d.getMinutes();
    db.ref("/users/" + currentUser).update({
        status: "offline",
        lastSeen: lastSeen
    });
});
function deleteMessages() {
    var choice = confirm("Delete all Messages?");
    if (choice === true) {
        db.ref("/messages").remove();
        document.getElementById("main").innerHTML = "";
    }
    else {
        return
    }
}
//function to send message
function sendMessage() {
    var month;
    switch (d.getMonth()) {
        case 0:
            month = "Jan";
            break;
        case 1:
            month = "Feb";
            break;
        case 2:
            month = "Mar";
            break;
        case 3:
            month = "Apr";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "Aug";
            break;
        case 8:
            month = "Sep";
            break;
        case 9:
            month = "Oct";
            break;
        case 10:
            month = "Nov";
            break;
        case 11:
            month = "Dec";
            break;
    }
    var text = document.querySelector("#input").value;
    var sender = currentUser;
    var time = d.getDate() + "th" + " " + month + " " + d.getHours() + ":" + d.getMinutes();
    //taking databse reference
    var key = db.ref("/messages").push({
        text: text,
        sender: sender,
        time: time
    }).key;
    document.querySelector("#input").value = "";
document.querySelector('#main').scrollTo(0, document.querySelector('#main').scrollHeight);
}
