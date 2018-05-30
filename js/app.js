/* Summary
- 12 random employees from the US are added by the API (only english alphabet)
- You can search for either name or username.
- Autofocus and keyup is added to the search bar for increased UX.
- When you click on any employee card, you can see more detailed information
  about them.
- In the modals you can click the arrow buttons on the side to view previous or
  next employee.
- Click on the X or outside of the modal to close it.
*/

let allEmployees = null;
let index = 0;
let newIndex = 0;
let modalHTML = "";
let employeeArray = [];
let allNames = [];
let allUsernames = [];
$(".allmodals").hide();

// Get the 12 employees from the API (from the US)
function getEmployees() {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4) {
      allEmployees = JSON.parse(xhr.responseText).results;
      printEmployees(allEmployees);

      employeeArray = allEmployees; // Used for the modals and search
      nameArray(); // Used in search results
      usernameArray(); // Used in search results
    }
  };
  xhr.open("GET", "https://randomuser.me/api/?nat=us&results=12");
  xhr.send();
}

// Runing getEmployees on page load
getEmployees();

// Adding search error message to the HTML
$(".sorry").html('<h2> Sorry, there are no employees with that name.. </h2><img class="sorryImg" src="https://tinyurl.com/y8stclgh">');
$(".sorry").hide();

// Adding the search function to the HTML
let searchHTML = "<form class='searchForm'>";
searchHTML += '<input id="search" placeholder="Search for a name or username" autofocus>'
searchHTML += '</form>'
$(".search").html(searchHTML);

// Adding employees to the HTML
function printEmployees(array){
  let employeeHTML = "<div class='all'>";

  for (let i = 0; i < array.length; i++){
    employeeHTML += "<div class='card' id='" + i + "'>";
      employeeHTML += "<div class='profilePicture'>";
        employeeHTML += '<img class="profilePicture" src="' + array[i].picture.large + '">';
      employeeHTML += "</div>";

      employeeHTML += "<div class='info'>";
        employeeHTML += "<p class='name'>" + array[i].name.first + " " + array[i].name.last + "</p>";
        employeeHTML += "<p class='mail'>" + array[i].email + "</p>";
        employeeHTML += "<p class='user'>" + array[i].login.username + "</p>";
        employeeHTML += "<p class='city'>" + array[i].location.city + "</p>";
      employeeHTML += "</div>";
    employeeHTML += "</div>";
  }

  employeeHTML += "</div>";
  $("#employees").html(employeeHTML);

  // Adding a click event for the employee cards
  $(".card").click(function(event){
    const stringIndex = $(this).attr("id");
    index = parseInt(stringIndex);
    const currentModal = employeeArray[index];
    addModal(currentModal);
  });
}

// Makes a new array with all employee names
function nameArray() {
  names = document.querySelectorAll(".info .name")
  for (let i = 0; i < names.length; i++){
    allNames.push(names[i])
  }
}

// Makes a new array with all employee usernames
function usernameArray() {
  users = document.querySelectorAll(".info .user")
  for (let i = 0; i < users.length; i++){
    allUsernames.push(users[i])
  }
}

// Search logic
function search(){
  $(".sorry").hide(); // Just in case there is a new search after error message
  const searchInputField = document.getElementById('search');
  const searchInput = searchInputField.value.toUpperCase();
  employeeArray = [] // Emptying the array before adding new employees

  // Loop through all employees and add those who match the search in the array
  for (i = 0; i < allNames.length; i++) {
      const names = allNames[i].textContent;
      const users = allUsernames[i].textContent;
      const emp = allEmployees[i];

      if (names.toUpperCase().indexOf(searchInput) > -1) {
          employeeArray.push(emp)
      } else if (users.toUpperCase().indexOf(searchInput) > -1) {
          employeeArray.push(emp)
      }
  }

  // Prevent the browser to refresh when submiting the search form
  $(".searchForm").submit(function (evt) {
    evt.preventDefault();
    search();
  });

  // Adding an error message if there are no employees matching the search.
  if(employeeArray.length === 0) {
    $(".sorry").show();
  };

  // Add relevant employees to the page
  printEmployees(employeeArray);
};

// Click event on "keyup"
$("#search").on("keyup", function() {
  search();
});

// Adding the modal to the HTML
function addModal(employee){
  const birthday = new Date(employee.dob).toLocaleDateString();

  modalHTML = "<div class='modal-content animate'>";
    modalHTML += "<div class='imgcontainer'><span class='close' title='Close Modal'>&times;</span>";
      modalHTML += '<span class="prev">&lt;</span><img class="avatar" src="' + employee.picture.large + '"><span class="next">&gt;</span>';
    modalHTML += "</div>";

    modalHTML += "<div class='textcontainer1'>";
      modalHTML += "<p class='name'>" + employee.name.first + " " + employee.name.last + "</p>";
      modalHTML += "<p class='username'>" + employee.login.username + "</p>";
      modalHTML += "<p class='mail'>" + employee.email + "</p>";
    modalHTML += "</div>";

    modalHTML += "<div class='textcontainer2'>";
      modalHTML += "<p class='phone'>Phone: " + employee.cell + "</p>";
      modalHTML += "<p class='adress'>Adress: " + employee.location.street + ', ' + employee.location.postcode + ' ' + employee.location.city + ', ' + employee.location.state + "</p>";
      modalHTML += "<p class='birthday'>Birthdate: " + birthday + "</p>";
    modalHTML += "</div>";
  modalHTML += "</div>";

  $(".allmodals").html(modalHTML);
  $(".allmodals").show();
  $(".modal-content").show();

  // Adding a click event to the close button (X)
  $(".close").click(function(event){
    $(this).parent().parent().css("display", "none");
    $(this).parent().parent().parent().css("display", "none");
  });

  // Prev click event - previous employee
  $(".prev").click(function(event){
    newIndex = index - 1; // Index is from card click event

    if(newIndex < 0) {
      newIndex = (employeeArray.length - 1);
    }

    const prevModal = employeeArray[newIndex];
    addModal(prevModal);
    index = newIndex;
  });

  // Next click event - next employee
  $(".next").click(function(event){
    newIndex = (index + 1); // Index is from card click event

    if(newIndex > (employeeArray.length - 1)) {
      newIndex = 0;
    }

    const nextModal = employeeArray[newIndex];
    addModal(nextModal);
    index = newIndex;
  });

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == $(".allmodals")[0]) {
      $(".allmodals").fadeOut(600);
      $(".modal-content").fadeOut(600);
    }
  }
}
