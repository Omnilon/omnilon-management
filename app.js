const NEWSLETTER_STORAGE_KEY = "omnilon_management_newsletter_v1";
const HOVER_LOCK_MS = 7000;
const PROFILE_CYCLE_MS = 5000;

const TALENTS = [
  {
    id: "isaac-lelonek",
    name: "Isaac Lelonek",
    handle: "@isaaclelonek",
    birthPlace: "United States",
    height: "5'11\" / 180 cm",
    age: "25",
    genderIdentity: "Male",
    division: "Runway / Editorial",
    image: "./public/assets/images/isaac/isaac-static-card-g.jpg",
    profileImages: [
      "./public/assets/images/isaac/isaac-closeup-shirt.jpg",
      "./public/assets/images/isaac/isaac-full-shirt.jpg",
      "./public/assets/images/isaac/isaac-closeup-shirtless.jpg",
      "./public/assets/images/isaac/isaac-full-shirtless.jpg",
    ],
  },
  {
    id: "peter-kessler",
    name: "Peter Kessler",
    handle: "@peterkessler",
    birthPlace: "Greece",
    height: "6'2\" / 188 cm",
    age: "22",
    genderIdentity: "Male",
    division: "Runway / Editorial",
    image: "./public/assets/images/peter/peter-closeup-shirt.jpg",
    profileImages: [
      "./public/assets/images/peter/peter-closeup-shirt.jpg",
      "./public/assets/images/peter/peter-closeup-shirtless.jpg",
    ],
  },
  {
    id: "adrian-vale",
    name: "Adrian Vale",
    handle: "@adrianv.arch",
    birthPlace: "Austin, Texas, USA",
    height: "5'11\" / 180 cm",
    age: "24",
    genderIdentity: "Man (he/him)",
    division: "Editorial / Runway",
    image: "./public/assets/images/talent/adrian-vale.png",
    profileImages: ["./public/assets/images/talent/adrian-vale.png"],
  },
  {
    id: "mina-seo",
    name: "Mina Seo",
    handle: "@minaseo.studio",
    birthPlace: "San Diego, California, USA",
    height: "5'6\" / 168 cm",
    age: "23",
    genderIdentity: "Woman (she/her)",
    division: "Beauty / Editorial",
    image: "./public/assets/images/talent/mina-seo.png",
    profileImages: ["./public/assets/images/talent/mina-seo.png"],
  },
  {
    id: "elias-hart",
    name: "Elias Hart",
    handle: "@eliashart.jpg",
    birthPlace: "Denver, Colorado, USA",
    height: "6'0\" / 183 cm",
    age: "25",
    genderIdentity: "Man (he/him)",
    division: "Campaign / Runway",
    image: "./public/assets/images/talent/elias-hart.png",
    profileImages: ["./public/assets/images/talent/elias-hart.png"],
  },
  {
    id: "naomi-rhodes",
    name: "Naomi Rhodes",
    handle: "@naomi.rhodes",
    birthPlace: "Atlanta, Georgia, USA",
    height: "5'8\" / 173 cm",
    age: "26",
    genderIdentity: "Woman (she/her)",
    division: "Editorial / Concept",
    image: "./public/assets/images/talent/naomi-rhodes.png",
    profileImages: ["./public/assets/images/talent/naomi-rhodes.png"],
  },
  {
    id: "camila-reyes",
    name: "Camila Reyes",
    handle: "@cami.reyes.co",
    birthPlace: "Phoenix, Arizona, USA",
    height: "5'7\" / 170 cm",
    age: "24",
    genderIdentity: "Woman (she/her)",
    division: "Beauty / Editorial",
    image: "./public/assets/images/talent/camila-reyes.png",
    profileImages: ["./public/assets/images/talent/camila-reyes.png"],
  },
  {
    id: "kenji-mori",
    name: "Kenji Mori",
    handle: "@kenjimori.frames",
    birthPlace: "Seattle, Washington, USA",
    height: "5'10\" / 178 cm",
    age: "29",
    genderIdentity: "Man (he/him)",
    division: "Campaign / Editorial",
    image: "./public/assets/images/talent/kenji-mori.png",
    profileImages: ["./public/assets/images/talent/kenji-mori.png"],
  },
  {
    id: "zayn-malikhan",
    name: "Zayn Malikhan",
    handle: "@zayn.malikhan",
    birthPlace: "Jersey City, New Jersey, USA",
    height: "5'11\" / 180 cm",
    age: "27",
    genderIdentity: "Man (he/him)",
    division: "Campaign / Motion",
    image: "./public/assets/images/talent/zayn-malikhan.png",
    profileImages: ["./public/assets/images/talent/zayn-malikhan.png"],
  },
];

