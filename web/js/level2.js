document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const body = document.body;
    const btnRefuse = document.getElementById('btn-refuse');
    const btnConsider = document.getElementById('btn-consider');

    const briefcaseContainer = document.getElementById('briefcase');
    const newspaperCover = document.getElementById('newspaper');

    const overlayGameOver = document.getElementById('overlay-gameover');
    const overlayInnocent = document.getElementById('overlay-innocent');

    const btnGotoLevel3 = document.getElementById('btn-goto-level3'); // This is now .btn-lie
    const characterWrapper = document.querySelector('.character-wrapper');
    const keywords = document.querySelectorAll('.keyword');

    // 1. Hover Effect for "Consider" -> Tunnel Vision
    btnConsider.addEventListener('mouseenter', () => {
        body.classList.add('considering-money');
    });

    btnConsider.addEventListener('mouseleave', () => {
        body.classList.remove('considering-money');
    });

    // 2. Refuse Choice -> Game Over
    // 2. Refuse Choice -> Game Over
    // 2. Refuse Choice -> Game Over
    // Force direct handler to avoid conflicts
    if (btnRefuse) {
        btnRefuse.onclick = function () {
            console.log("REFUSE DETECTED: Forcing Overlay");
            const overlay = document.getElementById('overlay-gameover');
            if (overlay) {
                overlay.classList.remove('hidden');
                overlay.style.display = 'flex'; // FORCE display

                // Hide main game container to avoid z-index fighting (just in case)
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    // Don't remove it, just lower its stack or hide children except overlay?
                    // actually if overlay is INSIDE, we can't hide container.
                    // But overlay should be fixed.
                }
            } else {
                alert("Error: Game Over Overlay Not Found!");
            }
        };
    }

    // 3. Consider Choice -> Trigger "Event 2: Innocent Couple"
    btnConsider.addEventListener('click', () => {
        // a. Show Newspaper covering the money (Guilt Start)
        newspaperCover.classList.remove('hidden');

        // Remove tunnel vision (reset for new scene atmosphere)
        body.classList.remove('considering-money');

        // Show Innocent Overlay
        setTimeout(() => {
            overlayInnocent.classList.remove('hidden');

            // Trigger Text Irony Reveal after delay
            setTimeout(() => {
                keywords.forEach(k => k.classList.add('reveal'));

                // Trigger Newspaper Flutter (Leaking Guilt)
                newspaperCover.classList.add('flutter');
            }, 1500);

        }, 500);
    });

    // 4. Stare Interaction (The Challenge)
    // When hovering the "Lie" button, eyes zoom in
    if (btnGotoLevel3) {
        btnGotoLevel3.addEventListener('mouseenter', () => {
            if (characterWrapper) characterWrapper.classList.add('staring');
            newspaperCover.style.transform = "rotate(-5deg) translateY(-10px)"; // Newspaper reacts furiously
        });

        btnGotoLevel3.addEventListener('mouseleave', () => {
            if (characterWrapper) characterWrapper.classList.remove('staring');
            newspaperCover.style.transform = ""; // Reset
        });

        // 5. Navigate to Level 3
        btnGotoLevel3.addEventListener('click', () => {
            // Transition to Level 3
            window.location.href = 'level3.html';
        });
    }
});
