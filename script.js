// Typewriter effect
const messages = [
  "Chúc chị luôn xinh đẹp và rực rỡ như những đóa hoa hồng 🌹",
  "Mong chị luôn được yêu thương, an yên và mỉm cười mỗi ngày ✨",
  "Mãi iu chị 💝",
];

const el = document.getElementById('typewriter');
let msgIndex = 0, charIndex = 0, deleting = false;

const typeSpeed = 65;
const pauseAtEnd = 1200;
const pauseAtStart = 400;

function typeLoop() {
  const current = messages[msgIndex];
  if (!deleting) {
    el.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, pauseAtEnd);
      return;
    }
  } else {
    el.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      msgIndex = (msgIndex + 1) % messages.length;
      setTimeout(typeLoop, pauseAtStart);
      return;
    }
  }
  setTimeout(typeLoop, typeSpeed);
}
typeLoop();
