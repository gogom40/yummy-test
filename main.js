"use strict";

// DOM Elements
let data = document.getElementById("data");
let mealDetails = document.getElementById("mealDetails");
let categories = document.getElementById("categories");
let categoriesList = document.getElementById("categoriesList");
let areaList = document.getElementById("areaList");
let area = document.getElementById("area");
let ingredientsList = document.getElementById("ingredientsList");
let contact = document.getElementById("contact");
let ingredients = document.getElementById("ingredients");
let search = document.getElementById("search");
//im
//search.classList.remove('d-none')
//data.classList.remove('d-none')
//categories.classList.remove('d-none')
//area.classList.remove('d-none')
//ingredients.classList.remove('d-none')
//contact.classList.remove('d-none')
// Spinner
$(function () {
  $(".loader").fadeOut(1000, function () {
    $(".loading").slideUp(1000, function () {
      $("body").css("overflow", "auto");
      $(".loading").remove();
    });
  });
});
// Side Navigation
let left = $(".side-nav-inner").innerWidth();
$(".side-nav").css("left", -left);
$("#closeIcon").fadeOut(0);
$("#openIcon").on("click", function () {
  $(".side-nav").css("left", 0);
  $("#closeIcon").fadeIn(0);
  $("#openIcon").fadeOut(0);
  $(".side-nav ul li").animate({ top: 0 }, 1000);
});
function openNav() {
  $("#closeIcon").fadeOut(0);
  $("#openIcon").on("click", function () {
    $(".side-nav").css("left", 0);
    $("#closeIcon").fadeIn(0);
    $("#openIcon").fadeOut(0);
    $(".side-nav ul li").animate({ top: 0 }, 1000);
  });
}
$("#closeIcon").on("click", function () {
  $(".side-nav").css("left", -left);
  $("#closeIcon").fadeOut(0);
  $("#openIcon").fadeIn(0);
  $(".side-nav ul li").animate({ top: 150 }, 1000);
});
function closeNav() {
  $("#closeIcon").on("click", function () {
    $(".side-nav").css("left", -left);
    $("#closeIcon").fadeOut(0);
    $("#openIcon").fadeIn(0);
    $(".side-nav ul li").animate({ top: 150 }, 1000);
  });
}

