// 이벤트 리스너: 'Send' 버튼 클릭 시 메시지 전송
document.getElementById('send-button').addEventListener('click', sendMessage);

// 이벤트 리스너: Enter 키 입력 시 메시지 전송
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // 기본 Enter 동작 방지
        sendMessage();
    }
});

// textarea 높이 자동 조절
document.getElementById('user-input').addEventListener('input', function () {
    const lineHeight = parseFloat(getComputedStyle(this).lineHeight);
    const padding = parseFloat(getComputedStyle(this).paddingTop) + parseFloat(getComputedStyle(this).paddingBottom);
    this.style.height = '2.25em'; // 초기 높이로 설정
    if (this.scrollHeight > this.clientHeight) {
        this.style.height = Math.min((this.scrollHeight - padding) / lineHeight, 10 * 1.4) + 'em'; // 최대 높이 설정, line-height 1.4를 곱하여 em 단위로 조정
    }
});

// 사용자가 입력한 메시지를 처리하고 API로 전송하는 함수
function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    // 사용자 메시지를 채팅 박스에 추가
    appendMessage('user', userInput);
    document.getElementById('user-input').value = '';
    document.getElementById('user-input').style.height = '2.25em'; // 초기 높이로 재설정

    // 타이핑 인디케이터 추가
    appendTypingIndicator();

    console.log('Sending message to backend:', userInput);

    // 백엔드 서버에 메시지를 전송하여 ChatGPT 응답 요청
    fetch('http://localhost:3000/chatbot/message', { // URL 수정
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Received response from backend:', data);
        // 타이핑 인디케이터 제거
        removeTypingIndicator();
        // 백엔드 서버로부터 받은 ChatGPT 응답을 채팅 박스에 추가
        appendMessage('bot', data.response);
    })
    .catch(error => {
        console.error('Error:', error);
        // 타이핑 인디케이터 제거
        removeTypingIndicator();
    });
}

// 채팅 박스에 메시지를 추가하는 함수
function appendMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    const bubbleElement = document.createElement('div');
    bubbleElement.classList.add('bubble');
    bubbleElement.textContent = message;
    messageElement.appendChild(bubbleElement);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // 스크롤을 맨 아래로 이동
}

// 타이핑 인디케이터 추가 함수
function appendTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot', 'typing-indicator');
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight; // 스크롤을 맨 아래로 이동
}

// 타이핑 인디케이터 제거 함수
function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}
