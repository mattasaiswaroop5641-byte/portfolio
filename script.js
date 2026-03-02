document.addEventListener("DOMContentLoaded", () => {
    const dot = document.getElementById("cursor-dot");
    const outline = document.getElementById("cursor-outline");
    const progressBar = document.getElementById("progress-bar");

    // 1. Custom Mouse Follower
    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;

        // Outline follows with a slight delay for "lag" effect
        outline.animate({
            left: `${posX - 20}px`,
            top: `${posY - 20}px`
        }, { duration: 500, fill: "forwards" });

        // Spotlight Effect for Cards
        document.querySelectorAll('.glass-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // 2. Scroll Progress Tracker
    window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // 3. Typing Logic (Restored)
    const textElement = document.getElementById("typing-text");
    const words = ["Zero-Knowledge Systems.", "Secure Ratchet Protocols.", "QA Automation Pipelines.", "Forward Secrecy."];
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        textElement.textContent = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);
        charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

        let typeSpeed = isDeleting ? 50 : 150;
        if (!isDeleting && charIndex === currentWord.length) { isDeleting = true; typeSpeed = 2000; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typeSpeed = 500; }
        setTimeout(type, typeSpeed);
    }

    // 4. Interaction Feedback (Cursor grows on links)
    document.querySelectorAll('a, button, .cert-btn').forEach(link => {
        link.addEventListener('mouseenter', () => {
            outline.style.transform = "scale(2)";
            outline.style.backgroundColor = "rgba(34, 197, 94, 0.1)";
        });
        link.addEventListener('mouseleave', () => {
            outline.style.transform = "scale(1)";
            outline.style.backgroundColor = "transparent";
        });
    });

    // 5. Scroll Reveal Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.style.filter = "blur(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    type();
});