const ui = {
  menuToggle: document.querySelector(".menu-toggle"),
  hudNav: document.querySelector("#hudNav"),
  navLinks: Array.from(document.querySelectorAll("#hudNav a")),
  revealBlocks: Array.from(document.querySelectorAll("[data-reveal]")),
  talentGrid: document.querySelector("#talentGrid"),
  profilePanel: document.querySelector("#profilePanel"),
  panelState: document.querySelector("#panelState"),
  profileImage: document.querySelector("#profileImage"),
  fieldName: document.querySelector("#fieldName"),
  fieldHandle: document.querySelector("#fieldHandle"),
  fieldBirthPlace: document.querySelector("#fieldBirthPlace"),
  fieldHeight: document.querySelector("#fieldHeight"),
  fieldAge: document.querySelector("#fieldAge"),
  fieldGenderIdentity: document.querySelector("#fieldGenderIdentity"),
  nextIntake: document.querySelector("#nextIntake"),
  quoteForm: document.querySelector("#quoteForm"),
  quoteFeedback: document.querySelector("#quoteFeedback"),
  newsletterForm: document.querySelector("#newsletterForm"),
  newsletterEmail: document.querySelector("#newsletterEmail"),
  newsletterFeedback: document.querySelector("#newsletterFeedback"),
  consultationForm: document.querySelector("#consultationForm"),
  consultationDate: document.querySelector("#consultDate"),
  consultationFeedback: document.querySelector("#consultationFeedback"),
  scanPulse: document.querySelector("#scanPulse"),
};

let activeTalentId = null;
let hoverLockUntil = 0;
let activeCycleTimer = null;
let activeCycleIndex = 0;
let activeCycleTalentId = null;

init();

function init() {
  setupMenuToggle();
  setupRevealAnimations();
  renderTalentGrid();
  setupScanPulse();
  setupIntakeLabel();
  setupQuoteForm();
  setupNewsletterForm();
  setupConsultationForm();
  setDefaultTalentForDevice();
  setupResponsiveSelectionFallback();
}

function setupMenuToggle() {
  if (!ui.menuToggle || !ui.hudNav) {
    return;
  }

  ui.menuToggle.addEventListener("click", () => {
    const isOpen = ui.hudNav.classList.toggle("open");
    ui.menuToggle.setAttribute("aria-expanded", String(isOpen));
    ui.menuToggle.textContent = isOpen ? "Close" : "Menu";
  });

  ui.navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!isCompactLayout()) {
        return;
      }
      ui.hudNav.classList.remove("open");
      ui.menuToggle.setAttribute("aria-expanded", "false");
      ui.menuToggle.textContent = "Menu";
    });
  });

  window.addEventListener("resize", () => {
    if (isCompactLayout()) {
      return;
    }
    ui.hudNav.classList.remove("open");
    ui.menuToggle.setAttribute("aria-expanded", "false");
    ui.menuToggle.textContent = "Menu";
  });
}

function isCompactLayout() {
  return window.matchMedia("(max-width: 860px)").matches;
}

