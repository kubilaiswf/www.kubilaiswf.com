document.addEventListener("DOMContentLoaded", function() {
    const phrases = [
        "junior developer",
        "software enthusiast",
        "web designer",
        "AI/ML enthusiast",
        "computer engineer",
        "WW2 history buff"
    ];

    const typingSpeed = 80;
    const erasingSpeed = 40;
    const delayBetweenPhrases = 1500;

    let phraseIndex = 0;
    let charIndex = 0;
    let isTyping = true;
    let timeoutId = null;
    const textElement = document.getElementById("typing-text");

    // Sayfa görünür değilse animasyonu durdur (performans için)
    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible && !timeoutId) {
            typeText();
        }
    });

    function typeText() {
        if (!isVisible) {
            timeoutId = null;
            return;
        }

        const currentPhrase = phrases[phraseIndex];

        if (isTyping) {
            if (charIndex < currentPhrase.length) {
                // substring kullan - daha verimli
                textElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                timeoutId = setTimeout(typeText, typingSpeed);
            } else {
                isTyping = false;
                timeoutId = setTimeout(typeText, delayBetweenPhrases);
            }
        } else {
            if (charIndex > 0) {
                charIndex--;
                textElement.textContent = currentPhrase.substring(0, charIndex);
                timeoutId = setTimeout(typeText, erasingSpeed);
            } else {
                isTyping = true;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                timeoutId = setTimeout(typeText, typingSpeed);
            }
        }
    }

    typeText();

    const animatedTitle = document.querySelector('.animated-title');
    if (animatedTitle) {
        animatedTitle.classList.add('show');
    }
});
