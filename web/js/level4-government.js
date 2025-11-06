// Level 4: Văn Phòng Chính Phủ (Normal Ending)

document.addEventListener('DOMContentLoaded', function() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        gameEngine = new GameEngine();
        
        // Load state first to get the values
        gameEngine.loadState(state);
        
        // IMPORTANT: Save current state to history AFTER loading
        // This preserves the state from level 3.5 (or previous level) so we can back to it
        // The state in history will be the state BEFORE entering level 4
        gameEngine.saveGameState();
        
        // Set current level to 4 (we're now on level 4)
        gameEngine.currentLevel = 4;
        // Keep previousLevel from loaded state (should be 3.5)
        gameEngine.previousLevel = state.previousLevel || state.currentLevel || 3.5;
        
        // Save updated state with level 4 info
        localStorage.setItem('gameState', JSON.stringify(gameEngine.getState()));
        
        console.log('Level 4 Government initialized. Previous level:', gameEngine.previousLevel);
    } else {
        gameEngine = new GameEngine();
        gameEngine.currentLevel = 4;
        gameEngine.previousLevel = 3.5;
    }
    
    initCanvas();
    startLevel4();
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
        gradient.addColorStop(0, '#0a1a0a');
        gradient.addColorStop(0.5, '#1a2e1a');
        gradient.addColorStop(1, '#163e16');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

const level4Events = [
    {
        id: 'government',
        title: 'Cấp 4: Văn Phòng Chính Phủ',
        description: 'Bạn đã từ chối Gã Khổng Lồ. Bây giờ là lúc tìm kiếm sự giúp đỡ từ chính phủ để đảm bảo công bằng và bảo vệ startup của bạn. Có nhiều con đường, mỗi con đường đều có hậu quả riêng...',
        choices: [
            {
                title: '📄 Gửi Hồ Sơ Cục Cạnh Tranh',
                description: 'Gửi hồ sơ chính thức đến Cục Cạnh tranh để tố cáo hành vi độc quyền của Gã Khổng Lồ.',
                effects: {
                    progress: 100, // Đặt trực tiếp 100% để đảm bảo thắng chắc chắn
                    runway: -1,
                    morale: 10
                },
                class: '',
                ending: 'official'
            },
            {
                title: '🤝 Liên Kết Doanh Nghiệp Nhỏ',
                description: 'Tạo liên minh với các doanh nghiệp nhỏ khác để cùng đối đầu với Gã Khổng Lồ.',
                effects: {
                    progress: 40,
                    runway: -2,
                    morale: 15,
                    awareness: 8,
                    // Thắng nếu đủ chỉ số: Vốn > 3 và Năng lượng > 30
                    conditionalWin: {
                        condition: () => gameEngine.runway > 3 && gameEngine.morale > 30,
                        success: {
                            progress: 20, // Thêm để đạt 100%
                            morale: 10
                        },
                        failure: {
                            gameOver: true,
                            gameOverReason: 'Liên minh không đủ mạnh. Bạn không có đủ tài nguyên để duy trì liên kết. GAME OVER.'
                        }
                    }
                },
                class: '',
                ending: 'alliance'
            },
            {
                title: '📢 Kêu Gọi Báo Chí',
                description: 'Kêu gọi báo chí và truyền thông để công khai hành vi của Gã Khổng Lồ.',
                effects: {
                    progress: 30,
                    runway: -3,
                    morale: -8,
                    awareness: 25,
                    risk: 0.5, // 50% thắng / 50% thua
                    riskSuccess: {
                        progress: 40, // Sẽ được điều chỉnh động để đạt 100%
                        morale: 10
                    },
                    riskFailure: {
                        gameOver: true,
                        gameOverReason: 'Chiến dịch truyền thông thất bại. Gã Khổng Lồ phản công mạnh mẽ. GAME OVER.'
                    }
                },
                class: '',
                ending: 'media'
            },
            {
                title: '🌍 Can Thiệp Quốc Tế',
                description: 'Tìm kiếm sự can thiệp từ các tổ chức quốc tế để giải quyết vấn đề.',
                effects: {
                    progress: 10, // Trung lập - không đủ để thắng
                    runway: -1,
                    morale: 5,
                    awareness: 15
                },
                class: '',
                ending: 'international'
            },
            {
                title: '🤐 Thương Lượng Bí Mật',
                description: 'Thương lượng bí mật với Gã Khổng Lồ.',
                effects: {
                    gameOver: true,
                    gameOverReason: 'Bạn đã bị thâu tóm trong thương lượng bí mật. GAME OVER.'
                },
                class: ''
            },
            {
                title: '💼 Vận Động Hành Lang',
                description: 'Sử dụng các mối quan hệ để vận động hành lang.',
                effects: {
                    gameOver: true,
                    gameOverReason: 'Bạn đã bị trả đũa. GAME OVER.'
                },
                class: ''
            }
        ]
    }
];

