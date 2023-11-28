const toggle = document.querySelector('.toggle');
const sideBar = document.querySelector('.side-bar');
const content = document.querySelector('.content');
const headerBar = document.querySelector('.header-bar');

toggle.onclick = function() {
    sideBar.classList.toggle('active');
    headerBar.classList.toggle('active')
}

window.onscroll = function() {
    if (document.documentElement.scrollTop > 20) {
        headerBar.classList.add('shadowed');
    } else {
        headerBar.classList.remove('shadowed');
    }
}