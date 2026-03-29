// Animated Background
const bg = document.getElementById("animated-bg");
if (bg) {
    for (let i = 0; i < 15; i++) {
        let c = document.createElement("div");
        let size = Math.random() * 120 + 40;
        c.classList.add("bg-circle");
        c.style.width = size + "px";
        c.style.height = size + "px";
        c.style.left = Math.random() * window.innerWidth + "px";
        c.style.animationDuration = Math.random() * 15 + 8 + "s";
        c.style.animationDelay = Math.random() * 10 + "s";
        bg.appendChild(c);
    }
}

// Sticky nav scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.sticky-nav');
    if (nav && window.scrollY > 50) nav.classList.add('scrolled');
    else if (nav) nav.classList.remove('scrolled');
});