function updateClock() {
  const date = new Date();
  $('#date').html('Date: ' + date.toLocaleDateString());
  $('#time').html('Time: ' + date.toLocaleTimeString());
}
updateClock();

setInterval(() => {
  updateClock();
}, 1000);

$('#good').on('click', () => {
  if(response !== $('#good').val()) {
    $('#response').slideUp(800, () => {
      $('#response').html("That's great to hear! I hope you have fun playing games!");
    });
    $('#response').slideDown(1000);
  }
  response = $('#good').val();
});

$('#notgood').on('click', () => {
  if(response !== $('#notgood').val()) {
    $('#response').slideUp(800, () => {
      $('#response').html("I'm sorry to hear that. Maybe some games will help you feel better.");
    });
    $('#response').slideDown(1000);
  }
  response = $('#notgood').val();
});

var response = '';