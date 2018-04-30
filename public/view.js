/*globals io, Qs, hljs*/
let socket = io();

$(document).ready(function() {
  
  let key = window.location.href.replace(/[^0-9]/g, '');
  
  socket.emit('requestView', key);
  socket.on('requestViewCallback', function(data) {

    if (!data) return $('#title').text('Invalid Key');
    
    $('#title').text(data.title || 'No Title');
    $('#desc').text(data.desc || '');
    $('#author').text(data.username || 'Anonymous');
    if (data.type === 'request') {
      $('.codeOnly').remove();
      $('#requestStatus').html(`<b>Request Status:</b> ${data.status ? '<i class="fa fa-check mr-3" aria-hidden="true"></i>' : '<i class="fa fa-times mr-3" aria-hidden="true"></i>' }`);
      $('#requestTitle').html(`<b class="text-muted">Source Code Request</b>`);
      return;
    } else if (data.type === 'suggestion') {
      $('.codeOnly').remove();
      $('#requestStatus').html(`<b>Suggestion Status:</b> ${data.status ? '<i class="fa fa-check mr-3" aria-hidden="true"></i>' : '<i class="fa fa-times mr-3" aria-hidden="true"></i>' }`);
      $('#requestTitle').html(`<b class="text-muted">Website Suggestion</b>`);
      return;
    }
    $('#code').text(Qs.parse(data.code).raw || 'No Code');
    $('#difficulty').text(data.difficulty || 'Unknown');
    $('#packages').text(data.packagesUsed.toLowerCase() || 'Unknown');
    $('.key').text(data.key);
    hljs.initHighlighting();

    if (typeof data.rating !== 'object') return;

    $('#upvotes').text(data.rating.upvote.length || 0);
    $('#downvotes').text(data.rating.downvote.length || 0);
 
  })
  
})

function fetchRandom() {
  socket.emit('requestRandom');
  socket.on('requestRandomCallback', function(key){
    window.location = `https://sourcecode.glitch.me/view?key=${key}`; 
  })
}