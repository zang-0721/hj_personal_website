const tabWrap = document.getElementById('tabs');
const cards = [...document.querySelectorAll('.project')];
const navLinks = [...document.querySelectorAll('.topbar nav a')];

if (tabWrap) {
  tabWrap.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLButtonElement)) return;

    const filter = target.dataset.filter || 'all';
    [...tabWrap.querySelectorAll('button')].forEach((btn) => btn.classList.remove('active'));
    target.classList.add('active');

    cards.forEach((card) => {
      if (filter === 'all') {
        card.style.display = 'block';
        return;
      }
      const tags = (card.dataset.type || '').split(' ');
      card.style.display = tags.includes(filter) ? 'block' : 'none';
    });
  });
}

const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const podcastTemplate = document.getElementById('podcast-modal-template');
const researchTemplate = document.getElementById('research-modal-template');
const mediaTemplate = document.getElementById('media-modal-template');
const researchImageTemplate = document.getElementById('research-image-modal-template');


let mediaGrowthTimer = null;
let mediaAssistantTimer = null;
let researchOverlayTimer = null;

function stopMediaGrowthRotation() {
  if (mediaGrowthTimer) {
    window.clearInterval(mediaGrowthTimer);
    mediaGrowthTimer = null;
  }
  if (mediaAssistantTimer) {
    window.clearInterval(mediaAssistantTimer);
    mediaAssistantTimer = null;
  }
  if (researchOverlayTimer) {
    window.clearInterval(researchOverlayTimer);
    researchOverlayTimer = null;
  }
}



function initMediaGrowth(root) {
  const growthImages = ['./增长3.jpg', './增长2.jpg', './增长1.jpg'];
  const assistantImages = ['./助手1.png', './助手2.png', './助手3.png'];

  const growthImage = root.querySelector('[data-growth-image]');
  const assistantImage = root.querySelector('[data-assistant-image]');
  const growthViewer = root.querySelector('.media-growth-viewer');
  const assistantViewer = root.querySelector('.media-assistant-viewer');
  const lightbox = root.querySelector('.media-growth-lightbox');
  const lightboxImage = root.querySelector('.media-growth-lightbox__img');
  const closeButton = root.querySelector('[data-growth-close]');
  const prevButton = root.querySelector('[data-growth-prev]');
  const nextButton = root.querySelector('[data-growth-next]');

  if (!(growthImage instanceof HTMLImageElement)) return;

  let growthIndex = 0;
  let activeImages = growthImages;
  let activeIndex = 0;

  const renderGrowth = () => {
    const src = growthImages[growthIndex];
    growthImage.src = encodeURI(src);
    growthImage.alt = `增长${growthImages.length - growthIndex}`;
    growthImage.dataset.galleryIndex = String(growthIndex);
  };

  const renderLightbox = () => {
    if (!(lightboxImage instanceof HTMLImageElement)) return;
    const src = activeImages[activeIndex];
    lightboxImage.src = encodeURI(src);
  };

  const openLightbox = (images, startIndex) => {
    if (!(lightbox instanceof HTMLElement) || !(lightboxImage instanceof HTMLImageElement)) return;
    activeImages = images;
    activeIndex = startIndex;
    renderLightbox();
    lightbox.hidden = false;
  };

  mediaGrowthTimer = window.setInterval(() => {
    growthIndex = (growthIndex + 1) % growthImages.length;
    renderGrowth();
  }, 2200);

  renderGrowth();

  if (growthViewer instanceof HTMLButtonElement) {
    growthViewer.addEventListener('click', () => {
      const startIndex = Number.parseInt(growthImage.dataset.galleryIndex || '0', 10) || 0;
      openLightbox(growthImages, startIndex);
    });
  }

  if (assistantViewer instanceof HTMLButtonElement && assistantImage instanceof HTMLImageElement) {
    assistantViewer.addEventListener('click', () => {
      const startIndex = Number.parseInt(assistantImage.dataset.galleryIndex || '0', 10) || 0;
      openLightbox(assistantImages, startIndex);
    });
  }

  closeButton?.addEventListener('click', () => {
    if (lightbox instanceof HTMLElement) lightbox.hidden = true;
  });

  prevButton?.addEventListener('click', () => {
    if (!activeImages.length) return;
    activeIndex = (activeIndex - 1 + activeImages.length) % activeImages.length;
    renderLightbox();
  });

  nextButton?.addEventListener('click', () => {
    if (!activeImages.length) return;
    activeIndex = (activeIndex + 1) % activeImages.length;
    renderLightbox();
  });

  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.hidden = true;
  });
}


