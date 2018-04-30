/*globals io, findBestMatch*/
let socket = io();
let items;
let tags = {};
let initialTable;
let showingInitial = true;

// Request Entries
  socket.emit('requestEntries');
  socket.on('requestEntriesCallback', function(data){
    items = data;
    for (var i in data) {
      if (typeof data[i].rating !== 'object') data[i].rating = { upvote: [], downvote: [] };
      let row = $(`<tr onclick=goto("key=${data[i].key}")>`);
      row.append($(`<th scope="row"><i class="fa fa-arrows-v" aria-hidden="true"></i><code>&nbsp${data[i].rating.upvote.length-data[i].rating.downvote.length}</code></th>`))
      row.append($(`<th scope="row">${data[i].username}</th>`));
      row.append($(`<td>${data[i].title}</td>`));
      row.append($(`<td>${data[i].packagesUsed.toLowerCase()}</td>`));
      row.append($(`<td>${data[i].difficulty}</td>`));
      $("#table tbody").append(row); 
    }
    setTags();
  })

function add(prop) {
  if (!tags[prop.toLowerCase()] || typeof tags[prop.toLowerCase()] !== 'number') tags[prop.toLowerCase()] = 1;
  else tags[prop.toLowerCase()]++;
}


function setTags() {
  if ($('#tags').length < 1) return;
  items.map(function(item){
    item.packagesUsed = item.packagesUsed.split(',');
    if (!item.packagesUsed instanceof Array) return add('No Tags');
    for (var i in item.packagesUsed) add(item.packagesUsed[i].trim())
  });
  for (var i in tags) {
    var name = i;
    if (name.length > 20) name = `${name.substring(0, 20)}...`;
    let row = $(`<tr onclick="searchTags('${name}')">`);
    row.append($(`<th scope="row width="95%">${name}</th>`));
    row.append($(`<td width="5%"><span class="badge badge-light">${tags[i]}</span></td>`));
    $("#tags").append(row); 
  }
  let row = $(`<tr onclick="searchTags('Clear Filter')">`);
  sortTags();
  row.append($(`<th scope="row width="95%">Clear Filter</th>`));
  row.append($(`<td width="5%"></td>`));
  $('#tags').prepend(row);
  $('#tagCount').text($('#tags tr').length);
}

function goto(key) {
 window.location = `https://sourcecode.glitch.me/view?${key}`; 
}

function fetchRandom() {
  socket.emit('requestRandom');
  socket.on('requestRandomCallback', function(key){
    window.location = `https://sourcecode.glitch.me/view?key=${key}`; 
  })
}

function searchTags(input) {
  var filter, table, tr, td, i;
  if (input === 'Clear Filter') input = '';
  filter = input.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
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

function sortTags() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("tags");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("tr");
    for (i = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[0].getElementsByTagName("span")[0];
      y = rows[i + 1].getElementsByTagName("td")[0].getElementsByTagName("span")[0];
      if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function sort() {
  if (showingInitial) {
    showingInitial = false;
    initialTable = document.getElementById("table").innerHTML;
    $('#sortBy').text('Recent');
    sortTable();
  } else {
    showingInitial = true;
    $('#sortBy').text('Rating')
    $('#table').html(initialTable)
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
    rows = table.getElementsByTagName("tr");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("th")[0];
      y = rows[i + 1].getElementsByTagName("th")[0];
      // Check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
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