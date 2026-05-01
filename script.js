/* ============================================
   PORTFOLIO — MAIN SCRIPT
   Fully dynamic: all content from data/about.json
   ============================================ */

// ── EmailJS Configuration ──────────────────
const EMAILJS_PUBLIC_KEY = "961nxAGTq9j0Kki6g";
const EMAILJS_SERVICE_ID = "service_d77xomw";
const EMAILJS_TEMPLATE_ID = "template_wymp3wm";

// ── Bootstrap ──────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);
  initApp();
});

async function initApp() {
  try {
    const res = await fetch("data/about.json");
    const data = await res.json();

    renderNav(data);
    renderHero(data);
    renderAbout(data);
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderSkills(data.skills);
    renderEducation(data.education);
    renderProfiles(data.codingProfiles);
    renderContact(data.contact, data.socialLinks);
    renderFooter(data);

    setupScrollEffects();
    setupMobileMenu(data);
    setupContactForm();
    setupFloatingSocial(data.socialLinks);
    setupAIChat(data.chatbot);

    // Hide loader
    setTimeout(() => {
      document.getElementById("loader").classList.add("hidden");
    }, 400);
  } catch (err) {
    console.error("Failed to load data:", err);
    document.getElementById("loader").classList.add("hidden");
  }
}

/* ==========================================
   RENDER — Navigation
   ========================================== */
function renderNav(data) {
  const navLinks = document.getElementById("navLinks");
  const navLogo = document.getElementById("navLogo");

  // Set logo to initials
  const names = data.hero.superTitle.split(" ");
  navLogo.textContent = names.map((n) => n[0]).join("");

  // Build nav links from data
  if (data.nav) {
    navLinks.innerHTML = data.nav
      .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
      .join("");
  }

  // Resume button
  if (data.resumeUrl) {
    document.getElementById("navResumeBtn").href = data.resumeUrl;
  }
}

/* ==========================================
   RENDER — Hero
   ========================================== */
function renderHero(data) {
  const { hero, profileImage, socialLinks } = data;

  document.getElementById("superTitle").innerHTML = hero.superTitle;
  document.getElementById("heroDescription").innerHTML = hero.heroDescription;

  // Set profile image as blurred hero background
  const heroBg = document.getElementById("heroBgImage");
  if (heroBg && profileImage) {
    heroBg.style.backgroundImage = `url('${profileImage}')`;
  }

  // Typing animation for role
  const typingPhrases = [hero.title, ...(hero.taglines || [])];
  initTypingAnimation("heroTitle", typingPhrases);

  // Taglines
  if (hero.taglines) {
    document.getElementById("heroTaglines").innerHTML = hero.taglines
      .map((t) => `<span class="tagline">${t}</span>`)
      .join("");
  }

  // Social links
  if (socialLinks) {
    document.getElementById("heroSocials").innerHTML = socialLinks
      .map(
        (s) =>
          `<a href="${s.url}" target="_blank" aria-label="${s.platform}" title="${s.platform}"><i class="${s.icon}"></i></a>`,
      )
      .join("");
  }
}

/* ==========================================
   TYPING ANIMATION
   ========================================== */
function initTypingAnimation(elementId, phrases) {
  const el = document.getElementById(elementId);
  if (!el || !phrases.length) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseAfterType = 2000;
  const pauseAfterDelete = 500;

  // Add cursor element
  el.innerHTML = `<span class="typing-text"></span><span class="typing-cursor"></span>`;
  const textEl = el.querySelector(".typing-text");

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing
      textEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        // Finished typing — pause, then start deleting
        isDeleting = true;
        setTimeout(tick, pauseAfterType);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      // Deleting
      textEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Finished deleting — move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, pauseAfterDelete);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  // Start after a short delay to let the fadeInUp animation play
  setTimeout(tick, 800);
}

/* ==========================================
   RENDER — About
   ========================================== */
function renderAbout(data) {
  document.getElementById("aboutTitle").innerHTML = data.title;
  document.getElementById("aboutText").innerHTML = data.about;
}

/* ==========================================
   RENDER — Experience
   ========================================== */
