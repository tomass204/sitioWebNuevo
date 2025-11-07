function typeWriter(element, speed = 100) {
  const text = element.innerHTML;
  element.innerHTML = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}


document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.querySelector(".typewriter");
  if (heroTitle) typeWriter(heroTitle, 80);
});


const particlesContainer = document.createElement("div");
particlesContainer.classList.add("particles");
document.body.appendChild(particlesContainer);

for (let i = 0; i < 30; i++) {
  const particle = document.createElement("span");
  particle.classList.add("particle");
  particle.style.left = Math.random() * 100 + "vw";
  particle.style.animationDuration = 5 + Math.random() * 10 + "s";
  particle.style.opacity = Math.random();
  particlesContainer.appendChild(particle);
}


document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0)";
  });
});


const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 50) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
  });

  const navbar = document.getElementById('tabs');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
});
