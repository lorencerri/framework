/*globals io*/
let socket = io();

$(document).ready(function() {
  
  // Request Entries
  socket.emit('requestSuggestions');
  socket.on('requestSuggestions', function(data){
    for (var i in data) {
      let status;
      if (data[i].status) status = '<i class="fa fa-check ml-3" aria-hidden="true"></i>';
      else status = '<i class="fa fa-times ml-3" aria-hidden="true"></i>';
      let row = $(`<tr onclick="goto(${data[i].key})">`);
      row.append($(`<th scope="row">${data[i].username}</th>`));
      row.append($(`<td>${data[i].title}</td>`));
      row.append($(`<td>${data[i].desc}</td>`));
      row.append($(`<td>${status}</td>`));
      $("#table tbody").append(row); 
    }
  })
  
})

function goto(key) {
 window.location = `https://sourcecode.glitch.me/view?${key}`; 
}

function fetchRandom() {
  socket.emit('requestRandom');
  socket.on('requestRandomCallback', function(key){
    window.location = `https://sourcecode.glitch.me/view?key=${key}`; 
  })
}

function search() {
  // Declare variables 
  var input, filter, table, tr, td, i;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}

function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("table");
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      // Check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        // I so, mark as a switch and break the loop:
        shouldSwitch= true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}