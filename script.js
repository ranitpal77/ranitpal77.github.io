document.addEventListener('DOMContentLoaded', () => {

  const PROJECTS_CONFIG = {
    deposhield: {
      title: 'DepoShield',
      tags: 'STELLAR, SOROBAN, REACT',
      description: 'Trustless Security Deposit Escrow.',
      visitUrl: 'https://deposhield.007447.xyz/',
      codeUrl: 'https://github.com/ranitpal77/deposhield'
    },
    timevault: {
      title: 'TimeVault',
      tags: 'SOROBAN, STELLAR, TYPESCRIPT',
      description: 'Time-locked savings on Soroban.',
      visitUrl: 'https://timevault.007447.xyz/',
      codeUrl: 'https://github.com/ranitpal77/timevault'
    },
    bouquet: {
      title: 'Bouquet',
      tags: 'CANVAS, 2D PHYSICS, WEBGL',
      description: 'Interactive digital flower garden.',
      visitUrl: 'https://bouquet.745482.xyz/',
      codeUrl: 'https://github.com/ranitpal77/bouquet'
    },
    pinch: {
      title: 'Pinch',
      tags: 'MEDIAPIPE, COMPUTER VISION, AR',
      description: 'Real-time AR dual-hand tracking.',
      visitUrl: 'https://pinch.007447.xyz/',
      codeUrl: 'https://github.com/ranitpal77/pinch'
    }
  };

  /* ==========================================================================
     2. PROJECT CARD HOVER & CLICK INTERACTIONS
     ========================================================================== */
  const projectsGrid = document.getElementById('projects-grid');
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    const projectId = card.getAttribute('data-project-id');
    const projectData = PROJECTS_CONFIG[projectId];

    // Mouse Enter: Apply lift to hovered card & dim others
    card.addEventListener('mouseenter', () => {
      if (projectsGrid) projectsGrid.classList.add('has-hover');
      card.classList.add('is-hovered');
    });

    // Mouse Leave: Restore all cards to default state
    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-hovered');
      // Check if any other card is still hovered
      const anyHovered = Array.from(projectCards).some((c) => c.classList.contains('is-hovered'));
      if (!anyHovered && projectsGrid) {
        projectsGrid.classList.remove('has-hover');
      }
    });

    // Click on Card: If not clicking on an action link, open the project
    card.addEventListener('click', (e) => {
      const isActionLink = e.target.closest('.card-btn');
      if (!isActionLink && projectData && projectData.visitUrl) {
        window.open(projectData.visitUrl, '_blank', 'noopener,noreferrer');
      }
    });

    // Keyboard accessibility: Enter or Space opens project
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!e.target.closest('.card-btn') && projectData && projectData.visitUrl) {
          e.preventDefault();
          window.open(projectData.visitUrl, '_blank', 'noopener,noreferrer');
        }
      }
    });
  });

  /* ==========================================================================
     3. NAVIGATION (00 WORK / 01 CONTACT ME)
     - WORK: Closes modal and scrolls projects to top
     - CONTACT ME: Opens contact modal
     ========================================================================== */
  const navWork = document.getElementById('nav-work');
  const navContact = document.getElementById('nav-contact');
  const bioContactLink = document.getElementById('cta-talk');
  const rightPane = document.getElementById('right-pane');

  function setActiveNav(target) {
    if (target === 'work') {
      navWork.classList.add('active');
      navContact.classList.remove('active');
    } else if (target === 'contact') {
      navContact.classList.add('active');
      navWork.classList.remove('active');
    }
  }

  // Click on "00 WORK"
  if (navWork) {
    navWork.addEventListener('click', (e) => {
      e.preventDefault();
      closeContactModal();
      setActiveNav('work');
      if (window.innerWidth <= 768 && rightPane) {
        rightPane.scrollIntoView({ behavior: 'smooth' });
      } else if (rightPane) {
        rightPane.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Click on "01 CONTACT ME"
  if (navContact) {
    navContact.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  }

  /* ==========================================================================
     4. CONTACT MODAL 
     ========================================================================== */
  const contactBackdrop = document.getElementById('contact-backdrop');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const contactModal = document.getElementById('contact-modal');
  const contactForm = document.getElementById('contact-form');
  const feedbackAlert = document.getElementById('feedback-alert');
  const inputName = document.getElementById('input-name');

  function openContactModal() {
    if (!contactBackdrop) return;
    contactBackdrop.classList.add('active');
    contactBackdrop.setAttribute('aria-hidden', 'false');
    setActiveNav('contact');
    // Focus first input field smoothly
    setTimeout(() => {
      if (inputName) inputName.focus();
    }, 150);
  }

  function closeContactModal() {
    if (!contactBackdrop) return;
    contactBackdrop.classList.remove('active');
    contactBackdrop.setAttribute('aria-hidden', 'true');
    setActiveNav('work');
  }

  // Close Button Click (at top-right)
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeContactModal();
    });
  }

  // Click outside modal on dark backdrop to close
  if (contactBackdrop) {
    contactBackdrop.addEventListener('click', (e) => {
      if (e.target === contactBackdrop) {
        closeContactModal();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactBackdrop && contactBackdrop.classList.contains('active')) {
      closeContactModal();
    }
  });

  // Contact Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('input-name').value.trim();
      const email = document.getElementById('input-email').value.trim();
      const message = document.getElementById('input-message').value.trim();

      if (!name || !email || !message) {
        if (feedbackAlert) {
          feedbackAlert.textContent = 'Please fill out all fields.';
          feedbackAlert.style.color = '#ff6b6b';
        }
        return;
      }

      // Visual feedback in UI
      if (feedbackAlert) {
        feedbackAlert.textContent = 'Message sent! Thank you.';
        feedbackAlert.style.color = '#ffffff';
      }

      // Open email client with pre-filled content
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Ranit,\n\n${message}\n\nFrom:\n${name} (${email})`);
      window.location.href = `mailto:ranitpal@77gamil.com?subject=${subject}&body=${body}`;

      // Reset form fields after 2.5 seconds
      setTimeout(() => {
        contactForm.reset();
        if (feedbackAlert) {
          feedbackAlert.textContent = '';
        }
      }, 2500);
    });
  }

});
