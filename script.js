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

function openProjectModal(title, content, type) {
  if (!modal || !modalTitle || !modalContent) return;
  modalTitle.textContent = title;

  if (type === 'research' && researchTemplate) {
    modalContent.innerHTML = researchTemplate.innerHTML;
    modal.classList.remove('podcast-mode');
  } else if (type === 'podcast' && podcastTemplate) {
    modalContent.innerHTML = podcastTemplate.innerHTML;
    modal.classList.add('podcast-mode');
    initPodcastCarousel(modalContent);
  } else {
    modalContent.textContent = content;
    modal.classList.remove('podcast-mode');
  }

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}



function closeProjectModal() {
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

cards.forEach((card) => {
  card.addEventListener('click', () => {
    const title = card.dataset.title || '项目介绍';
    const detail = card.dataset.detail || '暂无介绍';
    const modalType = card.dataset.modal || (title.includes('播客') ? 'podcast' : 'default');
    const finalType = title.includes('竞品调研') ? 'research' : modalType;
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


