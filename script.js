const backendUrl = 'https://port-0-unsad-unsaid-back-lyt7bu192d19b53c.sel4.cloudtype.app';

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
document.getElementById('user-input').addEventListener('input', function() {
    const textarea = this;
    textarea.style.height = 'auto';  // 높이 자동 초기화
    textarea.style.height = `${textarea.scrollHeight}px`;  // 내용에 맞게 높이 조절

    const maxLines = 4;  // 최대 4줄까지 허용
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
    const maxHeight = lineHeight * maxLines;
    if (textarea.scrollHeight > maxHeight) {
        textarea.style.overflowY = 'scroll';  // 스크롤 활성화
        textarea.style.height = `${maxHeight}px`;  // 최대 높이 설정
    } else {
        textarea.style.overflowY = 'hidden';  // 스크롤 비활성화
    }
});

// 사용자가 입력한 메시지를 처리하고 API로 전송하는 함수
function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'click_send_button',
        user_message: userInput
    });


    // 사용자 메시지를 채팅 박스에 추가
    appendMessage('user', userInput);
    document.getElementById('user-input').value = '';
    document.getElementById('user-input').style.height = '2.25em'; // 초기 높이로 재설정

    // 타이핑 인디케이터 추가
    appendTypingIndicator();

    // 백엔드 서버에 메시지를 전송하여 ChatGPT 응답 요청
    fetch(`${backendUrl}/chatbot/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
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
