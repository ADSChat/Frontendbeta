const db = firebase.database();

document.getElementById('chatInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const message = this.value;
        const timestamp = Date.now();

        // Save message to Firebase
        db.ref('messages/' + timestamp).set({
            sender: 'You',
            message: message
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
