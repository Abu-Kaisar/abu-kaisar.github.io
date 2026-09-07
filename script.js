/**
 * Abu Kaisar Md Faisal | Portfolio Scripts
 * High-Performance Scrollytelling Canvas Frame Scrubbing Engine (300 Frames)
 * Dual-Track Specialization Toggle, Mobile Nav, Publication Filter & Citation Copy.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. High-Performance Scrollytelling Canvas Engine (300 Frames)
  // =========================================================================
  const canvas = document.getElementById('scrollyCanvas');
  const frameCounter = document.getElementById('frameCounter');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const totalFrames = 300;
    const framePath = (index) => `Frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

    const images = new Array(totalFrames + 1);
    let activeFrame = 1;
    let canvasWidth = 0;
    let canvasHeight = 0;

    // Responsive Canvas Resizing with Retina Support
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      ctx.scale(dpr, dpr);
      renderFrame(activeFrame);
    }

    // High-performance cover rendering math
    function renderFrame(index) {
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvasWidth;
      const ch = canvasHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.max(cw / iw, ch / ih);
      const x = (cw - iw * scale) / 2;
      const y = (ch - ih * scale) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, iw * scale, ih * scale);

      if (frameCounter) {
        frameCounter.textContent = `Frame ${index}/${totalFrames}`;
      }
    }

    // Load Frame 1 immediately, then background buffer the remaining 299 frames
    const initialImg = new Image();
    initialImg.src = framePath(1);
    initialImg.onload = () => {
      images[1] = initialImg;
      resizeCanvas();
      renderFrame(1);
      preloadRemainingFrames();
    };

    function preloadRemainingFrames() {
      // Step 1: Preload every 5th frame for fast responsiveness
      for (let i = 5; i <= totalFrames; i += 5) {
        const img = new Image();
        img.src = framePath(i);
        images[i] = img;
      }

      // Step 2: Fill in all intermediate frames smoothly
      setTimeout(() => {
        for (let i = 2; i <= totalFrames; i++) {
          if (!images[i]) {
            const img = new Image();
            img.src = framePath(i);
            images[i] = img;
          }
        }
      }, 100);
    }

    // Smooth Scroll scrubbing loop with requestAnimationFrame
    let isTicking = false;
    function onScroll() {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const scrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

          const targetFrame = Math.min(totalFrames, Math.max(1, Math.ceil(scrollProgress * totalFrames)));

          if (targetFrame !== activeFrame) {
            activeFrame = targetFrame;
            // Find closest available loaded frame if target hasn't loaded yet
            let frameToDraw = targetFrame;
            if (!images[frameToDraw] || !images[frameToDraw].complete) {
              for (let delta = 1; delta < 10; delta++) {
                if (images[targetFrame - delta] && images[targetFrame - delta].complete) {
                  frameToDraw = targetFrame - delta;
                  break;
                }
              }
            }
            renderFrame(frameToDraw);
          }
          isTicking = false;
        });
        isTicking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);
  }

  // =========================================================================
  // 2. Mobile Navigation Menu Toggle
  // =========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // =========================================================================
  // 3. Hero Dual Specialization Pillars
  // =========================================================================
  // Dual pillars are displayed simultaneously side-by-side in modern bento cards.

  // =========================================================================
  // 4. Publication Filter & Live Search
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubItems = document.querySelectorAll('.pub-item');
  const searchInput = document.getElementById('pubSearchInput');
  let currentFilter = 'all';

  function filterPublications() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    pubItems.forEach(item => {
      const type = item.getAttribute('data-type') || '';
      const tags = (item.getAttribute('data-tags') || '').toLowerCase();
      const text = item.textContent.toLowerCase();

      let matchesFilter = false;
      if (currentFilter === 'all') {
        matchesFilter = true;
      } else if (currentFilter === type) {
        matchesFilter = true;
      } else if (tags.includes(currentFilter)) {
        matchesFilter = true;
      }

      const matchesSearch = !query || text.includes(query);

      if (matchesFilter && matchesSearch) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });

    const visibleCount = Array.from(pubItems).filter(item => item.style.display !== 'none').length;
    let noMatchMsg = document.getElementById('noPubsFound');
    if (!noMatchMsg && pubItems.length > 0) {
      noMatchMsg = document.createElement('li');
      noMatchMsg.id = 'noPubsFound';
      noMatchMsg.className = 'pub-item';
      noMatchMsg.style.textAlign = 'center';
      noMatchMsg.style.padding = '2rem';
      noMatchMsg.style.color = '#94a3b8';
      noMatchMsg.innerHTML = '<p>🔍 No publications found matching the current search criteria.</p>';
      const pubList = document.querySelector('.pub-list');
      if (pubList) pubList.appendChild(noMatchMsg);
    }
    if (noMatchMsg) {
      noMatchMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (typeof pinnedPubItem !== 'undefined' && pinnedPubItem && pinnedPubItem.style.display === 'none') {
      pinnedPubItem = null;
      if (typeof resetInspector === 'function') resetInspector();
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      filterPublications();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterPublications);
  }

  // =========================================================================
  // 4b. Interactive Author & Google Scholar Intelligence Inspector
  // =========================================================================
  const inspectorPanel = document.getElementById('pubAuthorInspector');
  const inspectorContent = document.getElementById('inspectorContent');
  const inspectorPinTag = document.getElementById('inspectorPinTag');
  const inspectorCloseBtn = document.getElementById('inspectorCloseBtn');

  const AUTHOR_DATABASE = {
    "Faisal, A. K. M.": {
      name: "Abu Kaisar Md Faisal",
      role: "Lecturer (KYAU) & CFD Researcher (RUET)",
      isMe: true,
      scholar: "https://scholar.google.com/citations?user=h8IUROQAAAAJ&hl=en"
    },
    "Hasan Masud, M.": {
      name: "Prof. Dr. Mohammad Hasan Masud",
      role: "Associate Professor, Mechanical Eng., RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Mohammad+Hasan+Masud+RUET"
    },
    "Masud, M. H.": {
      name: "Prof. Dr. Mohammad Hasan Masud",
      role: "Associate Professor, Mechanical Eng., RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Mohammad+Hasan+Masud+RUET"
    },
    "Ankhi, I. J.": {
      name: "Israt Jahan Ankhi",
      role: "Mechanical Engineering Researcher, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Israt+Jahan+Ankhi"
    },
    "Siddhpura, M.": {
      name: "Dr. Murtadha Siddhpura",
      role: "Senior Lecturer, Engineering Inst. of Technology",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Murtadha+Siddhpura"
    },
    "Siddhpura, A.": {
      name: "Dr. Ashish Siddhpura",
      role: "Faculty of Engineering, EIT Australia",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Ashish+Siddhpura"
    },
    "Dangol, S. R.": {
      name: "Suman R. Dangol",
      role: "Aerospace & CFD Researcher",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Suman+Dangol"
    },
    "Saimoon, N. Z.": {
      name: "N. Z. Saimoon",
      role: "Department of Mechanical Engineering, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=N+Z+Saimoon"
    },
    "Salehin, N.": {
      name: "Nahid Salehin",
      role: "Mechanical Engineering, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Nahid+Salehin"
    },
    "Alam, Md. M.": {
      name: "Prof. Dr. Md. Mahbub Alam",
      role: "Professor, Harbin Institute of Technology (HIT)",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Md+Mahbub+Alam+HIT"
    },
    "Rabiul, M.": {
      name: "M. Rabiul",
      role: "Mechanical Engineering, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=M+Rabiul+RUET"
    },
    "Dabnichki, P.": {
      name: "Prof. Peter Dabnichki",
      role: "Prof. Mechanical & Aerospace Eng., RMIT Australia",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Peter+Dabnichki"
    },
    "Haque, Md. A.": {
      name: "Md. Anwarul Haque",
      role: "Mechanical Engineering, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Md+Anwarul+Haque+RUET"
    },
    "Azad, A. M. A. S.": {
      name: "A. M. A. S. Azad",
      role: "Energy & Thermal Systems Researcher",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=A+M+A+S+Azad"
    },
    "Himel, Md. H. H.": {
      name: "Md. Hasibul Hasan Himel",
      role: "Thermal & Food Engineering, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Md+Hasibul+Hasan+Himel"
    },
    "Akter, M.": {
      name: "Mst. Akter",
      role: "Food & Thermal Engineering, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=M+Akter+RUET"
    },
    "Ahmed, M. M.": {
      name: "M. M. Ahmed",
      role: "Renewable Energy Researcher, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=M+M+Ahmed+RUET"
    },
    "Hasan, Md. R.-U.": {
      name: "Md. Rashed-Ul Hasan",
      role: "Sustainability & Materials, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Md+Rashed-Ul+Hasan"
    },
    "Barua, S.": {
      name: "S. Barua",
      role: "Environmental Engineering, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=S+Barua+RUET"
    },
    "Olayiwola, O. S.": {
      name: "O. S. Olayiwola",
      role: "Aerodynamics & Propulsion, EIT Australia",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=O+S+Olayiwola"
    },
    "Qasem, N. A. A.": {
      name: "Dr. Naef A. A. Qasem",
      role: "Aerospace & Biomimetics Researcher, KFUPM",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Naef+A+A+Qasem"
    },
    "Ahmed, R.": {
      name: "R. Ahmed",
      role: "Waste-to-Energy & Resource Recycling, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=R+Ahmed+RUET"
    },
    "Ahmed, Md. R.": {
      name: "Md. R. Ahmed",
      role: "Mechanical Engineering Researcher",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Md+R+Ahmed+RUET"
    },
    "Ananno, A. A.": {
      name: "A. A. Ananno",
      role: "Energy & Thermal Systems, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=A+A+Ananno"
    },
    "Rashid, M.": {
      name: "M. Rashid",
      role: "Chemical & Energy Engineering, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=M+Rashid+RUET"
    },
    "Hossain, G. A.": {
      name: "Golam Al Hossain",
      role: "Mechanical & Marine Hydrodynamics, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=Golam+Al+Hossain"
    },
    "Shahadat, M. Md. Z.": {
      name: "M. Md. Z. Shahadat",
      role: "Aerodynamics & Wind Turbine Engineering, RUET",
      scholar: "https://scholar.google.com/citations?view_op=search_authors&mauthors=M+Md+Z+Shahadat"
    }
  };

  function getAuthorInfo(rawName) {
    const clean = rawName.trim();
    if (AUTHOR_DATABASE[clean]) return AUTHOR_DATABASE[clean];
    for (const key in AUTHOR_DATABASE) {
      if (clean.toLowerCase() === key.toLowerCase()) {
        return AUTHOR_DATABASE[key];
      }
    }
    return {
      name: clean,
      role: "Contributing Researcher",
      isMe: clean.includes("Faisal"),
      scholar: `https://scholar.google.com/citations?view_op=search_authors&mauthors=${encodeURIComponent(clean)}`
    };
  }

  function getMonogram(name) {
    const parts = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length >= 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return 'AU';
  }

  let pinnedPubItem = null;

  function renderInspector(pubItem, isPinned) {
    if (!inspectorContent) return;

    let authorsData = [];
    const authorsAttr = pubItem.getAttribute('data-authors');
    if (authorsAttr) {
      try {
        authorsData = JSON.parse(authorsAttr);
      } catch (e) {
        authorsData = [];
      }
    }

    const titleEl = pubItem.querySelector('.pub-title');
    const venueEl = pubItem.querySelector('.pub-venue');
    const typeBadgeEl = pubItem.querySelector('.pub-type-badge');

    const title = titleEl ? titleEl.textContent.trim() : 'Selected Publication';
    const venue = venueEl ? venueEl.textContent.trim() : '';
    const typeText = typeBadgeEl ? typeBadgeEl.textContent.trim() : 'Research Record';

    // Clear inspected state from other items
    pubItems.forEach(item => item.classList.remove('is-inspected'));
    pubItem.classList.add('is-inspected');

    // Build Authors HTML
    let authorsHtml = '';
    authorsData.forEach(authorRaw => {
      const info = getAuthorInfo(authorRaw);
      const monogram = getMonogram(info.name);
      const isMeClass = info.isMe ? 'author-is-me' : '';
      const meTag = info.isMe ? '<span class="author-me-tag">ME</span>' : '';

      authorsHtml += `
        <div class="author-card ${isMeClass}">
          <div class="author-info-left">
            <div class="author-avatar">${monogram}</div>
            <div class="author-name" title="${info.name}">
              <span>${info.name}</span>
              ${meTag}
            </div>
          </div>
          <a href="${info.scholar}" target="_blank" rel="noopener noreferrer" class="author-scholar-btn" title="View Google Scholar Profile of ${info.name}">
            🎓 Scholar ↗
          </a>
        </div>
      `;
    });

    inspectorContent.innerHTML = `
      <div class="inspector-paper-meta">
        <span class="inspector-paper-type">${typeText}</span>
        <div class="inspector-paper-title">${title}</div>
        ${venue ? `<div class="inspector-paper-venue">${venue}</div>` : ''}
      </div>

      <div class="inspector-authors-title">
        <span>Contributing Authors (${authorsData.length})</span>
        <span style="font-size: 0.68rem; color: #38bdf8; text-transform: none; font-weight: 500;">
          ${isPinned ? '📌 Locked' : '👁️ Previewing'}
        </span>
      </div>

      <div class="inspector-authors-list">
        ${authorsHtml}
      </div>
    `;

    if (inspectorPinTag) {
      if (isPinned) {
        inspectorPinTag.classList.add('visible');
      } else {
        inspectorPinTag.classList.remove('visible');
      }
    }

    if (inspectorPanel && window.innerWidth <= 1024) {
      inspectorPanel.classList.add('mobile-active');
    }
  }

  function resetInspector() {
    if (pinnedPubItem) {
      renderInspector(pinnedPubItem, true);
      return;
    }

    pubItems.forEach(item => item.classList.remove('is-inspected'));
    if (inspectorPinTag) inspectorPinTag.classList.remove('visible');
    if (inspectorPanel) inspectorPanel.classList.remove('mobile-active');

    if (inspectorContent) {
      inspectorContent.innerHTML = `
        <div class="inspector-empty-state">
          <div class="empty-icon">👥</div>
          <h4>Interactive Author Explorer</h4>
          <p>Hover or click on any publication to inspect the contributing authors and their direct Google Scholar research profiles.</p>
        </div>
      `;
    }
  }

  if (inspectorPanel) {
    pubItems.forEach(item => {
      // Hover preview (desktop)
      item.addEventListener('mouseenter', () => {
        if (!pinnedPubItem) {
          renderInspector(item, false);
        }
      });

      item.addEventListener('mouseleave', () => {
        if (!pinnedPubItem) {
          resetInspector();
        }
      });

      // Click to pin/lock
      item.addEventListener('click', (e) => {
        // Prevent pinning if clicked an interactive action button
        if (e.target.closest('.pub-actions') || e.target.closest('a') || e.target.closest('button') || e.target.closest('.bibtex-box')) {
          return;
        }

        if (pinnedPubItem === item) {
          pinnedPubItem = null;
          resetInspector();
        } else {
          pinnedPubItem = item;
          renderInspector(item, true);
        }
      });
    });

    if (inspectorCloseBtn) {
      inspectorCloseBtn.addEventListener('click', () => {
        pinnedPubItem = null;
        resetInspector();
      });
    }
  }

  // =========================================================================
  // 5. 1-Click Copy Citation with Toast Notification
  // =========================================================================
  const copyCitationBtns = document.querySelectorAll('.btn-copy-citation');
  copyCitationBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const citationText = btn.getAttribute('data-citation');
      if (citationText) {
        try {
          await navigator.clipboard.writeText(citationText);
          showToast('✓ Citation copied to clipboard!');
        } catch (err) {
          showToast('Citation copied!');
        }
      }
    });
  });

  // =========================================================================
  // 6. Toggle BibTeX Box
  // =========================================================================
  const toggleBibtexBtns = document.querySelectorAll('.btn-toggle-bibtex');
  toggleBibtexBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetBox = document.getElementById(targetId);
      if (targetBox) {
        targetBox.classList.toggle('show');
      }
    });
  });

  function showToast(message) {
    let toast = document.getElementById('toastMsg');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastMsg';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // =========================================================================
  // 7. Scroll-Spy for Floating Navigation Rail
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navDots = document.querySelectorAll('.nav-dot, .toc-nav-link');

  if (sections.length > 0 && navDots.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navDots.forEach(dot => {
            if (dot.getAttribute('href') === `#${id}`) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
  }

  // =========================================================================
  // 8. Back-to-Top Button
  // =========================================================================
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 9. Blueprint Animation Focus Mode Toggle
  // =========================================================================
  const btnToggleFocus = document.getElementById('btnToggleFocus');
  if (btnToggleFocus) {
    btnToggleFocus.addEventListener('click', () => {
      const isFocused = document.body.classList.toggle('blueprint-focus-mode');
      btnToggleFocus.textContent = isFocused ? '✕ Exit Focus' : '👁️ Focus Video';
      btnToggleFocus.setAttribute('aria-pressed', isFocused);
      btnToggleFocus.title = isFocused ? 'Restore full content view' : 'Dim content to spotlight blueprint animation';
    });
  }
});
