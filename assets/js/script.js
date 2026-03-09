document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
  
    const prismLink = document.getElementById("prism-theme");
    const prismCdn = "https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/";
    const prismLight = prismCdn + "prism-base16-ateliersulphurpool.light.min.css";
    const prismDark = prismCdn + "prism-coldark-dark.min.css";

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
      if (prismLink) {
        prismLink.href = theme === "dark" ? prismDark : prismLight;
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
  
