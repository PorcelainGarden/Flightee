const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
closeIcon = document.querySelector("header i"),
titleTag = document.getElementById("title"),
fromTag = document.getElementById("from"),
toTag = document.getElementById("to"),
waysTag = document.getElementById("ways"),
peopleTag = document.getElementById("people"),
addBttn = popupBox.querySelector("button");

addBox.addEventListener("click", () => {
  popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
  popupBox.classList.remove("show");
});

addBttn.addEventListener("click", e => {
  e.preventDefault();
  
  let title = titleTag.value,
  from = fromTag.value,
  to = toTag.value,
  ways = waysTag.value,
  people = peopleTag.value,
  dateVal = new Date();
  
  if(title || from || to || ways || people ){
    console.log(title, from, to, ways, people, dateVal)
  }

})