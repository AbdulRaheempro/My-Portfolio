/* =============================================
   script.js — Abdul Raheem Portfolio
   Premium Interactions & Animations
   ============================================= */

'use strict';

/* ============================================
   PARTICLES CANVAS
   ============================================ */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0, mouseY = 0;
let animFrameId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '124,58,237' : Math.random() > 0.5 ? '37,99,235' : '6,182,212',
    });
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const alpha = (1 - dist / 140) * 0.12;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    // Mouse repel
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      p.x += dx / dist * 1.5;
      p.y += dy / dist * 1.5;
    }
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
    ctx.fill();
  });
  drawConnections();
  animFrameId = requestAnimationFrame(animateParticles);
}

window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });
resizeCanvas();
createParticles();
animateParticles();

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  scrollProgress.style.width = progress + '%';
});

/* ============================================
   NAVBAR
   ============================================ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  updateActiveNav();
  updateBackToTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (window.scrollY >= sectionTop) currentSection = section.getAttribute('id');
  });
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) link.classList.add('active');
  });
}

/* ============================================
   TYPING ANIMATION
   ============================================ */
const phrases = [
  'AI Engineer',
  'Generative AI Developer',
  'Machine Learning Engineer',
  'Deep Learning Enthusiast',
  'Computer Vision Developer',
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];
  if (isDeleting) {
    typedEl.textContent = currentPhrase.substring(0, charIndex--);
  } else {
    typedEl.textContent = currentPhrase.substring(0, charIndex++);
  }
  let delay = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === currentPhrase.length + 1) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex < 0) {
    isDeleting = false;
    charIndex = 0;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(typeEffect, delay);
}
setTimeout(typeEffect, 800);

/* ============================================
   SCROLL REVEAL (AOS-like)
   ============================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0);
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  elements.forEach(el => observer.observe(el));
}
initScrollReveal();

/* ============================================
   ANIMATED COUNTERS
   ============================================ */