function initMediaAssistant(root) {
  const images = ['./助手1.png', './助手2.png', './助手3.png'];
  const assistantImage = root.querySelector('[data-assistant-image]');
  if (!(assistantImage instanceof HTMLImageElement)) return;

  let currentIndex = 0;
  const render = () => {
    const src = images[currentIndex];
    assistantImage.src = encodeURI(src);
    assistantImage.alt = `助手${currentIndex + 1}`;
    assistantImage.dataset.galleryIndex = String(currentIndex);
  };

  mediaAssistantTimer = window.setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    render();
  }, 2200);

  render();
}

function initResearchOverlayCarousel(root) {
  const overlayImages = ['./竞1.png', './竞2.png', './竞3.png'];
  const overlayImage = root.querySelector('[data-research-overlay-image]');
  const overlayViewer = root.querySelector('.research-overlay-viewer');
  const lightbox = root.querySelector('.media-growth-lightbox');
  const lightboxImage = root.querySelector('.media-growth-lightbox__img');
  const closeButton = root.querySelector('[data-research-close]');
  const prevButton = root.querySelector('[data-research-prev]');
  const nextButton = root.querySelector('[data-research-next]');

  if (!(overlayImage instanceof HTMLImageElement)) return;

  let currentIndex = 0;
  let activeIndex = 0;

  const render = () => {
    const src = overlayImages[currentIndex];
    overlayImage.src = encodeURI(src);
    overlayImage.alt = `竞品补充图${currentIndex + 1}`;
    overlayImage.dataset.galleryIndex = String(currentIndex);
  };

  const renderLightbox = () => {
    if (!(lightboxImage instanceof HTMLImageElement)) return;
    const src = overlayImages[activeIndex];
    lightboxImage.src = encodeURI(src);
  };

  const openLightbox = (startIndex) => {
    if (!(lightbox instanceof HTMLElement)) return;
    activeIndex = startIndex;
    renderLightbox();
    lightbox.hidden = false;
  };

  researchOverlayTimer = window.setInterval(() => {
    currentIndex = (currentIndex + 1) % overlayImages.length;
    render();
  }, 2200);

  render();

  if (overlayViewer instanceof HTMLButtonElement) {
    overlayViewer.addEventListener('click', () => {
      const startIndex = Number.parseInt(overlayImage.dataset.galleryIndex || '0', 10) || 0;
      openLightbox(startIndex);
    });
  }

  closeButton?.addEventListener('click', () => {
    if (lightbox instanceof HTMLElement) lightbox.hidden = true;
  });

  prevButton?.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + overlayImages.length) % overlayImages.length;
    renderLightbox();
  });

  nextButton?.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % overlayImages.length;
    renderLightbox();
  });

  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.hidden = true;
  });
}




function initPodcastCarousel(root) {



  const imageEl = root.querySelector('.podcast-visual-image');
  const captionEl = root.querySelector('.podcast-visual-caption');
  const prevBtn = root.querySelector('.podcast-arrow[data-dir="prev"]');
  const nextBtn = root.querySelector('.podcast-arrow[data-dir="next"]');
  if (!(imageEl instanceof HTMLImageElement) || !captionEl || !prevBtn || !nextBtn) return;

  const slides = [
    { src: './原生插件.png', caption: '原生插件沉淀' },
    { src: './AI播客自动化生成工作流交付报告.png', caption: 'AI播客自动化生成流程' },
    { src: './播客工作流.png', caption: 'AI播客工作流' },
  ];



  let currentIndex = 0;

  function render() {
    const slide = slides[currentIndex];
    imageEl.src = encodeURI(slide.src);
    imageEl.alt = slide.caption;
    captionEl.textContent = slide.caption;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    render();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    render();
  });

  render();
}

function initDraggableCube(sceneId, cubeId) {
  const cubeScene = document.getElementById(sceneId);
  const cube = document.getElementById(cubeId);
  if (!(cubeScene instanceof HTMLElement) || !(cube instanceof HTMLElement)) return;

  const ROTATE_SPEED = 0.95;
  let rotateX = -18;
  let rotateY = 24;
  let dragging = false;
  let startX = 0;
  let startY = 0;

  const render = () => {
    cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handlePointerMove = (event) => {
    if (!dragging) return;
    event.preventDefault();

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    startX = event.clientX;
    startY = event.clientY;

    rotateY += deltaX * ROTATE_SPEED;
    rotateX -= deltaY * ROTATE_SPEED;
    rotateX = Math.max(-88, Math.min(88, rotateX));
    render();
  };

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    cubeScene.classList.remove('dragging');
    if (event.pointerId !== undefined && cubeScene.hasPointerCapture(event.pointerId)) {
      cubeScene.releasePointerCapture(event.pointerId);
    }
  };

  cubeScene.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    cubeScene.classList.add('dragging');
    cubeScene.setPointerCapture(event.pointerId);
  });

  cubeScene.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  cubeScene.addEventListener('pointermove', handlePointerMove);
  cubeScene.addEventListener('pointerup', stopDragging);
  cubeScene.addEventListener('pointercancel', stopDragging);
  cubeScene.addEventListener('lostpointercapture', () => {
    dragging = false;
    cubeScene.classList.remove('dragging');
  });

  render();
}