function renderExperience(experience) {
  const container = document.getElementById("experience-timeline");
  if (!container || !experience) return;

  container.innerHTML = experience
    .map(
      (exp) => `
    <div class="timeline-card reveal">
      <div class="timeline-icon">💼</div>
      <div class="timeline-body">
        <div class="timeline-header-row">
          <div>
            <h3 class="timeline-title">${exp.position}</h3>
            <p class="timeline-subtitle">${exp.company}</p>
          </div>
          <div class="timeline-meta-right">
            <span><i class="fas fa-calendar-alt"></i> ${exp.duration}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${exp.location}</span>
          </div>
        </div>
        <ul class="timeline-highlights">
          ${exp.highlights.map((h) => `<li>${h}</li>`).join("")}
        </ul>
      </div>
    </div>`,
    )
    .join("");
}

/* ==========================================
   RENDER — Projects
   ========================================== */
function renderProjects(projects) {
  const container = document.getElementById("projectsGrid");
  if (!container || !projects) return;

  projects.forEach((project, index) => {
    const card = document.createElement("div");
    card.classList.add("project-card", "reveal");
    card.addEventListener("click", () => openProjectModal(project));

    const imagesHTML = project.images
      .map(
        (img) =>
          `<div class="slider-image" style="background-image: url('${img}')"></div>`,
      )
      .join("");

    const dotsHTML = project.images
      .map((_, i) => `<span class="dot ${i === 0 ? "active" : ""}"></span>`)
      .join("");

    const tagsHTML = project.tags
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");

    const links = [];
    if (project.preview)
      links.push(
        `<a href="${project.preview}" target="_blank" class="btn" onclick="event.stopPropagation()"><i class="fas fa-play"></i> Preview</a>`,
      );
    if (project.github)
      links.push(
        `<a href="${project.github}" target="_blank" class="btn" onclick="event.stopPropagation()"><i class="fab fa-github"></i> GitHub</a>`,
      );
    if (project.appStore)
      links.push(
        `<a href="${project.appStore}" target="_blank" class="btn" onclick="event.stopPropagation()"><i class="fab fa-app-store"></i> App Store</a>`,
      );

    card.innerHTML = `
      <div class="project-image">
        <div class="image-slider" id="slider${index}">${imagesHTML}</div>
        <div class="slider-dots" id="dots${index}">${dotsHTML}</div>
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tags">${tagsHTML}</div>
        <div class="project-links">${links.join("")}</div>
      </div>`;

    container.appendChild(card);
    initSlider(`slider${index}`, `dots${index}`, project.images.length);
  });
}

/* ==========================================
   RENDER — Skills
   ========================================== */
function renderSkills(skills) {
  const grid = document.getElementById("skills-grid");
  if (!grid || !skills) return;

  grid.innerHTML = skills
    .map(
      (skill) => `
    <div class="skill-card reveal">
      <div class="skill-icon">${skill.icon}</div>
      <h3 class="skill-name">${skill.name}</h3>
      <div class="skill-tags">
        ${skill.tags.map((t) => `<span class="skill-tag">${t}</span>`).join("")}
      </div>
    </div>`,
    )
    .join("");
}

/* ==========================================
   RENDER — Education
   ========================================== */
function renderEducation(education) {
  const container = document.getElementById("education-timeline");
  if (!container || !education) return;

  container.innerHTML = education
    .map(
      (edu) => `
    <div class="timeline-card reveal">
      <div class="timeline-icon">🎓</div>
      <div class="timeline-body">
        <h3 class="timeline-title">${edu.degree}</h3>
        <p class="timeline-subtitle">${edu.institution}</p>
        <div class="timeline-meta">
          <span><i class="fas fa-map-marker-alt"></i> ${edu.location}</span>
          <span><i class="fas fa-calendar-alt"></i> ${edu.duration}</span>
        </div>
        <div class="timeline-badges">
          ${edu.highlights.map((h) => `<span class="badge">${h}</span>`).join("")}
        </div>
      </div>
    </div>`,
    )
    .join("");
}

/* ==========================================
   RENDER — Coding Profiles
   ========================================== */
