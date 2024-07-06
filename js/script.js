document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.navbar__mobile-menu-toggle')
  const mobileMenu = document.querySelector('.navbar__mobile-menu-items')
  toggleBtn.addEventListener('click', () => mobileMenu.classList.toggle('active'))
})