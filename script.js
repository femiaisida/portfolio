// =============================
// Hamburger Nav Toggle
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      toggle.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        toggle.textContent = "☰";
      });
    });
  }
});

// =============================
// Hero Typing Animation with Syntax Highlighting
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const heroCode = document.querySelector(".hero-code pre code");
  if (!heroCode) return;

  // Structured tokens for syntax highlighting
  const tokens = [
    { text: "const",      cls: "syn-keyword" },
    { text: " developer", cls: "syn-key" },
    { text: " =",         cls: "syn-punct" },
    { text: " {",         cls: "syn-bracket" },
    { text: "\n  name",   cls: "syn-key" },
    { text: ":",          cls: "syn-punct" },
    { text: ' "Oluwafemi"', cls: "syn-string" },
    { text: ",",          cls: "syn-punct" },
    { text: "\n  focus",  cls: "syn-key" },
    { text: ":",          cls: "syn-punct" },
    { text: ' "Frontend"', cls: "syn-string" },
    { text: ",",          cls: "syn-punct" },
    { text: "\n  learning", cls: "syn-key" },
    { text: ":",          cls: "syn-punct" },
    { text: " [",         cls: "syn-bracket" },
    { text: '"JavaScript"', cls: "syn-string" },
    { text: ",",          cls: "syn-punct" },
    { text: ' "React"',   cls: "syn-string" },
    { text: "]",          cls: "syn-bracket" },
    { text: ",",          cls: "syn-punct" },
    { text: "\n  goal",   cls: "syn-key" },
    { text: ":",          cls: "syn-punct" },
    { text: ' "Computer Science"', cls: "syn-string" },
    { text: "\n",         cls: null },
    { text: "};",         cls: "syn-bracket" },
  ];

  heroCode.textContent = "";

  // Build flat char list: [{char, cls}]
  const chars = [];
  tokens.forEach(tok => {
    for (const ch of tok.text) {
      chars.push({ char: ch, cls: tok.cls });
    }
  });

  let i = 0;

  function typeNext() {
    if (i >= chars.length) {
      // Add blinking cursor at end
      const cursor = document.createElement("span");
      cursor.classList.add("cursor");
      heroCode.appendChild(cursor);
      return;
    }

    const { char, cls } = chars[i];
    i++;

    if (char === "\n") {
      heroCode.appendChild(document.createTextNode("\n"));
    } else {
      const span = document.createElement("span");
      if (cls) span.className = cls;
      span.textContent = char;
      heroCode.appendChild(span);
    }

    setTimeout(typeNext, 22);
  }

  typeNext();
});

// =============================
// Scroll Fade-In for Cards
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card, .about-image");
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
});
