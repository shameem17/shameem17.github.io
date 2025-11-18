fetch("data/about.json")
  .then((res) => res.json())
  .then((data) => {
    // use innerHTML to render bold tags
    console.log(data.hero.superTitle);
    document.getElementById("aboutText").innerHTML = data.about;
    document.getElementById("aboutTitle").innerHTML = data.title;
    document.getElementById("profileImage").src = data.profileImage;
    document.getElementById("superTitle").innerHTML = data.hero.superTitle;
    document.getElementById("heroTitle").innerHTML = data.hero.title;
    document.getElementById("heroDescription").innerHTML =
      data.hero.heroDescription;

    // Set resume URL
    if (data.resumeUrl) {
      const resumeBtn = document.querySelector(".floating-resume-btn");
      if (resumeBtn) {
        resumeBtn.href = data.resumeUrl;
      }
      // Also set for nav button
      const navResumeBtn = document.querySelector(".resume-nav-btn");
      if (navResumeBtn) {
        navResumeBtn.href = data.resumeUrl;
      }
    }

    setupProjects(data.projects);
    setupSkills(data.skills);
    if (data.experience) {
      setupExperience(data.experience);
    }
    if (data.education) {
      setupEducation(data.education);
    }
    setupProfiles(data.codingProfiles);
  })
  .catch((err) => console.error("Failed to load About section:", err));

function initSlider(sliderId, dotsId, totalImages) {
  let currentIndex = 0;
  const slider = document.getElementById(sliderId);
  const dots = document.getElementById(dotsId).children;

  function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    Array.from(dots).forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalImages;
    updateSlider();
  }

  // Auto-slide every 2 seconds
  setInterval(nextSlide, 2000);

  // Optional: Add click handlers to dots
  Array.from(dots).forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateSlider();
    });
  });
}

function setupProjects(projects) {
  //card
  const container = document.getElementById("projectsGrid");

  projects.forEach((project, index) => {
    // Create card wrapper
    const card = document.createElement("div");
    card.classList.add("project-card");
    card.style.cursor = "pointer";

    // Add click event to open modal
    card.addEventListener("click", () => {
      openProjectModal(project);
    });

    // Build image slider
    let imagesHTML = "";
    project.images.forEach((img) => {
      imagesHTML += `
          <div class="slider-image" style="background-image: url('${img}'); background-size: cover; background-position: center;"></div>
        `;
    });

    // Dots
    let dotsHTML = project.images
      .map((_, i) => `<span class="dot ${i === 0 ? "active" : ""}"></span>`)
      .join("");

    // Build tags
    const tagsHTML = project.tags
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");
    const previewBtn = project.preview
      ? `<a href="${project.preview}" target="_blank" class="btn preview-btn" onclick="event.stopPropagation()">🎬 Preview</a>`
      : "";
    const githubBtn = project.github
      ? `<a href="${project.github}" target="_blank" class="btn github-btn" onclick="event.stopPropagation()">💻 GitHub</a>`
      : "";
    const appStoreBtn = project.appStore
      ? `<a href="${project.appStore}" target="_blank" class="btn appstore-btn" onclick="event.stopPropagation()">📱 App Store</a>`
      : "";
    // Full card HTML
    card.innerHTML = `
        <div class="project-image">
          <div class="image-slider" id="slider${index + 1}">
            ${imagesHTML}
          </div>
          <div class="slider-dots" id="dots${index + 1}">
            ${dotsHTML}
          </div>
        </div>

        <div class="project-content">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-tags">${tagsHTML}</div>
          <div class="project-links">
            ${previewBtn}
            ${githubBtn}
            ${appStoreBtn}
          </div>
        </div>
      `;

    container.appendChild(card);
    initSlider(`slider${index + 1}`, `dots${index + 1}`, project.images.length);
  });
}

function setupSkills(skills) {
  const skillsGrid = document.getElementById("skills-grid");
  if (skillsGrid && skills) {
    skillsGrid.innerHTML = skills
      .map(
        (skill) => `
      <div class="skill-card">
        <div class="skill-icon">${skill.icon}</div>
        <h3 class="skill-name">${skill.name}</h3>
        <div class="skill-tags">
          ${skill.tags
            .map((tag) => `<span class="skill-tag">${tag}</span>`)
            .join("")}
        </div>
      </div>
    `
      )
      .join("");
  }
}

function setupExperience(experience) {
  const experienceTimeline = document.getElementById("experience-timeline");
  if (experienceTimeline && experience) {
    experienceTimeline.innerHTML = experience
      .map(
        (exp) => `
        <div class="experience-card">
          <div class="experience-icon">💼</div>
          <div class="experience-header">
            <h3 class="experience-position">${exp.position}</h3>
            <div class="experience-company">${exp.company}</div>
            <div class="experience-meta">
              <span><i class="fas fa-map-marker-alt"></i> ${exp.location}</span>
              <span><i class="fas fa-calendar-alt"></i> ${exp.duration}</span>
            </div>
          </div>
          <div class="experience-highlights">
            ${exp.highlights
              .map(
                (highlight) => `
              <span class="highlight-badge">
                <i class="fas fa-check-circle"></i> ${highlight}
              </span>
            `
              )
              .join("")}
          </div>
        </div>
      `
      )
      .join("");
  }
}