function renderProfiles(profiles) {
  const grid = document.getElementById("profile-grid");
  if (!grid || !profiles) return;

  grid.innerHTML = profiles
    .map(
      (p) => `
    <a href="${p.url}" target="_blank" class="profile-card reveal">
      <div class="profile-header">
        <img class="profile-icon-img" src="${p.icon}" alt="${p.name}">
        <div class="profile-info">
          <h3>${p.name}</h3>
          <p class="profile-username">${p.username}</p>
        </div>
      </div>
      <div class="profile-stats">
        ${p.stats
          .map(
            (s) => `
          <div class="stat">
            <span class="stat-value">${s.value}</span>
            <span class="stat-label">${s.label}</span>
          </div>`,
          )
          .join("")}
      </div>
      <div class="profile-badges">
        ${p.badges.map((b) => `<span class="badge">${b}</span>`).join("")}
      </div>
    </a>`,
    )
    .join("");
}

/* ==========================================
   RENDER — Contact Info
   ========================================== */
function renderContact(contact, socialLinks) {
  const container = document.getElementById("contactInfo");
  if (!container || !contact) return;

  const items = [
    {
      icon: "fas fa-envelope",
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: "fas fa-phone",
      label: "Phone",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    },
    {
      icon: "fas fa-map-marker-alt",
      label: "Location",
      value: contact.location,
      href: null,
    },
  ];

  container.innerHTML = items
    .map(
      (item) => `
    <${item.href ? `a href="${item.href}"` : "div"} class="contact-item">
      <div class="contact-item-icon"><i class="${item.icon}"></i></div>
      <div>
        <div class="contact-item-label">${item.label}</div>
        <div class="contact-item-value">${item.value}</div>
      </div>
    </${item.href ? "a" : "div"}>`,
    )
    .join("");
}

/* ==========================================
   RENDER — Footer
   ========================================== */
function renderFooter(data) {
  document.getElementById("footerName").textContent = data.hero.superTitle;
  document.getElementById("footerTagline").textContent = data.hero.title;
  document.getElementById("footerYear").textContent = new Date().getFullYear();
  document.getElementById("footerCopyName").textContent = data.hero.superTitle;

  // Footer nav links
  if (data.nav) {
    document.getElementById("footerNav").innerHTML = data.nav
      .map((item) => `<a href="${item.href}">${item.label}</a>`)
      .join("");
  }

  // Footer social
  if (data.socialLinks) {
    document.getElementById("footerSocials").innerHTML = data.socialLinks
      .map(
        (s) =>
          `<a href="${s.url}" target="_blank" aria-label="${s.platform}" title="${s.platform}"><i class="${s.icon}"></i></a>`,
      )
      .join("");
  }
}

/* ==========================================
   IMAGE SLIDER
   ========================================== */
function initSlider(sliderId, dotsId, total) {
  if (total <= 1) return;

  let current = 0;
  const slider = document.getElementById(sliderId);
  const dots = document.getElementById(dotsId)?.children;
  if (!slider || !dots) return;

  function update() {
    slider.style.transform = `translateX(-${current * 100}%)`;
    Array.from(dots).forEach((d, i) =>
      d.classList.toggle("active", i === current),
    );
  }

  setInterval(() => {
    current = (current + 1) % total;
    update();
  }, 3000);

  Array.from(dots).forEach((d, i) => {
    d.addEventListener("click", (e) => {
      e.stopPropagation();
      current = i;
      update();
    });
  });
}

/* ==========================================
   PROJECT MODAL
   ========================================== */
