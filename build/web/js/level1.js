document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const btnSell = document.getElementById('btn-sell');
    const btnLoan = document.getElementById('btn-loan');
    const btnCharity = document.getElementById('btn-charity');

    const overlayCall = document.getElementById('overlay-call');
    const overlayCrisis = document.getElementById('overlay-crisis');
    const overlayGameOver = document.getElementById('overlay-gameover');

    const btnNextEvent = document.getElementById('btn-next-event');
    const btnGotoLevel2 = document.getElementById('btn-goto-level2');

    const daysDisplay = document.getElementById('days-display');

    // 1. Black Market Choice (Risk) -> Denied
    btnLoan.addEventListener('click', () => {
        if (btnLoan.classList.contains('disabled')) return;

        // Play static noise sound effect here if audio existed

        // Add visual denied effect
        btnLoan.classList.add('disabled');

        // Optional: Shake the screen slightly
        document.body.style.animation = 'jitter 0.2s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 200);
    });

    // 2. Charity Choice (Passive) -> Game Over
    btnCharity.addEventListener('click', () => {
        // "System Shutdown" effect
        const container = document.querySelector('.game-container');
        container.style.transition = 'all 1s ease';
        container.style.transform = 'scale(0.01) skew(20deg)';
        container.style.opacity = '0';

        setTimeout(() => {
            overlayGameOver.classList.remove('hidden');
            container.style.display = 'none'; // Completely hide original UI
        }, 1000);
    });

    // 3. Sell House Choice (Official) -> Trigger Narrative Events
    btnSell.addEventListener('click', () => {
        // Dim background logic handled by overlay class
        overlayCall.classList.remove('hidden');
    });

    // Handle "Next Event" (Bank Call -> Hospital/Crisis)
    btnNextEvent.addEventListener('click', () => {
        // Hide Bank Call
        overlayCall.classList.add('hidden');

        // Show Crisis Overlay
        overlayCrisis.classList.remove('hidden');

        // Update HUD silently while user looks at overlay
        setTimeout(() => {
            daysDisplay.textContent = "7 NGÀY";
            daysDisplay.classList.add('critical');
            daysDisplay.style.color = 'red';
        }, 1000);
    });

    // Handle "Go to Level 2"
    btnGotoLevel2.addEventListener('click', () => {
        // Transition to Level 2
        window.location.href = 'level2.html';
    });
});
