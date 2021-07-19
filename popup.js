let spinnerElement, meaningElement, descriptionElement, spinner, translate, 
teluguWord, teluguSynonym, html, body, descriptionText, translationElement, synonymElement;

const controller = new AbortController();

window.onload = () => {
    checkInternetConnection();
    getTags();
    hideSpinner();
    hideMeaningElement();
    translate.addEventListener('click', getMeaning);
    englishWord.addEventListener('keyup', pressEnter);
}



///////////////////        Get DOM elements            ////////////////////////////
const getTags = () => {
    spinnerElement = document.getElementsByClassName('spinner-hide')[0];
    meaningElement = document.getElementsByClassName('meaning-hide')[0];
    descriptionElement = document.getElementById("description");
    spinner = document.getElementById('spinner');
    translate = document.getElementById('translate');
    teluguWord = document.getElementById('telugu_word');
    teluguSynonym = document.getElementById('telugu_synonym');
    englishWord = document.getElementById('english_input');
    html = document.documentElement;
    body = document.body;
    description = document.getElementById('emailHelp');
    translationElement = document.getElementById('translationElement');
    synonymElement = document.getElementById('synonymElement');    
}




///////////////////        start & stop spinning   ////////////////////////////
const hideSpinner = () => {
    spinnerElement.style.display = 'none';
    spinner.style.visibility = 'hidden';
}

const showSpinner = () => {
    spinnerElement.style.display = 'block';
    spinner.style.visibility = 'visible';
}

const expandHeight = () => {
    html.style.height = '300px';
    body.style.height = '300px';
}



///////////////////        On Press Enter Get Meaning   ////////////////////////////
const pressEnter = (event) => {
    console.log("came here");
    // 13 enter key
    if (event.keyCode === 13) {
        console.log("came inside");
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    //let temp = englishWord.value;
    translate.click();
    //englishWord.innerText; = temp;
  }
}



///////////////////        hide elements            ////////////////////////////
const hideMeaningElement = () => {
    meaningElement.style.setProperty('display', 'none');
}

const hideDescriptionElement = () => {
    descriptionElement.style.display = "none";
}



///////////////////        show elements            ////////////////////////////
const showMeaningElement = () => {
    meaningElement.style.setProperty('display', 'block');
}




///////////////////        check connection            ////////////////////////////
const checkInternetConnection = () => {
    var xhr = new XMLHttpRequest();
    var file = "https://i.imgur.com/7ofBNix.png";
    var randomNum = Math.round(Math.random() * 10000);
 
    xhr.open('HEAD', file + "?rand=" + randomNum, true);
    xhr.send();
    
    xhr.addEventListener("readystatechange", processRequest, false);
    
    function processRequest(e) {
      if (xhr.readyState == 4) {
        if (!(xhr.status >= 200 && xhr.status < 304)) {
            translate.disabled = true;
            invalidDescriptionElement("Check your Internet Connection and try again...!");                     
        }
      }
      
    }
}




///////////////////        get meaning            ////////////////////////////
const getMeaning = () => {
    console.log("also came here");
    // If clicked again
    hideDescriptionElement();
    hideMeaningElement();
    showSpinner();

    const engWord = englishWord.value;
    //console.log(engWord);
    console.log(englishWord.value);
    // Input Validation
    let invalidType;
    if((invalidType = inputValidation(engWord)) != 1){
        if(invalidType == -1) invalidDescriptionElement("Please enter a word...!");
        if(invalidType == 0) invalidDescriptionElement("Please enter a valid word...!");        
        hideSpinner();
    }
    else{
        const URL = `https://telugu-translation-api.herokuapp.com/:${engWord}`;
        
        // fetch(URL)
        // .then(res => res.json())
        // .then(res => {
        //     //console.log(res);
        //     setInnerText(res.translatedWord, res.translatedWordSynonyms);
        //     hideSpinner();
            
        //     // expandHeight();
        // })
        // .catch(err => {
        //     //console.log(err);
        //     invalidDescriptionElement("sorry try again....!");
        //     hideSpinner();
        //      //invalidText("sorry try again....!");
        // });

        // fetchWithTimeout(URL, 5000,)

        const timeoutId = setTimeout(() => controller.abort(), 5000);

        fetch(URL, { signal: controller.signal })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            setInnerText(res.translatedWord, res.translatedWordSynonyms);
            hideSpinner();
            
            // expandHeight();
        })
        .catch(err => {
            console.log(err);
            invalidDescriptionElement("sorry try again after sometime....!");
            hideSpinner();
            //clearTimeout(timeoutId)
             //invalidText("sorry try again....!");
        });
        
    }
    
}




///////////////////        Set Text in Meaning Element            ////////////////////////////
const setInnerText = (telWord, telWordSynonyms) => {
    //if(telWord)    
    if(telWord !== undefined){
        showMeaningElement();
        teluguWord.innerText = telWord;
        //hideSynonymElement();
        if(telWordSynonyms !== undefined){
            let temp = "";
            for(let i of telWordSynonyms){
                temp += ","+i;
            }
            temp = temp.substring(1);                        
            teluguSynonym.innerText = temp;
        }
        else{
            hideSynonymElement();
        }
    }
    else{
        invalidDescriptionElement("sorry try again after sometime....!");
    }    
}


///////////////////        Hide Synonym            ////////////////////////////
const hideSynonymElement = () => {
    synonymElement.style.display = "none";
    document.getElementById("meanings").children[2].style.display = "none";
}



///////////////////        invalid description            ////////////////////////////

const invalidDescriptionElement = (text) => {
    //description.innerText = "Please enter a valid string..!";
    description.innerText = text;
    description.style.color = "red";
    descriptionElement.style.display = "block";
}

///////////////////        input validation            ////////////////////////////
const inputValidation = (word) => {
    if(!emptyCheck(word)) return -1;
    else if(!validString(word)) return 0;    
    else return 1;
}

const emptyCheck = (word) => {
    if(word === '') return 0;
    else return 1;
}

const validString = (word) => {
    const regExp = /^[a-zA-Z]*$/;
    if(!regExp.test(word)) return 0;
    else return 1;
}