/**
 * Abu Kaisar Md Faisal | Portfolio Scripts
 * Handles mobile navigation, publication filtering & search, citation copy, and scroll-spy.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // 2. Publication Filter & Live Search
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

      // Check category/tag match
      let matchesFilter = false;
      if (currentFilter === 'all') {
        matchesFilter = true;
      } else if (currentFilter === type) {
        matchesFilter = true;
      } else if (tags.includes(currentFilter)) {
        matchesFilter = true;
      }

      // Check search query match
      const matchesSearch = !query || text.includes(query);

      if (matchesFilter && matchesSearch) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });

    // Check if empty
    const visibleCount = Array.from(pubItems).filter(item => item.style.display !== 'none').length;
    let noMatchMsg = document.getElementById('noPubsFound');
    if (!noMatchMsg && pubItems.length > 0) {
      noMatchMsg = document.createElement('li');
      noMatchMsg.id = 'noPubsFound';
      noMatchMsg.className = 'pub-item';
      noMatchMsg.style.textAlign = 'center';
      noMatchMsg.style.padding = '2rem';
      noMatchMsg.style.color = '#64748b';
      noMatchMsg.innerHTML = '<p>🔍 No publications found matching the current search criteria.</p>';
      const pubList = document.querySelector('.pub-list');
      if (pubList) pubList.appendChild(noMatchMsg);
    }
    if (noMatchMsg) {
      noMatchMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter') || 'all';
        filterPublications();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterPublications);
  }

  // 3. BibTeX Toggle & Citation Copy
  document.addEventListener('click', (e) => {
    // Toggle BibTeX Box
    if (e.target.closest('.btn-toggle-bibtex')) {
      const btn = e.target.closest('.btn-toggle-bibtex');
      const targetId = btn.getAttribute('data-target');
      const box = document.getElementById(targetId);
      if (box) {
        box.classList.toggle('show');
      }
    }

    // Copy Citation
    if (e.target.closest('.btn-copy-citation')) {
      const btn = e.target.closest('.btn-copy-citation');
      const textToCopy = btn.getAttribute('data-citation');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('Citation copied to clipboard! 📋');
        }).catch(() => {
          showToast('Failed to copy. Please select text manually.');
        });
      }
    }
  });

  // 4. Toast Notification
  function showToast(message) {
    let toast = document.getElementById('siteToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'siteToast';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 5. Scroll-Spy for Table of Contents
  const sections = document.querySelectorAll('section[id]');
  const tocLinks = document.querySelectorAll('.toc-nav-link');

  if (sections.length > 0 && tocLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
  }

  // 6. Back-to-Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
