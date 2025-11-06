// Level 0: Khởi Đầu

document.addEventListener('DOMContentLoaded', function() {
    // Reset game state
    gameEngine = new GameEngine();
    localStorage.removeItem('gameState'); // Clear any previous state
    localStorage.setItem('gameState', JSON.stringify(gameEngine.getState()));
    
    initCanvas();
    startLevel0();
});

function initCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawBackground();
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    function drawBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.5, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

const level0Events = [
    {
        id: 'start',
        title: 'Bắt Đầu Hành Trình',
        description: 'Bạn đã có ý tưởng, một khát vọng thay đổi thế giới. Nhưng phía trước không phải là con đường trải hoa hồng. Đó là một mê cung, nơi mọi ngã rẽ đều bị Gã Khổng Lồ giám sát. Hắn kiểm soát dòng tiền. Hắn thao túng luật chơi. Hắn đợi bạn sai lầm. Bạn có đủ bản lĩnh để tìm ra lối thoát duy nhất?',
        choices: [
            {
                title: '🚀 Bắt Đầu',
                description: 'Bạn đã sẵn sàng. Bắt đầu hành trình tìm nguồn vốn...',
                effects: {
                    levelAdvance: true
                },
                class: ''
            }
        ]
    }
];

function startLevel0() {
    // Shuffle choices before showing
    const event = {...level0Events[0]};
    event.choices = shuffleArray(event.choices);
    showEvent(event);
}

function showEvent(event) {
    const eventTitle = document.getElementById('eventTitle');
    const eventDescription = document.getElementById('eventDescription');
    const choicesContainer = document.getElementById('choicesContainer');
    
    eventTitle.textContent = event.title;
    eventDescription.textContent = event.description;
    choicesContainer.innerHTML = '';
    
    event.choices.forEach((choice) => {
        const choiceCard = document.createElement('div');
        choiceCard.className = `choice-card ${choice.class}`;
        
        let html = `
            <div class="choice-title">${choice.title}</div>
            <div class="choice-description">${choice.description}</div>
        `;
        
        if (choice.warning) {
            html += `<div style="color: #ff4444; font-weight: 700; margin-top: 0.5rem;">${choice.warning}</div>`;
        }
        
        choiceCard.innerHTML = html;
        choiceCard.addEventListener('click', () => {
            if (gameEngine.gameOver || gameEngine.victory) return;
            makeChoice(choice, event);
        });
        
        choicesContainer.appendChild(choiceCard);
    });
}

function makeChoice(choice, event) {
    if (gameEngine.gameOver || gameEngine.victory) return;
    
    // Lưu trạng thái trước khi áp dụng hiệu ứng
    gameEngine.saveGameState();

    const logMessages = gameEngine.applyEffects(choice.effects);
    if (gameEngine.gameOver) return;
    
    // Save state
    localStorage.setItem('gameState', JSON.stringify(gameEngine.getState()));
    
    // Move to Level 1
    setTimeout(() => {
        window.location.href = 'level1.html';
    }, 1000);
}




