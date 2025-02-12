const container = document.querySelector(".container");
const optionsContainer = document.querySelector(".options-container");
const searchInput = document.querySelector(".search-input");
const loader = document.querySelector(".loader");

const country = "us";
const options = [
  "general",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

let requestURL;

//Create cards from data
const generateUI = (articles) => {
  container.innerHTML = "";
  for (let item of articles) {
    let card = document.createElement("div");
    card.classList.add("news-card");
    card.innerHTML = `<div class="news-image-container">
    <img src="${item.urlToImage || "./newspaper.jpg"}" alt="" />
    </div>
    <div class="news-content">
      <div class="news-title">
        ${item.title}
      </div>
      <div class="news-description">
      ${item.description || item.content || ""}
      </div>
      <a href="${item.url}" target="_blank" class="view-button">Read More</a>
    </div>`;
    container.appendChild(card);
  }
};

//Show loader
const showLoader = () => {
  loader.style.display = "block";
};

//Hide loader
const hideLoader = () => {
  loader.style.display = "none";
};

//News API Call
const getNews = async () => {
  showLoader();
  try {
    let response = await fetch(requestURL);
    if (!response.ok) {
      throw new Error("Data unavailable at the moment. Please try again later");
    }
    let data = await response.json();
    generateUI(data.articles);
    console.log(data);
  } catch (error) {
    alert(error.message);
    console.error(error);
  } finally {
    hideLoader();
  }
};

//Category Selection
const selectCategory = (e, category) => {
  let options = document.querySelectorAll(".option");
  options.forEach((element) => {
    element.classList.remove("active");
  });
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`;
  e.target.classList.add("active");
  getNews();
};

//Options Buttons
const createOptions = () => {
  for (let i of options) {
    optionsContainer.innerHTML += `<button class="option ${
      i == "general" ? "active" : ""
    }" onclick="selectCategory(event,'${i}')">${i}</button>`;
  }
};

//Search News
const searchNews = async (query) => {
  showLoader();
  try {
    let response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`);
    if (!response.ok) {
      throw new Error("Data unavailable at the moment. Please try again later");
    }
    let data = await response.json();
    generateUI(data.articles);
    console.log(data);
  } catch (error) {
    alert(error.message);
    console.error(error);
  } finally {
    hideLoader();
  }
};

//Search Event Listener
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchNews(searchInput.value);
  }
});

const init = () => {
  optionsContainer.innerHTML = "";
  createOptions();
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=general&apiKey=${apiKey}`;
  getNews();
};

window.onload = init;