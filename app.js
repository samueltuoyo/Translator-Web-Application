const input = document.getElementById('input');
const btn = document.querySelector('#btn');
const recBtn = document.getElementById('speech-record-button');
const TranslatedText = document.getElementById('translated-text');
const TranslateButtons = document.querySelectorAll('.switch-lang');
const selectLanguage = document.querySelector('dialog');
const SelectLangChoice = document.querySelectorAll('ul li');
const translatedArea = document.getElementById('TranslateText-Area');
let translateFrom = 'en'; // Default "From" language
let translateTo = 'fr';   // Default "To" language
let buttons;

// Open language selection dialog and determine if selecting "From" or "To" language
TranslateButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        buttons = button;
        selectLanguage.showModal();
        selectLanguage.dataset.languageType = index === 0 ? 'from' : 'to';
    });
});

// Set selected language based on user choice
SelectLangChoice.forEach((choice) => {
    choice.addEventListener('click', () => {
        const selectedLanguage = choice.getAttribute('data-value').toString();
        
        if (selectLanguage.dataset.languageType === 'from') {
            translateFrom = selectedLanguage;
        } else {
            translateTo = selectedLanguage;
        }

        // Update the button text to reflect the selected language
        buttons.textContent = choice.textContent;

        selectLanguage.close();
    });
});

// Initialize speech recognition
function initialize() {
    const speech = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    speech.onresult = (event) => {
        input.value = event.results[0][0].transcript;
        fetchLang(input.value);
    };
    speech.start();
}

// Fetch translation from API
function fetchLang(text) {
    if (!input.value) {
        TranslatedText.textContent = 'Type in something, please';
        TranslatedText.style.color = 'maroon';
    } else {
        btn.innerHTML = 'Translating ............';

        const apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
        
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                TranslatedText.textContent = data.responseData.translatedText;
                TranslatedText.style.color = '#333';
                btn.innerHTML = 'Translate <i class="fas fa-recycle"></i>';
                generateAudioIcon();
                input.value = '';
            })
            .catch(error => {
                console.error('Error:', error);
                TranslatedText.textContent = 'Translation failed, please try again.';
                TranslatedText.style.color = 'maroon';
                btn.innerHTML = 'Translate <i class="fas fa-recycle"></i>';
            });
    }
}

// Generate an audio icon if it doesn't exist already
function generateAudioIcon() {
    const existingIcon = translatedArea.querySelector('i.fas.fa-volume-up');
    if (!existingIcon) {
        const audioIcon = document.createElement('i');
        audioIcon.className = 'fas fa-volume-up fs-1 mt-3 font-weight-bold';
        audioIcon.onclick = () => generateAudio();
        translatedArea.prepend(audioIcon);
    }
}

// Generate speech synthesis for the translated text
function generateAudio() {
    const text = TranslatedText.textContent;
    const speech = new SpeechSynthesisUtterance(text);
    speech.volume = 1; 
    speech.rate = 1;
    speechSynthesis.speak(speech);
}

// Event listener for translation button
btn.addEventListener('click', () => {
    fetchLang(input.value);
});

// Event listener for speech recognition button
recBtn.onclick = () => initialize();
