const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = document.querySelector("header p"),
closeIcon = document.querySelector("header i"),
titleTag = document.getElementById("title"),
fromTag = document.getElementById("from"),
toTag = document.getElementById("to"),
waysTag = document.getElementById("ways"),
peopleTag = document.getElementById("people"),
addBttn = document.querySelector("button");


const pusher = JSON.parse(localStorage.getItem("card") || "[]");
const months = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
let updateMode = false, updateIndex;

addBox.addEventListener("click", () => {
  titleTag.focus();
  popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
  popupBox.classList.remove("show");
  updateMode = false;
  addBttn.innerText = "Add New Entry";
  popupTitle.innerText = "Add a New Flight";
  titleTag.value = "";
  fromTag.value = "";
  toTag.value = "";
  waysTag.value = 1;
  peopleTag.value = 1;
});

function showCards(){
  document.querySelectorAll(".card").forEach(card => card.remove());
  pusher.forEach((pusher, index) => {
    let liTag = `<li class="card">
                  <div class="details">
                    <p>${pusher.title}</p>
                    <i class="uil uil-plane-departure"> </i>${pusher.from}<p></p>
                    <i class="uil uil-plane-arrival"> </i>${pusher.to}<p></p>
                    <i class="uil uil-repeat"></i>  ${pusher.ways}
                    <i class="uil uil-user"></i>  ${pusher.people} <p></p>
                    <i class="uil uil-clouds"></i> ${pusher.emissions} kgCO₂
                  </div>
                  <div class="bottom-content">
                    <span>${pusher.date}</span>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="menu">
                        <li onclick="updateCard(${index}, '${pusher.title}', '${pusher.from}', '${pusher.to}', '${pusher.ways}', '${pusher.people}')"><i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteCard(${index})"><i class="uil uil-trash"></i>Delete</li>
                      </ul>
                    </div>
                  </div>
                </li>`;
      addBox.insertAdjacentHTML("afterend", liTag);
  });
}
showCards();

function showMenu(elem){
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e =>{
    if(e.target.tagName != "I" || e.target != elem){
      elem.parentElement.classList.remove("show");
    }
  })
}

function deleteCard(cardIndex){
  pusher.splice(cardIndex, 1);
  localStorage.setItem("card", JSON.stringify(pusher));
  showCards();
}

function updateCard(cardIndex, title, from, to, ways, people){
  updateMode = true;
  updateIndex = cardIndex;
  addBox.click();
  titleTag.value = title;
  fromTag.value = from;
  toTag.value = to;
  waysTag.value = ways;
  peopleTag.value = people;

  addBttn.innerText = "Update Entry";
  popupTitle.innerText = "Update a Flight";
  console.log(cardIndex, title, from, to, ways, people)
}

async function sendAPI(element1, element2, element3, element4, element5){
  
  const url = 'https://travel-co2-climate-carbon-emissions.p.rapidapi.com/api/v1/simpletrips';
   
  const data = {
      from: element2,
      to: element3,
      ways: element4,
      people: element5,
      language: 'en',
      title: element1,
      transport_types: [
        'flying',
      ]
    }

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'f2348189a1msh0ce3501ebcb3e58p1add59jsnd211a5787994',
      'X-RapidAPI-Host': 'travel-co2-climate-carbon-emissions.p.rapidapi.com'
    },
    body: JSON.stringify(data)
  };
  
  try {
    const response = await fetch(url, options);
    const jsonObject = await response.json();
    const co2eValue = jsonObject.trips[0].co2e;
    console.log('Carbon Emissions (in kg CO2e): ', co2eValue);
    return co2eValue;
  } catch (error) {
    console.error(error);
  }
}

addBttn.addEventListener("click", async e => {
  e.preventDefault();
  
  let title = titleTag.value,
  from = fromTag.value,
  to = toTag.value,
  ways = waysTag.value,
  people = peopleTag.value;
  carbonEmissions = await sendAPI(titleTag.value, toTag.value, fromTag.value, waysTag.value, peopleTag.value);
  

  date = new Date();
  
  if(title || from || to || ways || people ){
    month = months[date.getMonth()],
    day = date.getDate(),
    year = date.getFullYear();

    

    let cardInfo = {
      title: titleTag.value, to: toTag.value, from: fromTag.value, 
      ways: waysTag.value, people: peopleTag.value, 
      emissions: carbonEmissions,
      date: `${month} ${day}, ${year}`
    }
    if(!updateMode){
      notes.push(cardInfo);
    } else {
      updateMode = false;
      pusher[updateIndex] = cardInfo;
    }

    localStorage.setItem("card", JSON.stringify(pusher));
    closeIcon.click();
    showCards();

  }

})