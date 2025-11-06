// Main Menu JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCityCanvas();
    initButtons();
    initStoryAnimation();
});

// City Canvas - Cyberpunk City Background
function initCityCanvas() {
    const canvas = document.getElementById('cityCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawCity();
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Draw Cyberpunk City
    function drawCity() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.5, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw skyscrapers
        const buildingCount = 15;
        const buildingWidth = canvas.width / buildingCount;
        
        for (let i = 0; i < buildingCount; i++) {
            const x = i * buildingWidth;
            const height = Math.random() * (canvas.height * 0.6) + canvas.height * 0.2;
            const width = buildingWidth * (0.7 + Math.random() * 0.3);
            
            // Building shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(x + 5, canvas.height, width, -height);
            
            // Building
            const buildingGradient = ctx.createLinearGradient(x, canvas.height, x, canvas.height - height);
            buildingGradient.addColorStop(0, '#1a1a2e');
            buildingGradient.addColorStop(1, '#0a0a1a');
            ctx.fillStyle = buildingGradient;
            ctx.fillRect(x, canvas.height - height, width, height);
            
            // Windows
            ctx.fillStyle = 'rgba(255, 255, 100, 0.3)';
            const windowRows = Math.floor(height / 30);
            const windowCols = Math.floor(width / 20);
            
            for (let row = 0; row < windowRows; row++) {
                for (let col = 0; col < windowCols; col++) {
                    if (Math.random() > 0.5) {
                        ctx.fillRect(
                            x + col * 20 + 5,
                            canvas.height - height + row * 30 + 5,
                            10,
                            15
                        );
                    }
                }
            }
        }
        
        // Draw Giant Tower (center, glowing red)
        const towerX = canvas.width * 0.5;
        const towerY = canvas.height * 0.3;
        const towerWidth = 60;
        const towerHeight = canvas.height * 0.7;
        
        // Tower glow
        const towerGlow = ctx.createRadialGradient(towerX, towerY, 0, towerX, towerY, 200);
        towerGlow.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
        towerGlow.addColorStop(0.5, 'rgba(255, 0, 0, 0.3)');
        towerGlow.addColorStop(1, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = towerGlow;
        ctx.fillRect(towerX - 200, towerY - 200, 400, 400);
        
        // Tower
        const towerGradient = ctx.createLinearGradient(towerX - towerWidth/2, canvas.height, towerX - towerWidth/2, towerY);
        towerGradient.addColorStop(0, '#660000');
        towerGradient.addColorStop(1, '#ff0000');
        ctx.fillStyle = towerGradient;
        ctx.fillRect(towerX - towerWidth/2, canvas.height - towerHeight, towerWidth, towerHeight);
        
        // Tower lights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 10; i++) {
            const lightY = canvas.height - towerHeight + i * (towerHeight / 10);
            ctx.fillRect(towerX - towerWidth/2 + 10, lightY, towerWidth - 20, 5);
        }
        
        // Player dot (small blue light at edge)
        const playerX = canvas.width * 0.1;
        const playerY = canvas.height * 0.85;
        
        // Player glow
        const playerGlow = ctx.createRadialGradient(playerX, playerY, 0, playerX, playerY, 50);
        playerGlow.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
        playerGlow.addColorStop(0.5, 'rgba(0, 255, 255, 0.3)');
        playerGlow.addColorStop(1, 'rgba(0, 255, 255, 0)');
        ctx.fillStyle = playerGlow;
        ctx.fillRect(playerX - 50, playerY - 50, 100, 100);
        
        // Player dot
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(playerX, playerY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Add pulsing effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00ffff';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    // Animate city (subtle animations)
    setInterval(() => {
        drawCity();
    }, 100);
}

// Initialize Buttons
function initButtons() {
    const startBtn = document.getElementById('startBtn');
    const optionsBtn = document.getElementById('optionsBtn');
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const guideBtn = document.getElementById('guideBtn');
    
    // Start Button - Main Action
    startBtn.addEventListener('click', function() {
        startTransition();
    });
    
    // Secondary Buttons
    optionsBtn.addEventListener('click', function() {
        // TODO: Open options menu
        alert('Tùy chọn sẽ được triển khai sau');
    });
    
    leaderboardBtn.addEventListener('click', function() {
        // TODO: Open leaderboard
        alert('Bảng xếp hạng sẽ được triển khai sau');
    });
    
    guideBtn.addEventListener('click', function() {
        window.location.href = 'survival-guide.html';
    });
}

// Story Animation
function initStoryAnimation() {
    // Story text already has CSS animations
    // Can add additional JavaScript animations if needed
}

// Start Transition Effect
function startTransition() {
    const overlay = document.getElementById('transitionOverlay');
    const playerDot = document.getElementById('playerDot');
    const giantTower = document.getElementById('giantTower');
    const mainContainer = document.querySelector('.main-container');
    
    // Activate overlay
    overlay.classList.add('active');
    
    // Fade out main container
    mainContainer.style.transition = 'opacity 1s ease';
    mainContainer.style.opacity = '0';
    
    // Animate player dot rushing into the city
    setTimeout(() => {
        playerDot.style.transition = 'all 2s ease-in-out';
        playerDot.style.left = '50%';
        playerDot.style.bottom = '50%';
        playerDot.style.transform = 'translateX(-50%) translateY(50%)';
        playerDot.style.width = '5px';
        playerDot.style.height = '5px';
        playerDot.style.opacity = '0';
    }, 500);
    
    // After transition, redirect to level 1
    setTimeout(() => {
        // Set flag to indicate fresh start from main menu
        sessionStorage.setItem('fromMainMenu', 'true');
        // Clear old game state for fresh start
        localStorage.removeItem('gameState');
        window.location.href = 'level1.html';
    }, 3500);
}

// Background Music (optional - requires audio file)
function initMusic() {
    const bgMusic = document.getElementById('bgMusic');
    // Uncomment and add audio file path when available
    // bgMusic.src = 'audio/cyberpunk-theme.mp3';
    // bgMusic.volume = 0.3;
    
    // Play music when user interacts (browser autoplay policy)
    document.addEventListener('click', function() {
        if (bgMusic.src && bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Audio play failed:', e));
        }
    }, { once: true });
}

// Initialize music
initMusic();

