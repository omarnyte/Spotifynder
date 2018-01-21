// console.log('navbarring');
//
// const triggers = document.querySelectorAll('.nav-list > li');
// console.log({triggers});
// const background = document.querySelector('.dropdownBackground');
// console.log({background});
// const nav = document.querySelector('.top');
// console.log({nav});
//
// function handleEnter() {
//   this.classList.add('trigger-enter');
//   setTimeout(() => {
//     if (this.classList.contains('trigger-enter')) {
//       this.classList.add('trigger-enter-active');
//     }
//   }, 150);
//
//   background.classList.add('open');
//
//   const dropdown = this.querySelector('.dropdown');
//   const dropdownCoords = dropdown.getBoundingClientRect();
//   const navCoords = nav.getBoundingClientRect();
//
//   const coords = {
//     height: dropdownCoords.height,
//     width: dropdownCoords.width,
//     top: dropdownCoords.top - navCoords.top,
//     left: dropdownCoords.left - navCoords.left
//   };
//
//   background.style.setProperty('width', `${coords.width}px`);
//   background.style.setProperty('height', `${coords.height}px`);
//   background.style.setProperty('transform', `translate(${coords.left}px, ${coords.top}px)`);
// }
//
//
//
// function handleLeave() {
//   this.classList.remove('trigger-enter', 'trigger-enter-active');
//
//   background.classList.remove('open');
// }
//
// triggers.forEach(trigger => trigger.addEventListener('mouseenter', handleEnter));
// triggers.forEach(trigger => trigger.addEventListener('mouseleave', handleLeave));

const navList = document.querySelectorAll('.nav-list-item');
console.log(navList);
const dropdownContent = document.querySelectorAll('.dropdown-content');

function displayDropdown(e) {
  console.log(e);
  let dropdown = e.target.children[1];
  console.log(dropdown.classList);
  dropdown.classList.add('revealed');
}

function hideDropdown(e) {
  console.log(e);
}

// navList.forEach(item => item.addEventListener('mouseenter', displayDropdown));
// dropdownContent.forEach(content => content.addEventListener('mouseleave', hideDropdown));
