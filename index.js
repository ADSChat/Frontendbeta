document.getElementById('chatInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const message = this.value;
        appendMessage('You', message); // Show user's message

        fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        })
        .then(response => response.json())
        .then(data => {
            appendMessage('Bot', data.reply); // Show bot's reply
        });

        this.value = '';
    }
});

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = `${sender}: ${message}`;
    document.getElementById('chatContent').appendChild(messageElement);
}