function startLevel4() {
    // Shuffle choices before showing
    const event = {...level4Events[0]};
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
    console.log('Making choice:', choice.title); // DEBUG LOG
    
    if (gameEngine.gameOver || gameEngine.victory) {
        console.log('Game already over or victory, returning');
        return;
    }
    
    // Override showVictory to prevent default victory overlay
    const originalShowVictory = gameEngine.showVictory;
    gameEngine.showVictory = function() {
        console.log('Original showVictory suppressed'); // DEBUG LOG
        this.victory = true;
    };
    
    try {
        // Handle conditional win (for Alliance)
        if (choice.effects.conditionalWin) {
            console.log('Processing conditionalWin...');
            const condition = choice.effects.conditionalWin.condition();
            console.log('Condition result:', condition);
            
            if (condition) {
                // Success - apply success effects
                console.log('Condition met, applying success effects');
                
                // Apply base effects first (runway, morale, awareness)
                const baseEffects = {
                    runway: choice.effects.runway,
                    morale: choice.effects.morale,
                    awareness: choice.effects.awareness
                };
                gameEngine.applyEffects(baseEffects);
                
                // Apply conditional success effects (without progress)
                const successEffects = {...choice.effects.conditionalWin.success};
                const successProgress = successEffects.progress || 0;
                delete successEffects.progress;
                gameEngine.applyEffects(successEffects);
                
                // Apply base progress
                if (choice.effects.progress) {
                    gameEngine.applyEffects({progress: choice.effects.progress});
                }
                
                // Force progress to 100% (bypassing soft limits)
                const currentProgress = gameEngine.progress;
                const progressNeeded = Math.max(0, 100 - currentProgress);
                console.log('Alliance choice - currentProgress:', currentProgress, 'progressNeeded:', progressNeeded);
                
                if (progressNeeded > 0) {
                    gameEngine.progress = Math.min(100, gameEngine.progress + progressNeeded);
                    console.log('After setting progress directly, progress:', gameEngine.progress);
                }
            } else {
                // Failure - game over
                console.log('Condition not met, game over');
                gameEngine.showVictory = originalShowVictory; // Restore
                gameEngine.applyEffects(choice.effects.conditionalWin.failure);
                return;
            }
        } else {
            // Normal effects
            // For "Gửi Hồ Sơ Cục Cạnh Tranh" - ensure it reaches 100% progress
            if (choice.title.includes('Gửi Hồ Sơ Cục Cạnh Tranh')) {
                // Apply other effects first (runway, morale)
                const effectsCopy = {...choice.effects};
                delete effectsCopy.progress; // Remove progress from effects
                
                // Apply non-progress effects
                gameEngine.applyEffects(effectsCopy);
                
                // Then set progress directly to 100% (bypassing soft limits)
                const currentProgress = gameEngine.progress;
                const progressNeeded = Math.max(0, 100 - currentProgress);
                console.log('Official choice - currentProgress:', currentProgress, 'progressNeeded:', progressNeeded);
                
                // Force progress to 100% by applying the remaining amount
                if (progressNeeded > 0) {
                    gameEngine.progress = Math.min(100, gameEngine.progress + progressNeeded);
                    console.log('After setting progress directly, progress:', gameEngine.progress);
                }
            }
            // For risk-based choices (Kêu Gọi Báo Chí), ensure progress reaches 100% on success
            else if (choice.effects.risk && choice.effects.riskSuccess) {
                console.log('Processing risk-based choice...');
                
                // Apply base effects first (without progress)
                const baseEffects = {...choice.effects};
                delete baseEffects.risk;
                delete baseEffects.riskSuccess;
                delete baseEffects.riskFailure;
                
                // Store original riskSuccess to restore later
                const originalRiskSuccess = {...choice.effects.riskSuccess};
                
                // Calculate progress needed to reach 100% after base effects
                const currentProgress = gameEngine.progress;
                const baseProgress = choice.effects.progress || 0;
                const progressAfterBase = currentProgress + baseProgress;
                const neededProgress = Math.max(0, 100 - progressAfterBase);
                
                console.log('Risk choice - currentProgress:', currentProgress, 'baseProgress:', baseProgress, 'progressAfterBase:', progressAfterBase, 'neededProgress:', neededProgress);
                
                // Update riskSuccess to add exactly what's needed to reach 100%
                if (neededProgress > 0) {
                    choice.effects.riskSuccess.progress = neededProgress;
                } else {
                    // Already at or above 100% after base effects
                    choice.effects.riskSuccess.progress = 0;
                }
                
                // Apply effects (including risk)
                const logMessages = gameEngine.applyEffects(choice.effects);
                
                // Check if risk succeeded or failed
                if (gameEngine.gameOver) {
                    console.log('Game over after applying effects (risk failed)');
                    gameEngine.showVictory = originalShowVictory; // Restore
                    return;
                }
                
                // If risk succeeded, ensure progress is exactly 100%
                // (The riskSuccess progress should already be set correctly, but double-check)
                if (gameEngine.progress < 100) {
                    console.log('Risk succeeded but progress < 100, forcing to 100%');
                    const remainingProgress = 100 - gameEngine.progress;
                    gameEngine.progress = 100;
                    console.log('Progress forced to 100%');
                }
                
                // Restore original riskSuccess for future use
                choice.effects.riskSuccess = originalRiskSuccess;
            } else {
                // Other normal effects
                const logMessages = gameEngine.applyEffects(choice.effects);
                if (gameEngine.gameOver) {
                    console.log('Game over after applying effects');
                    gameEngine.showVictory = originalShowVictory; // Restore
                    return;
                }
            }
        }
        
        // Restore original showVictory
        gameEngine.showVictory = originalShowVictory;
        
        // Update UI
        gameEngine.updateUI();
        
        // Check victory condition manually (without showing default overlay)
        const progressCheck = gameEngine.progress >= 100;
        const runwayCheck = gameEngine.runway > 0;
        const moraleCheck = gameEngine.morale > 0;
        
        console.log('Victory check:', {
            progress: gameEngine.progress,
            progressCheck,
            runway: gameEngine.runway,
            runwayCheck,
            morale: gameEngine.morale,
            moraleCheck
        });
        
        if (progressCheck && runwayCheck && moraleCheck) {
            console.log('Victory condition met!');
            gameEngine.victory = true;
        } else {
            console.log('Victory condition NOT met:', {
                progressCheck,
                runwayCheck,
                moraleCheck,
                actualProgress: gameEngine.progress,
                actualRunway: gameEngine.runway,
                actualMorale: gameEngine.morale
            });
        }
        
        console.log('Choice ending type:', choice.ending);
        console.log('Game state:', {
            victory: gameEngine.victory,
            gameOver: gameEngine.gameOver,
            ending: choice.ending
        });
        
        // Show appropriate ending based on choice
        if (gameEngine.victory && choice.ending && choice.ending !== 'international') {
            console.log('Scheduling showVictoryEnding for:', choice.ending);
            setTimeout(() => {
                console.log('Executing showVictoryEnding now!');
                showVictoryEnding(choice.ending);
            }, 2000);
        } else if (!gameEngine.gameOver && choice.ending === 'international') {
            // Neutral ending for international
            console.log('Scheduling showNeutralEnding');
            setTimeout(() => {
                console.log('Executing showNeutralEnding now!');
                showNeutralEnding();
            }, 2000);
        } else if (gameEngine.victory && !choice.ending) {
            // Generic victory (shouldn't happen, but just in case)
            console.log('Victory but no ending type, using default');
            setTimeout(() => {
                showVictoryEnding('official');
            }, 2000);
        } else {
            console.warn('No ending displayed. State:', {
                victory: gameEngine.victory,
                gameOver: gameEngine.gameOver,
                ending: choice.ending
            });
        }
    } catch (error) {
        console.error('Error in makeChoice:', error);
        // Restore original showVictory on error
        gameEngine.showVictory = originalShowVictory;
        alert('Đã xảy ra lỗi: ' + error.message);
    }
}