function initSportsCube() {
  initDraggableCube('sports-cube-scene', 'sports-cube');
}

function initPodcastCube() {
  initDraggableCube('podcast-cube-scene', 'podcast-cube');
}

function initTravelCube() {
  initDraggableCube('travel-cube-scene', 'travel-cube');
}

function initHonorFlipCards() {
  const honorCards = [...document.querySelectorAll('.honor-flip-card')];
  honorCards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      card.classList.toggle('is-flipped');
    });
  });
}

function openProjectModal(title, content, type) {

  if (!modal || !modalTitle || !modalContent) return;
  stopMediaGrowthRotation();
  modalTitle.textContent = title;

  if (type === 'research-image' && researchImageTemplate) {
    modalContent.innerHTML = researchImageTemplate.innerHTML;
    modal.classList.add('research-image-mode');
    modal.classList.remove('podcast-mode', 'media-mode');
    initResearchOverlayCarousel(modalContent);
  } else if (type === 'research' && researchTemplate) {

    modalContent.innerHTML = researchTemplate.innerHTML;
    modal.classList.remove('podcast-mode', 'media-mode', 'research-image-mode');
  } else if (type === 'podcast' && podcastTemplate) {
    modalContent.innerHTML = podcastTemplate.innerHTML;
    modal.classList.add('podcast-mode');
    modal.classList.remove('media-mode', 'research-image-mode');
    initPodcastCarousel(modalContent);
  } else if (type === 'media' && mediaTemplate) {
    modalContent.innerHTML = mediaTemplate.innerHTML;
    modal.classList.add('media-mode');
    modal.classList.remove('podcast-mode', 'research-image-mode');
    initMediaGrowth(modalContent);
    initMediaAssistant(modalContent);
  } else {
    modalContent.textContent = content;
    modal.classList.remove('podcast-mode', 'media-mode', 'research-image-mode');
  }

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}




function closeProjectModal() {
  if (!modal) return;
  stopMediaGrowthRotation();
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}


cards.forEach((card) => {
  card.addEventListener('click', () => {
    const title = card.dataset.title || '项目介绍';
    const detail = card.dataset.detail || '暂无介绍';
    const modalType = card.dataset.modal || (title.includes('播客') ? 'podcast' : 'default');
    const finalType = card.dataset.modal ? modalType : (title.includes('竞品调研') ? 'research' : modalType);

    openProjectModal(title, detail, finalType);
  });
});



if (modalClose) {
  modalClose.addEventListener('click', closeProjectModal);
}

if (modal) {
  modal.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.dataset.close === 'modal') {
      closeProjectModal();
      return;
    }

    const toggle = target.closest('.podcast-expand-toggle');
    if (toggle instanceof HTMLButtonElement) {
      const panel = toggle.nextElementSibling;
      if (!(panel instanceof HTMLElement)) return;
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    }
  });
}


window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectModal();
});

const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
    });
  },
  { threshold: 0.45 }
);

sections.forEach((s) => observer.observe(s));

const fxLayer = document.createElement('div');
fxLayer.id = 'fx-layer';
document.body.appendChild(fxLayer);

function firework(x, y) {
  const colors = ['#1d4ed8', '#60a5fa', '#93c5fd', '#f59e0b', '#f472b6'];
  for (let i = 0; i < 16; i += 1) {
    const dot = document.createElement('i');
    dot.className = 'spark';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.background = colors[i % colors.length];
    dot.style.setProperty('--tx', `${(Math.random() - 0.5) * 110}px`);
    dot.style.setProperty('--ty', `${(Math.random() - 0.5) * 110}px`);
    fxLayer.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  }
}

window.addEventListener('click', (e) => {
  firework(e.clientX, e.clientY);
});

initSportsCube();
initPodcastCube();
initTravelCube();
initHonorFlipCards();











