/*globals io, Qs*/
let socket = io(),
    sent = false;

function submit() {
 
  let data = {
      username: $('#usernameInput').val(),
      title: $('#titleInput').val(),
      desc: $('#descInput').val()
  },
      valid = true;

  for (var i in data) if (data[i] === undefined || data[i] === '') valid = false;
  if (!valid) return sendAlert('danger', 'Please verify all fields are filled');
  if (sent) return;
  sent = true;
  sendAlert('success', 'Sending, please wait...');
  socket.emit('submitRequest', data);
  socket.on('submitRequestCallback', function(res){
    window.location = `https://sourcecode.glitch.me/view?key=${res}`;
  })
  
}

function sendAlert(type, msg) {
  $('#alert').addClass('alert').addClass(`alert-${type}`).text(msg);
}