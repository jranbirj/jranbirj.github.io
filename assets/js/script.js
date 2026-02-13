document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
  
    function setTheme(theme) {
      if (theme === "dark") {
        document.body.classList.add("dark");
        toggle.textContent = "☀︎";
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark");
        toggle.textContent = "☾";
        localStorage.setItem("theme", "light");
      }
    }
  
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  
    toggle.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark");
      setTheme(isDark ? "light" : "dark");
    });
  });
  
