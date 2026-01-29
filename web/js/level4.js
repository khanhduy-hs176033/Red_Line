document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const body = document.body;
    const overlayBoss = document.getElementById('overlay-boss');
    const btnGoHome = document.getElementById('btn-go-home');

    const sceneHome = document.getElementById('scene-home');
    const wifeTextContainer = document.getElementById('wife-text');

    const btnLie = document.getElementById('btn-lie');
    const btnConfess = document.getElementById('btn-confess');

    const endingFake = document.getElementById('ending-fake');
    const endingConscience = document.getElementById('ending-conscience');

    // 1. Initial State: Boss Call
    // Trigger "Marionette Effect" immediately
    setTimeout(() => {
        body.classList.add('trapped');
    }, 1000);

    // 2. Go Home -> Scene Transition
    btnGoHome.addEventListener('click', () => {
        overlayBoss.classList.add('hidden');
        sceneHome.classList.remove('hidden');

        // Start Typing Effect for Wife
        const message = "Anh Minh... Tiền đâu ra thế này? \nCó phải tiền từ dự án X không? \nNếu con mình sống bằng mạng của người khác, liệu nó có hạnh phúc không?";
        typeWriter(wifeTextContainer, message, 0);
    });

    // Typing Effect Function
    function typeWriter(element, text, i) {
        if (i < text.length) {
            element.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
            // Randomize speed for "trembling" feel
            const speed = Math.random() * 50 + 30;
            setTimeout(() => typeWriter(element, text, i + 1), speed);
        }
    }

    // 3. Choice: Lie (Fake Hero) -> Trigger Epilogue Sequence
    btnLie.addEventListener('click', () => {
        sceneHome.classList.add('hidden');
        // Instead of showing static ending, start the cinema sequence
        startEpilogueSequence();
    });

    // 4. Choice: Confess (Conscience)
    btnConfess.addEventListener('click', () => {
        sceneHome.classList.add('hidden');
        endingConscience.classList.remove('hidden');
        // Optional: Silence / Heartbeat
    });

    // Epilogue Logic
    const epilogueLines = [
        { text: "2 năm sau...", delay: 3000, style: "time-stamp" },
        { text: "Chung cư X xảy ra hỏa hoạn nghiêm trọng.\nHệ thống PCCC không hoạt động.", delay: 5000, style: "news-flash" },
        { text: "14 người thương vong.\nTrong đó có người vợ trẻ và đứa con 2 tuổi năm xưa.", delay: 6000, style: "tragedy" },
        { text: "Chữ ký của bạn nằm ở trang đầu tiên của hồ sơ điều tra.", delay: 5000, style: "cold-fact" },
        { text: "Con gái bạn hỏi:\n'Bố ơi, sao tivi lại nhắc tên bố?'", delay: 7000, style: "final-stab" },
        { text: "GAME OVER", delay: 5000, style: "game-over-text-epilogue" },
        { text: "\"Tham nhũng không bắt đầu từ sự tham lam.\nNó bắt đầu từ một tình huống không còn lựa chọn,\nvà kết thúc bằng một lời tự lừa dối bản thân.\"", delay: 12000, style: "moral-message" }
    ];

    async function startEpilogueSequence() {
        // 1. Clear UI and set mode
        body.innerHTML = '';
        body.className = 'epilogue-mode'; // Black screen

        // 2. Create container
        const container = document.createElement('div');
        container.id = 'epilogue-container';
        body.appendChild(container);

        // 3. Run lines
        for (let line of epilogueLines) {
            await showLine(container, line);
        }

        // Reload button
        const btnReload = document.createElement('button');
        btnReload.innerText = "CHƠI LẠI";
        btnReload.className = "btn-restart-epilogue fade-in-text";
        btnReload.onclick = () => window.location.href = 'main-menu.html';
        container.appendChild(btnReload);
    }

    function showLine(container, lineData) {
        return new Promise(resolve => {
            const p = document.createElement('p');
            p.innerText = lineData.text;
            p.className = `fade-in-text ${lineData.style}`;

            container.innerHTML = ''; // Clear previous
            container.appendChild(p);

            // Wait for reading time then fade out
            setTimeout(() => {
                if (lineData.style !== 'moral-message' && lineData.style !== 'game-over-text-epilogue') {
                    p.classList.add('fade-out');
                }

                // If it's the final message, keep it longer, but resolve to allow button
                setTimeout(resolve, 1000);
            }, lineData.delay);
        });
    }
});