// Fetch and Display Meals
async function getMeals() {
  try {
    let apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s`
    );
    let responseData = await apiResponse.json();
    displayMeals(responseData.meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
  }
}
function displayMeals(meals) {
  let cartoona = "";

  meals.forEach((meal) => {
    cartoona += `
      <div class="col-md-3">
        <div onclick="getMealDetails('${meal.idMeal}')" class="card position-relative overflow-hidden rounded-2">
          <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}" srcset="">
          <div class="overlay position-absolute d-flex align-items-center text-black p-2">
            <h3 class="fs-3 text-black">${meal.strMeal}</h3>
          </div>
        </div>
      </div>
    `;
  });

  data.innerHTML = cartoona;
}

// Fetch and Display Categories
$("#categoriesLink").on('click',function(){
  getCategories();
  closeNav(); search.classList.add('d-none')
  data.classList.add('d-none')
  categories.classList.remove('d-none')
  area.classList.add('d-none')
  ingredients.classList.add('d-none')
  contact.classList.add('d-none')
})
async function getCategories() {
  try {
    let apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    let responseData = await apiResponse.json();
    displayCategories(responseData.categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

function displayCategories(categories) {
  let cartoona = "";
  categories.forEach((category) => {
    cartoona += `
      <div class="col-sm-12 col-md-6 col-lg-4">
      <div class="card rounded-2" onclick="getCategoryMeals('${
        category.strCategory
      }'); $('#data').css('opacity', '1'); $('#categories').fadeOut(300)">
        <img src="${category.strCategoryThumb}" alt="Category" />
        <div class="overlay text-center">
        <h4 class="fs-3">${category.strCategory}</h4>
        <p>${category.strCategoryDescription
          .split(" ")
          .slice(0, 20)
          .join(" ")}...</p>
        </div>
      </div>
    </div>
    `;
  });
  categoriesList.innerHTML = cartoona;
  $("#categories").fadeIn(300);
}
async function getCategoryMeals(category) {
  $("#loading").fadeIn(300);

  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let responseData = await apiResponse.json();

  displayMeals(responseData.meals.slice(0, 20));

  $("#loading").fadeOut(300);
}
// Fetch and Display Meal Details
async function getMealDetails(mealID) {
  try {
    let apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    );
    let responseData = await apiResponse.json();
    displayMealDetails(responseData.meals[0]);
  } catch (error) {
    console.error("Error fetching meal details:", error);
  }
}

function displayMealDetails(meal) {
  let ingredients = "";

  for (let i = 0; i < 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-light m-1 py-1 px-2">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }
  let tags = meal.strTags.split(",");
  let tagsStr = "";

  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
    <li class="alert alert-light m-1 py-1 px-2">${tags[i]}</li>`;
  }
  let box = `
  <div class="bg-transparent text-light rounded-3 shadow p-5 overflow-auto">
  <i
    id="closeBtn"
    class="fa-solid fa-xmark p-3 rounded-3 shadow text-dark fs-5"
    onclick="$('#mealDetails').fadeOut(300), $('#data').css('opacity', '1')"
  ></i>
  <div class="row">
    <div class="col-md-4 mb-3 mb-md-0">
      <div>
        <img
          src="${meal.strMealThumb}"
          alt="meal"
          class="img-fluid rounded-3 shadow border"
        />
        <h2 class="mt-2 text-light fw-bold">${meal.strMeal}</h2>
      </div>
    </div>
    <div class="col-md-8">
      <h3 class="fw-bold text-light">Instructions</h3>
      <p>${meal.strInstructions}</p>

      <h5 class="mt-2">
        <span class="fw-bold text-light">Area : </span>${meal.strArea}
      </h5>

      <h5 class="mt-2">
        <span class="fw-bold text-light">Category : </span>${meal.strCategory}
      </h5>

      <h5 class="mt-2 fw-bold text-light">Recipes :</h5>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${ingredients}
      </ul>

      <h5 class="mt-2 fw-bold text-light">Tags :</h5>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${tagsStr}
      </ul>

      <a
        target="_blank"
        href="${meal.strSource}"
        class="btn btn-primary mt-2 me-1"
        ><i class="fa-solid fa-link me-2"></i>Source</a
      >
      <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger mt-2"
        ><i class="fa-brands fa-youtube me-2"></i>Youtube</a
      >
    </div>
  </div>
</div>
`;
  mealDetails.innerHTML = box;
  search.classList.add('d-none')
  data.classList.add('d-none')
  categories.classList.add('d-none')
  area.classList.add('d-none')
  ingredients.classList.add('d-none')
  contact.classList.add('d-none')
}
// Initial fetch of meals and categories
getMeals();
getCategories();
getCategoryMeals();
//serch
$("#search").fadeOut(0);
$("#searchLink").on("click", function () {
  closeNav();
  $("#search").fadeIn(500);
  search.classList.remove('d-none')
  data.classList.remove('d-none')
  categories.classList.add('d-none')
  area.classList.add('d-none')
  ingredients.classList.add('d-none')
  contact.classList.add('d-none')
});
async function searchByName(term) {
  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  let responseData = await apiResponse.json();
  displayMeals(responseData.meals);
}
async function searchByFLetter(term) {
  if (term === "") {
    term = "l";
  }
  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  let responseData = await apiResponse.json();
  displayMeals(responseData.meals);
}
//endsearch
//int
$("#ingredients").fadeOut(0);
$("#ingredientsLink").on("click", function () {
  closeNav();
  getIngredients();
  $("#ingredients").fadeIn(500);
search.classList.add('d-none')
data.classList.add('d-none')
categories.classList.add('d-none')
area.classList.add('d-none')
ingredients.classList.remove('d-none')
contact.classList.add('d-none')
});
async function getIngredients() {
  $("#loading").fadeIn(300);

  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  respone = await respone.json();
  displayIngredients(respone.meals.slice(0, 20));
  $("#loading").fadeOut(300);
}

async function getIngredientsMeals(ingredients) {
  $("#loading").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));

  $("#loading").fadeOut(300);
}

