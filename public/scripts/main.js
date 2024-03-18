const target = document.getElementById('target');

function updatePosition(event) {
  const mouseX = event.clientX;
  const newPosition = mouseX / window.innerWidth * 100;
  target.style.left = newPosition + '%';
}

document.addEventListener('mousemove', updatePosition);
