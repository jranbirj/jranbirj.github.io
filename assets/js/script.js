document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");

    const prismLink = document.getElementById("prism-theme");
    const prismCdn = "https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/";
    const prismLight = prismCdn + "prism-base16-ateliersulphurpool.light.min.css";
    const prismDark = prismCdn + "prism-coldark-dark.min.css";

    const sunSVG  = `<svg class="theme-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.8 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.8-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.8-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.8 15.2-1.6zM256 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>`;
    const moonSVG = `<svg class="theme-icon" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.2c-6.3-.3-12.6-.4-19-.4z"/></svg>`;

    function setTheme(theme) {
      if (theme === "dark") {
        document.body.classList.add("dark");
        if (toggle) toggle.innerHTML = sunSVG;
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark");
        if (toggle) toggle.innerHTML = moonSVG;
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
    } else {
      setTheme("light");
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

    // Table of contents sidebar
    const tocSidebar = document.getElementById('toc-sidebar');
    if (tocSidebar) {
      const headings = document.querySelectorAll('article h2');
      if (headings.length) {
        const ul = document.createElement('ul');
        headings.forEach((h, i) => {
          if (!h.id) h.id = 'section-' + i;
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#' + h.id;
          a.textContent = h.dataset.toc || h.textContent;
          a.dataset.target = h.id;
          li.appendChild(a);
          ul.appendChild(li);
        });
        tocSidebar.appendChild(ul);

        // Highlight active section on scroll
        const tocLinks = tocSidebar.querySelectorAll('a');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              tocLinks.forEach(a => a.classList.remove('toc-active'));
              const active = tocSidebar.querySelector(`a[data-target="${entry.target.id}"]`);
              if (active) active.classList.add('toc-active');
            }
          });
        }, { rootMargin: '0px 0px -60% 0px' });
        headings.forEach(h => observer.observe(h));
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
  
