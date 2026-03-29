// Animated Background
const bg = document.getElementById("animated-bg");
if (bg) {
    for (let i = 0; i < 12; i++) {
        let c = document.createElement("div");
        let size = Math.random() * 100 + 30;
        c.classList.add("bg-circle");
        c.style.width = size + "px";
        c.style.height = size + "px";
        c.style.left = Math.random() * window.innerWidth + "px";
        c.style.animationDuration = Math.random() * 8 + 6 + "s";
        c.style.animationDelay = Math.random() * 5 + "s";
        bg.appendChild(c);
    }
}

// Sticky nav scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.sticky-nav');
    if (nav && window.scrollY > 50) nav.classList.add('scrolled');
    else if (nav) nav.classList.remove('scrolled');
});