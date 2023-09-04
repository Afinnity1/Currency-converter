const dropList = document.querySelectorAll(".drop-list select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

for(let i = 0; i < dropList.length; i++) {
    for(currency_code in country_code){
        // 3. selecting USD as default for the FROM section droplist and NPR as default for TO section droplist 
        let selected;
        if(i == 0){
            selected = currency_code == "USD" ? "selected" : "";
        }else if(i == 1){
            selected = currency_code == "NPR" ? "selected" : "";
        }

        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target); // calling loadFlag with passing target element as an argument
    });
}

function loadFlag(element){
    for(code in country_code){
        if(code == element.value){ // if currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img"); // selecting img tag of particular drop list
            // passing country code of a selected currency code in a img url
            imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png` 
        }
    }
}

window.addEventListener("load", () =>{
        getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault(); //Preventing form from submitting.
    getExchangeRate();
});
// To create a toggle behaviour for the exchange-icon icon
const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () =>{
    let tempCode = fromCurrency.value; // temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value; // passing TO currency code to FROM currency code
    toCurrency.value = tempCode; // passing temporary currency code to TO currency code
    loadFlag(fromCurrency); // calling loadFlag with passing select element (fromCurrency) of FROM
    loadFlag(toCurrency); // calling loadFlag with passing select element (toCurrency) of TO
    getExchangeRate();
});

function getExchangeRate(){
    const amount = document.querySelector(".amount input"),
    exchangeRateText = document.querySelector(".exchange-rate");
    let amountVal = amount.value;
    //Here if the user doesnt input any value or inputs 0, then we'll put 1 value by default in the input field.
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1"
        amountVal = 1;
    }
    exchangeRateText.innerText = "Getting exchange rate...";
    let url = `https://v6.exchangerate-api.com/v6/9e3ee75cc318731196198e08/latest/${fromCurrency.value}`;
    //fetching api response and returning it with parsing into javascript object and in another then method recieving that object
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateText.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    }).catch(() =>{ // if user is offline or any other error occured while fetching data then catch function will run
        exchangeRateText.innerText = "Something went wrong";
    })
}