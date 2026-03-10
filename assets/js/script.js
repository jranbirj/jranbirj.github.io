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

    // Filter + sort system
    const filterChips = document.querySelectorAll('.filter-chip');
    const filterReset = document.getElementById('filter-reset');
    const sortDateBtn = document.getElementById('sort-date');
    const postList = document.querySelector('.post-list');
    const noResults = document.getElementById('no-results');
    const filterToggleBtn = document.getElementById('filter-toggle');
    const filterDropdown = document.getElementById('filter-dropdown');

    let activeFilters = new Set();
    let sortDir = 'desc';

    function getPosts() {
      return postList ? [...postList.querySelectorAll('.post-preview')] : [];
    }

    function updateFilterBtn() {
      if (!filterToggleBtn) return;
      const count = activeFilters.size;
      const arrow = (filterDropdown && !filterDropdown.hidden) ? '↑' : '↓';
      filterToggleBtn.textContent = count > 0 ? `Filter (${count}) ${arrow}` : `Filter ${arrow}`;
    }

    function applyFilters() {
      if (!postList) return;
      let visibleCount = 0;
      getPosts().forEach(post => {
        const tags = post.dataset.tags ? post.dataset.tags.split(',') : [];
        // AND logic: every active filter must be present on the post
        const show = activeFilters.size === 0 || [...activeFilters].every(f => tags.includes(f));
        post.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });
      if (noResults) noResults.hidden = visibleCount > 0;
      updateFilterBtn();
    }

    if (filterChips.length && postList) {
      filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const filter = chip.dataset.filter;
          if (activeFilters.has(filter)) {
            activeFilters.delete(filter);
            chip.classList.remove('active');
          } else {
            activeFilters.add(filter);
            chip.classList.add('active');
          }
          applyFilters();
        });
      });

      if (filterReset) {
        filterReset.addEventListener('click', () => {
          activeFilters.clear();
          filterChips.forEach(c => c.classList.remove('active'));
          applyFilters();
        });
      }

      if (sortDateBtn) {
        sortDateBtn.addEventListener('click', () => {
          sortDir = sortDir === 'desc' ? 'asc' : 'desc';
          sortDateBtn.textContent = `Date ${sortDir === 'desc' ? '↓' : '↑'}`;
          const sorted = getPosts().sort((a, b) => {
            const dateA = new Date(a.dataset.date || 0);
            const dateB = new Date(b.dataset.date || 0);
            return sortDir === 'desc' ? dateB - dateA : dateA - dateB;
          });
          sorted.forEach(post => postList.insertBefore(post, noResults));
        });
      }
    }

    // Tag legend toggle
    const legendBtn = document.getElementById("legend-toggle");
    const legendPanel = document.getElementById("tag-legend");

    function closeLegend() {
      if (legendPanel) { legendPanel.hidden = true; }
      if (legendBtn)   { legendBtn.textContent = "Tags ↓"; }
    }

    function closeFilter() {
      if (filterDropdown) { filterDropdown.hidden = true; }
      updateFilterBtn();
    }

    // Filter dropdown toggle
    if (filterToggleBtn && filterDropdown) {
      filterToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLegend();                              // close Tags if open
        filterDropdown.hidden = !filterDropdown.hidden;
        updateFilterBtn();
      });
      document.addEventListener('click', (e) => {
        if (!filterDropdown.hidden &&
            !filterDropdown.contains(e.target) &&
            e.target !== filterToggleBtn) {
          closeFilter();
        }
      });
    }

    if (legendBtn && legendPanel) {
      legendBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeFilter();                              // close Filter if open
        legendPanel.hidden = !legendPanel.hidden;
        legendBtn.textContent = legendPanel.hidden ? "Tags ↓" : "Tags ↑";
      });
      document.addEventListener("click", (e) => {
        if (!legendPanel.contains(e.target) && e.target !== legendBtn) {
          closeLegend();
        }
      });
    }
  });
  
