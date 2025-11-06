// Level 1: Ngã Rẽ Vốn (Capital)

document.addEventListener('DOMContentLoaded', function() {
    // Check if this is a fresh start (no saved state or from main menu)
    const savedState = localStorage.getItem('gameState');
    const fromMainMenu = sessionStorage.getItem('fromMainMenu');
    
    if (savedState && !fromMainMenu) {
        // Load existing state
        gameEngine = new GameEngine();
        gameEngine.loadState(JSON.parse(savedState));
    } else {
        // Fresh start - reset to initial values
        gameEngine = new GameEngine();
        gameEngine.runway = 24; // Vốn bắt đầu 24 tháng
        gameEngine.morale = 100;
        gameEngine.progress = 0; // Progress bắt đầu từ 0, tích lũy dần qua các cấp
        gameEngine.awareness = 0;
        gameEngine.survivalPoints = 100;
        gameEngine.darkChoices = 0;
        gameEngine.technicalDebt = false;
        gameEngine.updateUI();
        // Clear the flag
        sessionStorage.removeItem('fromMainMenu');
    }
    
    initCanvas();
    startLevel1();
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

// Nested events
const nestedEvents = {
    investor_negotiate: {
        id: 'investor_negotiate',
        title: 'Đàm Phán Với Nhà Đầu Tư',
        description: 'Nhà đầu tư yêu cầu 60% cổ phần. Bạn sẽ làm gì?',
        choices: [
            {
                title: '✅ Chấp Nhận 60% Cổ Phần',
                description: 'Chấp nhận đề nghị để có vốn.',
                effects: {
                    runway: 8,
                    morale: -15,
                    progress: 12,
                    awareness: 5
                },
                class: ''
            },
            {
                title: '❌ Từ Chối',
                description: 'Từ chối đề nghị và tìm cách khác.',
                effects: {
                    risk: 0.4,
                    riskFailure: {
                        gameOver: true,
                        gameOverReason: 'Không tìm được nhà đầu tư phù hợp. Startup không thể tiếp tục. GAME OVER.'
                    },
                    riskSuccess: {
                        runway: 4,
                        morale: -3,
                        progress: 8,
                        awareness: 3
                    }
                },
                class: 'dangerous'
            }
        ]
    },
    partnership_decision: {
        id: 'partnership_decision',
        title: 'Quyết Định Liên Doanh',
        description: 'Bạn cần quyết định về mối quan hệ đối tác.',
        choices: [
            {
                title: '🤝 Tiếp Tục Liên Doanh',
                description: 'Tiếp tục hợp tác với đối tác.',
                effects: {
                    risk: 0.35,
                    riskFailure: {
                        gameOver: true,
                        gameOverReason: 'Đối tác phản bội. Startup của bạn tan vỡ. GAME OVER.'
                    },
                    riskSuccess: {
                        runway: 5,
                        morale: -5,
                        progress: 10,
                        awareness: 5
                    }
                },
                class: 'dangerous'
            },
            {
                title: '🚪 Rút Lui',
                description: 'Rút lui khỏi liên doanh.',
                effects: {
                    risk: 0.4,
                    riskFailure: {
                        gameOver: true,
                        gameOverReason: 'Rút lui thất bại. Mâu thuẫn không thể giải quyết. GAME OVER.'
                    },
                    riskSuccess: {
                        runway: 2,
                        morale: -3,
                        progress: 6,
                        awareness: 2
                    }
                },
                class: ''
            }
        ]
    }
};

const level1Events = [
    {
        id: 'capital',
        title: 'Cấp 1: Ngã Rẽ Vốn',
        description: 'Bạn cần tiền để bắt đầu kinh doanh. Có nhiều con đường, nhưng mỗi con đường đều có giá của nó...',
        choices: [
            {
                title: '💰 Tự Có Vốn',
                description: 'Sử dụng tiền tiết kiệm và nguồn lực cá nhân.',
                effects: {
                    runway: 4,
                    morale: 5,
                    progress: 8,
                    awareness: 0
                },
                class: ''
            },
            {
                title: '🏦 Vay Ngân Hàng',
                description: 'Tiếp cận nguồn vốn truyền thống từ các ngân hàng với lãi suất cố định và thủ tục rõ ràng.',
                effects: {
                    risk: 0.5,
                    riskFailure: {
                        gameOver: true,
                        gameOverReason: 'Ngân hàng từ chối vì là sân sau của Gã Khổng Lồ. GAME OVER.'
                    },
                    riskSuccess: {
                        runway: 8,
                        morale: -10,
                        progress: 8,
                        awareness: 5
                    }
                },
                class: ''
            },
            {
                title: '📞 Gọi Vốn Nhà Đầu Tư',
                description: 'Tìm kiếm các nhà đầu tư thiên thần hoặc quỹ đầu tư mạo hiểm để có được khoản vốn lớn và kinh nghiệm.',
                effects: {
                    runway: 5,
                    morale: -5,
                    progress: 10,
                    awareness: 5,
                    nestedEvent: 'investor_negotiate'
                },
                class: ''
            },
            {
                title: '🤝 Liên Doanh',
                description: 'Hợp tác chiến lược với các công ty đối tác để chia sẻ tài nguyên và mở rộng thị trường nhanh chóng.',
                effects: {
                    runway: 6,
                    morale: -8,
                    progress: 12,
                    awareness: 8,
                    nestedEvent: 'partnership_decision'
                },
                class: ''
            }
        ]
    }
];

let currentEventIndex = 0;
let isNestedEvent = false;

function startLevel1() {
    // Shuffle choices before showing
    const event = {...level1Events[0]};
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
    
    // Lưu trạng thái trước khi áp dụng lựa chọn để hỗ trợ Back
    gameEngine.saveGameState();
    
    // Apply initial effects (but skip nested event trigger)
    const effectsToApply = {...choice.effects};
    delete effectsToApply.nestedEvent;
    const logMessages = gameEngine.applyEffects(effectsToApply);
    if (gameEngine.gameOver) return;
    
    // Check for nested event
    if (choice.effects.nestedEvent && nestedEvents[choice.effects.nestedEvent]) {
        setTimeout(() => {
            isNestedEvent = true;
            showNestedEvent(nestedEvents[choice.effects.nestedEvent]);
        }, 1500);
        return;
    }
    
    // No nested event - proceed normally
    proceedToNextLevel();
}

function showNestedEvent(nestedEvent) {
    const eventTitle = document.getElementById('eventTitle');
    const eventDescription = document.getElementById('eventDescription');
    const choicesContainer = document.getElementById('choicesContainer');
    
    eventTitle.textContent = nestedEvent.title;
    eventDescription.textContent = nestedEvent.description;
    choicesContainer.innerHTML = '';
    
    nestedEvent.choices.forEach((choice) => {
        const choiceCard = document.createElement('div');
        choiceCard.className = `choice-card ${choice.class}`;
        
        let html = `
            <div class="choice-title">${choice.title}</div>
            <div class="choice-description">${choice.description}</div>
        `;
        
        // Removed warning display - no visual cues
        
        choiceCard.innerHTML = html;
        choiceCard.addEventListener('click', () => {
            if (gameEngine.gameOver || gameEngine.victory) return;
            makeNestedChoice(choice, nestedEvent);
        });
        
        choicesContainer.appendChild(choiceCard);
    });
}

function makeNestedChoice(choice, nestedEvent) {
    if (gameEngine.gameOver || gameEngine.victory) return;
    
    isNestedEvent = false;
    
    // Lưu trạng thái trước khi áp dụng lựa chọn phụ
    gameEngine.saveGameState();
    
    // Handle risk-based choices
    if (choice.effects.risk !== undefined) {
        const roll = Math.random();
        if (roll < choice.effects.risk) {
            // Risk triggered - failure
            if (choice.effects.riskFailure) {
                gameEngine.applyEffects(choice.effects.riskFailure);
                if (gameEngine.gameOver) return;
            }
        } else {
            // Risk passed - success
            if (choice.effects.riskSuccess) {
                gameEngine.applyEffects(choice.effects.riskSuccess);
            }
        }
    } else {
        gameEngine.applyEffects(choice.effects);
    }
    
    if (gameEngine.gameOver) return;
    
    proceedToNextLevel();
}

function proceedToNextLevel() {
    // Save state to history BEFORE making changes
    gameEngine.saveGameState();
    
    // Save state
    localStorage.setItem('gameState', JSON.stringify(gameEngine.getState()));
    
    // Save runway before decreasing (for Back button restoration)
    gameEngine.previousRunway = gameEngine.runway;
    gameEngine.previousLevel = gameEngine.currentLevel;
    
    // Auto decrease runway (Burn Rate theo cấp độ)
    gameEngine.currentLevel = 1;
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
    
    // Move to Level 1.5
    setTimeout(() => {
        window.location.href = 'level1-5.html';
    }, 2000);
}
