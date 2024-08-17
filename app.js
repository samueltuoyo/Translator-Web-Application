const input = document.getElementById('input');
const btn = document.querySelector('#btn')
const recBtn = document.getElementById('speech-record-button');
const TranslatedText = document.getElementById('translated-text')
const TranslateButtons = document.querySelectorAll('.switch-lang')
const selectLanguage = document.querySelector('dialog')
const SelectLangChoice = document.querySelectorAll('ul li')
let translateFrom
let translateTo
let buttons
TranslateButtons.forEach((button) => {
    button.addEventListener('click', () => {
        buttons = button 
        selectLanguage.showModal()
    })
})
SelectLangChoice.forEach((choice) => {
    choice.addEventListener('click', () => {
        translateFrom = choice.getAttribute('data-value').toString()
        translateTo = choice.getAttribute('data-value').toString()
        buttons.textContent = choice.textContent
        selectLanguage.close()
    })
})
function initialize() {
  const speech = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
  speech.onresult = (event) => {
    input.value = event.results[0][0].transcript
    fetchLang(input.value)
  };
  speech.start()
}
function fetchLang(text){
    if (!input.value) {
        TranslatedText.textContent = 'Type in something please '
    }
    else{
    translateFrom = 'en'
    translateTo = 'fr'
    btn.innerHTML = 'Translating ............'
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
    TranslatedText.textContent = data.responseData.translatedText
    btn.innerHTML = 'Translate <i class="fas fa-recycle"></i>'
    input.value = ''
  })}
}
btn.addEventListener('click', () => {
    fetchLang(input.value)
})
recBtn.addEventListener('click', initialize)