function setupRevealAnimations() {
  if (!ui.revealBlocks.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    ui.revealBlocks.forEach((block) => block.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  ui.revealBlocks.forEach((block) => observer.observe(block));
}

function renderTalentGrid() {
  if (!ui.talentGrid) {
    return;
  }

  const fragment = document.createDocumentFragment();

  TALENTS.forEach((talent) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "talent-card";
    card.dataset.talentId = talent.id;
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-label", `View profile for ${talent.name}`);

    const img = document.createElement("img");
    img.src = talent.image;
    img.alt = `${talent.name} portrait`;
    img.className = "card-image";
    if (talent.id === "isaac-lelonek") {
      img.classList.add("card-image--isaac-lower");
    }

    const meta = document.createElement("div");
    meta.className = "card-meta";

    const name = document.createElement("p");
    name.className = "card-name";
    name.textContent = talent.name;

    const role = document.createElement("p");
    role.className = "card-role";
    role.textContent = talent.division;

    meta.append(name, role);
    card.append(img, meta);

    card.addEventListener("mouseenter", () => {
      handleTalentHoverStart(talent.id);
    });

    card.addEventListener("mousemove", () => {
      handleTalentHoverMove(talent.id);
    });

    card.addEventListener("mouseleave", () => {
      handleTalentHoverEnd(talent.id);
    });

    card.addEventListener("focus", () => {
      handleTalentHoverStart(talent.id);
    });

    card.addEventListener("blur", () => {
      handleTalentHoverEnd(talent.id);
    });

    card.addEventListener("click", () => {
      handleTalentSelect(talent.id);
    });

    fragment.append(card);
  });

  ui.talentGrid.innerHTML = "";
  ui.talentGrid.append(fragment);
}

function handleTalentHoverStart(talentId) {
  if (isHoverLocked() && talentId !== activeTalentId) {
    return;
  }

  activateTalent(talentId, { source: "hover" });

  if (canCycleTalent(talentId)) {
    startTalentCycle(talentId);
  } else {
    stopActiveCycle();
  }
}

function handleTalentHoverMove(talentId) {
  if (isHoverLocked() && talentId !== activeTalentId) {
    return;
  }

  if (activeTalentId !== talentId) {
    activateTalent(talentId, { source: "hover" });
  }

  if (canCycleTalent(talentId)) {
    startTalentCycle(talentId);
  } else {
    stopActiveCycle();
  }
}

function handleTalentHoverEnd(talentId) {
  if (talentId === activeCycleTalentId) {
    stopActiveCycle();
  }
}

function handleTalentSelect(talentId) {
  activateTalent(talentId, { source: "click" });
  hoverLockUntil = Date.now() + HOVER_LOCK_MS;
  stopActiveCycle();
}

function isHoverLocked() {
  return Date.now() < hoverLockUntil;
}

function activateTalent(talentId, options = {}) {
  const talent = TALENTS.find((entry) => entry.id === talentId);
  if (!talent) {
    return;
  }

  activeTalentId = talentId;

  const cards = Array.from(document.querySelectorAll(".talent-card"));
  cards.forEach((card) => {
    const isActive = card.dataset.talentId === talentId;
    card.classList.toggle("is-active", isActive);
    card.setAttribute("aria-pressed", String(isActive));
  });

  if (ui.fieldName) {
    ui.fieldName.textContent = talent.name;
  }
  if (ui.fieldHandle) {
    ui.fieldHandle.textContent = talent.handle;
  }
  if (ui.fieldBirthPlace) {
    ui.fieldBirthPlace.textContent = talent.birthPlace;
  }
  if (ui.fieldHeight) {
    ui.fieldHeight.textContent = talent.height;
  }
  if (ui.fieldAge) {
    ui.fieldAge.textContent = talent.age;
  }
  if (ui.fieldGenderIdentity) {
    ui.fieldGenderIdentity.textContent = talent.genderIdentity;
  }

  const stateText = `Active scan: ${talent.id}`;
  if (ui.panelState) {
    ui.panelState.textContent = stateText;
  }

  if (ui.profilePanel) {
    ui.profilePanel.classList.remove("is-expanded");
    requestAnimationFrame(() => {
      ui.profilePanel.classList.add("is-expanded");
    });
  }

  const images = talent.profileImages?.length ? talent.profileImages : [talent.image];
  setPanelImage(images[0], talent.name);

  if (!canCycleTalent(talentId)) {
    stopActiveCycle();
  }
}

function canCycleTalent(talentId) {
  const talent = TALENTS.find((entry) => entry.id === talentId);
  return Boolean(talent && Array.isArray(talent.profileImages) && talent.profileImages.length > 1);
}

function startTalentCycle(talentId) {
  const talent = TALENTS.find((entry) => entry.id === talentId);
  if (!talent || !Array.isArray(talent.profileImages) || talent.profileImages.length < 2) {
    return;
  }

  // Restart from frame 1 when a new profile is hovered.
  if (activeCycleTalentId !== talentId) {
    stopActiveCycle();
    activeCycleTalentId = talentId;
    activeCycleIndex = 0;
    setPanelImage(talent.profileImages[activeCycleIndex], talent.name);
  }

  if (!activeCycleTimer) {
    activeCycleTimer = setInterval(() => {
      if (activeTalentId !== talentId) {
        return;
      }
      activeCycleIndex = (activeCycleIndex + 1) % talent.profileImages.length;
      setPanelImage(talent.profileImages[activeCycleIndex], talent.name);
    }, PROFILE_CYCLE_MS);
  }
}

function stopActiveCycle() {
  if (!activeCycleTimer) {
    activeCycleTalentId = null;
    activeCycleIndex = 0;
    return;
  }

  clearInterval(activeCycleTimer);
  activeCycleTimer = null;
  activeCycleTalentId = null;
  activeCycleIndex = 0;
}

function setPanelImage(src, talentName) {
  if (!ui.profileImage || !src) {
    return;
  }

  ui.profileImage.src = src;
  ui.profileImage.alt = talentName ? `${talentName} profile image` : "Selected talent profile";
}

function setDefaultTalentForDevice() {
  if (!TALENTS.length) {
    return;
  }
  if (isCompactLayout()) {
    activateTalent(TALENTS[0].id, { source: "click" });
    return;
  }
  resetPanel();
}

function setupResponsiveSelectionFallback() {
  window.addEventListener("resize", () => {
    if (!isCompactLayout() || activeTalentId || !TALENTS.length) {
      return;
    }
    activateTalent(TALENTS[0].id, { source: "click" });
  });
}

function setupScanPulse() {
  if (!ui.scanPulse) {
    return;
  }

  const messages = [
    "SCANNING NODE READY",
    "FACIAL VECTOR LOCKED",
    "PROFILE LAYER VERIFIED",
    "TALENT SIGNAL STABLE",
  ];

  let index = 0;
  setInterval(() => {
    index = (index + 1) % messages.length;
    ui.scanPulse.textContent = messages[index];
  }, 2100);
}

function resetPanel() {
  activeTalentId = null;
  hoverLockUntil = 0;
  stopActiveCycle();

  const cards = Array.from(document.querySelectorAll(".talent-card"));
  cards.forEach((card) => {
    card.classList.remove("is-active");
    card.setAttribute("aria-pressed", "false");
  });

  if (ui.profileImage) {
    ui.profileImage.src = "./public/assets/images/analysis-placeholder.svg";
    ui.profileImage.alt = "Profile panel standby";
  }
  if (ui.fieldName) {
    ui.fieldName.textContent = "--";
  }
  if (ui.fieldHandle) {
    ui.fieldHandle.textContent = "--";
  }
  if (ui.fieldBirthPlace) {
    ui.fieldBirthPlace.textContent = "--";
  }
  if (ui.fieldHeight) {
    ui.fieldHeight.textContent = "--";
  }
  if (ui.fieldAge) {
    ui.fieldAge.textContent = "--";
  }
  if (ui.fieldGenderIdentity) {
    ui.fieldGenderIdentity.textContent = "--";
  }
  if (ui.panelState) {
    ui.panelState.textContent = "Awaiting selection";
  }
  if (ui.profilePanel) {
    ui.profilePanel.classList.remove("is-expanded");
  }
}

function setupIntakeLabel() {
  if (!ui.nextIntake) {
    return;
  }

  const now = new Date();
  const nextFallDate = resolveNextFallDate(now);
  const intakeYear = nextFallDate.getFullYear();
  const months = Math.max(0, monthsBetween(now, nextFallDate));

  ui.nextIntake.textContent =
    months <= 1
      ? `Next intake: Fall ${intakeYear} (communications opening soon)`
      : `Next intake: Fall ${intakeYear} (${months} months remaining)`;
}

function setupQuoteForm() {
  if (!ui.quoteForm || !ui.quoteFeedback) {
    return;
  }

  ui.quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(ui.quoteForm);
    const name = normalizeText(formData.get("name"));
    const email = normalizeEmail(formData.get("email"));
    const company = normalizeText(formData.get("company"));
    const service = normalizeText(formData.get("service"));
    const budget = normalizeText(formData.get("budget"));
    const message = normalizeText(formData.get("message"));

    if (!name || !company || !service || !budget || !message || !isValidEmail(email)) {
      setInlineFeedback(ui.quoteFeedback, "Complete all fields with a valid business email.", "error");
      return;
    }

    const submitButton = ui.quoteForm.querySelector("button[type='submit']");
    setSubmitButtonBusy(submitButton, true, "Submitting...");

    await wait(420);

    setInlineFeedback(ui.quoteFeedback, "Quote request secured. Desk response window: within 24 hours.", "success");
    ui.quoteForm.reset();
    setSubmitButtonBusy(submitButton, false);
  });
}

