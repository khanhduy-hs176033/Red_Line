// Event: Internal Conflict

document.addEventListener('DOMContentLoaded', function() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        gameEngine = new GameEngine();
        gameEngine.loadState(JSON.parse(savedState));
    } else {
        gameEngine = new GameEngine();
    }
    
    initCanvas();
    startEvent();
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
        gradient.addColorStop(0, '#2e1a0a');
        gradient.addColorStop(0.5, '#3e2a1a');
        gradient.addColorStop(1, '#4e3a2a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

const internalConflictEvent = {
    id: 'internal_conflict',
    title: 'Xung Đột Nội Bộ',
    description: 'Năng lượng của đội ngũ đã xuống thấp. Mâu thuẫn nội bộ đang bùng nổ. Bạn phải quyết định cách giải quyết...',
    choices: [
        {
            title: '🤝 Dung Hòa',
            description: 'Tổ chức các buổi đối thoại để lắng nghe quan điểm của mọi bên và tìm giải pháp thỏa hiệp công bằng cho tất cả.',
            effects: {
                runway: -2,
                morale: 20,
                progress: -5
            },
            class: ''
        },
        {
            title: '⚡ Quyết Định Nhanh',
            description: 'Đưa ra quyết định dứt khoát và nhanh chóng để giải quyết mâu thuẫn, tránh kéo dài ảnh hưởng đến công việc.',
            effects: {
                runway: 0,
                morale: -40,
                darkChoices: 1
            },
            class: ''
        }
    ]
};

function startEvent() {
    // Shuffle choices before showing
    const event = {...internalConflictEvent};
    event.choices = shuffleArray(event.choices);
    showEvent(event);
}

function showEvent(event) {
    document.getElementById('eventTitle').textContent = event.title;
    document.getElementById('eventDescription').textContent = event.description;
    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = '';
    
    event.choices.forEach((choice) => {
        const choiceCard = document.createElement('div');
        choiceCard.className = `choice-card ${choice.class}`;
        
        let html = `<div class="choice-title">${choice.title}</div><div class="choice-description">${choice.description}</div>`;
        // Removed warning display - no visual cues
        
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
    const logMessages = gameEngine.applyEffects(choice.effects);
    if (gameEngine.gameOver) return;
    
    // Save state to history BEFORE making changes
    gameEngine.saveGameState();
    
    localStorage.setItem('gameState', JSON.stringify(gameEngine.getState()));
    
    // Save runway before decreasing (for Back button restoration)
    gameEngine.previousRunway = gameEngine.runway;
    gameEngine.previousLevel = gameEngine.currentLevel;
    
    // Auto decrease runway (Burn Rate theo cấp độ)
    // Event không thay đổi level, giữ nguyên level hiện tại
    const burnRate = gameEngine.getBurnRateByLevel();
    gameEngine.runway = Math.max(0, gameEngine.runway - burnRate);
    gameEngine.updateUI();
    
    // Check game state after decreasing runway
    gameEngine.checkGameState();
    if (gameEngine.gameOver) return;
    
    // Evaluate level performance and adjust Survival Points
    gameEngine.evaluateLevelPerformance();
    gameEngine.updateUI();
    
    // Save state again after evaluation
    localStorage.setItem('gameState', JSON.stringify(gameEngine.getState()));
    
    setTimeout(() => {
        window.location.href = 'level3.html';
    }, 2000);
}

