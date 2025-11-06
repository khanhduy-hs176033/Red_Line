// Level 3.5: Lời Đề Nghị Mua Lại

document.addEventListener('DOMContentLoaded', function() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        gameEngine = new GameEngine();
        gameEngine.loadState(JSON.parse(savedState));
    } else {
        gameEngine = new GameEngine();
    }
    
    initCanvas();
    startLevel35();
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
        gradient.addColorStop(1, '#3e2a2a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function getLevel35Event() {
    // Check if darkChoices >= 2 for special content
    if (gameEngine.darkChoices >= 2) {
        return {
            id: 'acquisition_special',
            title: '🧭 NGÃ RẼ 3.5: LỜI ĐỀ NGHỊ... KHÔNG CÒN THÂN THIỆN',
            description: 'Tiếng chuông điện thoại reo. Là Gã Khổng Lồ.\n\n"Ta đã thấy cách ngươi thâu tóm nhà cung cấp, cách ngươi xử lý nhân viên... Ngươi không giống những kẻ khởi nghiệp khác. Ngươi giống ta."\n\n"Ta sẽ hỏi một lần duy nhất. Bán công ty cho ta, hoặc bị nghiền nát."',
            choices: [
                {
                    title: '💰 Bán Đứt Công Ty',
                    description: 'Chấp nhận bán công ty và nhận tiền.',
                    effects: {
                        gameOver: true,
                        gameOverReason: 'Bạn đã bán công ty. Bạn trở thành "Lồng Vàng" - giàu có nhưng mất tự do. Một Kẻ Kế Vị không bao giờ chấp nhận cái lồng. GAME OVER.'
                    },
                    class: ''
                },
                {
                    title: '🤝 Sáp Nhập',
                    description: 'Chấp nhận sáp nhập với Gã Khổng Lồ.',
                    effects: {
                        gameOver: true,
                        gameOverReason: 'Bạn đã sáp nhập. Bạn trở thành "Con Rối" - mất quyền kiểm soát. Một Kẻ Kế Vị không bao giờ làm con rối. GAME OVER.'
                    },
                    class: ''
                },
                {
                    title: '🛡️ "Ngươi Không Đủ Tư Cách."',
                    description: 'Từ chối thẳng thừng và tuyên chiến.',
                    effects: {
                        runway: -3,
                        morale: 10, // Từ chối Gã Khổng Lồ thể hiện quyết tâm, tăng Morale
                        progress: 5,
                        survivalPoints: 20 // Giữ vững đạo đức: +20 điểm
                    },
                    class: ''
                }
            ]
        };
    } else {
        return {
            id: 'acquisition',
            title: 'Lời Đề Nghị Mua Lại',
            description: 'Gã Khổng Lồ đưa ra lời đề nghị mua lại công ty của bạn với một số tiền khổng lồ. Đây là thời điểm quyết định...',
            choices: [
            {
                title: '💰 Bán Đứt',
                description: 'Chấp nhận bán công ty và nhận tiền.',
                effects: {
                    gameOver: true,
                    gameOverReason: 'Bạn đã bán công ty. Bạn trở thành "Lồng Vàng" - giàu có nhưng mất tự do. GAME OVER.'
                },
                class: 'dangerous'
            },
            {
                title: '🤝 Sáp Nhập',
                description: 'Chấp nhận sáp nhập với Gã Khổng Lồ.',
                effects: {
                    gameOver: true,
                    gameOverReason: 'Bạn đã sáp nhập. Bạn trở thành "Con Rối" - mất quyền kiểm soát. GAME OVER.'
                },
                class: 'dangerous'
            },
                {
                    title: '❌ Từ Chối Thẳng Thừng',
                    description: 'Từ chối đề nghị và tiếp tục chiến đấu.',
                    effects: {
                        runway: -3,
                        morale: 10, // Từ chối Gã Khổng Lồ thể hiện quyết tâm, tăng Morale
                        progress: 5,
                        survivalPoints: 20 // Giữ vững đạo đức: +20 điểm
                    },
                    class: ''
                }
            ]
        };
    }
}

function startLevel35() {
    const event = getLevel35Event();
    // Shuffle choices before showing
    const eventShuffled = {...event};
    eventShuffled.choices = shuffleArray(eventShuffled.choices);
    showEvent(eventShuffled);
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
    
    // If rejected, check darkChoices to determine next level
    if (choice.title.includes('Từ Chối') || choice.title.includes('Ngươi Không Đủ')) {
        // Save runway before decreasing (for Back button restoration)
        gameEngine.previousRunway = gameEngine.runway;
        gameEngine.previousLevel = gameEngine.currentLevel; // Save current level (3.5) as previous
        
        // Auto decrease runway (Burn Rate theo cấp độ)
        gameEngine.currentLevel = 3.5;
        const burnRate = gameEngine.getBurnRateByLevel();
        gameEngine.runway = Math.max(0, gameEngine.runway - burnRate);
        gameEngine.updateUI();
        
        // Check game state after decreasing runway
        gameEngine.checkGameState();
        if (gameEngine.gameOver) return;
        
        // Evaluate level performance and adjust Survival Points
        gameEngine.evaluateLevelPerformance();
        gameEngine.updateUI();
        
        // Save state với thông tin cập nhật trước khi chuyển cấp
        localStorage.setItem('gameState', JSON.stringify(gameEngine.getState()));

        // Check darkChoices
        if (gameEngine.darkChoices >= 2) {
            // Go to cutscene first, then boss battle
            setTimeout(() => {
                window.location.href = 'level4-battle.html';
            }, 2000);
        } else {
            // Government path
            setTimeout(() => {
                window.location.href = 'level4-government.html';
            }, 2000);
        }
    } else {
        // Other choices (sell/merge) lead to game over
        localStorage.setItem('gameState', JSON.stringify(gameEngine.getState()));
    }
}

function showBossBattleIntro() {
    const eventTitle = document.getElementById('eventTitle');
    const eventDescription = document.getElementById('eventDescription');
    const choicesContainer = document.getElementById('choicesContainer');
    
    eventTitle.textContent = '🔥 CUỘC CHIẾN KẾ VỊ BẮT ĐẦU';
    eventDescription.textContent = 'Gã Khổng Lồ cười lớn qua điện thoại.\n\n"Rất tốt. Vậy thì chiến tranh đi."\n\n"Mê cung này không đủ chỗ cho cả hai chúng ta."\n\n"Ta sẽ không dùng Chính phủ. Đây là cuộc chiến giữa ta và ngươi."';
    choicesContainer.innerHTML = '';
    
    const continueBtn = document.createElement('div');
    continueBtn.className = 'choice-card';
    continueBtn.innerHTML = '<div class="choice-title">⚔️ Bắt Đầu Cuộc Chiến</div><div class="choice-description">Bạn đã sẵn sàng cho trận đấu cuối cùng...</div>';
    continueBtn.addEventListener('click', () => {
        setTimeout(() => {
            window.location.href = 'level4-boss.html';
        }, 500);
    });
    choicesContainer.appendChild(continueBtn);
}