function openProjectModal(project) {
  const modal = document.getElementById("projectModal");
  document.getElementById("modalTitle").textContent = project.title;

  // Preview tab
  const previewContent = document.getElementById("previewContent");
  let previewHTML = "";
  if (project.preview) {
    const videoId = extractYouTubeId(project.preview);
    if (videoId) {
      previewHTML = `<iframe width="100%" height="480" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:12px"></iframe>`;
    } else {
      previewHTML = `<p class="no-preview">Preview format not supported</p>`;
    }
  } else {
    previewHTML = `<p class="no-preview">No preview available for this project</p>`;
  }

  const tagsHTML = project.tags
    ? project.tags.map((t) => `<span class="tag">${t}</span>`).join("")
    : "";
  const challengeHTML = project.challenge
    ? `<div class="modal-challenge"><i class="fas fa-lightbulb"></i> <strong>Behind the Code:</strong> ${project.challenge}</div>`
    : "";
  const linksHTML = project.links
    ? Object.entries(project.links)
        .map(
          ([key, url]) =>
            `<a href="${url}" target="_blank" class="btn btn-outline" style="padding:8px 16px;font-size:13px"><i class="fas fa-${key === "github" ? "code-branch" : "external-link-alt"}"></i> ${key.charAt(0).toUpperCase() + key.slice(1)}</a>`,
        )
        .join("")
    : "";

  previewContent.innerHTML =
    previewHTML +
    `
    <div class="modal-description">
      <h3>About This Project</h3>
      <p>${project.description}</p>
      ${challengeHTML}
      <div class="modal-tags">${tagsHTML}</div>
      ${linksHTML ? `<div class="modal-links">${linksHTML}</div>` : ""}
    </div>`;

  // Gallery tab
  document.getElementById("galleryContent").innerHTML = project.images
    .map(
      (img, i) =>
        `<div class="gallery-item"><img src="${img}" alt="${project.title} – ${i + 1}" loading="lazy"></div>`,
    )
    .join("");

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
  switchTab(project.preview ? "preview" : "gallery");
}

function closeProjectModal() {
  document.getElementById("projectModal").style.display = "none";
  document.body.style.overflow = "auto";
}

function switchTab(name) {
  document
    .querySelectorAll(".tab-button")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((c) => c.classList.remove("active"));

  if (name === "preview") {
    document.querySelectorAll(".tab-button")[0].classList.add("active");
    document.getElementById("previewTab").classList.add("active");
  } else {
    document.querySelectorAll(".tab-button")[1].classList.add("active");
    document.getElementById("galleryTab").classList.add("active");
  }
}

function extractYouTubeId(url) {
  const match = url.match(
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
  );
  return match && match[2].length === 11 ? match[2] : null;
}

// Close modal on outside click / escape
window.addEventListener("click", (e) => {
  if (e.target === document.getElementById("projectModal")) closeProjectModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProjectModal();
});

/* ==========================================
   SCROLL EFFECTS
   ========================================== */
function setupScrollEffects() {
  const header = document.getElementById("header");
  const aiAgentBtn = document.getElementById("aiAgentBtn");
  const backToTop = document.getElementById("backToTop");
  const floatingSocial = document.getElementById("floatingSocial");

  // Intersection Observer for scroll-reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll(
      ".reveal, .project-card, .skill-card, .profile-card, .timeline-card",
    )
    .forEach((el) => {
      observer.observe(el);
    });

  // Active nav link on scroll
  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    const scrollY = window.scrollY;

    // Header solid on scroll
    header.classList.toggle("scrolled", scrollY > 60);

    // Floating buttons
    if (aiAgentBtn) aiAgentBtn.classList.toggle("visible", scrollY > 400);
    if (backToTop) backToTop.classList.toggle("visible", scrollY > 600);
    if (floatingSocial)
      floatingSocial.classList.toggle("visible", scrollY > 400);

    // Active nav link
    sections.forEach((section) => {
      const top = section.offsetTop - 100;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        link.classList.toggle(
          "active",
          scrollY >= top && scrollY < top + height,
        );
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load

  // Back to top
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* ==========================================
   MOBILE MENU
   ========================================== */
function setupMobileMenu(data) {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileNavLinks = document.getElementById("mobileNavLinks");

  if (data.nav) {
    mobileNavLinks.innerHTML = data.nav
      .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
      .join("");
  }

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "";
  });

  // Close on link click
  mobileNavLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

/* ==========================================
   CONTACT FORM — EmailJS
   ========================================== */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const btnSpan = btn.querySelector("span");
    const originalText = btnSpan.textContent;
    btnSpan.textContent = "Sending...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    emailjs
      .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(() => {
        showToast("Message sent successfully! Thank you.", "success");
        form.reset();
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        showToast("Failed to send. Please try again.", "error");
      })
      .finally(() => {
        btnSpan.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = "1";
      });
  });
}

/* ==========================================
   FLOATING SOCIAL WIDGET
   ========================================== */
