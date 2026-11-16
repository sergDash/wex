document.getElementById('theme').onclick = () => {
    const dark = document.documentElement.classList.toggle('dark')
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch (e) {}
}