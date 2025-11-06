// Level 2.5: Cuộc Chiến Nhân Tài

document.addEventListener('DOMContentLoaded', function() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        gameEngine = new GameEngine();
        gameEngine.loadState(JSON.parse(savedState));
    } else {
        gameEngine = new GameEngine();
    }
    
    initCanvas();
    startLevel25();
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

const level25Events = [
    {
        id: 'talent_war',
        title: 'Cuộc Chiến Nhân Tài',
        description: 'Gã Khổng Lồ đang săn trộm nhân tài của bạn với những lời đề nghị hấp dẫn. Bạn phải hành động để giữ chân đội ngũ...',
        choices: [
            {
                title: '🚫 Không Hành Động',
                description: 'Tin tưởng vào lòng trung thành tự nhiên của nhân viên và không thực hiện bất kỳ biện pháp nào để giữ chân họ.',
                effects: {
                    gameOver: true,
                    gameOverReason: 'Bạn đã mất nhân tài cốt lõi. Startup không thể tiếp tục. GAME OVER.'
                },
                class: ''
            },
            {
                title: '❤️ Văn Hóa & ESOP',
                description: 'Xây dựng môi trường làm việc tích cực và chia sẻ quyền sở hữu công ty với nhân viên thông qua chương trình cổ phần.',
                effects: {
                    runway: -3,
                    morale: 20,
                    progress: 18,
                    awareness: 3
                },
                class: ''
            },
            {
                title: '📋 Cấm Cạnh Tranh',
                description: 'Ký hợp đồng lao động với điều khoản cấm cạnh tranh nghiêm ngặt để bảo vệ tài sản trí tuệ và bí mật kinh doanh.',
                effects: {
                    runway: -1,
                    morale: -15,
                    progress: 5,
                    awareness: 0
                },
                class: ''
            },
            {
                title: '⚖️ Ràng Buộc Pháp Lý',
                description: 'Tăng cường các điều khoản pháp lý trong hợp đồng lao động để đảm bảo tính bảo mật và lòng trung thành của nhân viên.',
                effects: {
                    runway: 0,
                    morale: -25,
                    progress: 5,
                    darkChoices: 1
                },
                class: ''
            }
        ]
    }
];

function startLevel25() {
    // Shuffle choices before showing
    const event = {...level25Events[0]};
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
        
        const effects = choice.effects;
        if (effects) {
            html += '<div class="choice-effects">';
            if (effects.runway !== undefined && effects.runway !== 0) {
                const cls = effects.runway > 0 ? 'positive' : 'negative';
                html += `<div class="effect-badge ${cls}">💰 Vốn: ${effects.runway > 0 ? '+' : ''}${effects.runway} tháng</div>`;
            }
            if (effects.morale !== undefined && effects.morale !== 0) {
                const cls = effects.morale > 0 ? 'positive' : 'negative';
                html += `<div class="effect-badge ${cls}">🔥 Năng lượng: ${effects.morale > 0 ? '+' : ''}${effects.morale}%</div>`;
            }
            if (effects.progress !== undefined && effects.progress !== 0) {
                const cls = effects.progress > 0 ? 'positive' : 'negative';
                html += `<div class="effect-badge ${cls}">📈 Tiến độ: ${effects.progress > 0 ? '+' : ''}${effects.progress}%</div>`;
            }
            html += '</div>';
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
    
    try {
        // Lưu trạng thái trước khi áp dụng hiệu ứng
        gameEngine.saveGameState();

        const logMessages = gameEngine.applyEffects(choice.effects);
        if (gameEngine.gameOver) return;
        
        // Update UI after applying effects
        gameEngine.updateUI();
        
        // Save state
        localStorage.setItem('gameState', JSON.stringify(gameEngine.getState()));
        
        // Save runway before decreasing (for Back button restoration)
        gameEngine.previousRunway = gameEngine.runway;
        gameEngine.previousLevel = gameEngine.currentLevel;
        
        // Auto decrease runway (Burn Rate theo cấp độ)
        gameEngine.currentLevel = 2.5;
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
        
        // Check for internal conflict event
        if (gameEngine.morale < 50) {
            setTimeout(() => {
                window.location.href = 'event-internal-conflict.html';
            }, 2000);
        } else {
            setTimeout(() => {
                window.location.href = 'level3.html';
            }, 2000);
        }
    } catch (error) {
        console.error('Error in makeChoice:', error);
        alert('Đã xảy ra lỗi: ' + error.message);
    }
}

