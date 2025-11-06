// Event: Technical Debt

document.addEventListener('DOMContentLoaded', function() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        gameEngine = new GameEngine();
        gameEngine.loadState(JSON.parse(savedState));
    } else {
        gameEngine = new GameEngine();
        gameEngine.technicalDebt = true;
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
        gradient.addColorStop(0, '#1a0a0a');
        gradient.addColorStop(0.5, '#2e1a1a');
        gradient.addColorStop(1, '#3e1616');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

const technicalDebtEvent = {
    id: 'technical_debt',
    title: 'Nợ Kỹ Thuật Đã Bùng Nổ',
    description: 'Sản phẩm ra mắt nhanh đã để lại những vấn đề kỹ thuật nghiêm trọng. Hệ thống đang gặp sự cố, khách hàng phàn nàn, và bạn phải đối mặt với hậu quả. Bạn sẽ làm gì?',
    choices: [
        {
            title: '✅ Thú Nhận & Sửa Chữa',
            description: 'Công khai thừa nhận vấn đề với khách hàng và nhà đầu tư, sau đó đầu tư nguồn lực để giải quyết triệt để các lỗi kỹ thuật.',
            effects: {
                runway: -5,
                morale: 12, // Lựa chọn minh bạch/đạo đức dũng cảm: +12%
                progress: -8,
                technicalDebt: false,
                survivalPoints: 18 // Vượt qua khủng hoảng: +18 điểm
            },
            class: ''
        },
        {
            title: '🤐 Xử Lý Nội Bộ',
            description: 'Tập trung xử lý vấn đề một cách kín đáo trong nội bộ, tránh gây ảnh hưởng đến danh tiếng và niềm tin của khách hàng.',
            effects: {
                runway: -1,
                // Morale sẽ tự động -25% từ darkChoices logic
                darkChoices: 1,
                risk: 0.25,
                riskFailure: {
                    gameOver: true,
                    gameOverReason: 'Bí mật bị lộ. Khách hàng và nhà đầu tư mất niềm tin hoàn toàn. GAME OVER.'
                }
                // Survival Points: -18 sẽ tự động từ darkChoices logic
            },
            class: ''
        }
    ]
};

function startEvent() {
    // Shuffle choices before showing
    const event = {...technicalDebtEvent};
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
            
            if (effects.technicalDebt === false) {
                html += `<div class="effect-badge positive">✅ Nợ Kỹ Thuật: Đã giải quyết</div>`;
            }
            
            if (effects.darkChoices) {
                html += `<div class="effect-badge negative">⚠️ Điểm Hắc Ám: +${effects.darkChoices}</div>`;
            }
            
            if (effects.risk) {
                html += `<div class="effect-badge negative">⚠️ Rủi ro: ${(effects.risk * 100).toFixed(0)}%</div>`;
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
    
    // Lưu trạng thái trước khi áp dụng hiệu ứng
    gameEngine.saveGameState();

    const logMessages = gameEngine.applyEffects(choice.effects);
    if (gameEngine.gameOver) return;
    
    // Save state
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
    
    // Continue to next level
    setTimeout(() => {
        // Check if we should go to Level 2.5 or Level 3
        // This depends on the choice made in Level 2
        const savedState = JSON.parse(localStorage.getItem('gameState') || '{}');
        if (savedState.skipLevel25) {
            window.location.href = 'level3.html';
        } else {
            window.location.href = 'level2-5.html';
        }
    }, 2000);
}

