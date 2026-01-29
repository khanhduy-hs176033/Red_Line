document.addEventListener('DOMContentLoaded', () => {
    // Sequence Steps
    const step1 = document.getElementById('seq-step-1'); // Decision
    const step2 = document.getElementById('seq-step-2'); // Timeline
    const step3 = document.getElementById('seq-step-3'); // Flashback
    const step4 = document.getElementById('seq-step-4'); // Climax
    const siren = document.getElementById('siren-alert'); // Siren inside step 4
    const step5 = document.getElementById('seq-step-5'); // Conclusion

    // Auto-play the cinematic sequence
    const timeline = [
        { time: 1000, action: () => show(step1) },
        { time: 5000, action: () => show(step2) }, // +4s reading time
        { time: 11000, action: () => show(step3) }, // +6s reading time
        { time: 18000, action: () => show(step4) }, // +7s reading time (Flashback is dense)
        { time: 24000, action: () => siren.classList.remove('hidden') }, // Siren triggers at end of speech
        {
            time: 28000, action: () => {
                // Hide previous chaos to focus on resolution? 
                // Or just append. Let's append but scroll to bottom.
                show(step5);
                scrollToBottom();
            }
        }
    ];

    // Execute Timeline
    timeline.forEach(event => {
        setTimeout(event.action, event.time);
    });

    function show(element) {
        if (element) {
            element.classList.remove('hidden');
            scrollToBottom();
        }
    }

    function scrollToBottom() {
        const container = document.querySelector('.endgame-container');
        if (container) {
            // Smooth scroll to bottom
            setTimeout(() => {
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            }, 100);
        }
    }
});