function setupFloatingSocial(socialLinks) {
  if (!socialLinks || !socialLinks.length) return;

  const widget = document.getElementById("floatingSocial");
  const toggle = document.getElementById("floatingSocialToggle");
  const iconEl = document.getElementById("floatingSocialIcon");
  const labelEl = document.getElementById("floatingSocialLabel");
  const listEl = document.getElementById("floatingSocialList");
  if (!widget || !toggle) return;

  // Build the expanded list
  listEl.innerHTML = socialLinks
    .map(
      (s) =>
        `<a href="${s.url}" target="_blank" aria-label="${s.platform}"><i class="${s.icon}"></i> ${s.platform}</a>`,
    )
    .join("");

  // Cycling animation state
  let currentIndex = 0;
  let cycleTimer = null;

  function showPlatform(index) {
    const social = socialLinks[index];
    iconEl.innerHTML = `<i class="${social.icon}"></i>`;
    labelEl.innerHTML = `<span>${social.platform}</span>`;
  }

  function startCycle() {
    showPlatform(currentIndex);
    cycleTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % socialLinks.length;
      showPlatform(currentIndex);
    }, 2500);
  }

  function stopCycle() {
    if (cycleTimer) {
      clearInterval(cycleTimer);
      cycleTimer = null;
    }
  }

  startCycle();

  // Toggle open/close
  toggle.addEventListener("click", () => {
    const isOpen = widget.classList.toggle("open");
    if (isOpen) {
      stopCycle();
      // Show a generic icon when open
      iconEl.innerHTML = `<i class="fas fa-times"></i>`;
      labelEl.innerHTML = `<span>Close</span>`;
    } else {
      startCycle();
    }
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!widget.contains(e.target) && widget.classList.contains("open")) {
      widget.classList.remove("open");
      startCycle();
    }
  });
}

/* ==========================================
   TOAST NOTIFICATION
   ========================================== */
function showToast(message, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
    <span>${message}</span>
  `;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    padding: 14px 24px;
    background: ${type === "success" ? "#065f46" : "#7f1d1d"};
    color: #fff;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 99999;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
    border: 1px solid ${type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"};
  `;

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ==========================================
   AI CHAT AGENT
   ========================================== */
function setupAIChat(chatData) {
  const btn = document.getElementById("aiAgentBtn");
  const chatWindow = document.getElementById("aiChatWindow");
  const closeBtn = document.getElementById("aiChatClose");
  const body = document.getElementById("aiChatBody");
  const questionsContainer = document.getElementById("aiChatQuestions");
  if (!btn || !chatWindow || !chatData) return;

  // Render preset questions
  function renderQuestions() {
    questionsContainer.innerHTML = chatData
      .map(
        (item, i) =>
          `<button class="ai-question-btn" data-index="${i}">${item.question}</button>`,
      )
      .join("");
  }

  renderQuestions();

  // Toggle chat window
  btn.addEventListener("click", () => {
    chatWindow.classList.toggle("open");
    btn.classList.toggle("active");
  });

  closeBtn.addEventListener("click", () => {
    chatWindow.classList.remove("open");
    btn.classList.remove("active");
  });

  // Handle question click
  questionsContainer.addEventListener("click", (e) => {
    const questionBtn = e.target.closest(".ai-question-btn");
    if (!questionBtn) return;

    const index = parseInt(questionBtn.dataset.index);
    const item = chatData[index];

    // Add user question bubble
    const userBubble = document.createElement("div");
    userBubble.className = "ai-chat-bubble ai-bubble-user";
    userBubble.innerHTML = `<p>${item.question}</p>`;
    body.appendChild(userBubble);

    // Show typing indicator
    const typing = document.createElement("div");
    typing.className = "ai-chat-bubble ai-bubble-bot ai-typing";
    typing.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    // Simulate delay, then show answer
    setTimeout(() => {
      typing.remove();
      const botBubble = document.createElement("div");
      botBubble.className = "ai-chat-bubble ai-bubble-bot";
      botBubble.innerHTML = `<p>${item.answer}</p>`;
      body.appendChild(botBubble);
      body.scrollTop = body.scrollHeight;
    }, 800);
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (
      !chatWindow.contains(e.target) &&
      !btn.contains(e.target) &&
      chatWindow.classList.contains("open")
    ) {
      chatWindow.classList.remove("open");
      btn.classList.remove("active");
    }
  });
}