function setupConsultationForm() {
  if (!ui.consultationForm || !ui.consultationFeedback) {
    return;
  }

  if (ui.consultationDate) {
    ui.consultationDate.min = toDateInputValue(new Date());
  }

  ui.consultationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(ui.consultationForm);
    const name = normalizeText(formData.get("name"));
    const email = normalizeEmail(formData.get("email"));
    const type = normalizeText(formData.get("type"));
    const date = normalizeText(formData.get("date"));
    const details = normalizeText(formData.get("details"));

    if (!name || !type || !date || !details || !isValidEmail(email)) {
      setInlineFeedback(ui.consultationFeedback, "Complete all fields before requesting consultation.", "error");
      return;
    }

    const submitButton = ui.consultationForm.querySelector("button[type='submit']");
    setSubmitButtonBusy(submitButton, true, "Sending...");

    await wait(420);

    setInlineFeedback(ui.consultationFeedback, "Consultation request received. We will confirm by email.", "success");
    ui.consultationForm.reset();
    setSubmitButtonBusy(submitButton, false);
  });
}

function resolveNextFallDate(now) {
  const year = now.getFullYear();
  const septemberIndex = 8;
  const targetYear = now.getMonth() <= septemberIndex ? year : year + 1;
  return new Date(targetYear, septemberIndex, 1);
}

