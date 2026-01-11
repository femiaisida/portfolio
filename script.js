// =============================
// Hero Typing Animation
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const heroCode = document.querySelector(".hero-code pre code");
  const codeLines = heroCode.textContent.split("\n");
  heroCode.textContent = ""; // clear for typing

  let lineIndex = 0;

  function typeLine() {
    if (lineIndex < codeLines.length) {
      const line = document.createElement("div");
      line.classList.add("code-line");
      heroCode.appendChild(line);

      let charIndex = 0;
      function typeChar() {
        if (charIndex < codeLines[lineIndex].length) {
          line.textContent += codeLines[lineIndex][charIndex];
          charIndex++;
          setTimeout(typeChar, 25);
        } else {
          lineIndex++;
          typeLine(); // next line
        }
      }
      typeChar();
    } else {
      // Add final blinking cursor only at the end
      const cursor = document.createElement("span");
      cursor.classList.add("cursor");
      cursor.textContent = "▌";
      heroCode.appendChild(cursor);
      setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
      }, 500);
    }
  }

  typeLine();
});

// =============================
// Scroll Fade-In for Cards
// =============================
const cards = document.querySelectorAll(".card, .embed-card, .about-image");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

cards.forEach((card) => observer.observe(card));

// =============================
// Dark Mode Toggle
// =============================
function toggleDarkMode() {
  const root = document.documentElement;
  const darkMode = root.classList.toggle("dark");

  if (darkMode) {
    root.style.setProperty("--bg", "#0b0f14");
    root.style.setProperty("--bg-soft", "#111827");
    root.style.setProperty("--card", "#0f172a");
    root.style.setProperty("--border", "#1f2933");
    root.style.setProperty("--text", "#e5e7eb");
    root.style.setProperty("--text-muted", "#9ca3af");
  } else {
    root.style.setProperty("--bg", "#f9f9f9");
    root.style.setProperty("--bg-soft", "#f0f0f0");
    root.style.setProperty("--card", "#ffffff");
    root.style.setProperty("--border", "#e0e0e0");
    root.style.setProperty("--text", "#222222");
    root.style.setProperty("--text-muted", "#555555");
  }
}