function animateCounter(el, target, duration = 2000) {
  const start = 0;
  const step = (timestamp) => {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  let startTime;
  requestAnimationFrame(ts => { startTime = ts; step(ts); });
}

function initCounters() {
  const counters = document.querySelectorAll('.counter, .github-stat-num[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = true;
        const target = parseInt(entry.target.dataset.counter || entry.target.textContent);
        animateCounter(entry.target, target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}
initCounters();

/* ============================================
   SKILL BAR ANIMATION
   ============================================ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('animated'), 200);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(fill => observer.observe(fill));
}
initSkillBars();

/* ============================================
   SKILLS FILTER
   ============================================ */
document.querySelectorAll('.skills-filter .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skills-filter .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.skill-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.4s ease both';
        setTimeout(() => card.style.animation = '', 500);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ============================================
   PROJECTS FILTER
   ============================================ */
document.querySelectorAll('.projects-filter .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.projects-filter .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('#projects-grid .project-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.4s ease both';
        setTimeout(() => card.style.animation = '', 500);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ============================================
   PROJECT MODAL
   ============================================ */
const projectData = {
  eyecarebot: {
    icon: '👁️',
    title: 'EyeCareBot',
    subtitle: 'Multimodal AI + Blockchain Platform',
    description: 'A comprehensive multimodal AI and Blockchain platform for retinal eye disease detection. The system uses advanced computer vision models for retinal image analysis, integrated with a LangChain-powered diagnostic chatbot (LangGraph agent). The blockchain component ensures data integrity and patient privacy. Built to assist ophthalmologists and healthcare professionals with AI-driven diagnostic support.',
    tech: ['Python', 'PyTorch', 'LangChain', 'LangGraph', 'Blockchain', 'Computer Vision', 'OpenCV'],
    github: 'https://github.com/AbdulRaheempro',
  },
  pneumonia: {
    icon: '🫁',
    title: 'Pneumonia Detection System',
    subtitle: 'AI-Powered Medical Chest X-Ray Analysis',
    description: 'An AI-powered system for detecting pneumonia from chest X-ray images using Convolutional Neural Networks (CNNs) and Vision Transformers. The model classifies X-ray images into "normal" or "pneumonia" categories with high accuracy. Features transfer learning from pre-trained models and a clean web interface for radiologists.',
    tech: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'CNN', 'Transfer Learning', 'Flask'],
    github: 'https://github.com/AbdulRaheempro/Pneumonia-detection-system',
  },
  'rag-youtube': {
    icon: '📹',
    title: 'RAG YouTube Interaction Bot',
    subtitle: 'Natural Language Q&A over Video Content',
    description: 'An intelligent chatbot system that embeds YouTube video transcripts into vector databases (FAISS) and enables natural-language interaction with the content. Uses RAG pipeline to retrieve relevant segments and generate contextually accurate responses. Perfect for learning from long YouTube lectures and educational content.',
    tech: ['Python', 'LangChain', 'FAISS', 'OpenAI API', 'RAG', 'YouTube API', 'Vector DB'],
    github: 'https://github.com/AbdulRaheempro',
  },
  healthmate: {
    icon: '❤️',
    title: 'AI Health Mate',
    subtitle: 'Bilingual Healthcare AI Chatbot',
    description: 'A web-based AI healthcare chatbot built with Flask and Google Gemini AI that provides quick, friendly healthcare guidance in both English and Urdu. Features dark mode, quick reply buttons, and safety-first advice mechanisms to ensure accurate and responsible medical information delivery.',
    tech: ['Flask', 'Google Gemini AI', 'Python', 'HTML/CSS', 'JavaScript', 'NLP'],
    github: 'https://github.com/AbdulRaheempro/Ai-Health-Mate',
  },
  crop: {
    icon: '🌾',
    title: 'Crop Recommender System',
    subtitle: 'ML-Powered Agricultural Intelligence',
    description: 'A Machine Learning + Flask web application that predicts the best crop to cultivate based on soil nutrients (N, P, K), temperature, humidity, pH, and rainfall data. Built with a Random Forest Classifier achieving ~95% accuracy, comprehensive data preprocessing, and a simple HTML/CSS front-end for easy farmer interaction.',
    tech: ['Python', 'Flask', 'Scikit-Learn', 'Random Forest', 'Jupyter Notebook', 'Pandas', 'NumPy'],
    github: 'https://github.com/AbdulRaheempro/Crop-Recommender-System',
  },
  spam: {
    icon: '📧',
    title: 'Email Spam Classifier',
    subtitle: 'NLP-Powered Email Detection System',
    description: 'A real-time spam detection system using Natural Language Processing with TF-IDF vectorization and a machine learning classifier. Enter any email text and the smart ML model instantly classifies it as spam or safe. Features a sleek dark-themed interactive web interface for a modern user experience.',
    tech: ['Python', 'NLP', 'TF-IDF', 'Scikit-Learn', 'Flask', 'HTML/CSS', 'JavaScript'],
    github: 'https://github.com/AbdulRaheempro/Email-Spam-Classifier',
  },
  movie: {
    icon: '🎬',
    title: 'AI Movie Recommender',
    subtitle: 'Cosine Similarity Based Recommendation Engine',
    description: 'A Python & Flask-based web application that recommends movies similar to a user\'s favorite film. Uses vectorization and cosine similarity via Scikit-learn to analyze movie metadata including overview, cast, crew, genres, and keywords. Features an interactive Bootstrap 5 UI with movie cards and loading animations.',
    tech: ['Python', 'Flask', 'Scikit-Learn', 'Cosine Similarity', 'Pandas', 'Bootstrap 5'],
    github: 'https://github.com/AbdulRaheempro/Ai-Movie-Recommender',
  },
  flight: {
    icon: '✈️',
    title: 'Flight Vision Analytics',
    subtitle: 'Interactive Flight Data Dashboard',
    description: 'An interactive Flight Analytics Dashboard built with Streamlit, Plotly, and MySQL to search flights, analyze airline trends, busiest airports, pricing patterns, and class distribution. Provides comprehensive data visualization for travel analytics with real-time interactive charts.',
    tech: ['Python', 'Streamlit', 'Plotly', 'MySQL', 'Pandas', 'Data Visualization'],
    github: 'https://github.com/AbdulRaheempro/Flight-Visiion',
  },
  'medical-llm': {
    icon: '🏥',
    title: 'Medical LLM Assistant',
    subtitle: 'RAG-Powered Medical Q&A System',
    description: 'An intelligent medical question-answering system leveraging Large Language Models with a RAG pipeline to retrieve accurate, context-aware medical information from curated knowledge bases. Designed to assist healthcare professionals and students with reliable AI-driven medical insights.',
    tech: ['Python', 'LangChain', 'RAG', 'FAISS', 'LLM', 'Vector Database', 'FastAPI'],
    github: 'https://github.com/AbdulRaheempro',
  },
};

const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');

window.openModal = function(projectId) {
  const data = projectData[projectId];
  if (!data) return;
  modalBody.innerHTML = `
    <div class="modal-project-icon">${data.icon}</div>
    <h2 class="modal-title">${data.title}</h2>
    <p class="modal-subtitle">${data.subtitle}</p>
    <p class="modal-description">${data.description}</p>
    <p class="modal-tech-title">Technologies Used</p>
    <div class="modal-tech">
      ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
    </div>
    <div class="modal-actions">
      <a href="${data.github}" target="_blank" class="btn btn-primary btn-sm">
        <i class="fab fa-github"></i> View on GitHub
      </a>
      <button class="btn btn-outline btn-sm" onclick="closeModal()">
        <i class="fas fa-times"></i> Close
      </button>
    </div>
  `;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ============================================
   BACK TO TOP
   ============================================ */
const backToTop = document.getElementById('back-to-top');
function updateBackToTop() {
  if (window.scrollY > 400) backToTop.classList.add('visible');
  else backToTop.classList.remove('visible');
}
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   CONTACT FORM
   ============================================ */
window.handleSubmit = function(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const feedback = document.getElementById('form-feedback');
  const form = document.getElementById('contact-form');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  // Simulate email send (replace with actual EmailJS or backend)
  setTimeout(() => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    // Open mailto as fallback
    const mailtoLink = `mailto:abdulraheemstd@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
    window.location.href = mailtoLink;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    feedback.textContent = '✅ Thank you! Your message has been prepared. Your email client should open.';
    feedback.className = 'form-feedback success';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      feedback.textContent = '';
      form.reset();
    }, 4000);
  }, 1200);
};

/* ============================================
   SMOOTH SCROLL FOR NAV LINKS
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = target.offsetTop - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ============================================
   THEME TOGGLE
   ============================================ */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;
let isDark = true;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
isDark = savedTheme === 'dark';
updateThemeIcon();

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  const theme = isDark ? 'dark' : 'light';
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeIcon();
});

function updateThemeIcon() {
  themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
}

/* ============================================
   RESUME BUTTON LOGIC (Opens in new tab)
   ============================================ */

/* ============================================
   TILT EFFECT ON PROJECT CARDS (Desktop)
   ============================================ */
if (window.innerWidth > 768) {
  document.querySelectorAll('.project-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
}

/* ============================================
   GLOWING CURSOR TRAIL (Desktop only)
   ============================================ */
if (window.innerWidth > 1024) {
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed; width: 20px; height: 20px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%);
    pointer-events: none; z-index: 9998; transform: translate(-50%,-50%);
    transition: left 0.1s ease, top 0.1s ease;
  `;
  document.body.appendChild(trail);
  window.addEventListener('mousemove', e => {
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
  });
}

/* ============================================
   NAB LINKS HOVER ANIMATION
   ============================================ */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('mouseenter', function() {
    this.style.letterSpacing = '0.03em';
  });
  link.addEventListener('mouseleave', function() {
    this.style.letterSpacing = '';
  });
});

/* ============================================
   INIT ON LOAD
   ============================================ */
window.addEventListener('load', () => {
  // Trigger initial scroll check
  updateActiveNav();
  updateBackToTop();
  // Animate hero elements
  document.querySelector('.hero-content')?.classList.add('aos-animate');
});

console.log(
  '%c👨‍💻 Abdul Raheem — AI Engineer Portfolio\n%cBuilt with ❤️ and JavaScript\nhttps://github.com/AbdulRaheempro',
  'color: #A78BFA; font-size: 18px; font-weight: bold;',
  'color: #94A3B8; font-size: 12px;'
);