function setupEducation(education) {
  const educationTimeline = document.getElementById("education-timeline");
  if (educationTimeline && education) {
    educationTimeline.innerHTML = education
      .map(
        (edu) => `
        <div class="education-card">
          <div class="education-icon">🎓</div>
          <div class="education-header">
            <h3 class="education-degree">${edu.degree}</h3>
            <div class="education-institution">${edu.institution}</div>
            <div class="education-meta">
              <span><i class="fas fa-map-marker-alt"></i> ${edu.location}</span>
              <span><i class="fas fa-calendar-alt"></i> ${edu.duration}</span>
            </div>
          </div>
          <div class="education-highlights">
            ${edu.highlights
              .map(
                (highlight) => `
              <span class="highlight-badge">
                <i class="fas fa-check-circle"></i> ${highlight}
              </span>
            `
              )
              .join("")}
          </div>
        </div>
      `
      )
      .join("");
  }
}
function setupProfiles(codingProfiles) {
  const profileGrid = document.getElementById("profile-grid");
  if (profileGrid && codingProfiles) {
    profileGrid.innerHTML = codingProfiles
      .map(
        (profile) => `
        <a href="${profile.url}" target="_blank" class="profile-card">
          <div class="profile-header">
            <div class="profile-icon"><img class="profile-icon-img" src="${
              profile.icon
            }" alt="${profile.name}'s icon"></div>
            <div class="profile-info">
              <h3>${profile.name}</h3>
              <p class="profile-username">@${profile.username}</p>
            </div>
          </div>
          <div class="profile-stats">
            ${profile.stats
              .map(
                (stat) => `
              <div class="stat">
                <span class="stat-value">${stat.value}</span>
                <span class="stat-label">${stat.label}</span>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="profile-badges">
            ${profile.badges
              .map((badge) => `<span class="badge">${badge}</span>`)
              .join("")}
          </div>
        </a>
      `
      )
      .join("");
  }
}

// Modal Functions
function openProjectModal(project) {
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const previewContent = document.getElementById("previewContent");
  const galleryContent = document.getElementById("galleryContent");

  // Set modal title
  modalTitle.textContent = project.title;

  // Setup preview tab
  if (project.preview) {
    const videoId = extractYouTubeId(project.preview);
    if (videoId) {
      previewContent.innerHTML = `
        <iframe 
          width="100%" 
          height="500px" 
          src="https://www.youtube.com/embed/${videoId}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
    } else {
      previewContent.innerHTML = `<p class="no-preview">Preview link format not supported</p>`;
    }
  } else {
    previewContent.innerHTML = `<p class="no-preview">No preview available for this project</p>`;
  }

  // Setup gallery tab
  let galleryHTML = "";
  project.images.forEach((img, index) => {
    galleryHTML += `
      <div class="gallery-item">
        <img src="${img}" alt="${project.title} - Image ${
      index + 1
    }" loading="lazy">
      </div>
    `;
  });
  galleryContent.innerHTML = galleryHTML;

  // Show modal
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Reset to preview tab if available, otherwise gallery
  if (project.preview) {
    switchTab("preview");
  } else {
    switchTab("gallery");
  }
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

function switchTab(tabName) {
  const tabs = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => tab.classList.remove("active"));
  contents.forEach((content) => content.classList.remove("active"));

  if (tabName === "preview") {
    tabs[0].classList.add("active");
    document.getElementById("previewTab").classList.add("active");
  } else if (tabName === "gallery") {
    tabs[1].classList.add("active");
    document.getElementById("galleryTab").classList.add("active");
  }
}

function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  const modal = document.getElementById("projectModal");
  if (event.target === modal) {
    closeProjectModal();
  }
});

// Close modal with Escape key
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
  }
});
// EmailJS Configuration
// Replace these with your actual EmailJS values
const EMAILJS_PUBLIC_KEY = "961nxAGTq9j0Kki6g"; // Replace with your EmailJS public key
const EMAILJS_SERVICE_ID = "service_d77xomw"; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = "template_wymp3wm"; // Replace with your EmailJS template ID

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

function sendMail(event) {
  event.preventDefault();
  console.log("sendMail function called!");

  const form = document.getElementById("contactForm");
  const name = form.name.value;
  const email = form.email.value;
  const message = form.message.value;

  // Validate form
  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  } else if (name.length > 100) {
    alert("Name is too long. Please limit to 100 characters.");
    return false;
  }

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  // Send email using EmailJS
  emailjs
    .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
    .then(() => {
      console.log("Email sent successfully!");
      alert("Message sent successfully! Thank you for reaching out.");
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      alert("Failed to send message. Error: " + JSON.stringify(error));
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });

  return false;
}

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    console.log("Contact form found, setting up submit handler.");
    contactForm.addEventListener("submit", sendMail);
  } else {
    console.log("Contact form not found.");
  }
});
