document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const body = document.body;
    const choices = document.querySelectorAll('.rationalize-btn');
    const conscienceBar = document.getElementById('conscience-bar');

    const overlayPen = document.getElementById('overlay-pen');
    const scratchMark = document.querySelector('.scratch-mark');

    const btnStop = document.getElementById('btn-stop');
    const btnBorrow = document.getElementById('btn-borrow');

    const overlayBorrow = document.getElementById('overlay-borrow');
    const overlayGameOver = document.getElementById('overlay-gameover');

    const btnGotoLevel4 = document.getElementById('btn-goto-level4');

    // --- SECRET ENDING LOGIC (Added) ---
    const propPhone = document.getElementById('prop-phone');
    const secretChoiceBtn = document.getElementById('secret-choice');
    const choicesContainer = document.getElementById('choices-container'); // Element might need to be fetched if not already

    let secretClickCount = 0;
    let secretUnlocked = false;
    let idleTimer;

    // 1. Idle Timer: REMOVED (User request)
    // idleTimer = setTimeout(() => {
    //    unlockSecretEnding("time_wait");
    // }, 10000);

    // 2. Phone Click
    if (propPhone) {
        propPhone.addEventListener('click', () => {
            if (secretUnlocked) return;
            secretClickCount++;

            // Shake effect
            propPhone.style.transform = `scale(1.1) rotate(${Math.random() * 20 - 10}deg)`;
            setTimeout(() => { propPhone.style.transform = 'none'; }, 100);

            if (secretClickCount >= 5) {
                unlockSecretEnding("phone_spam");
            }
        });
    }

    // 3. Unlock Function
    function unlockSecretEnding(reason) {
        if (secretUnlocked) return;
        secretUnlocked = true;
        clearTimeout(idleTimer);

        // Visuals
        document.getElementById('choices-container').classList.add('secret-unlocked');
        secretChoiceBtn.classList.remove('hidden');
        console.log("Secret Unlocked: " + reason);
    }

    // 4. Secret Choice Click
    if (secretChoiceBtn) {
        secretChoiceBtn.addEventListener('click', () => {
            window.location.href = 'level4_5.html';
        });
    }

    // 5. Normal choices cancel timer
    choices.forEach(c => {
        c.addEventListener('click', () => clearTimeout(idleTimer));
    });

    // --- EXISTING LOGIC ---
    // 1. Hover Logic for Choices (Morality Drop)
    choices.forEach(choice => {
        choice.addEventListener('mouseenter', () => {
            body.classList.add('focused-choice');

            // Get data attributes
            const conscienceDrop = parseInt(choice.dataset.conscience); // e.g. -50

            // Visual update of bar
            // Assuming simplified start at 80% (which represents high conscience)
            // Let's just visually represent the drop relative to current width
            // For simplicity, we hardcode the visual feedback based on the choice

            let newWidth = 80 + conscienceDrop; // 80 - 50 = 30%
            if (newWidth < 0) newWidth = 5;

            conscienceBar.style.width = `${newWidth}%`;

            if (newWidth < 30) {
                conscienceBar.classList.add('dying');
                conscienceBar.textContent = "LƯƠNG TÂM: NGUY KỊCH";
            }
        });

        choice.addEventListener('mouseleave', () => {
            body.classList.remove('focused-choice');
            // Restore bar (optional, or keep it dropped as "temptation lingering")
            // Requirement says "slide down... right before player's eyes".
            // Let's reset it to simulate "it only drops if you CHOOSE it", 
            // but the prompt implies the bar reacts to the *thought* (hover).
            conscienceBar.style.width = '80%';
            conscienceBar.classList.remove('dying');
            conscienceBar.textContent = "LƯƠNG TÂM";
        });

        // 2. Click Choice -> Transition to Pen Event
        choice.addEventListener('click', () => {
            // Hide choices
            document.getElementById('choices-container').style.display = 'none';
            document.querySelector('.narrative-box').style.display = 'none';

            // Show Pen Overlay
            overlayPen.classList.remove('hidden');

            // Trigger Scratch Animation immediately
            setTimeout(() => {
                scratchMark.classList.add('animate');
            }, 500);
        });
    });

    // 3. Micro Choice: Stop (Sợ hãi tâm linh)
    btnStop.addEventListener('click', () => {
        // Game Over - Conscience Restored
        overlayPen.classList.add('hidden');
        overlayGameOver.classList.remove('hidden');
    });

    // 4. Micro Choice: Borrow Pen (Trembling Cursor)
    // Add shaking class for hover effect in CSS
    btnBorrow.classList.add('shaking');

    btnBorrow.addEventListener('click', () => {
        overlayPen.classList.add('hidden');
        overlayBorrow.classList.remove('hidden');
    });

    // 5. Proceed to Level 4
    // 5. Proceed to Level 4
    btnGotoLevel4.addEventListener('click', () => {
        // Transition to Level 4
        window.location.href = 'level4.html';
    });
});
