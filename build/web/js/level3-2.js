// Level 3.2: Khủng Hoảng Mở Rộng

document.addEventListener('DOMContentLoaded', function() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        gameEngine = new GameEngine();
        gameEngine.loadState(JSON.parse(savedState));
    } else {
        gameEngine = new GameEngine();
    }
    
    initCanvas();
    startLevel32();
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
        gradient.addColorStop(0, '#2a1a0a');
        gradient.addColorStop(0.5, '#3e2a1a');
        gradient.addColorStop(1, '#4e3a2a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

const level32Events = [
    {
        id: 'scaling_crisis',
        title: 'Cấp 3.2: Khủng Hoảng Mở Rộng',
        description: 'Bạn đã phát triển quá nhanh. Hệ thống không thể theo kịp. Nhu cầu tăng vọt, nhưng cơ sở hạ tầng của bạn chưa sẵn sàng. Bạn phải quyết định: nâng cấp hệ thống hay tìm giải pháp nhanh chóng...',
        choices: [
            {
                title: '🔧 Nâng Cấp Hệ Thống',
                description: 'Đầu tư vào nâng cấp cơ sở hạ tầng để đáp ứng nhu cầu tăng trưởng.',
                effects: {
                    runway: -5,
                    morale: -3,
                    progress: -8
                },
                class: ''
            },
            {
                title: '💼 Thuê Dịch Vụ Cloud',
                description: 'Chuyển sang sử dụng dịch vụ cloud từ nhà cung cấp hàng đầu để giải quyết nhanh chóng vấn đề về hạ tầng với chi phí thấp.',
                effects: {
                    runway: -1,
                    morale: 10,
                    progress: 15,
                    awareness: 100
                },
                class: ''
            },
            {
                title: '⏸️ Tạm Dừng Mở Rộng',
                description: 'Tạm dừng mở rộng để tập trung vào cải thiện hệ thống hiện có.',
                effects: {
                    runway: -2,
                    morale: -8,
                    progress: -3
                },
                class: ''
            }
        ]
    }
];

function startLevel32() {
    // Shuffle choices before showing
    const event = {...level32Events[0]};
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
    
    // Lưu trạng thái trước khi áp dụng hiệu ứng
    gameEngine.saveGameState();
    
    const logMessages = gameEngine.applyEffects(choice.effects);
    if (gameEngine.gameOver) return;
    
    // Update UI
    gameEngine.updateUI();
    
    // Save state
    localStorage.setItem('gameState', JSON.stringify(gameEngine.getState()));
    
    // Save runway before decreasing (for Back button restoration)
    gameEngine.previousRunway = gameEngine.runway;
    gameEngine.previousLevel = gameEngine.currentLevel;
    
    // Auto decrease runway (Burn Rate theo cấp độ)
    gameEngine.currentLevel = 3.2;
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
    
    // Move to Level 3.5
    setTimeout(() => {
        window.location.href = 'level3-5.html';
    }, 2000);
}

