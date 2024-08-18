const input = document.getElementById('input');
const btn = document.querySelector('#btn')
const recBtn = document.getElementById('speech-record-button');
const TranslatedText = document.getElementById('translated-text')
const TranslateButtons = document.querySelectorAll('.switch-lang')
const selectLanguage = document.querySelector('dialog')
const SelectLangChoice = document.querySelectorAll('ul li')
const translatedArea = document.getElementById('TranslateText-Area')
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
        TranslatedText.style.color = 'maroon'
    }
    else{
    translateFrom = 'en'
    translateTo = 'fr'
    btn.innerHTML = 'Translating ............'
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`
    fetch(apiUrl).then(res => res.json()).then(data => {
    TranslatedText.textContent = data.responseData.translatedText
    TranslatedText.style.color = '#333'
    btn.innerHTML = 'Translate <i class="fas fa-recycle"></i>'
    generateAudioIcon()
    input.value = ''
  })}
}


function generateAudioIcon(){
  const existingIcon = translatedArea.querySelector('i.fas.fa-volume-up')
  if (!existingIcon) {
    const audioIcon = document.createElement('i')
    audioIcon.className = 'fas fa-volume-up fs-1 mt-3 font-weight-bold'
    audioIcon.onclick = () => generateAudio()
    translatedArea.prepend(audioIcon)
  }
}


function generateAudio() {
  const text = TranslatedText.textContent
  const speech = new SpeechSynthesisUtterance(text)
  speech.volume = 1; 
  speech.rate = 1
  speechSynthesis.speak(speech)
}

btn.addEventListener('click', () => {
    fetchLang(input.value)
})


recBtn.onclick = () => initialize()
