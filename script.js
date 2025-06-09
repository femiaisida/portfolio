
function toggleDarkMode() {
  const root = document.documentElement;
  const darkMode = root.classList.toggle('dark');

  if (darkMode) {
    root.style.setProperty('--bg-color', '#1a1a1a');
    root.style.setProperty('--text-color', '#f1f1f1');
    root.style.setProperty('--card-bg', '#2a2a2a');
    root.style.setProperty('--card-border', '#444');
  } else {
    root.style.setProperty('--bg-color', '#f9f9f9');
    root.style.setProperty('--text-color', '#222');
    root.style.setProperty('--card-bg', '#ffffff');
    root.style.setProperty('--card-border', '#e0e0e0');
  }
}

// Animate cards on scroll
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    observer.observe(card);
  });
});
