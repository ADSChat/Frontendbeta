const db = firebase.database();
let onlineUsers = 0;

function toggleVisibility(showChat) {
    document.getElementById('loginForm').style.display = showChat ? 'none' : 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('chatApp').style.display = showChat ? 'block' : 'none';
}

// Login functionality
document.getElementById('loginButton').addEventListener('click', function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            toggleVisibility(true);
            document.getElementById('loggedInUser').textContent = userCredential.user.email;
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Signup functionality
document.getElementById('signupButton').addEventListener('click', function() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            toggleVisibility(true);
            document.getElementById('loggedInUser').textContent = userCredential.user.email;
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Chat functionality
document.getElementById('chatInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const message = this.value;
        const timestamp = Date.now();
        // Save message to Firebase
        db.ref('messages').push({
            sender: firebase.auth().currentUser.email,
            message: message,
            timestamp: timestamp
        });
        this.value = '';
    }
});

db.ref('messages').on('child_added', function(snapshot) {
    const message = snapshot.val();
    appendMessage(message.sender, message.message);
});

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = `${sender}: ${message}`;
    document.getElementById('chatContent').appendChild(messageElement);
}

// Track online users (example logic, adjust as needed)
firebase.database().ref('.info/connected').on('value', function(snapshot) {
    if (snapshot.val() === true) {
        onlineUsers++;
        firebase.database().ref('users').push({
            email: firebase.auth().currentUser.email,
            status: 'online'
        });
        document.getElementById('onlineUsers').textContent = `Online Users: ${onlineUsers}`;
    }
});

firebase.database().ref('users').on('child_removed', function(snapshot) {
    onlineUsers--;
    document.getElementById('onlineUsers').textContent = `Online Users: ${onlineUsers}`;
});

// Ensure chat interface is hidden initially
toggleVisibility(false);