function showVictoryEnding(endingType) {
    console.log('showVictoryEnding called with endingType:', endingType);
    
    try {
        const overlay = document.getElementById('victoryOverlay');
        if (!overlay) {
            console.error('victoryOverlay element not found!');
            alert('Lỗi: Không tìm thấy overlay. Vui lòng kiểm tra HTML.');
            return;
        }
        
        const overlayContent = overlay.querySelector('.overlay-content');
        if (!overlayContent) {
            console.error('overlay-content element not found!');
            alert('Lỗi: Không tìm thấy overlay-content. Vui lòng kiểm tra HTML.');
            return;
        }
        
        const message = document.getElementById('victoryMessage');
        if (!message) {
            console.error('victoryMessage element not found!');
            alert('Lỗi: Không tìm thấy victoryMessage. Vui lòng kiểm tra HTML.');
            return;
        }
        
        console.log('All DOM elements found, proceeding with ending display');
        
        // Map achievement for each ending
        const achievementMap = {
            official: 'DOANH NHÂN KIẾN TẠO',
            alliance: 'LÃNH ĐẠO PHONG TRÀO',
            media: 'NGÔI SAO TRUYỀN THÔNG'
        };
    
    const endings = {
        official: {
            title: '🏆 CHIẾN THẮNG: GỬI HỒ SƠ CỤC CẠNH TRANH',
            lesson: 'BÀI HỌC: SỨC MẠNH CỦA PHÁP LÝ',
            content: '"Trong một thị trường bị thao túng, pháp luật là vũ khí cuối cùng của người yếu thế. Bạn đã chứng minh rằng ngay cả Gã Khổng Lồ cũng phải cúi đầu trước cán cân công lý. Khi sân chơi được san phẳng, giá trị thực sự của sự đổi mới mới có cơ hội tỏa sáng."'
        },
        alliance: {
            title: '🏆 CHIẾN THẮNG: LIÊN KẾT DOANH NGHIỆP',
            lesson: 'BÀI HỌC: SỨC MẠNH CỦA SỰ ĐOÀN KẾT',
            content: '"Một que đũa dễ bị bẻ gãy, nhưng một bó đũa thì không. Gã Khổng Lồ có thể nghiền nát một startup đơn lẻ, nhưng hắn không thể chống lại cả một thị trường cùng đứng lên. Bạn không chỉ cứu chính mình, bạn đã tạo ra một liên minh mới, thay đổi luật chơi mãi mãi."'
        },
        media: {
            title: '🏆 CHIẾN THẮNG: KÊU GỌI BÁO CHÍ',
            lesson: 'BÀI HỌC: CON DAO HAI LƯỠI CỦA DƯ LUẬN',
            content: '"Dư luận là thứ vũ khí khó lường nhất. Nó có thể biến bạn thành người hùng chỉ sau một đêm, nhưng cũng sẵn sàng dìm bạn xuống vực sâu nếu bạn sơ sẩy. Bạn đã đánh cược tất cả vào niềm tin của công chúng và đã thắng. Nhưng hãy nhớ: sự chú ý này cũng đi kèm với áp lực khổng lồ."'
        }
    };
    
        const ending = endings[endingType];
        if (!ending) {
            console.error('Invalid ending type:', endingType);
            return;
        }
        
        console.log('Displaying ending:', endingType);
        
        // Make overlay wider and scrollable
        overlayContent.classList.add('wide');
        
        let endingText = `
            <div class="victory-content-scroll">
                <p style="font-size: 1.4rem; margin-bottom: 1.5rem; color: #00ff00; font-weight: 700; text-align: center;">
                    ${ending.title}
                </p>
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                    Bạn đã tìm được công lý và bảo vệ startup của mình.
                </p>
                <hr style="border: 1px solid rgba(255,255,255,0.2); margin: 1.5rem 0;">
                <p style="font-size: 1.3rem; margin-bottom: 1rem; color: #ffd700; font-weight: 700;">
                    ${ending.lesson}
                </p>
                <p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-style: italic; color: #cccccc; line-height: 1.8;">
                    ${ending.content}
                </p>
                <hr style="border: 1px solid rgba(255,255,255,0.2); margin: 1.5rem 0;">
                <p style="font-size: 1rem; color: #aaaaaa;">
                    Bạn đã hoàn thành hành trình startup và tìm ra lối thoát mê cung.
                </p>
                ${createScoreSummary(achievementMap[endingType] || 'DOANH NHÂN KIẾN TẠO', endingType)}
            </div>
        `;
        
        message.innerHTML = endingText;
        overlay.classList.add('active');
        
        console.log('Overlay activated');
        
        // Setup buttons
        const buttonsContainer = overlayContent.querySelector('.overlay-buttons');
        if (buttonsContainer) {
            buttonsContainer.innerHTML = `
                <button class="overlay-btn" onclick="location.reload()" style="background: #444; border-color: #666;">Chơi Lại</button>
                <button class="overlay-btn" onclick="window.location.href='main-menu.html'">Về Menu Chính</button>
            `;
            console.log('Buttons added to overlay');
        } else {
            console.warn('overlay-buttons element not found!');
        }
    } catch (error) {
        console.error('Error in showVictoryEnding:', error);
        alert('Lỗi khi hiển thị kết thúc: ' + error.message);
    }
}