function displayIngredients(ingredient) {
  $("#data").css("opacity", 0.3);

  ingredientsList.innerHTML = ingredient
    .map(
      (data) =>
        `
        <div class="col-md-3 chiken">
          <div class="text-center mt-3 text-light rounded-2" onclick="getIngredientsMeals('${
            data.strIngredient
          }'); $('#data').css('opacity', '1'); $('#ingredients').fadeOut(300)">
           <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <div class=" text-center">
            <h4>${data.strIngredient}</h4>
            <p>${data.strDescription.split(" ").slice(0, 20).join(" ")}...</p>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  $("#ingredients").fadeIn(300);
}
//endint
//area
$("#area").fadeOut(0);
$("#areaLink").on("click", function () {
  getArea();
  closeNav();
search.classList.add('d-none')
data.classList.add('d-none')
//categories.add('d-none')
area.classList.remove('d-none')
ingredients.add('d-none')
contact.classList.add('d-none')
});
async function getArea() {
  $("#loading").fadeIn(300);
  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let responseData = await apiResponse.json();
  displayArea(responseData.meals);
  $("#loading").fadeOut(300);
}
async function getAreaMeals(area) {
  $("#loading").fadeIn(300);

  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  responseData = await apiResponse.json();

  displayMeals(response.meals.slice(0, 20));

  $("#loading").fadeOut(300);
}
function displayArea(areas) {
  $("#data").css("opacity", 0.3);

  let cartoona = "";
  areas.forEach((area) => {
    cartoona += `
      <div class="col-md-3">
        <div class="card chiken rounded-2 text-center py-3" onclick="getAreaMeals('${area.strArea}'); $('#data').css('opacity', '1'); $('#area').fadeOut(300)">
          <i class="fa-solid fa-house-laptop fa-4x"></i>
          <h4 class="mb-0">${area.strArea}</h4> 
        </div>
      </div>
    `;
  });

  areaList.innerHTML = cartoona;
  $("#area").fadeIn(300);
  console.log("area");
}
//contact
$("#contactUs").on("click", function () {
  closeNav();
  $("#data").css("opacity", 0.3);
  $("#contact").fadeIn(300);
  search.classList.add('d-none')
  data.classList.add('d-none')
  categories.classList.add('d-none')
  area.classList.add('d-none')
  ingredients.classList.add('d-none')
  contact.classList.remove('d-none')
});


$("#contact").fadeOut(0);

$("#contact input").on("keyup", function () {
  inputsValidation();
});
$("#nameWarning").fadeOut(0);
$("#emailWarning").fadeOut(0);
$("#phoneWarning").fadeOut(0);
$("#ageWarning").fadeOut(0);
$("#passwordWarning").fadeOut(0);
$("#rePasswordWarning").fadeOut(0);
let submitBtn = document.getElementById("submitBtn");

function inputsValidation() {
  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.classList.remove("disabled");
    $("#submitBtn").css("cursor", "pointer");
  } else {
    submitBtn.classList.add("disabled");
    $("#submitBtn").css("cursor", "not-allowed");
  }
}

function nameValidation() {
  return /^[a-zA-Z ]+$/.test($("#uName").val());
}

$("#uName").on("keyup", function () {
  if (nameValidation()) {
    $("#nameWarning").fadeOut(300);
  } else {
    $("#nameWarning").fadeIn(300);
  }
});

function emailValidation() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    document.getElementById("email").value
  );
}

$("#email").on("keyup", function () {
  if (emailValidation()) {
    $("#emailWarning").fadeOut(300);
  } else {
    $("#emailWarning").fadeIn(300);
  }
});

function phoneValidation() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    document.getElementById("phone").value
  );
}

$("#phone").on("keyup", function () {
  if (phoneValidation()) {
    $("#phoneWarning").fadeOut(300);
  } else {
    $("#phoneWarning").fadeIn(300);
  }
});

function ageValidation() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
    document.getElementById("age").value
  );
}

$("#age").on("keyup", function () {
  if (ageValidation()) {
    $("#ageWarning").fadeOut(300);
  } else {
    $("#ageWarning").fadeIn(300);
  }
});

function passwordValidation() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
    document.getElementById("password").value
  );
}

$("#password").on("keyup", function () {
  if (passwordValidation()) {
    $("#passwordWarning").fadeOut(300);
  } else {
    $("#passwordWarning").fadeIn(300);
  }
});

function repasswordValidation() {
  return (
    document.getElementById("rePassword").value ===
    document.getElementById("password").value
  );
}
$("#rePassword").on("keyup", function () {
  if (repasswordValidation()) {
    $("#rePasswordWarning").fadeOut(300);
  } else {
    $("#rePasswordWarning").fadeIn(300);
  }
});
