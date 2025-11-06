// Level 2: Chiến Lược Bán Hàng

document.addEventListener('DOMContentLoaded', function() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        gameEngine = new GameEngine();
        gameEngine.loadState(JSON.parse(savedState));
    } else {
        gameEngine = new GameEngine();
    }
    
    initCanvas();
    startLevel2();
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

const level2Events = [
    {
        id: 'sales_strategy',
        title: 'Chiến Lược Bán Hàng',
        description: 'Sản phẩm đã sẵn sàng. Bây giờ bạn cần quyết định cách tiếp cận thị trường. Mỗi chiến lược đều có rủi ro riêng...',
        choices: [
            {
                title: '🏷️ Chiến Lược Giá Thấp',
                description: 'Thâm nhập thị trường nhanh chóng bằng mức giá cực kỳ cạnh tranh để thu hút lượng lớn người dùng ban đầu.',
                effects: {
                    gameOver: true,
                    gameOverReason: 'Giảm giá quá mức đã khiến bạn thua lỗ nghiêm trọng. Không thể phục hồi. GAME OVER.'
                },
                class: ''
            },
            {
                title: '🎯 Thị Trường Ngách',
                description: 'Tập trung vào một phân khúc khách hàng cụ thể với nhu cầu đặc biệt, xây dựng vị thế vững chắc trước khi mở rộng.',
                effects: {
                    runway: -1,
                    morale: 8, // Lựa chọn tốt bình thường: +8%
                    progress: 18,
                    awareness: 8,
                    niche: true,
                    survivalPoints: 12 // Quyết định chiến lược đúng: +12 điểm
                },
                class: ''
            },
            {
                title: '📢 Quảng Cáo',
                description: 'Tăng cường độ nhận diện thương hiệu thông qua các chiến dịch marketing lớn trên nhiều kênh truyền thông.',
                effects: {
                    runway: -5,
                    morale: -8, // Rủi ro cao: -8%
                    progress: 22,
                    awareness: 35,
                    risk: 0.25,
                    riskFailure: {
                        runway: -4,
                        morale: -10
                    },
                    survivalPoints: -3 // Rủi ro cao: -3 điểm
                },
                class: ''
            },
            {
                title: '⭐ Chất Lượng',
                description: 'Đầu tư vào việc hoàn thiện sản phẩm và dịch vụ, xây dựng danh tiếng dựa trên trải nghiệm người dùng xuất sắc.',
                effects: {
                    runway: -3,
                    morale: 8, // Lựa chọn tốt bình thường: +8%
                    progress: 15,
                    awareness: 20,
                    quality: true,
                    skipLevel25: true,
                    survivalPoints: 10 // Quyết định tốt: +10 điểm
                },
                class: ''
            }
        ]
    }
];

let currentEventIndex = 0;

function startLevel2() {
    // Shuffle choices before showing
    const event = {...level2Events[0]};
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
            
            if (effects.skipLevel25) {
                html += `<div class="effect-badge neutral">⚡ Bỏ qua Cấp 2.5</div>`;
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
    gameEngine.currentLevel = 2;
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
    
    // Check if technical debt event should trigger
    if (gameEngine.technicalDebt) {
        setTimeout(() => {
            window.location.href = 'event-technical-debt.html';
        }, 2000);
    } else if (choice.effects.skipLevel25) {
        // Skip to Level 3
        setTimeout(() => {
            window.location.href = 'level3.html';
        }, 2000);
    } else {
        // Go to Level 2.5
        setTimeout(() => {
            window.location.href = 'level2-5.html';
        }, 2000);
    }
}

