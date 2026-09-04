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
     2. PROJECT CARD HOVER INTERACTIONS
     ========================================================================== */
  const projectsGrid = document.getElementById('projects-grid');
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
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
  const inputEmail = document.getElementById('input-email');
  const inputMessage = document.getElementById('input-message');
  const submitActionBtn = document.getElementById('submit-action-btn');

  let isSubmitting = false;

  function setFeedback(message, state) {
    if (!feedbackAlert) return;
    feedbackAlert.textContent = message;
    feedbackAlert.className = 'feedback-alert';
    if (state) {
      feedbackAlert.classList.add(state);
    }
  }

  function clearFeedback() {
    if (!feedbackAlert) return;
    feedbackAlert.textContent = '';
    feedbackAlert.className = 'feedback-alert';
  }

  // Clear errors when user types in inputs
  [inputName, inputEmail, inputMessage].forEach((field) => {
    if (field) {
      field.addEventListener('input', () => {
        if (feedbackAlert && feedbackAlert.classList.contains('error')) {
          clearFeedback();
        }
      });
    }
  });

  function openContactModal() {
    if (!contactBackdrop) return;
    contactBackdrop.scrollTop = 0;
    contactBackdrop.classList.add('active');
    contactBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setActiveNav('contact');
    // Focus first input field smoothly on desktop
    if (window.innerWidth > 768) {
      setTimeout(() => {
        if (inputName) inputName.focus();
      }, 150);
    }
  }

  function closeContactModal() {
    if (!contactBackdrop) return;
    contactBackdrop.classList.remove('active');
    contactBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
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

  // Contact Form Submission via Web3Forms
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Prevent duplicate submissions while request is pending
      if (isSubmitting) return;

      const name = inputName ? inputName.value.trim() : '';
      const email = inputEmail ? inputEmail.value.trim() : '';
      const message = inputMessage ? inputMessage.value.trim() : '';

      // Validate required fields
      if (!name) {
        setFeedback('Please enter your name.', 'error');
        if (inputName) inputName.focus();
        return;
      }

      if (!email) {
        setFeedback('Please enter your email address.', 'error');
        if (inputEmail) inputEmail.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFeedback('Please enter a valid email address.', 'error');
        if (inputEmail) inputEmail.focus();
        return;
      }

      if (!message) {
        setFeedback('Please enter your message.', 'error');
        if (inputMessage) inputMessage.focus();
        return;
      }

      // Check honeypot anti-spam
      const botcheck = contactForm.querySelector('input[name="botcheck"]');
      if (botcheck && botcheck.checked) {
        setFeedback('Spam submission rejected.', 'error');
        return;
      }

      // Retrieve public access key from runtime configuration
      const accessKey = window.CONFIG && window.CONFIG.WEB3FORMS_ACCESS_KEY;
      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
        setFeedback('Form service is not configured. Please set WEB3FORMS_ACCESS_KEY.', 'error');
        console.warn(
          'Web3Forms access key is missing.\n' +
          '• Local: Ensure config.js has a valid WEB3FORMS_ACCESS_KEY.\n' +
          '• GitHub Pages: Add WEB3FORMS_ACCESS_KEY to GitHub Repository Secrets.'
        );
        return;
      }

      // Enter loading state
      isSubmitting = true;
      const originalBtnText = submitActionBtn ? submitActionBtn.textContent : 'Submit';
      if (submitActionBtn) {
        submitActionBtn.disabled = true;
        submitActionBtn.textContent = 'Sending...';
      }
      setFeedback('Sending message...', 'loading');

      try {
        const payload = {
          access_key: accessKey,
          name: name,
          email: email,
          message: message,
          subject: `Portfolio Contact: Message from ${name}`,
          from_name: name,
          replyto: email
        };

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Success state
          setFeedback('Message sent successfully! Thank you.', 'success');
          contactForm.reset();

          // Clear success message after 6 seconds
          setTimeout(() => {
            if (feedbackAlert && feedbackAlert.textContent === 'Message sent successfully! Thank you.') {
              clearFeedback();
            }
          }, 6000);
        } else {
          // Error state returned by form service
          const errorMessage = result.message || 'Failed to send message. Please try again.';
          setFeedback(errorMessage, 'error');
        }
      } catch (err) {
        console.error('Contact form submission error:', err);
        setFeedback('Network error. Please check your connection and try again.', 'error');
      } finally {
        isSubmitting = false;
        if (submitActionBtn) {
          submitActionBtn.disabled = false;
          submitActionBtn.textContent = originalBtnText;
        }
      }
    });
  }

});
