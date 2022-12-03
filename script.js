let word;
let capitalText;
let separateWords;
let arrayWords;
let randomizeWord;
let selectedWord;
let word_container;
let letter_page;
let word_page;

fetch('words.txt')
    .then(response => response.text())
    .then(text => word = text)
    .then (function(word){
        
            capitalText = word.toUpperCase();
            separateWords = capitalText.match(/.{1,5}/g);
            arrayWords = Array.from(separateWords);
            randomizeWord = Math.floor(Math.random() * arrayWords.length);
            selectedWord = arrayWords[randomizeWord].toUpperCase().split("");
            console.log(selectedWord);
            word_container = document.querySelectorAll(".word-container");
            letter_page = 0;
            word_page = 0;




            document.addEventListener("keydown", function (e) {
                if (
                    e.key === "CapsLock" ||
                    e.key === "Tab" ||
                    e.key === "Shift" ||
                    e.key === "Control" ||
                    e.key === "ArrowUp" ||
                    e.key === "ArrowRight" ||
                    e.key === "ArrowDown" ||
                    e.key === "ArrowLeft" ||
                    e.key === "Alt" ||
                    e.key === "Escape" ||
                    e.key === "Delete" ||
                    e.key === "Insert" ||
                    e.key === "Home" ||
                    e.key === "PageUp" ||
                    e.key === "Enter" ||
                    e.key === "Meta" ||
                    e.key.charCodeAt() === 70
                ) {
                    return;
                } else if (e.key === "Backspace" && word_container[word_page].children[letter_page] !== "") {
                    checkUnderRange();
                    word_container[word_page].children[letter_page].textContent = "";
                }
                 else if (word_container[word_page].children[4].textContent === ""){
                    word_container[word_page].children[letter_page].textContent = e.key.toUpperCase();
                    checkOverRange();
                } 
                else{
                   return;
                }
            });




            function checkOverRange() {
                if (letter_page === 5) {
                    return;
                } else {
                    letter_page++;
                }
            }




            function checkUnderRange() {
                if (letter_page === 0) {
                    return;
                } else {
                    letter_page--;
                }
            }



            document.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    checkIncomplete();
                }
            });



            function checkIncomplete() {
                if (word_container[word_page].children[4].textContent !== "") {
                    checkInput();
                } else {
                    alert('input is incomplete');
                }
            }


            function checkInput() {
                let word_checker = word_container[word_page];
                array = Array.from(word_checker.innerText);
                array = array.filter((e) => e % 2 !== 0);

                if (arrayWords.includes(array.join('').toString())) {
                    letterAlgo();
                    checkIfSolve();
                } else {
                    alert('input is not a word');
                }

            }



            function letterAlgo() {
                for (let i = 0; i < selectedWord.length; i++) {
                    if (array[i] === selectedWord[i]) {
                        word_container[word_page].children[i].style.backgroundColor = "rgb(6,214,160)";
                    } else if (selectedWord.includes(array[i])) {
                        word_container[word_page].children[i].style.backgroundColor = "rgb(234,157,52)";
                    } else {
                        word_container[word_page].children[i].style.backgroundColor = "rgba(152,147,165)";

                    }
                }
            }

            function checkIfSolve() {

                if (array.join('').toString() === selectedWord.join('').toString()) {
                    alert('word is solve!');
                } else {
                    console.log('word not solve yet');
                    showAnswer()
                }

            }



            function showAnswer() {
                if ((word_page === 5) && (letter_page === 5)) {
                    alert(`the answer is ${selectedWord.join('')}`);
                    return;
                } else {
                    word_page++;
                    letter_page = 0;
                }
            }





        }
    ) 