function createScoreSummary(achievement, endingType) {
    const survivalPoints = gameEngine.survivalPoints;
    const runway = gameEngine.runway;
    const morale = gameEngine.morale;
    
    // Calculate final score
    const scoreData = gameEngine.calculateFinalScore(endingType);
    const finalScore = scoreData.finalScore;
    const breakdown = scoreData.breakdown;
    
    return `
        <div class="score-summary-box" style="background: rgba(0,0,0,0.6); padding: 25px; border-radius: 15px; margin-top: 30px; border: 1px solid rgba(255,255,255,0.1);">
            <h3 style="text-align: center; color: #ffd700; margin-bottom: 25px; font-size: 1.4em; text-transform: uppercase; letter-spacing: 1px;">📊 Tổng Kết Hành Trình</h3>
            
            <!-- Final Score Display -->
            <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05)); border-radius: 12px; border: 2px solid rgba(255,215,0,0.4);">
                <div style="font-size: 0.9em; color: #ffd700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">🏆 ĐIỂM TỔNG KẾT</div>
                <div style="font-size: 3.5em; font-weight: 900; color: #fff; text-shadow: 0 0 20px rgba(255,215,0,0.8); line-height: 1;">
                    ${finalScore.toLocaleString()}
                </div>
            </div>
            
            <!-- Score Breakdown -->
            <div style="margin-bottom: 25px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                <div style="font-size: 0.85em; color: #aaa; margin-bottom: 15px; text-transform: uppercase;">Chi tiết điểm số:</div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <span style="color: #ccc;">Điểm Tồn Tại (${survivalPoints} x 10):</span>
                        <span style="font-weight: bold; color: #fff;">${breakdown.survivalPoints}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <span style="color: #ccc;">Vốn dư (${runway} x 50):</span>
                        <span style="font-weight: bold; color: #fff;">${breakdown.runway}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <span style="color: #ccc;">Năng lượng (${morale} x 5):</span>
                        <span style="font-weight: bold; color: #fff;">${breakdown.morale}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 2px solid rgba(255,215,0,0.3);">
                        <span style="color: #ffd700; font-weight: 700;">Điểm Kết Thúc:</span>
                        <span style="font-weight: bold; color: #ffd700; font-size: 1.1em;">+${breakdown.endingBonus.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <!-- Stats Display -->
            <div style="margin-bottom: 25px;">
                <div style="font-size: 0.9em; color: #aaa; margin-bottom: 10px; text-transform: uppercase;">Tài nguyên còn lại:</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
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
            </div>
            
            <!-- Achievement -->
            <div class="achievement-box" style="text-align: center; background: linear-gradient(135deg, rgba(255,215,0,0.1), transparent); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,215,0,0.3);">
                <span style="color: #ffd700; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px;">Danh hiệu mở khóa</span>
                <div style="font-size: 1.6em; font-weight: 900; color: #fff; margin-top: 5px; text-shadow: 0 0 10px rgba(255,215,0,0.5);">
                    ${achievement}
                </div>
            </div>
        </div>
    `;
}

