'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const passwordInput = document.querySelector("#password");
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const menuWrapper = document.querySelector('.menu-wrapper');


let login = localStorage.getItem('username');

const getData = async function(url){
  const response = await fetch(url);

  if (!response.ok){
    throw new Error(`Not valid url: ${url}. Error code: ${response.status}`)
  }

  return await response.json();

};

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
};

function toggleModal() {
  modal.classList.toggle("is-open");
};

function authorized(){

  function logOut(){
    login = null;
    localStorage.removeItem('username');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  console.log('authorized');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
};

function notauthorized(){
  console.log('notauthorized');

  function logIn(event){
    event.preventDefault();
    login = loginInput.value;

    if (login == ''){
      alert('Enter valid username');
    } else{
      localStorage.setItem('username', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
};

function checkAuth(){
  if (login) {
    authorized();
  } else{
    notauthorized();
  }
};

function createCardRestaurant({image, kitchen, name, price, products, stars,
    time_of_delivery : timeOfDelivery }){
    
  const card = `
    <a class="card card-restaurant" data-products="${products}" data-name="${name}", 
    data-stars="${stars}", data-price="${price}", data-kitchen="${kitchen}"
    >
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);

};

function createCardGood({ description, id, image, name, price }){

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);

};

function openGoods(event){

  const target = event.target;

  const restaurant = target.closest('.card-restaurant');

  if (restaurant){

    if (! login){
      toggleModalAuth();
    }else{

    cardsMenu.textContent = '';

    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    menuWrapper.textContent = '';

    const header = document.createElement('div');
    header.className = 'section-heading'
    header.insertAdjacentHTML('beforeend', `
      <h2 class="section-title restaurant-title">${restaurant.dataset.name}</h2>
      <div class="card-info">
        <div class="rating">
          ${restaurant.dataset.stars}
        </div>
        <div class="price">От ${restaurant.dataset.price} ₽</div>
        <div class="category">${restaurant.dataset.kitchen}</div>
      </div>
    `);

    menuWrapper.insertAdjacentElement('afterbegin', header)

    getData(`db/${restaurant.dataset.products}`).then(function(data){
      data.forEach(createCardGood);
    });
    }
  }
};

function init(){

  getData('db/partners.json').then(function(data){
    data.forEach(createCardRestaurant);
  });

  cardsRestaurants.addEventListener('click', openGoods);

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  logo.addEventListener('click', function(){
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  })

  checkAuth();
};

init();
