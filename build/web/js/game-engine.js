// Game Engine - Core game logic and state management

const GAME_HISTORY_STORAGE_KEY = 'gameHistory';
const MANUAL_BACK_FLAG_KEY = 'manualBackPending';

function getHistoryStackFromStorage() {
    try {
        const raw = localStorage.getItem(GAME_HISTORY_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error reading game history from storage:', error);
        return [];
    }
}

function saveHistoryStackToStorage(stack) {
    try {
        localStorage.setItem(GAME_HISTORY_STORAGE_KEY, JSON.stringify(stack));
    } catch (error) {
        console.error('Error saving game history to storage:', error);
    }
}

function popStateFromHistoryStack() {
    const stack = getHistoryStackFromStorage();
    if (stack.length === 0) {
        console.log('⚠️ History stack is empty. Nothing to restore.');
        return null;
    }
    const previousState = stack.pop();
    saveHistoryStackToStorage(stack);
    try {
        localStorage.setItem('gameState', JSON.stringify(previousState));
    } catch (error) {
        console.error('Error saving restored state to localStorage:', error);
    }
    return previousState;
}

function restoreStateFromHistoryNavigation(isFromPopState = false) {
    try {
        let navigationType = '';
        if (performance && performance.getEntriesByType) {
            const entries = performance.getEntriesByType('navigation');
            if (entries && entries.length > 0) {
                navigationType = entries[0].type;
            }
        }

        const manualBackTriggered = sessionStorage.getItem(MANUAL_BACK_FLAG_KEY) === '1';
        if (manualBackTriggered) {
            sessionStorage.removeItem(MANUAL_BACK_FLAG_KEY);
        }

        const shouldRestore = manualBackTriggered || navigationType === 'back_forward' || isFromPopState;

        if (shouldRestore) {
            const previousState = popStateFromHistoryStack();
            if (previousState) {
                console.log('🔙 Đã phục hồi trạng thái cho điều hướng Back/Forward. Level:', previousState.currentLevel);
            }
        }
    } catch (error) {
        console.error('Error restoring state during history navigation:', error);
    }
}

class GameEngine {
    constructor() {
        // 4 Chỉ Số Chính
        this.runway = 24;        // Vốn (tháng) - "Đồng hồ đếm ngược"
        this.morale = 100;       // Năng lượng (%) - Tối đa 120 (Hưng phấn)
        this.progress = 0;        // Tiến độ (%) - TÍCH LŨY từ đầu game, không được reset
        this.awareness = 0;       // Cảnh giác (%) - Chỉ tăng, không giảm (Mắt của Sauron)
        
        // Chỉ Số Đặc Biệt
        this.survivalPoints = 100;  // Điểm Tồn Tại
        this.darkChoices = 0;       // Điểm Hắc Ám
        this.technicalDebt = false; // Nợ Kỹ Thuật
        
        // Game State Flags
        this.niche = false;          // Trạng thái Niche từ Cấp 2
        this.quality = false;       // Trạng thái Quality từ Cấp 2
        this.pendingEvent = null;    // Event phụ đang chờ (nested event)
        
        // Game State
        this.currentLevel = 1;
        this.gameOver = false;
        this.victory = false;
        
        // Progress milestones tracking (để không cộng lại)
        this.progressMilestonesReached = {
            25: false,
            50: false,
            75: false
        };
        
        // Track previous runway and level for Back button restoration
        this.previousRunway = 24;
        this.previousLevel = 1;
        
        // History Stack for Back button restoration
        this.gameHistory = getHistoryStackFromStorage();
        
        // Initialize UI
        this.init();
    }
    
    init() {
        this.updateUI();
        this.checkGameState();
    }
    
    // Update UI with current stats
    updateUI() {
        // Helper function to safely update element
        const safeUpdate = (id, value, isText = true) => {
            const element = document.getElementById(id);
            if (element) {
                if (isText && element.textContent !== undefined) {
                    element.textContent = value;
                } else if (!isText && element.style) {
                    element.style.width = value;
                }
            }
        };
        
        // Update values (with null checks)
        safeUpdate('runwayValue', this.runway);
        safeUpdate('moraleValue', this.morale);
        safeUpdate('progressValue', this.progress);
        safeUpdate('awarenessValue', this.awareness);
        safeUpdate('survivalValue', this.survivalPoints);
        safeUpdate('darkChoicesValue', this.darkChoices);
        
        // technicalDebtValue may not exist in all pages (e.g., boss battle)
        const technicalDebtElement = document.getElementById('technicalDebtValue');
        if (technicalDebtElement && technicalDebtElement.textContent !== undefined) {
            technicalDebtElement.textContent = this.technicalDebt ? 'Có' : 'Không';
        }
        
        // Update bars
        const maxRunway = 24; // Vốn bắt đầu 24 tháng
        const runwayPercent = Math.max(0, Math.min(100, (this.runway / maxRunway) * 100));
        const runwayBar = document.getElementById('runwayBar');
        if (runwayBar && runwayBar.style) {
            runwayBar.style.width = runwayPercent + '%';
            // Reset background color if runway is good
            if (this.runway >= 6) {
                runwayBar.style.background = 'linear-gradient(90deg, #00ffff 0%, #0080ff 100%)';
            }
        }
        
        // Morale: Max 120 (Hưng phấn)
        const moralePercent = Math.min(100, (this.morale / 120) * 100);
        const moraleBar = document.getElementById('moraleBar');
        if (moraleBar && moraleBar.style) {
            moraleBar.style.width = moralePercent + '%';
        }
        
        const progressBar = document.getElementById('progressBar');
        if (progressBar && progressBar.style) {
            progressBar.style.width = this.progress + '%';
        }
        
        const awarenessBar = document.getElementById('awarenessBar');
        if (awarenessBar && awarenessBar.style) {
            awarenessBar.style.width = this.awareness + '%';
        }
        
        const survivalBar = document.getElementById('survivalBar');
        if (survivalBar && survivalBar.style) {
            survivalBar.style.width = this.survivalPoints + '%';
        }
        
        // Color warnings
        if (this.runway < 6 && runwayBar && runwayBar.style) {
            runwayBar.style.background = 'linear-gradient(90deg, #ff4444 0%, #ff0000 100%)';
        }
        if (this.morale < 30 && moraleBar && moraleBar.style) {
            moraleBar.style.background = 'linear-gradient(90deg, #ff4444 0%, #ff0000 100%)';
        }
        if (this.survivalPoints < 30 && survivalBar && survivalBar.style) {
            survivalBar.style.background = 'linear-gradient(90deg, #ff0000 0%, #ff4444 50%, #ff8888 100%)';
        }
    }
    
    // Apply choice effects
    applyEffects(effects) {
        // Check for immediate game over
        if (effects.gameOver) {
            this.gameOver = true;
            this.showGameOver(effects.gameOverReason || 'Bạn đã thua...');
            return [];
        }
        
        // Check for risk-based failure (only if not already handled)
        if (effects.risk !== undefined && !effects.riskSuccess) {
            const roll = Math.random();
            if (roll < effects.risk && effects.riskFailure) {
                // Risk triggered - apply failure effects
                if (effects.riskFailure.gameOver) {
                    this.gameOver = true;
                    this.showGameOver(effects.riskFailure.gameOverReason || 'Rủi ro đã trở thành hiện thực...');
                    return [];
                } else {
                    // Apply failure effects but don't game over
                    return this.applyEffects(effects.riskFailure);
                }
            } else if (effects.riskSuccess) {
                // Risk passed - apply success effects
                return this.applyEffects(effects.riskSuccess);
            }
        }
        
        let logMessages = [];
        
        let runwayChanged = false;
        const oldRunwayBeforeChange = this.runway;
        if (effects.runway !== undefined) {
            const oldValue = this.runway;
            this.runway = Math.max(0, this.runway + effects.runway);
            const change = this.runway - oldValue;
            if (change !== 0) {
                logMessages.push(`💰 Vốn: ${change > 0 ? '+' : ''}${change} tháng`);
                runwayChanged = true;
            }
        }
        
        // Tự động trừ Morale: Nếu Vốn < 6 tháng và có thay đổi Vốn trong lượt đó, Morale tự động -5
        if (runwayChanged && this.runway < 6 && oldRunwayBeforeChange >= 6) {
            // Vốn vừa giảm xuống dưới 6 tháng
            const oldMorale = this.morale;
            this.morale = Math.max(0, this.morale - 5);
            const moraleChange = this.morale - oldMorale;
            if (moraleChange < 0) {
                logMessages.push(`🔥 Năng lượng: ${moraleChange}% (Vốn < 6 tháng - Căng thẳng tài chính)`);
            }
        } else if (runwayChanged && this.runway < 6 && oldRunwayBeforeChange < 6) {
            // Vốn đã < 6 và tiếp tục thay đổi (có thể tăng hoặc giảm)
            // Chỉ áp dụng nếu Vốn giảm (không áp dụng khi Vốn tăng trở lại)
            if (this.runway < oldRunwayBeforeChange) {
                const oldMorale = this.morale;
                this.morale = Math.max(0, this.morale - 5);
                const moraleChange = this.morale - oldMorale;
                if (moraleChange < 0) {
                    logMessages.push(`🔥 Năng lượng: ${moraleChange}% (Vốn < 6 tháng - Áp lực tăng)`);
                }
            }
        }
        
        // Track if morale was explicitly set in effects (before darkChoices processing)
        const moraleWasSet = effects.morale !== undefined;
        const moraleValueSet = effects.morale;
        
        // Process darkChoices FIRST to apply auto-penalties before applying explicit morale
        if (effects.darkChoices !== undefined && effects.darkChoices !== 0) {
            const oldValue = this.darkChoices;
            this.darkChoices += effects.darkChoices;
            this.darkChoices = Math.max(0, this.darkChoices);
            if (effects.darkChoices > 0) {
                logMessages.push(`⚠️ Điểm Hắc Ám: +${effects.darkChoices} (Tổng: ${this.darkChoices})`);
                
                // Auto-apply Morale penalty for dark choices if not explicitly decreased
                // Nguyên lý "Xây Khó - Phá Dễ": Lựa chọn Hắc Ám phải giảm Morale mạnh (-25%)
                // Chỉ áp dụng nếu morale chưa được set hoặc được set dương (không được tăng Morale từ dark choice)
                if (!moraleWasSet) {
                    // Morale not set - apply -25% penalty
                    const oldMorale = this.morale;
                    this.morale = Math.max(0, this.morale - 25);
                    const moraleChange = this.morale - oldMorale;
                    if (moraleChange < 0) {
                        logMessages.push(`🔥 Năng lượng: ${moraleChange}% (Lựa chọn Hắc Ám)`);
                    }
                } else if (moraleValueSet > 0) {
                    // Morale set to positive for dark choice - this is wrong, override to -25%
                    // But first, undo the positive morale that was already applied
                    const oldMorale = this.morale;
                    // Subtract the positive value that was added, then subtract 25
                    this.morale = Math.max(0, this.morale - moraleValueSet - 25);
                    const moraleChange = this.morale - oldMorale;
                    if (moraleChange < 0) {
                        logMessages.push(`🔥 Năng lượng: ${moraleChange}% (Lựa chọn Hắc Ám)`);
                    }
                }
                // If effects.morale < 0, it means level file already set a negative value, keep it
                
                // Auto-apply Survival Points penalty for dark choices if not explicitly set
                // Lựa chọn Hắc Ám: -15 đến -30 điểm (tùy mức độ)
                if (effects.survivalPoints === undefined) {
                    const penalty = -18; // Default -18 for dark choices
                    const oldSurvival = this.survivalPoints;
                    this.survivalPoints = Math.max(0, Math.min(100, this.survivalPoints + penalty));
                    const survivalChange = this.survivalPoints - oldSurvival;
                    if (survivalChange < 0) {
                        logMessages.push(`💀 Điểm Tồn Tại: ${survivalChange} (Lựa chọn Hắc Ám)`);
                    }
                }
            }
        }
        
        // Now apply morale (darkChoices penalty already applied above if needed)
        if (effects.morale !== undefined) {
            // Only apply if it wasn't a dark choice with positive morale (already handled above)
            if (!(effects.darkChoices > 0 && moraleValueSet > 0)) {
                const oldValue = this.morale;
                // Morale: Max 120 (Hưng phấn)
                this.morale = Math.max(0, Math.min(120, this.morale + effects.morale));
                const change = this.morale - oldValue;
                if (change !== 0) {
                    logMessages.push(`🔥 Năng lượng: ${change > 0 ? '+' : ''}${change}%`);
                    // Check for morale threshold effects
                    if (this.morale >= 100 && oldValue < 100) {
                        logMessages.push(`✨ Hưng phấn! Đội ngũ làm việc >100% công suất (+10% hiệu quả Progress)`);
                    } else if (this.morale < 50 && oldValue >= 50) {
                        logMessages.push(`⚠️ Đội ngũ rệu rã! Hiệu quả Progress giảm 20%`);
                    }
                }
            }
        }
        
        if (effects.progress !== undefined) {
            const oldValue = this.progress;
            let progressChange = effects.progress;
            
            // Cơ chế ngưỡng Morale ảnh hưởng Progress
            if (this.morale >= 100) {
                // Hưng phấn: Tăng 10% hiệu quả Progress
                progressChange = Math.floor(progressChange * 1.1);
                logMessages.push(`✨ Hưng phấn: Progress tăng thêm 10%`);
            } else if (this.morale < 50) {
                // Rệu rã: Giảm 20% hiệu quả Progress
                progressChange = Math.floor(progressChange * 0.8);
                logMessages.push(`⚠️ Rệu rã: Progress giảm 20%`);
            }
            
            // Giới hạn mềm Progress theo Level
            const maxProgressByLevel = this.getMaxProgressByLevel();
            const newProgress = Math.max(0, Math.min(maxProgressByLevel, this.progress + progressChange));
            const actualProgressChange = newProgress - this.progress;
            this.progress = newProgress;
            
            if (actualProgressChange !== 0) {
                logMessages.push(`📈 Tiến độ: ${actualProgressChange > 0 ? '+' : ''}${actualProgressChange}% (Tổng: ${this.progress}%)`);
                if (this.progress >= maxProgressByLevel && maxProgressByLevel < 100) {
                    logMessages.push(`🔒 Giới hạn Level ${this.currentLevel}: Tối đa ${maxProgressByLevel}%. Cần đến Level tiếp theo để mở khóa.`);
                }
                
                // Kiểm tra milestone Progress và cộng vốn (Doanh Thu Tự Động)
                this.checkProgressMilestones(logMessages);
            }
        }
        
        if (effects.awareness !== undefined) {
            const oldValue = this.awareness;
            // Awareness: Chỉ tăng, không giảm (Mắt của Sauron)
            // Chỉ cho phép tăng, không cho phép giảm (trừ khi là negative và được xử lý đặc biệt)
            const awarenessChange = effects.awareness;
            if (awarenessChange > 0) {
                // Tăng Awareness
                this.awareness = Math.min(100, this.awareness + awarenessChange);
                const change = this.awareness - oldValue;
                if (change !== 0) {
                    logMessages.push(`👁️ Cảnh giác: +${change}%`);
                    
                    // Cơ chế leo thang Awareness
                    const oldThreshold = this.getAwarenessThreshold(oldValue);
                    const newThreshold = this.getAwarenessThreshold(this.awareness);
                    if (oldThreshold !== newThreshold) {
                        this.handleAwarenessThresholdChange(newThreshold, logMessages);
                    }
                }
            }
            // Note: Không cho phép giảm Awareness (trừ khi có logic đặc biệt)
        }
        
        if (effects.survivalPoints !== undefined) {
            const oldValue = this.survivalPoints;
            this.survivalPoints = Math.max(0, Math.min(100, this.survivalPoints + effects.survivalPoints));
            const change = this.survivalPoints - oldValue;
            if (change !== 0) {
                logMessages.push(`💀 Điểm Tồn Tại: ${change > 0 ? '+' : ''}${change}`);
            }
        }
        
        if (effects.technicalDebt !== undefined) {
            this.technicalDebt = effects.technicalDebt;
            if (effects.technicalDebt) {
                logMessages.push(`⚠️ Nợ Kỹ Thuật được kích hoạt!`);
                // Technical debt = short-term decision: -8 survival points
                if (effects.survivalPoints === undefined) {
                    const oldSurvival = this.survivalPoints;
                    this.survivalPoints = Math.max(0, Math.min(100, this.survivalPoints - 8));
                    const survivalChange = this.survivalPoints - oldSurvival;
                    if (survivalChange < 0) {
                        logMessages.push(`💀 Điểm Tồn Tại: ${survivalChange} (Quyết định ngắn hạn)`);
                    }
                }
            }
        }
        
        if (effects.niche !== undefined) {
            this.niche = effects.niche;
        }
        
        if (effects.quality !== undefined) {
            this.quality = effects.quality;
        }
        
        // Auto decrease runway each level/event
        if (effects.levelAdvance !== undefined && effects.levelAdvance) {
            const burnRate = this.getBurnRateByLevel();
            this.runway = Math.max(0, this.runway - burnRate);
            logMessages.push(`⏳ Vốn tự động giảm: -${burnRate} tháng (Burn Rate Cấp ${this.currentLevel})`);
            runwayChanged = true;
        }
        
        // Cơ chế "Neo": Auto-decrease Morale khi Vốn < 6 tháng
        // Nhân viên lo sợ công ty phá sản
        // Áp dụng mỗi lượt nếu runway < 6 (nhưng chỉ log khi runway thay đổi để tránh spam)
        if (this.runway < 6 && this.runway > 0 && runwayChanged) {
            const oldMorale = this.morale;
            this.morale = Math.max(0, this.morale - 5);
            const moraleChange = this.morale - oldMorale;
            if (moraleChange < 0) {
                logMessages.push(`🔥 Năng lượng: ${moraleChange}% (Vốn thấp - Nhân viên lo sợ)`);
            }
        }
        
        this.updateUI();
        this.addLog(logMessages);
        this.checkGameState();
        
        return logMessages;
    }
    
    // Evaluate level performance and adjust Survival Points
    evaluateLevelPerformance() {
        let scoreChange = 0;
        const reasons = [];
        
        // 1. Đánh giá Vốn (Runway)
        // Vốn là yếu tố sống còn - ảnh hưởng mạnh nhất
        if (this.runway >= 20) {
            scoreChange += 5; // Vốn dồi dào: +5 điểm
            reasons.push('Vốn dồi dào');
        } else if (this.runway >= 12) {
            scoreChange += 2; // Vốn ổn định: +2 điểm
            reasons.push('Vốn ổn định');
        } else if (this.runway >= 6) {
            scoreChange += 0; // Vốn ở mức an toàn tối thiểu: không thay đổi
        } else if (this.runway >= 3) {
            scoreChange -= 5; // Vốn nguy hiểm: -5 điểm
            reasons.push('Vốn nguy hiểm');
        } else if (this.runway > 0) {
            scoreChange -= 10; // Vốn cực kỳ nguy hiểm: -10 điểm
            reasons.push('Vốn cực kỳ nguy hiểm');
        }
        
        // 2. Đánh giá Năng lượng (Morale)
        // Morale phản ánh sức khỏe đội ngũ
        if (this.morale >= 80) {
            scoreChange += 3; // Đội ngũ hăng hái: +3 điểm
            reasons.push('Đội ngũ hăng hái');
        } else if (this.morale >= 60) {
            scoreChange += 1; // Đội ngũ ổn định: +1 điểm
            reasons.push('Đội ngũ ổn định');
        } else if (this.morale >= 40) {
            scoreChange += 0; // Đội ngũ bình thường: không thay đổi
        } else if (this.morale >= 20) {
            scoreChange -= 3; // Đội ngũ mệt mỏi: -3 điểm
            reasons.push('Đội ngũ mệt mỏi');
        } else if (this.morale > 0) {
            scoreChange -= 8; // Đội ngũ kiệt quệ: -8 điểm
            reasons.push('Đội ngũ kiệt quệ');
        }
        
        // 3. Đánh giá Tiến độ (Progress)
        // Tiến độ cho thấy sự phát triển của startup
        if (this.progress >= 80) {
            scoreChange += 4; // Tiến độ xuất sắc: +4 điểm
            reasons.push('Tiến độ xuất sắc');
        } else if (this.progress >= 60) {
            scoreChange += 2; // Tiến độ tốt: +2 điểm
            reasons.push('Tiến độ tốt');
        } else if (this.progress >= 40) {
            scoreChange += 0; // Tiến độ trung bình: không thay đổi
        } else if (this.progress >= 20) {
            scoreChange -= 2; // Tiến độ chậm: -2 điểm
            reasons.push('Tiến độ chậm');
        } else {
            scoreChange -= 5; // Tiến độ rất chậm: -5 điểm
            reasons.push('Tiến độ rất chậm');
        }
        
        // 4. Đánh giá tổng hợp: Cân bằng tài nguyên
        // Nếu cả 3 chỉ số đều ở mức tốt → Bonus
        if (this.runway >= 12 && this.morale >= 60 && this.progress >= 40) {
            scoreChange += 3; // Quản lý tốt: +3 điểm bonus
            reasons.push('Quản lý tốt (Bonus)');
        }
        
        // Nếu cả 3 chỉ số đều ở mức nguy hiểm → Penalty nặng
        if (this.runway < 6 && this.morale < 40 && this.progress < 30) {
            scoreChange -= 5; // Quản lý kém: -5 điểm penalty
            reasons.push('Quản lý kém (Penalty)');
        }
        
        // Áp dụng thay đổi
        if (scoreChange !== 0) {
            const oldValue = this.survivalPoints;
            this.survivalPoints = Math.max(0, Math.min(100, this.survivalPoints + scoreChange));
            const actualChange = this.survivalPoints - oldValue;
            
            // Chỉ log nếu có thay đổi thực sự
            if (actualChange !== 0) {
                // Tạo log message với lý do
                const reasonText = reasons.length > 0 ? ` (${reasons.join(', ')})` : '';
                this.addLog([`💀 Đánh giá cấp: ${actualChange > 0 ? '+' : ''}${actualChange} điểm${reasonText} (Tổng: ${this.survivalPoints}/100)`]);
            }
        }
        
        return scoreChange;
    }
    
    // Check win/lose conditions
    checkGameState() {
        // Win Condition: Progress >= 100% AND Runway > 0 AND Morale > 0
        if (this.progress >= 100 && this.runway > 0 && this.morale > 0) {
            this.victory = true;
            this.showVictory();
            return;
        }
        
        // Lose Conditions
        if (this.runway <= 0 || this.morale <= 0 || this.survivalPoints <= 0) {
            this.gameOver = true;
            let reason = '';
            if (this.runway <= 0) {
                reason = 'Bạn đã hết vốn. Startup của bạn không thể tiếp tục...';
            } else if (this.morale <= 0) {
                reason = 'Bạn đã kiệt sức. Không còn năng lượng để tiếp tục...';
            } else if (this.survivalPoints <= 0) {
                reason = 'Bạn đã mất tất cả. Không còn gì để mất...';
            }
            this.showGameOver(reason);
            return;
        }
    }
    
    // Show game over overlay
    showGameOver(reason) {
        try {
            const overlay = document.getElementById('gameOverOverlay');
            const message = document.getElementById('overlayMessage');
            
            if (!overlay) {
                console.error('gameOverOverlay element not found!');
                alert('GAME OVER: ' + reason);
                return;
            }
            
            if (!message) {
                console.error('overlayMessage element not found!');
                alert('GAME OVER: ' + reason);
                return;
            }
            
            if (message.textContent !== undefined) {
                message.textContent = reason;
            }
            overlay.classList.add('active');
            
            // Setup buttons
            const retryBtn = document.getElementById('retryBtn');
            if (retryBtn) {
                retryBtn.onclick = () => {
                    location.reload();
                };
            }
            
            const menuBtn = document.getElementById('menuBtn');
            if (menuBtn) {
                menuBtn.onclick = () => {
                    window.location.href = 'main-menu.html';
                };
            }
        } catch (error) {
            console.error('Error in showGameOver:', error);
            alert('GAME OVER: ' + reason);
        }
    }
    
    // Show victory overlay
    showVictory() {
        const overlay = document.getElementById('victoryOverlay');
        if (overlay) {
            overlay.classList.add('active');
            
            // Setup next level button
            const nextBtn = document.getElementById('nextLevelBtn');
            if (nextBtn) {
                nextBtn.onclick = () => {
                    // Save state before moving
                    localStorage.setItem('gameState', JSON.stringify(this.getState()));
                    // Next level will be determined by the level file itself
                };
            }
        }
    }
    
    // Add log entry
    addLog(messages) {
        const logContent = document.getElementById('logContent');
        messages.forEach(msg => {
            const entry = document.createElement('div');
            entry.className = 'log-entry new';
            entry.textContent = msg;
            logContent.insertBefore(entry, logContent.firstChild);
            
            // Remove 'new' class after animation
            setTimeout(() => {
                entry.classList.remove('new');
            }, 500);
        });
        
        // Keep only last 10 entries
        while (logContent.children.length > 10) {
            logContent.removeChild(logContent.lastChild);
        }
    }
    
    // Get current game state (for saving)
    getState() {
        return {
            runway: this.runway,
            morale: this.morale,
            progress: this.progress,
            awareness: this.awareness,
            survivalPoints: this.survivalPoints,
            darkChoices: this.darkChoices,
            technicalDebt: this.technicalDebt,
            currentLevel: this.currentLevel,
            niche: this.niche,
            quality: this.quality,
            gameOver: this.gameOver,
            victory: this.victory,
            progressMilestonesReached: this.progressMilestonesReached,
            previousRunway: this.previousRunway,
            previousLevel: this.previousLevel
        };
    }
    
    // Load game state (for loading)
    loadState(state) {
        if (!state) return;
        
        // Load previous values
        const savedPreviousRunway = state.previousRunway;
        const savedPreviousLevel = state.previousLevel || 1;
        const savedCurrentLevel = state.currentLevel || 1;
        
        // Check if we're going back to a previous level
        // If current level < previous level, restore previous runway
        if (savedCurrentLevel < savedPreviousLevel && savedPreviousRunway !== undefined) {
            // Going back - restore runway
            this.runway = savedPreviousRunway;
            this.previousRunway = savedPreviousRunway;
            this.previousLevel = savedCurrentLevel;
            console.log(`🔄 Khôi phục vốn: ${savedPreviousRunway} tháng (quay lại từ cấp ${savedPreviousLevel} về cấp ${savedCurrentLevel})`);
        } else {
            // Normal load or going forward
            this.runway = state.runway || 24;
            this.previousRunway = savedPreviousRunway !== undefined ? savedPreviousRunway : (state.runway || 24);
            this.previousLevel = savedPreviousLevel;
        }
        
        this.morale = state.morale || 100;
        this.progress = state.progress || 0;
        this.awareness = state.awareness || 0;
        this.survivalPoints = state.survivalPoints || 100;
        this.darkChoices = state.darkChoices || 0;
        this.technicalDebt = state.technicalDebt || false;
        this.niche = state.niche || false;
        this.quality = state.quality || false;
        this.currentLevel = savedCurrentLevel;
        this.gameOver = state.gameOver || false;
        this.victory = state.victory || false;
        this.progressMilestonesReached = state.progressMilestonesReached || {
            25: false,
            50: false,
            75: false
        };
        
        // Refresh history stack from storage after loading state
        this.gameHistory = getHistoryStackFromStorage();
        
        this.updateUI();
    }
    
    // Get max progress by level (giới hạn mềm)
    getMaxProgressByLevel() {
        switch(this.currentLevel) {
            case 1:
            case 1.5:
                return 25; // Level 1: Tối đa ~25%
            case 2:
            case 2.5:
                return 60; // Level 2: Tối đa ~60%
            case 3:
            case 3.2:
            case 3.5:
                return 90; // Level 3: Tối đa ~90%
            case 4:
            default:
                return 100; // Level 4: Mở khóa 10% cuối
        }
    }
    
    // Get awareness threshold level
    getAwarenessThreshold(awareness) {
        if (awareness >= 90) return 'truy-sat';
        if (awareness >= 60) return 'de-doa';
        if (awareness >= 30) return 'de-y';
        return 'vo-hinh';
    }
    
    // Handle awareness threshold changes
    handleAwarenessThresholdChange(threshold, logMessages) {
        switch(threshold) {
            case 'de-y':
                logMessages.push(`⚠️ GĐQ bắt đầu để ý! Giá quảng cáo tăng 20%.`);
                break;
            case 'de-doa':
                logMessages.push(`🚨 GĐQ đe dọa! Kích hoạt các "Bẫy" chủ động. Cẩn thận!`);
                break;
            case 'truy-sat':
                if (this.progress < 80) {
                    logMessages.push(`💀 GĐQ truy sát toàn lực! Bạn chưa đủ mạnh (Progress < 80%). Nguy hiểm!`);
                } else {
                    logMessages.push(`🔥 GĐQ truy sát! Nhưng bạn đã đủ mạnh để đối đầu.`);
                }
                break;
        }
    }
    
    // Get burn rate by level (Burn Rate Cơ Bản theo Cấp Độ)
    getBurnRateByLevel() {
        // Cấp 0-1: -1 Vốn/lượt
        if (this.currentLevel <= 1) {
            return 1;
        }
        // Cấp 2: -2 Vốn/lượt
        else if (this.currentLevel <= 2) {
            return 2;
        }
        // Cấp 3+: -3 Vốn/lượt
        else {
            return 3;
        }
    }
    
    // Check Progress milestones and add runway (Doanh Thu Tự Động)
    checkProgressMilestones(logMessages) {
        const milestones = [
            { threshold: 25, bonus: 4, message: 'Đạt 25% Progress' },
            { threshold: 50, bonus: 6, message: 'Đạt 50% Progress' },
            { threshold: 75, bonus: 8, message: 'Đạt 75% Progress' }
        ];
        
        milestones.forEach(milestone => {
            if (this.progress >= milestone.threshold && !this.progressMilestonesReached[milestone.threshold]) {
                // Đạt milestone lần đầu - cộng vốn
                this.progressMilestonesReached[milestone.threshold] = true;
                const oldRunway = this.runway;
                this.runway += milestone.bonus;
                logMessages.push(`💰 Doanh thu tự động: +${milestone.bonus} Vốn (${milestone.message})`);
            }
        });
    }
    
    // Save current game state to history stack (called BEFORE changing level)
    saveGameState() {
        const stateSnapshot = JSON.parse(JSON.stringify(this.getState()));
        stateSnapshot.previousLevel = stateSnapshot.currentLevel;
        stateSnapshot.previousRunway = stateSnapshot.runway;
        
        this.gameHistory = getHistoryStackFromStorage();
        const lastSnapshot = this.gameHistory[this.gameHistory.length - 1];
        if (lastSnapshot && JSON.stringify(lastSnapshot) === JSON.stringify(stateSnapshot)) {
            console.log('ℹ️ Trạng thái trùng với bản ghi gần nhất. Bỏ qua lưu trùng lặp.');
            return;
        }
        this.gameHistory.push(stateSnapshot);
        if (this.gameHistory.length > 50) {
            this.gameHistory.shift();
        }
        saveHistoryStackToStorage(this.gameHistory);
        console.log(`💾 Đã lưu trạng thái. Lịch sử: ${this.gameHistory.length} bản ghi.`);
    }
    
    // Restore previous game state from history stack (called when Back button is pressed)
    restorePreviousState() {
        const previousState = popStateFromHistoryStack();
        if (previousState) {
            this.gameHistory = getHistoryStackFromStorage();
            this.loadState(previousState);
            this.updateUI();
            console.log(`🔄 Đã khôi phục trạng thái cũ. Vốn: ${this.runway} tháng, Level: ${this.currentLevel}`);
            console.log(`📊 Lịch sử còn lại: ${this.gameHistory.length} bản ghi.`);
            return true;
        }
        console.log('⚠️ Không có lịch sử để quay lại!');
        return false;
    }
    
    // Calculate Final Score based on ending type
    calculateFinalScore(endingType) {
        // 1. Điểm cơ bản từ chỉ số
        const survivalPointsScore = this.survivalPoints * 10;
        const runwayScore = this.runway * 50;
        const moraleScore = this.morale * 5;
        
        let baseScore = survivalPointsScore + runwayScore + moraleScore;
        
        // 2. Điểm thưởng theo Ending
        const endingBonuses = {
            'usurper': 5000,      // Kế vị (Boss)
            'official': 3000,     // Cục Cạnh Tranh (Gov)
            'alliance': 2000,     // Liên minh (Gov)
            'media': 1500,        // Truyền thông (Gov)
            'international': 1000, // Quốc tế (Gov)
            'survival': 1000      // Sống sót (Boss lost but alive)
        };
        
        const endingBonus = endingBonuses[endingType] || 0;
        
        const finalScore = baseScore + endingBonus;
        
        return {
            finalScore: finalScore,
            breakdown: {
                survivalPoints: survivalPointsScore,
                runway: runwayScore,
                morale: moraleScore,
                endingBonus: endingBonus,
                total: finalScore
            }
        };
    }
}

// Shuffle array function (Fisher-Yates shuffle)
function shuffleArray(array) {
    const shuffled = [...array]; // Create a copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize game engine globally
let gameEngine;

// Helper function to handle Back button (được dùng cho nút Back trong UI)
function handleBackButton() {
    try {
        sessionStorage.setItem(MANUAL_BACK_FLAG_KEY, '1');
    } catch (error) {
        console.warn('Không thể set flag cho manual back:', error);
    }
    window.history.back();
}

// Make function globally available for UI buttons
window.handleBackButton = handleBackButton;

// Restore state if this page was reached via browser back/forward navigation
restoreStateFromHistoryNavigation();

