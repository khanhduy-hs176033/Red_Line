/**
 * Main Menu JavaScript
 * THE RED LINE - LẰN RANH ĐẠO ĐỨC
 * 
 * Handles:
 * - Wavering Psychology Effect on button hover
 * - Screen distortion and noise effects
 * - City background animation
 * - Game transitions
 */

document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // DOM ELEMENTS
    // ============================================
    const startBtn = document.getElementById('startBtn');
    const mainContainer = document.getElementById('mainContainer');
    const noiseOverlay = document.getElementById('noiseOverlay');
    const transitionOverlay = document.getElementById('transitionOverlay');
    const cityCanvas = document.getElementById('cityCanvas');
    const optionsBtn = document.getElementById('optionsBtn');
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const guideBtn = document.getElementById('guideBtn');

    // ============================================
    // WAVERING PSYCHOLOGY EFFECT
    // Khi hover nút Bắt đầu - toàn màn hình bị nhiễu
    // ============================================

    let waveringTimeout = null;
    let isWavering = false;

    function activateWaveringPsychology() {
        if (isWavering) return;
        isWavering = true;

        // Add wavering class to main container
        mainContainer.classList.add('wavering-psychology');

        // Add active class to body for global effects
        document.body.classList.add('wavering-active');

        // Activate noise overlay
        if (noiseOverlay) {
            noiseOverlay.classList.add('active');
        }

        // Optional: Play distortion sound
        playDistortionSound();
    }

    function deactivateWaveringPsychology() {
        isWavering = false;

        // Remove wavering class from main container
        mainContainer.classList.remove('wavering-psychology');

        // Remove active class from body
        document.body.classList.remove('wavering-active');

        // Deactivate noise overlay
        if (noiseOverlay) {
            noiseOverlay.classList.remove('active');
        }

        // Stop distortion sound
        stopDistortionSound();
    }

    // Attach hover events to start button
    if (startBtn) {
        startBtn.addEventListener('mouseenter', function () {
            // Small delay before activating for smoother experience
            waveringTimeout = setTimeout(activateWaveringPsychology, 50);
        });

        startBtn.addEventListener('mouseleave', function () {
            // Clear any pending activation
            if (waveringTimeout) {
                clearTimeout(waveringTimeout);
            }
            // Deactivate with slight delay for smoothness
            setTimeout(deactivateWaveringPsychology, 100);
        });

        // Handle click - transition to game
        startBtn.addEventListener('click', function () {
            startGameTransition();
        });
    }

    // ============================================
    // AUDIO EFFECTS (Optional)
    // ============================================

    let distortionAudio = null;

    function playDistortionSound() {
        // Create audio context for distortion sound
        // This is optional - can be replaced with actual audio file
        try {
            if (!distortionAudio) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    const audioCtx = new AudioContext();
                    const oscillator = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();

                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(50, audioCtx.currentTime);
                    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);

                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);

                    oscillator.start();

                    distortionAudio = { audioCtx, oscillator, gainNode };
                }
            }
        } catch (e) {
            // Audio not supported or blocked
            console.log('Audio not available');
        }
    }

    function stopDistortionSound() {
        if (distortionAudio) {
            try {
                distortionAudio.oscillator.stop();
                distortionAudio.audioCtx.close();
            } catch (e) {
                // Already stopped
            }
            distortionAudio = null;
        }
    }

    // ============================================
    // GAME TRANSITION
    // ============================================

    function startGameTransition() {
        // Deactivate wavering effect
        deactivateWaveringPsychology();

        // Activate transition overlay
        if (transitionOverlay) {
            transitionOverlay.classList.add('active');
        }

        // Add final intense glitch before transition
        mainContainer.classList.add('final-glitch');

        // Transition to game after animation
        setTimeout(function () {
            // Navigate to game or load game scene
            window.location.href = './level1.html';
            console.log('Transitioning to game...');
        }, 1500);
    }

    // ============================================
    // CITY BACKGROUND ANIMATION
    // ============================================

    function initCityCanvas() {
        if (!cityCanvas) return;

        const ctx = cityCanvas.getContext('2d');

        // Set canvas size
        function resizeCanvas() {
            cityCanvas.width = window.innerWidth;
            cityCanvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // City buildings data
        const buildings = [];
        const numBuildings = 30;

        for (let i = 0; i < numBuildings; i++) {
            buildings.push({
                x: Math.random() * window.innerWidth,
                width: 30 + Math.random() * 80,
                height: 100 + Math.random() * 300,
                windowRows: 5 + Math.floor(Math.random() * 15),
                windowCols: 2 + Math.floor(Math.random() * 4),
                color: `rgba(${20 + Math.random() * 30}, ${10 + Math.random() * 20}, ${30 + Math.random() * 40}, 0.9)`
            });
        }

        // Animate city
        function drawCity() {
            // Clear canvas with gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, cityCanvas.height);
            gradient.addColorStop(0, '#0a0008');
            gradient.addColorStop(0.5, '#1a0a12');
            gradient.addColorStop(1, '#0d0d1a');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, cityCanvas.width, cityCanvas.height);

            // Draw buildings
            buildings.forEach(building => {
                const bottomY = cityCanvas.height;

                // Building body
                ctx.fillStyle = building.color;
                ctx.fillRect(
                    building.x,
                    bottomY - building.height,
                    building.width,
                    building.height
                );

                // Windows
                const windowWidth = building.width / (building.windowCols * 2 + 1);
                const windowHeight = building.height / (building.windowRows * 2 + 1);

                for (let row = 0; row < building.windowRows; row++) {
                    for (let col = 0; col < building.windowCols; col++) {
                        // Random window light
                        const isLit = Math.random() > 0.3;
                        if (isLit) {
                            const windowX = building.x + windowWidth * (col * 2 + 1);
                            const windowY = bottomY - building.height + windowHeight * (row * 2 + 1);

                            ctx.fillStyle = Math.random() > 0.5
                                ? 'rgba(255, 200, 100, 0.8)'
                                : 'rgba(100, 200, 255, 0.6)';
                            ctx.fillRect(windowX, windowY, windowWidth, windowHeight);
                        }
                    }
                }
            });

            // Draw red glow horizon line
            const horizonGradient = ctx.createLinearGradient(0, cityCanvas.height * 0.7, 0, cityCanvas.height);
            horizonGradient.addColorStop(0, 'transparent');
            horizonGradient.addColorStop(0.5, 'rgba(255, 0, 64, 0.2)');
            horizonGradient.addColorStop(1, 'rgba(255, 0, 64, 0.1)');
            ctx.fillStyle = horizonGradient;
            ctx.fillRect(0, cityCanvas.height * 0.7, cityCanvas.width, cityCanvas.height * 0.3);

            // Request next frame with slow update
            setTimeout(() => requestAnimationFrame(drawCity), 200);
        }

        drawCity();
    }

    initCityCanvas();

    // ============================================
    // SECONDARY BUTTON HANDLERS
    // ============================================

    if (optionsBtn) {
        optionsBtn.addEventListener('click', function () {
            console.log('Options clicked');
            // TODO: Show options menu
        });
    }

    if (leaderboardBtn) {
        leaderboardBtn.addEventListener('click', function () {
            console.log('Leaderboard clicked');
            // TODO: Show leaderboard
        });
    }

    if (guideBtn) {
        guideBtn.addEventListener('click', function () {
            console.log('Guide clicked');
            // TODO: Show guide
        });
    }

    // ============================================
    // GLITCH TEXT RANDOMIZATION
    // Occasionally randomize the glitch effect
    // ============================================

    const moralGlitch = document.querySelector('.moral-glitch');

    if (moralGlitch) {
        // Random intense glitch bursts
        setInterval(function () {
            if (Math.random() > 0.7) {
                moralGlitch.style.animation = 'none';
                moralGlitch.offsetHeight; // Trigger reflow
                moralGlitch.style.animation = null;
            }
        }, 5000);
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================

    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'Enter':
            case ' ':
                if (startBtn) {
                    startBtn.click();
                }
                break;
            case 'Escape':
                deactivateWaveringPsychology();
                break;
        }
    });

    console.log('Main Menu initialized - Wavering Psychology Effect ready');
});
