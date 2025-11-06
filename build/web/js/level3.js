// Level 3: Nguồn Cung Ứng

document.addEventListener('DOMContentLoaded', function() {
    try {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            gameEngine = new GameEngine();
            const state = JSON.parse(savedState);
            gameEngine.loadState(state);
        } else {
            gameEngine = new GameEngine();
        }
        
        // Ensure gameEngine is properly initialized
        if (!gameEngine) {
            console.error('Failed to initialize gameEngine');
            gameEngine = new GameEngine();
        }
        
        initCanvas();
        startLevel3();
    } catch (error) {
        console.error('Error initializing Level 3:', error);
        // Fallback initialization
        gameEngine = new GameEngine();
        initCanvas();
        startLevel3();
    }
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

function getLevel3Choices() {
    // Ensure gameEngine is available
    if (!gameEngine) {
        console.error('gameEngine not available in getLevel3Choices');
        return [];
    }
    
    const choices = [];
    
    // Check previous level choice to determine available options
    // Default choices (from advertising or other)
    choices.push(
        {
            title: '🏭 Tự Sản Xuất',
            description: 'Xây dựng nhà máy sản xuất riêng để kiểm soát toàn bộ quy trình và đảm bảo chất lượng nguyên liệu.',
            effects: {
                runway: -4,
                morale: -8, // Lựa chọn sai lầm nhỏ: -8%
                progress: 22,
                survivalPoints: -3 // Bị động: -3 điểm
            },
            class: ''
        },
        {
            title: '💼 Mua Từ Nhà Cung Cấp Lớn',
            description: 'Hợp tác với nhà cung cấp lớn nhất trên thị trường để có được giá cả cạnh tranh và nguồn cung ổn định.',
            effects: {
                gameOver: true,
                gameOverReason: 'Phụ thuộc vào Gã Khổng Lồ. Bạn đã thua. GAME OVER.'
            },
                class: ''
        },
        {
            title: '🌍 Nhập Khẩu',
            description: 'Tìm kiếm nguồn nguyên liệu từ các thị trường quốc tế để đa dạng hóa nhà cung cấp và tận dụng giá cả cạnh tranh.',
            effects: {
                runway: -2,
                morale: 5, // Lựa chọn tốt bình thường: +5%
                progress: 10,
                risk: 0.25,
                riskFailure: {
                    runway: -5,
                    morale: -10
                },
                survivalPoints: 5 // Lựa chọn tốt: +5 điểm
            },
            class: ''
        },
        {
            title: '🤝 Thương Lượng',
            description: 'Thương lượng trực tiếp với các nhà cung cấp hiện tại để tìm giải pháp hợp tác dựa trên lợi ích chung.',
            effects: {
                // Logic depends on awareness
                negotiate: true
            },
            class: ''
        }
    );
    
    // Add "Thâu tóm" option if awareness >= 30%
    if (gameEngine.awareness >= 30) {
        choices.push({
            title: '💣 Thâu Tóm Nhà Cung Cấp',
            description: 'Mua lại hoặc sáp nhập với các nhà cung cấp nhỏ để kiểm soát toàn bộ chuỗi cung ứng và giảm phụ thuộc vào bên ngoài.',
            effects: {
                runway: -3,
                morale: -25, // Đã set rõ ràng -25% cho dark choice
                progress: 12,
                darkChoices: 1,
                survivalPoints: -18 // Lựa chọn Hắc Ám: -18 điểm
            },
                class: ''
        });
    }
    
    return choices;
}

const level3Events = [
    {
        id: 'supply',
        title: 'Cấp 3: Nguồn Cung Ứng',
        description: 'Gã Khổng Lồ đang chặn nguồn nguyên liệu của bạn. Bạn phải tìm cách khác để có nguyên liệu...',
        choices: [] // Will be populated in startLevel3
    }
];

function startLevel3() {
    // Ensure gameEngine is initialized
    if (!gameEngine) {
        console.error('GameEngine not initialized');
        return;
    }
    
    // Update choices based on current state
    try {
        level3Events[0].choices = getLevel3Choices();
        // Shuffle choices before showing
        const event = {...level3Events[0]};
        event.choices = shuffleArray(event.choices);
        showEvent(event);
    } catch (error) {
        console.error('Error in startLevel3:', error);
        // Fallback: show basic choices
        level3Events[0].choices = [
            {
                title: '🏭 Tự Sản Xuất',
                description: 'Tự sản xuất nguyên liệu để độc lập.',
                effects: {
                    runway: -5,
                    morale: -10,
                    progress: 25
                },
                class: ''
            },
            {
                title: '🌍 Nhập Khẩu',
                description: 'Nhập khẩu nguyên liệu từ nước ngoài.',
                effects: {
                    runway: -3,
                    morale: 5,
                    progress: 10
                },
                class: ''
            }
        ];
        showEvent(level3Events[0]);
    }
}

function showEvent(event) {
    try {
        const eventTitleEl = document.getElementById('eventTitle');
        const eventDescriptionEl = document.getElementById('eventDescription');
        const choicesContainer = document.getElementById('choicesContainer');
        
        if (!eventTitleEl || !eventDescriptionEl || !choicesContainer) {
            console.error('Required DOM elements not found');
            return;
        }
        
        eventTitleEl.textContent = event.title || 'Cấp 3: Nguồn Cung Ứng';
        eventDescriptionEl.textContent = event.description || 'Gã Khổng Lồ đang chặn nguồn nguyên liệu của bạn...';
        choicesContainer.innerHTML = '';
        
        // Ensure choices array exists and is not empty
        if (!event.choices || event.choices.length === 0) {
            console.warn('No choices available, using fallback');
            event.choices = [
                {
                    title: '🏭 Tự Sản Xuất',
                    description: 'Tự sản xuất nguyên liệu để độc lập.',
                    effects: {
                        runway: -5,
                        morale: -10,
                        progress: 25
                    },
                    class: ''
                }
            ];
        }
        
        event.choices.forEach((choice) => {
            const choiceCard = document.createElement('div');
            choiceCard.className = `choice-card ${choice.class || ''}`;
            
            let html = `<div class="choice-title">${choice.title}</div><div class="choice-description">${choice.description}</div>`;
            // Removed warning display - no visual cues
            
            choiceCard.innerHTML = html;
            choiceCard.addEventListener('click', () => {
                if (!gameEngine || gameEngine.gameOver || gameEngine.victory) return;
                makeChoice(choice, event);
            });
            choicesContainer.appendChild(choiceCard);
        });
    } catch (error) {
        console.error('Error in showEvent:', error);
    }
}

function makeChoice(choice, event) {
    if (gameEngine.gameOver || gameEngine.victory) return;
    
    let actionPerformed = false;
    
    // Handle negotiate logic
    if (choice.effects.negotiate) {
        if (gameEngine.awareness < 30) {
            // Negotiation succeeds
            gameEngine.saveGameState();
            actionPerformed = true;
            gameEngine.applyEffects({
                runway: 0,
                morale: 5, // Lựa chọn tốt bình thường: +5%
                progress: 10,
                survivalPoints: 5 // Lựa chọn tốt: +5 điểm
            });
        } else {
            // GĐQ phát hiện - show sub-choices
            showNegotiateSubChoices();
            return;
        }
    } else {
        gameEngine.saveGameState();
        actionPerformed = true;
        const logMessages = gameEngine.applyEffects(choice.effects);
        if (gameEngine.gameOver) return;
    }

    if (!actionPerformed) {
        return;
    }
    
    localStorage.setItem('gameState', JSON.stringify(gameEngine.getState()));
    
    // Save runway before decreasing (for Back button restoration)
    gameEngine.previousRunway = gameEngine.runway;
    gameEngine.previousLevel = gameEngine.currentLevel;
    
    // Auto decrease runway (Burn Rate theo cấp độ)
    gameEngine.currentLevel = 3;
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
    
    // Check if progress > 50% for scaling crisis
    if (gameEngine.progress > 50) {
        setTimeout(() => {
            window.location.href = 'level3-2.html';
        }, 2000);
    } else {
        setTimeout(() => {
            window.location.href = 'level3-5.html';
        }, 2000);
    }
}

function showNegotiateSubChoices() {
    const eventTitle = document.getElementById('eventTitle');
    const eventDescription = document.getElementById('eventDescription');
    const choicesContainer = document.getElementById('choicesContainer');
    
    eventTitle.textContent = 'GĐQ Phát Hiện';
    eventDescription.textContent = 'Gã Khổng Lồ phát hiện bạn đang thương lượng. Hắn đe dọa bạn...';
    
    choicesContainer.innerHTML = '';
    
    const subChoices = [
        {
            title: '⚖️ Kiện',
            description: 'Kiện GĐQ ra tòa.',
            effects: {
                runway: -1,
                morale: 10, // Lựa chọn tốt: +10% (có thể coi là minh bạch)
                progress: 15,
                survivalPoints: 20 // Vượt qua khủng hoảng: +20 điểm
            },
            class: ''
        },
        {
            title: '🏳️ Bỏ Cuộc',
            description: 'Bỏ cuộc và chấp nhận thất bại.',
            effects: {
                gameOver: true,
                gameOverReason: 'Bạn đã bỏ cuộc. GAME OVER.'
            },
                class: ''
        },
        {
            title: '💣 Thâu Tóm (Hắc Ám)',
            description: 'Sử dụng thủ đoạn để phản đòn.',
            effects: {
                runway: -3,
                morale: -25, // Đã set rõ ràng -25% cho dark choice
                progress: 12,
                darkChoices: 1,
                survivalPoints: -18 // Lựa chọn Hắc Ám: -18 điểm
            },
                class: ''
        }
    ];
    
    subChoices.forEach((choice) => {
        const choiceCard = document.createElement('div');
        choiceCard.className = `choice-card ${choice.class}`;
        choiceCard.innerHTML = `<div class="choice-title">${choice.title}</div><div class="choice-description">${choice.description}</div>`;
        choiceCard.addEventListener('click', () => {
            if (gameEngine.gameOver || gameEngine.victory) return;
            makeChoice(choice, {choices: subChoices});
        });
        choicesContainer.appendChild(choiceCard);
    });
}

