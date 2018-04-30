/*globals io, Qs*/
let socket = io(),
    sent = false;

function submit() {
 
  let data = {
    username: $('#usernameInput').val(),
      title: $('#codeTitleInput').val(),
      difficulty: $('#difficultyInput').val(),
      packagesUsed: $('#tagsInput').val(),
      code: $('#codeInput').val()
  },
      valid = true;
  
  for (var i in data) if (data[i] === undefined || data[i] === '') valid = false;
  if (!valid) return sendAlert('danger', 'Please verify all fields are filled');
  if (sent) return;
  sent = true;
  data.code = Qs.stringify({ raw: data.code });
  data.desc = $('#descInput').val();
  sendAlert('success', 'Sending, please wait...');
  socket.emit('submitCode', data);
  socket.on('submitCodeCallback', function(res){
    window.location = `https://sourcecode.glitch.me/view?key=${res}`;
  })
  
}

function sendAlert(type, msg) {
  $('#alert').addClass('alert').addClass(`alert-${type}`).text(msg);
}