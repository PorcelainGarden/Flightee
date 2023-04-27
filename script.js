const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
closeIcon = document.querySelector("header i"),
titleTag = document.getElementById("title"),
fromTag = document.getElementById("from"),
toTag = document.getElementById("to"),
waysTag = document.getElementById("ways"),
peopleTag = document.getElementById("people"),
addBttn = popupBox.querySelector("button");


const pusher = JSON.parse(localStorage.getItem("card") || "[]");
const months = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

addBox.addEventListener("click", () => {
  popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
  popupBox.classList.remove("show");

  titleTag.value = "";
  fromTag.value = "";
  toTag.value = "";
  waysTag.value = 1;
  peopleTag.value = 1;
});

function showCards(){
  pusher.forEach((pusher) => {
    let liTag = `<li class="note">
                  <div class="details">
                    <p>${pusher.title}</p>
                    <i class="uil uil-plane-departure"> </i>${pusher.from}<p></p>
                    <i class="uil uil-plane-arrival"> </i>${pusher.to}<p></p>
                    <i class="uil uil-repeat"></i>  ${pusher.ways}
                    <i class="uil uil-user"></i>  ${pusher.people} <p></p>
                    <i class="uil uil-clouds"></i> Co2 Emissions
                  </div>
                  <div class="bottom-content">
                    <span>${pusher.date}</span>
                    <div class="settings">
                        <i class="uil uil-ellipsis-h"></i>
                        <ul class="menu">
                        <li><i class="uil uil-pen"></i>Edit</li>
                        <li><i class="uil uil-trash"></i>Delete</li>
                      </ul>
                    </div>
                  </div>
                </li>`;
      addBox.insertAdjacentHTML("afterend", liTag);
  });
}
showCards();

addBttn.addEventListener("click", e => {
  e.preventDefault();
  
  let title = titleTag.value,
  from = fromTag.value,
  to = toTag.value,
  ways = waysTag.value,
  people = peopleTag.value;
  const carbonEmissions = sendAPI(titleTag.value, toTag.value, fromTag.value, waysTag.value, peopleTag.value);

  date = new Date();
  
  if(title || from || to || ways || people ){
    month = months[date.getMonth()],
    day = date.getDate(),
    year = date.getFullYear();

    

    let cardInfo = {
      title: titleTag.value, to: toTag.value, from: fromTag.value, 
      ways: waysTag.value, people: peopleTag.value, 
      emissions: carbonEmissions.value,
      date: `${month} ${day}, ${year}`
    }


    bool = true;
    while (bool == true) {
      if (carbonEmissions != null) {
        bool = true;
      } else {
        bool = false;
        pusher.push(cardInfo);
        localStorage.setItem("card", JSON.stringify(pusher));
        closeIcon.click();
        showCards();
      }
    }
    console.log("Pushed!")

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
        'X-RapidAPI-Key': 'f310377281mshb7fcdd0bd5804b1p1572d1jsnaf1143a507f5',
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

})