(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  if (reduceMotion) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  const bar = document.getElementById('progressBar');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.width = `${progress * 100}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  const copy = document.getElementById('copyEmail');
  copy?.addEventListener('click', async () => {
    const email = copy.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      const original = copy.textContent;
      copy.textContent = 'Copied';
      setTimeout(() => { copy.textContent = original; }, 1400);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
})();