function monthsBetween(from, to) {
  const years = to.getFullYear() - from.getFullYear();
  const months = to.getMonth() - from.getMonth();
  const total = years * 12 + months;
  return from.getDate() > to.getDate() ? total - 1 : total;
}

function setupNewsletterForm() {
  if (!ui.newsletterForm || !ui.newsletterEmail || !ui.newsletterFeedback) {
    return;
  }

  ui.newsletterForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = normalizeEmail(ui.newsletterEmail.value);
    if (!isValidEmail(email)) {
      setFeedback("Please enter a valid email address.", "error");
      ui.newsletterEmail.focus();
      return;
    }

    const current = loadSignups();
    if (current.some((entry) => entry.email === email)) {
      setFeedback("This email is already subscribed.", "success");
      ui.newsletterEmail.value = "";
      return;
    }

    const submitButton = ui.newsletterForm.querySelector("button[type='submit']");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Subscribing...";
    }

    await wait(340);

    current.push({
      email,
      subscribedAt: new Date().toISOString(),
      source: "application-center",
    });

    try {
      saveSignups(current);
    } catch {
      setFeedback("Unable to save subscription right now. Please try again.", "error");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Subscribe";
      }
      return;
    }

    setFeedback("Subscribed. You will be notified for next-fall intake.", "success");
    ui.newsletterForm.reset();

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Subscribe";
    }
  });
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function setFeedback(text, state) {
  if (!ui.newsletterFeedback) {
    return;
  }
  setInlineFeedback(ui.newsletterFeedback, text, state);
}

function setInlineFeedback(target, text, state) {
  if (!target) {
    return;
  }
  target.textContent = text;
  target.dataset.state = state;
}

function setSubmitButtonBusy(button, isBusy, busyLabel = "Submitting...") {
  if (!button) {
    return;
  }
  if (!button.dataset.defaultLabel) {
    button.dataset.defaultLabel = button.textContent;
  }
  button.disabled = isBusy;
  button.textContent = isBusy ? busyLabel : button.dataset.defaultLabel;
}

function toDateInputValue(date) {
  const local = new Date(date);
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().slice(0, 10);
}

function loadSignups() {
  try {
    const raw = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSignups(entries) {
  localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(entries.slice(-500)));
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
