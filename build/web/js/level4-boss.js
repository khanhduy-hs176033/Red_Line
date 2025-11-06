// Level 4: Boss Battle - Cuộc Chiến Kế Vị (Redesigned v2)

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - Starting Boss Battle initialization');
    
    try {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            gameEngine = new GameEngine();
            gameEngine.loadState(JSON.parse(savedState));
            // Keep the player's accumulated stats from previous levels
            gameEngine.updateUI();
            console.log('Game state loaded:', gameEngine.getState());
        } else {
            gameEngine = new GameEngine();
            gameEngine.updateUI();
            console.log('New game engine created');
        }
        
        // Initialize Boss Battle specific stats
        // Convert old Progress to Dominance (20% from 43% old progress)
        const oldProgress = gameEngine.progress || 0;
        const initialDominance = Math.floor(oldProgress * 0.46); // ~20% from 43%
        
        bossBattleState = {
            battleSurvivalPoints: 100, // HP trong trận đấu
            dominance: initialDominance, // Chuyển hóa từ Progress cũ
            darkChoicesInBattle: 0 // Track dark choices trong trận đấu
        };
        
        console.log('Boss Battle initialized:', bossBattleState);
        console.log('Game Engine stats:', {
            runway: gameEngine.runway,
            morale: gameEngine.morale,
            progress: gameEngine.progress,
            awareness: gameEngine.awareness
        });
        
        initCanvas();
        
        // Delay start slightly to ensure DOM is ready
        setTimeout(() => {
            console.log('Starting boss battle after delay...');
            startBossBattle();
        }, 200);
    } catch (error) {
        console.error('Error initializing Boss Battle:', error);
        alert('Lỗi khi khởi tạo Boss Battle: ' + error.message);
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
        gradient.addColorStop(0, '#1a0000');
        gradient.addColorStop(0.5, '#2e0000');
        gradient.addColorStop(1, '#3e0000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw red glow for boss battle
        const glow = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, 300);
        glow.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
        glow.addColorStop(1, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

let currentRound = 1;
const maxRounds = 3;
let bossBattleState = null; // Initialize as null, will be set in DOMContentLoaded

// 3 Hiệp Đấu với logic mới
const bossRounds = [
    {
        id: 'round1',
        title: '🔔 HIỆP 1: CẮT ĐỨT DÒNG MÁU (NGUỒN CUNG)',
        description: 'Gã Khổng Lồ ra lệnh cho mọi nhà cung cấp ngừng hợp tác với bạn. Hắn muốn bóp nghẹt bạn ngay từ đầu.\n\nSát thương đe dọa: -30 Điểm Tồn Tại.',
        damage: 30,
        choices: [
            {
                title: '🛡️ Tìm Nguồn Cung Mới (An toàn)',
                description: 'Tốn kém để thiết lập lại từ đầu.',
                effects: {
                    runway: -3,
                    damageReduction: 30, // Chặn hoàn toàn
                    dominance: 15
                },
                class: ''
            },
            {
                title: '😈 Buôn Lậu & Hàng Giả (Hắc Ám)',
                description: 'Rẻ mạt nhưng team ghê tởm cách làm này.',
                effects: {
                    runway: -1,
                    morale: -15,
                    damageReduction: 25, // -5 SP
                    dominance: 30,
                    darkChoices: 1
                },
                class: 'dangerous',
                isDark: true
            }
        ]
    },
    {
        id: 'round2',
        title: '🔔 HIỆP 2: CUỘC SĂN ĐẦU NGƯỜI (NHÂN SỰ)',
        description: 'Gã Khổng Lồ gửi offer lương gấp 3 lần cho toàn bộ nhân sự chủ chốt của bạn.\n\nSát thương đe dọa: -40 Điểm Tồn Tại (Team đi hết là công ty sập).',
        damage: 40,
        choices: [
            {
                title: '💸 Dùng Tiền Đấu Tiền (Khô máu)',
                description: 'Tăng lương kịch trần để giữ người.',
                effects: {
                    runway: -4,
                    morale: 20, // Hồi phục vì team ở lại vì tiền
                    damageReduction: 35, // -5 SP
                    dominance: 10
                },
                class: ''
            },
            {
                title: '🗣️ Truyền Cảm Hứng (Vô vọng)',
                description: 'Team không tin bạn nữa khi Morale thấp.',
                effects: {
                    runway: 0,
                    morale: -10,
                    damageReduction: 10, // Bị nerf - vẫn bị -30 SP
                    dominance: 0,
                    isInspiration: true // Bị nerf khi Morale < 50
                },
                class: 'dangerous'
            },
            {
                title: '😈 Hồ Sơ Đen & Đe Dọa (Hắc ám tột cùng)',
                description: 'Dùng pháp lý gài bẫy hoặc bí mật cá nhân để ép nhân viên không thể nghỉ việc.',
                effects: {
                    runway: 0,
                    morale: -20,
                    damageReduction: 40, // Chặn hoàn toàn
                    dominance: 40,
                    darkChoices: 1
                },
                class: 'dangerous',
                isDark: true
            }
        ]
    },
    {
        id: 'round3',
        title: '🔔 HIỆP 3: ĐÒN KẾT LIỄU (TRUYỀN THÔNG)',
        description: 'Gã Khổng Lồ tung tin đồn bạn lừa đảo, sản phẩm gây hại cho người dùng. Cả xã hội quay lưng với bạn.\n\nSát thương đe dọa: -50 Điểm Tồn Tại.',
        damage: 50,
        choices: [
            {
                title: '🛡️ Chiến Dịch Sự Thật (Tốt)',
                description: 'Đối mặt với dư luận bằng sự thật.',
                requiresRunway: 2, // Yêu cầu ít nhất 2 Vốn
                effects: {
                    runway: -2,
                    damageReduction: 30, // -20 SP
                    dominance: 20
                },
                class: ''
            },
            {
                title: '😈 "Trạng Chết Chúa Cũng Băng Hà" (Tất tay)',
                description: 'Tung ngược bằng chứng phạm pháp của Gã Khổng Lồ mà bạn thu thập được.',
                requiresDarkChoice: true, // Yêu cầu ít nhất 1 dark choice trước đó
                effects: {
                    damageReduction: 50, // Phản đòn - không mất SP
                    dominance: 50,
                    darkChoices: 1
                },
                class: 'dangerous',
                isDark: true
            }
        ]
    }
];

function startBossBattle() {
    console.log('startBossBattle called');
    
    // Ensure bossBattleState is initialized
    if (!bossBattleState) {
        console.error('bossBattleState is not initialized!');
        const oldProgress = gameEngine ? (gameEngine.progress || 0) : 0;
        const initialDominance = Math.floor(oldProgress * 0.46);
        bossBattleState = {
            battleSurvivalPoints: 100,
            dominance: initialDominance,
            darkChoicesInBattle: 0
        };
    }
    
    // Reset round to 1
    currentRound = 1;
    
    // Check if DOM is ready
    const testElement = document.getElementById('eventTitle');
    if (!testElement) {
        console.error('DOM not ready yet! Retrying in 100ms...');
        setTimeout(() => {
            startBossBattle();
        }, 100);
        return;
    }
    
    // Update UI to show Dominance instead of Progress
    try {
        updateBossBattleUI();
        updateRoundDisplay();
    } catch (error) {
        console.error('Error updating UI:', error);
    }
    
    // Check if bossRounds is defined and has rounds
    if (!bossRounds || bossRounds.length === 0) {
        console.error('bossRounds is empty!');
        return;
    }
    
    // Check if round 1 exists
    if (!bossRounds[0]) {
        console.error('Round 1 does not exist!');
        return;
    }
    
    console.log('Starting boss battle, showing round 1:', bossRounds[0]);
    console.log('Round 1 choices:', bossRounds[0].choices);
    
    try {
        showRound(bossRounds[0]);
    } catch (error) {
        console.error('Error showing round:', error);
    }
}

function updateBossBattleUI() {
    // Change Progress label to Dominance
    try {
        const progressValue = document.getElementById('progressValue');
        if (progressValue) {
            const statInfo = progressValue.parentElement;
            if (statInfo) {
                const progressLabel = statInfo.previousElementSibling;
                if (progressLabel && progressLabel.classList.contains('stat-label')) {
                    progressLabel.textContent = 'Ưu Thế (Dominance)';
                }
            }
        }
    } catch (error) {
        console.error('Error updating progress label:', error);
    }
    
    // Update survival bar to show battle HP (only if bossBattleState exists)
    if (bossBattleState) {
        updateBattleSurvivalBar();
    }
}

function updateBattleSurvivalBar() {
    if (!bossBattleState) {
        console.error('bossBattleState is null in updateBattleSurvivalBar!');
        return;
    }
    
    const survivalBar = document.getElementById('survivalBar');
    const survivalValue = document.getElementById('survivalValue');
    
    if (!survivalBar) {
        console.error('survivalBar element not found!');
    } else if (!survivalValue) {
        console.error('survivalValue element not found!');
    } else {
        const percent = Math.max(0, Math.min(100, (bossBattleState.battleSurvivalPoints / 100) * 100));
        survivalBar.style.width = percent + '%';
        survivalValue.textContent = bossBattleState.battleSurvivalPoints;
        
        // Color warning
        if (bossBattleState.battleSurvivalPoints < 30) {
            survivalBar.style.background = 'linear-gradient(90deg, #ff0000 0%, #ff4444 100%)';
        } else if (bossBattleState.battleSurvivalPoints < 60) {
            survivalBar.style.background = 'linear-gradient(90deg, #ff8844 0%, #ffaa44 100%)';
        } else {
            survivalBar.style.background = 'linear-gradient(90deg, #ff4444 0%, #ff0000 100%)';
        }
    }
    
    // Update Dominance bar
    const dominanceBar = document.getElementById('progressBar');
    const dominanceValue = document.getElementById('progressValue');
    
    if (!dominanceBar) {
        console.error('progressBar element not found!');
    } else if (!dominanceValue) {
        console.error('progressValue element not found!');
    } else {
        const percent = Math.max(0, Math.min(100, bossBattleState.dominance));
        dominanceBar.style.width = percent + '%';
        dominanceValue.textContent = Math.floor(bossBattleState.dominance);
    }
}

function updateRoundDisplay() {
    const roundElement = document.getElementById('roundValue');
    if (!roundElement) {
        console.error('roundValue element not found!');
        return;
    }
    roundElement.textContent = `${currentRound}/3`;
}

function showRound(round) {
    console.log('showRound called with:', round);
    
    if (!round) {
        console.error('Round is undefined!');
        return;
    }
    
    if (!round.choices || round.choices.length === 0) {
        console.error('Round has no choices!', round);
        return;
    }
    
    // Ensure bossBattleState exists
    if (!bossBattleState) {
        console.error('bossBattleState is null in showRound!');
        const oldProgress = gameEngine ? (gameEngine.progress || 0) : 0;
        const initialDominance = Math.floor(oldProgress * 0.46);
        bossBattleState = {
            battleSurvivalPoints: 100,
            dominance: initialDominance,
            darkChoicesInBattle: 0
        };
    }
    
    const eventTitle = document.getElementById('eventTitle');
    const eventDescription = document.getElementById('eventDescription');
    const choicesContainer = document.getElementById('choicesContainer');
    
    console.log('DOM elements:', { eventTitle, eventDescription, choicesContainer });
    
    if (!eventTitle || !eventDescription || !choicesContainer) {
        console.error('Missing DOM elements!', { eventTitle, eventDescription, choicesContainer });
        return;
    }
    
    eventTitle.textContent = round.title;
    eventDescription.innerHTML = round.description.replace(/\n/g, '<br>');
    choicesContainer.innerHTML = '';
    
    console.log('Displaying choices for round:', currentRound);
    let choicesAdded = 0;
    
    round.choices.forEach((choice, index) => {
        console.log(`Processing choice ${index}:`, choice.title);
        
        // Check requirements
        if (choice.requiresDarkChoice && bossBattleState.darkChoicesInBattle === 0) {
            console.log(`Skipping choice ${index} - requires dark choice`);
            return; // Skip if requirement not met
        }
        
        if (choice.requiresRunway !== undefined && gameEngine && gameEngine.runway < choice.requiresRunway) {
            console.log(`Skipping choice ${index} - not enough runway (need ${choice.requiresRunway}, have ${gameEngine.runway})`);
            return; // Skip if not enough runway
        }
        
        const choiceCard = document.createElement('div');
        choiceCard.className = `choice-card ${choice.class}`;
        
        let html = `<div class="choice-title">${choice.title}</div><div class="choice-description">${choice.description}</div>`;
        
        if (choice.requiresDarkChoice) {
            html += `<div style="color: #ff4444; font-weight: 700; margin-top: 0.5rem;">⚠️ Yêu cầu: Phải có ít nhất 1 lựa chọn Hắc Ám trước đó</div>`;
        }
        
        if (choice.requiresRunway !== undefined) {
            html += `<div style="color: #ffaa00; font-weight: 700; margin-top: 0.5rem;">💰 Yêu cầu: Ít nhất ${choice.requiresRunway} tháng Vốn</div>`;
        }
        
        if (choice.isInspiration && gameEngine.morale < 50) {
            html += `<div style="color: #ff8800; font-weight: 700; margin-top: 0.5rem;">⚠️ Tinh Thần Rệu Rã: Hiệu quả giảm 50% (Morale < 50%)</div>`;
        }
        
        choiceCard.innerHTML = html;
        choiceCard.addEventListener('click', () => {
            if (gameEngine && (gameEngine.gameOver || gameEngine.victory)) return;
            makeChoice(choice, round);
        });
        choicesContainer.appendChild(choiceCard);
        choicesAdded++;
        console.log(`Choice ${index} added: ${choice.title}`);
    });
    
    const displayedChoices = choicesContainer.children.length;
    console.log(`Round ${currentRound} displayed with ${displayedChoices} choices (Total: ${round.choices.length}, Added: ${choicesAdded})`);
    
    if (displayedChoices === 0) {
        console.error('No choices displayed!', {
            round: round,
            choices: round.choices,
            darkChoicesInBattle: bossBattleState ? bossBattleState.darkChoicesInBattle : 'N/A',
            runway: gameEngine ? gameEngine.runway : 'N/A',
            bossBattleState: bossBattleState
        });
        
        // Show error message to user
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = 'color: #ff4444; padding: 20px; text-align: center; font-size: 1.2em;';
        errorMsg.textContent = '⚠️ Lỗi: Không có lựa chọn nào hiển thị. Vui lòng kiểm tra Console (F12).';
        choicesContainer.appendChild(errorMsg);
    }
}

function makeChoice(choice, round) {
    if (!gameEngine) {
        console.error('gameEngine is not initialized!');
        return;
    }
    
    if (gameEngine.gameOver || gameEngine.victory) return;
    
    if (!bossBattleState) {
        console.error('bossBattleState is null in makeChoice!');
        return;
    }
    
    const logMessages = [];
    
    // Track dark choices in battle
    if (choice.isDark) {
        bossBattleState.darkChoicesInBattle++;
        logMessages.push(`💀 Điểm Hắc Ám trong trận đấu: ${bossBattleState.darkChoicesInBattle}`);
    }
    
    // Apply choice effects
    if (choice.effects.runway !== undefined) {
        gameEngine.runway = Math.max(0, gameEngine.runway + choice.effects.runway);
        logMessages.push(`💰 Vốn: ${choice.effects.runway > 0 ? '+' : ''}${choice.effects.runway} tháng`);
    }
    
    if (choice.effects.morale !== undefined) {
        const oldMorale = gameEngine.morale;
        gameEngine.morale = Math.max(0, Math.min(120, gameEngine.morale + choice.effects.morale));
        const change = gameEngine.morale - oldMorale;
        logMessages.push(`🔥 Năng lượng: ${change > 0 ? '+' : ''}${change}%`);
        
        if (gameEngine.morale < 25) {
            logMessages.push(`🚨 MỨC BÁO ĐỘNG ĐỎ! Morale < 25% - Đội ngũ sắp tan rã!`);
        }
    }
    
    // Apply damage to battle survival points
    let damage = round.damage - (choice.effects.damageReduction || 0);
    
    // Special: "Tinh Thần Rệu Rã" - Giảm 50% hiệu quả cho lựa chọn dựa vào lòng tin
    if (choice.isInspiration && gameEngine.morale < 50) {
        damage = Math.floor(damage * 1.5); // Bị nerf - giảm 50% hiệu quả damage reduction
        logMessages.push(`⚠️ Tinh Thần Rệu Rã: Hiệu quả giảm 50%!`);
    }
    
    const actualDamage = Math.max(0, damage);
    bossBattleState.battleSurvivalPoints = Math.max(0, bossBattleState.battleSurvivalPoints - actualDamage);
    
    if (actualDamage > 0) {
        logMessages.push(`💀 Điểm Tồn Tại (Trận đấu): -${actualDamage} (Còn: ${bossBattleState.battleSurvivalPoints}/100)`);
    } else {
        logMessages.push(`🛡️ Đã đỡ toàn bộ sát thương!`);
    }
    
    // Add dominance
    if (choice.effects.dominance !== undefined) {
        bossBattleState.dominance = Math.min(100, bossBattleState.dominance + choice.effects.dominance);
        logMessages.push(`👑 Ưu Thế: +${choice.effects.dominance}% (Tổng: ${bossBattleState.dominance}%)`);
    }
    
    // Apply dark choices penalty (if any)
    if (choice.effects.darkChoices !== undefined) {
        // Dark choices penalty already handled by game-engine.js if needed
    }
    
    // Update UI
    gameEngine.updateUI();
    updateBattleSurvivalBar();
    gameEngine.addLog(logMessages);
    
    // Check immediate lose conditions
    if (gameEngine.runway < 0 || gameEngine.morale <= 0 || bossBattleState.battleSurvivalPoints <= 0) {
        gameEngine.gameOver = true;
        let reason = '';
        if (gameEngine.runway < 0) {
            reason = 'Bạn đã hết vốn trong cuộc chiến. Startup của bạn phá sản. Bạn biến mất khỏi thị trường như chưa từng tồn tại. GAME OVER.';
        } else if (gameEngine.morale <= 0) {
            reason = 'Đội ngũ đã đầu hàng. Bạn không còn ai để chiến đấu. GAME OVER.';
        } else if (bossBattleState.battleSurvivalPoints <= 0) {
            reason = 'Điểm Tồn Tại đã về 0. Công ty không thể tiếp tục. GAME OVER.';
        }
        gameEngine.showGameOver(reason);
        return;
    }
    
    // Move to next round
    currentRound++;
    updateRoundDisplay();
    
    if (currentRound > maxRounds) {
        // Battle completed - check victory condition
        checkBossVictory();
    } else {
        // Show next round
        setTimeout(() => {
            showRound(bossRounds[currentRound - 1]);
        }, 2000);
    }
}

function checkBossVictory() {
    // Save state
    localStorage.setItem('gameState', JSON.stringify(gameEngine.getState()));
    
    // Check lose conditions first
    if (gameEngine.runway < 0 || gameEngine.morale <= 0 || bossBattleState.battleSurvivalPoints <= 0) {
        gameEngine.gameOver = true;
        let reason = '';
        if (gameEngine.runway < 0) {
            reason = 'Bạn đã hết vốn. Startup của bạn phá sản. Bạn biến mất khỏi thị trường như chưa từng tồn tại. GAME OVER.';
        } else if (gameEngine.morale <= 0) {
            reason = 'Đội ngũ đã đầu hàng. Bạn không còn ai để chiến đấu. GAME OVER.';
        } else if (bossBattleState.battleSurvivalPoints <= 0) {
            reason = 'Điểm Tồn Tại đã về 0. Công ty không thể tiếp tục. GAME OVER.';
        }
        gameEngine.showGameOver(reason);
        return;
    }
    
    // Check victory conditions
    if (bossBattleState.dominance >= 80 && 
        gameEngine.runway >= 0 && 
        gameEngine.morale > 0 && 
        bossBattleState.battleSurvivalPoints > 0) {
        // Kế Vị (Chiến thắng lớn - True Ending)
        setTimeout(() => {
            showVictoryEnding('usurper');
        }, 2000);
    } else if (bossBattleState.dominance < 80 &&
               gameEngine.runway >= 0 && 
               gameEngine.morale > 0 && 
               bossBattleState.battleSurvivalPoints > 0) {
        // Sống Sót (Chiến thắng nhỏ)
        setTimeout(() => {
            showVictoryEnding('survival');
        }, 2000);
    }
}

function showVictoryEnding(type) {
    const overlay = document.getElementById('victoryOverlay');
    const overlayContent = overlay.querySelector('.overlay-content');
    const message = document.getElementById('victoryMessage');
    
    // Make overlay wider and scrollable
    overlayContent.classList.add('wide');
    
    let endingText = '';
    
    if (type === 'usurper') {
        // Kế Vị Ending
        endingText = `
            <div class="victory-content-scroll theme-usurper">
                <h2 class="victory-title" style="color: #ff0844;">👑 KẾ VỊ - CHIẾN THẮNG LỚN</h2>
                <div class="victory-main-message" style="font-size: 1.1em; line-height: 1.6;">
                    <p>Gã Khổng Lồ ngã xuống. Bạn bước lên vị trí của hắn.</p>
                    <p>Bạn nhìn vào gương và thấy bóng dáng của kẻ mà bạn từng căm ghét.</p>
                    <p style="font-weight: bold; color: #ff0844; font-size: 1.2em; margin-top: 20px;">Bạn là Vua mới.</p>
                </div>
                <div class="lesson-content-box usurper-theme" style="margin-top: 30px;">
                    <h3 style="color: #ff4444;">📖 BÀI HỌC: VÒNG LẶP ĐỘC QUYỀN</h3>
                    <p>Bạn không "phá vỡ" hệ thống. Bạn đã "hoàn thành" nó.</p>
                    <blockquote style="margin-top: 25px; padding: 15px; border-left: 3px solid #ff0844; background: #000; font-style: italic;">
                        "Ai chống lại yêu quỷ nên cẩn trọng để không chính mình trở thành yêu quỷ. Nếu bạn chằm chằm nhìn đủ lâu vào vực thẳm, vực thẳm sẽ nhìn lại bạn."
                        <br><span style="display: block; text-align: right; margin-top: 10px; font-weight: bold;">— Friedrich Nietzsche</span>
                    </blockquote>
                </div>
                ${createScoreSummary('VUA MÊ CUNG MỚI')}
            </div>
        `;
    } else {
        // Survival Ending
        endingText = `
            <div class="victory-content-scroll">
                <h2 class="victory-title" style="color: #ffaa00;">⚔️ SỐNG SÓT - CHIẾN THẮNG NHỎ</h2>
                <div class="victory-main-message" style="font-size: 1.1em; line-height: 1.6;">
                    <p>Bạn đã sống sót qua đợt tấn công của Gã Khổng Lồ.</p>
                    <p>Gã Khổng Lồ tạm tha cho bạn vì kiệt sức. Bạn tồn tại nhưng không thể trở thành số 1.</p>
                    <p style="margin-top: 20px; color: #aaa;">Ưu Thế: ${bossBattleState.dominance}% (Cần 80% để Kế Vị)</p>
                </div>
                <div class="lesson-content-box" style="margin-top: 30px;">
                    <h3 style="color: #ffaa00;">📖 BÀI HỌC: SỐNG SÓT KHÔNG PHẢI CHIẾN THẮNG</h3>
                    <p>Đôi khi, sống sót chỉ là bước đầu. Để thực sự thắng, bạn cần phải vượt qua ngưỡng cửa cuối cùng.</p>
                </div>
                ${createScoreSummary('KẺ SỐNG SÓT')}
            </div>
        `;
    }
    
    message.innerHTML = endingText;
    overlay.classList.add('active');
    
    // Setup buttons
    const buttonsContainer = overlayContent.querySelector('.overlay-buttons');
    if (buttonsContainer) {
        buttonsContainer.innerHTML = `
            <button class="overlay-btn" onclick="location.reload()" style="background: #444; border-color: #666;">Chơi Lại</button>
            <button class="overlay-btn" onclick="window.location.href='main-menu.html'">Về Menu Chính</button>
        `;
    }
}

function createScoreSummary(achievement) {
    const survivalPoints = gameEngine.survivalPoints;
    const runway = gameEngine.runway;
    const morale = gameEngine.morale;
    const dominance = bossBattleState.dominance;
    const battleSP = bossBattleState.battleSurvivalPoints;
    
    return `
        <div class="score-summary-box" style="background: rgba(0,0,0,0.6); padding: 25px; border-radius: 15px; margin-top: 30px; border: 1px solid rgba(255,255,255,0.1);">
            <h3 style="text-align: center; color: #ffd700; margin-bottom: 25px; font-size: 1.4em; text-transform: uppercase; letter-spacing: 1px;">📊 Tổng Kết Hành Trình</h3>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px dashed rgba(255,255,255,0.2);">
                <span style="font-size: 1.1em; color: #ccc;">Điểm Tồn Tại Cuối Cùng:</span>
                <div style="text-align: right;">
                    <span style="font-size: 2em; font-weight: 900; color: #fff;">${survivalPoints}</span>
                    <span style="font-size: 1em; color: #999;">/ 100</span>
                </div>
            </div>
            <div style="margin-bottom: 25px;">
                <div style="font-size: 0.9em; color: #aaa; margin-bottom: 10px; text-transform: uppercase;">Tài nguyên còn lại:</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div style="background: rgba(0,255,255,0.1); padding: 10px; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5em;">💰</span>
                        <div>
                            <div style="font-size: 0.8em; color: #00ffff;">Vốn dư</div>
                            <div style="font-weight: bold; color: #fff;">${runway} tháng</div>
                        </div>
                    </div>
                    <div style="background: rgba(255,107,107,0.1); padding: 10px; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5em;">🔥</span>
                        <div>
                            <div style="font-size: 0.8em; color: #ff6b6b;">Năng lượng</div>
                            <div style="font-weight: bold; color: #fff;">${morale}%</div>
                        </div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div style="background: rgba(255,68,68,0.1); padding: 10px; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5em;">🛡️</span>
                        <div>
                            <div style="font-size: 0.8em; color: #ff4444;">Điểm Tồn Tại (Trận đấu)</div>
                            <div style="font-weight: bold; color: #fff;">${battleSP}/100</div>
                        </div>
                    </div>
                    <div style="background: rgba(255,215,0,0.1); padding: 10px; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5em;">👑</span>
                        <div>
                            <div style="font-size: 0.8em; color: #ffd700;">Ưu Thế</div>
                            <div style="font-weight: bold; color: #fff;">${dominance}%</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="achievement-box" style="text-align: center; background: linear-gradient(135deg, rgba(255,215,0,0.1), transparent); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,215,0,0.3);">
                <span style="color: #ffd700; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px;">Danh hiệu mở khóa</span>
                <div style="font-size: 1.6em; font-weight: 900; color: #fff; margin-top: 5px; text-shadow: 0 0 10px rgba(255,215,0,0.5);">
                    ${achievement}
                </div>
            </div>
        </div>
    `;
}
