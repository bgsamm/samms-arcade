const textArea = document.querySelector('textarea');

function isFormComplete() {
  for(const input of document.querySelectorAll('input')) {
    if(input.value === '') return false;
  }
  if(textArea.value === '') return false;
  
  return true;
}

function validate() {
  if(isFormComplete()) {
    document.querySelector('input[type=submit]').disabled = false;
  }
  else {
    document.querySelector('input[type=submit]').disabled = true;
  }
}

for(const input of document.querySelectorAll('input')) {
  input.addEventListener('blur', () => {
    validate();
  });
}
textArea.addEventListener('blur', () => {
  validate();
});

textArea.addEventListener('input', () => {
  if(textArea.value.length > 200) {
    textArea.value = textArea.value.substr(0, 200);
  }
  document.querySelector('p.subtext').innerHTML = 
    "Characters remaining: " + (200 - textArea.value.length);
});