function showNeutralEnding() {
    console.log('showNeutralEnding called');
    
    try {
        const overlay = document.getElementById('victoryOverlay');
        if (!overlay) {
            console.error('victoryOverlay element not found!');
            alert('Lỗi: Không tìm thấy overlay. Vui lòng kiểm tra HTML.');
            return;
        }
        
        const overlayContent = overlay.querySelector('.overlay-content');
        if (!overlayContent) {
            console.error('overlay-content element not found!');
            alert('Lỗi: Không tìm thấy overlay-content. Vui lòng kiểm tra HTML.');
            return;
        }
        
        const message = document.getElementById('victoryMessage');
        if (!message) {
            console.error('victoryMessage element not found!');
            alert('Lỗi: Không tìm thấy victoryMessage. Vui lòng kiểm tra HTML.');
            return;
        }
        
        const title = document.getElementById('victoryTitle');
        if (title && title.textContent !== undefined) {
            title.textContent = '🏳️ KẾT THÚC TRUNG LẬP: CAN THIỆP QUỐC TẾ';
        }
        
        // Make overlay wider and scrollable
        overlayContent.classList.add('wide');
        
        let endingText = `
            <div class="victory-content-scroll">
                <p style="font-size: 1.2rem; margin-bottom: 1rem; color: #ffd700; text-align: center;">
                    Bạn đã sống sót, nhưng đây chưa phải là chiến thắng trọn vẹn.
                </p>
                <hr style="border: 1px solid rgba(255,255,255,0.2); margin: 1.5rem 0;">
                <p style="font-size: 1.3rem; margin-bottom: 1rem; color: #ffd700; font-weight: 700;">
                    BÀI HỌC: MƯỢN GIÓ BẺ MĂNG
                </p>
                <p style="font-size: 1.1rem; margin-bottom: 1.5rem; font-style: italic; color: #cccccc; line-height: 1.8;">
                    "Khi đối thủ quá mạnh trên sân nhà, người khôn ngoan biết tìm kiếm đòn bẩy từ bên ngoài. Bạn đã sống sót bằng cách biến cuộc chiến cục bộ thành vấn đề toàn cầu. Đây chưa phải là chiến thắng trọn vẹn, nhưng bạn đã mua được thứ quý giá nhất cho startup của mình: Thời gian."
                </p>
                <hr style="border: 1px solid rgba(255,255,255,0.2); margin: 1.5rem 0;">
                <p style="font-size: 1rem; color: #aaaaaa;">
                    Hành trình của bạn vẫn tiếp tục...
                </p>
                ${createScoreSummary('KẺ SỐNG SÓT CHIẾN LƯỢC', 'international')}
            </div>
        `;
        
        message.innerHTML = endingText;
        overlay.classList.add('active');
        
        console.log('Neutral ending overlay activated');
        
        // Setup buttons
        const buttonsContainer = overlayContent.querySelector('.overlay-buttons');
        if (buttonsContainer) {
            buttonsContainer.innerHTML = `
                <button class="overlay-btn" onclick="location.reload()" style="background: #444; border-color: #666;">Chơi Lại</button>
                <button class="overlay-btn" onclick="window.location.href='main-menu.html'">Về Menu Chính</button>
            `;
            console.log('Buttons added to neutral ending overlay');
        } else {
            console.warn('overlay-buttons element not found!');
        }
    } catch (error) {
        console.error('Error in showNeutralEnding:', error);
        alert('Lỗi khi hiển thị kết thúc trung lập: ' + error.message);
    }
}

