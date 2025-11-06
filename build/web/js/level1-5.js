// Level 1.5: Chiến Lược Sản Phẩm

document.addEventListener('DOMContentLoaded', function() {
    // Load game state from previous level
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        gameEngine = new GameEngine();
        gameEngine.loadState(JSON.parse(savedState));
    } else {
        gameEngine = new GameEngine();
    }
    
    initCanvas();
    startLevel15();
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

const level15Events = [
    {
        id: 'product_strategy',
        title: 'Ngã Rẽ 1.5: Chiến Lược Sản Phẩm',
        description: 'Bạn đã có vốn. Bây giờ là lúc phát triển sản phẩm. Bạn sẽ chọn tốc độ hay chất lượng? Mỗi lựa chọn đều có hậu quả riêng...',
        choices: [
            {
                title: '⚡ Ra Mắt Nhanh',
                description: 'Ưu tiên tốc độ để đưa sản phẩm ra thị trường sớm nhất, chiếm lợi thế đi trước và thu thập phản hồi từ người dùng thực tế.',
                effects: {
                    runway: -1,
                    morale: -8, // Quyết định ngắn hạn: -8%
                    progress: 12,
                    awareness: 8,
                    technicalDebt: true
                    // Survival Points: -8 sẽ tự động từ technicalDebt
                },
                class: ''
            },
            {
                title: '✨ Hoàn Thiện Sản Phẩm',
                description: 'Đầu tư thời gian và tài nguyên để phát triển sản phẩm với chất lượng cao nhất trước khi ra mắt, xây dựng nền tảng vững chắc.',
                effects: {
                    runway: -3,
                    morale: 12, // Quyết định chiến lược đúng: +12%
                    progress: 8,
                    awareness: 25,
                    survivalPoints: 12 // Quyết định chiến lược đúng: +12 điểm
                },
                class: ''
            }
        ]
    }
];

let currentEventIndex = 0;

function startLevel15() {
    // Shuffle choices before showing
    const event = {...level15Events[0]};
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
            
            if (effects.awareness !== undefined && effects.awareness !== 0) {
                const cls = effects.awareness > 0 ? 'neutral' : 'negative';
                html += `<div class="effect-badge ${cls}">👁️ Cảnh giác: ${effects.awareness > 0 ? '+' : ''}${effects.awareness}%</div>`;
            }
            
            if (effects.technicalDebt) {
                html += `<div class="effect-badge negative">⚠️ Nợ Kỹ Thuật: Kích hoạt</div>`;
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
    gameEngine.currentLevel = 1.5;
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
    
    // Move to Level 2
    setTimeout(() => {
        window.location.href = 'level2.html';
    }, 2000);
}

