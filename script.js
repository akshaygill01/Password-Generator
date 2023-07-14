const inputSlider=document.querySelector("[data-length-slider]");
const lengthDisplay=document.querySelector("[data-length]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("#data-copy-msg");
const upperCaseCheck=document.querySelector("#uppercase");
const lowerCaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols="~`!@#$%^&*()-_+={}[]|\;:<,>,./?";



//default password length'
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider()
//strength circle to grey
setIndicator("#CCC");





//function to handle the slider;
//it will reflect password length to ui;
function handleSlider(){
   inputSlider.value=passwordLength;
  
   lengthDisplay.innerText=inputSlider.value;

   
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

//function to get random integer for password

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;

}

//function to get random integer;
function generateRandomNumber(){
     return getRndInteger(0,9);
}

//function to get lower case character;

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));

}

//function to get upper case character;

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
    
}

//function to generate symbol

function generateSymbol(){
    let index=getRndInteger(0,symbols.length);
    return symbols.charAt(index);
   
}

//function to calculate the strength so that we can change color of password length indicator;
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(upperCaseCheck.checked) hasUpper=true;
    if(lowerCaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#070");
    }
    else if(
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

//function to shuffle the generated password;
function shufflePassword(array){
    //fisher yates algorithm to shuffle the array
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el) => (str+=el));
    return str;
}

//applied async because i want to use await and await only works when  the function is asynchronous;
//this await navigator method is used to display password on clipboard ,and because this method shows promise i am using try catch 
    // why? because promise have two outcomes either resolve or failed

    //means agar text copy nahi hua to i would show failed on clipboard button;
async function copyContent(){
    
try { 
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.style.display="block";
    copyMsg.innerText="copied";
    
   } catch (e) {
    copyMsg.style.display="block";
     copyMsg.innerText="failed";
   }
  //to make copy span visible
   copyMsg.classList.add("active");


   setTimeout(() => {
     copyMsg.classList.remove("active");
   }, 2000);

}


//function for check boxes to now how much dense password should be generated;

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special condition if,password lenght<no of marked checkboxes then password length should become equal to no of 
    //checkboxes cheked

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        //whenever length of password is changed  we always call handle slider function so that ui can accomodate the changes
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

//function on slider to show current status of password length;
//to change value of length indicator with slider;
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})


//event listener on copy button;

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        console.log("copy button working")
        copyContent();
    }
})



//main event listener (means on generate password button)
generateBtn.addEventListener('click',()=>{
    //if no check boxes are selected;
    if(checkCount==0)  return;

    password="";//clear old password;


    //generating new password;
    console.log("starting the journey");

    let funcArr=[];

    if(upperCaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowerCaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    //characters that have to be added compulsory
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    console.log("compulsory addition done");
    //adding remaining characters to password
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndex=getRndInteger(0,funcArr.length);
        
        password+=funcArr[randomIndex]();
    }
     
    console.log("remaining addition done");

    //suffelling the generated password to make it strong 
    password=shufflePassword(Array.from(password));
    console.log("shuffeling done");
    //showing generated password in ui;
    passwordDisplay.value=password;
    console.log("ui addition done");
    //calculating strength of password;
    calcStrength();
});