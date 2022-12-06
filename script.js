let vh = window.innerHeight * 0.01;

document.documentElement.style.setProperty("--vh", `${vh}px`);

//hello

let word;
let capitalText;
let separateWords;
let arrayWords;
let randomizeWord;
let selectedWord;
let letter_page;
let word_page;
let word_checker;
let array;

let popUpContainer = document.querySelector("#popUp-container");
let endContainer = document.querySelector("#end-container");
let button = document.querySelectorAll(".keyboard-key");
let enter = document.querySelector(".keyboard-enter");
let Backspace = document.querySelector(".keyboard-backspace");
let word_container = document.querySelectorAll(".word-container");
let retryButton = document.querySelector("#retry-btn");

const letterAudio = new Audio("./click.mp3");
const enterAudio = new Audio("./enter.mp3");
const backspaceAudio = new Audio("./backspace.mp3");

fetch("words.txt")
    .then((response) => response.text())
    .then((text) => (word = text))
    .then(function (word) {

        //FUNCTION FOR GETTING WORD
        function getNewWord() {

            capitalText = word.toUpperCase();
            separateWords = capitalText.match(/.{1,5}/g);
            arrayWords = Array.from(separateWords);
            randomizeWord = Math.floor(Math.random() * arrayWords.length);
            selectedWord = arrayWords[randomizeWord].toUpperCase().split("");
            console.log(selectedWord);
        }

        getNewWord();

        letter_page = 0;
        word_page = 0;

        //EVENT FOR KEYBOARD
        document.addEventListener("keydown", function (e) {

            if (word_page === 6) {
                return;
            }
                if (e.key.charCodeAt() <= 122 && e.key.charCodeAt() >= 97 && word_container[word_page].children[4].textContent === "") {

                    letterAudio.currentTime = 0;
                    letterAudio.play();

                    if (word_page !== 6) {

                        word_container[word_page].children[letter_page].textContent = e.key.toUpperCase();
                        gsap.fromTo(word_container[word_page].children[letter_page], { scale: 0, opacity: 0, ease: "expo.out" }, { scale: 1, opacity: 1, ease: "expo.out" });
                        checkOverRange();
                    } 
                    return;

                } else if ( e.key === "Backspace" && word_container[word_page].children[0].textContent !== "") {

                    backspaceAudio.currentTime = 0;
                    backspaceAudio.play();

                    checkUnderRange();
                    word_container[word_page].children[letter_page].textContent = "";
                    gsap.fromTo(word_container[word_page].children[letter_page],{ scale: 0, opacity: 0, ease: "expo.out" },{ scale: 1, opacity: 1, ease: "expo.out" });
                } else if (e.key === "Enter") {

                    enterAudio.currentTime = 0;
                    enterAudio.play();
                    validateCompletion();
                }

                    return;
        });

        //CHECK IF INPUT IS CORRECT OR NOT
        function validateCompletion() {

            word_checker = word_container[word_page];
            array = Array.from(word_checker.innerText);
            array = array.filter((e) => e % 2 !== 0);

            if (array.join("").toString() === selectedWord.join("").toString()) {

                letterAlgo();
                popUp("Well Played!", "#44af69");
                word_page++;
                retry();
            } else if (word_container[5].children[4].textContent !== "") {

                letterAlgo();
                popUp(`The Word is ${selectedWord.join("")}`, "#44af69");
                word_page++;
                retry();
            } else {

                checkIncomplete();
            }
        }

        //FUNCTION FOR CHECKING IF ALL LETTERS ARE FILLED
        function checkIncomplete() {

            if (word_container[word_page].children[4].textContent !== "") {
        
                checkInput();
            } else {

                popUp("Not enough letters", "#EDE0D4");
            }
        }

        //FUNCTION FOR CHECKING IF THE INPUT IS IN THE WORD LIST
        function checkInput() {

            word_checker = word_container[word_page];
            array = Array.from(word_checker.innerText);
            array = array.filter((e) => e % 2 !== 0);

            if (arrayWords.includes(array.join("").toString())) {

                letterAlgo();
                letter_page = 0;
                word_page++;
            } else {

                popUp("Not in word list", "#EDE0D4");
            }
        }

        //FUNCTION FOR GIVING THE RIGHT COLORS IN THE INPUT
        function letterAlgo() {

            let algoTl = gsap.timeline({ delay: 0.5, ease: "expo.out" });

            gsap.to(word_container[word_page].children, { scale: 0, opacity: 0 });

            for (let i = 0; i <= 4; i++) {

                if (array[i] === selectedWord[i]) {

                    algoTl.to(word_container[word_page].children[i],{ backgroundColor: "rgb(68,175,105)" } ,"<");


                    for (e of button) {

                        if (word_container[word_page].children[i].textContent ===e.textContent) {
                            algoTl.to(e, { backgroundColor: "rgb(68,175,105)" }, "<");
                        }
                    }

                } else if (word_container[word_page].children[i].style.backgroundColor !=="rgb(68,175,105)" && selectedWord.includes(array[i])) {

                    algoTl.to(word_container[word_page].children[i],{ backgroundColor: "rgb(234,157,52)" },"<");

                    for (e of button) {
                        if (word_container[word_page].children[i].textContent ===e.textContent) {
                            algoTl.to(e, { backgroundColor: "rgb(234,157,52)" }, "<");
                        }
                    }
                }else {

                    algoTl.to(word_container[word_page].children[i], { backgroundColor: "rgb(149,163,179)" }, "<");

                    for (e of button) {
                        if (word_container[word_page].children[i].textContent === e.textContent) {
                            algoTl.to(e, { backgroundColor: "rgb(149,163,179)" }, "<");
                        }
                    }
                }
        
            }
            gsap.to(word_container[word_page].children, {delay: 0.5,scale: 1,opacity: 1,stagger: 0.2,});
        }

        //POP UP MESSAGE
        function popUp(message, bg) {

            let popUpMessage = document.createElement("p");
            let popUpTimeline = gsap.timeline();

            popUpContainer.innerHTML = "";

            popUpMessage.textContent = message;
            popUpMessage.classList.add("pop-up");
            popUpContainer.appendChild(popUpMessage);
            popUpMessage.style.backgroundColor = bg;
            popUpTimeline.to(".pop-up", {display: "block",opacity: 1,ease: "expo.out",y: 30,});
            popUpTimeline.to(".pop-up", {delay: 3,display: "none",opacity: 0,ease: "expo.out",});
        }

        function retry() {

            const endTl = gsap.timeline({ delay: 0.8 });
            endTl.fromTo("#end-bg",{ display: "none", opacity: 0, ease: "expo.out" },{ display: "block", opacity: 0.8, ease: "expo.out" });
            endTl.fromTo("#end-container",{ display: "none", opacity: 0, scale: 0, ease: "expo.out" },{ display: "grid", opacity: 1, scale: 1, ease: "expo.out" });
        }

        retryButton.addEventListener("click", () => {

            let letterContainer = document.querySelectorAll(".letter-container");

            word_page = 0;
            letter_page = 0;
            const retryTl = gsap.timeline({});
            retryTl.to("#end-container", {opacity: 0,display: "none",scale: 0,ease: "expo.out",});
            retryTl.to("#end-bg", { opacity: 0, display: "none", ease: "expo.out" });

            for (e of button) {

                gsap.to(e, {backgroundColor: "#EDE0D4",ease: "expo.out",delay: 0.6,});
            }

            retryTl.to(letterContainer, {scale: 0, ease: "expo.out",stagger: { from: "end", amount: 0.3 }});
            retryTl.to(letterContainer, {backgroundColor: "#EDE0D4",textContent: "",ease: "expo.out",});
            retryTl.to(letterContainer, {scale: 1,ease: "expo.out",stagger: { from: "start", amount: 0.3 }});

            getNewWord();
        });

        //MOBILE KEYBOARD EVENT LISTENER
        enter.addEventListener("mousedown", function () {

            enterAudio.currentTime = 0;
            enterAudio.play();
            gsap.fromTo(".keyboard-enter",{ scale: 0, opacity: 0, ease: "expo.out" },{ scale: 1, opacity: 1, ease: "expo.out" });

            validateCompletion();
        });

        for (let x of button) {

            x.addEventListener("mousedown", function () {

                if (word_container[word_page].children[4].textContent === "") {
                    x.className = "active";

                    gsap.fromTo(x, { scale: 0, opacity: 0, ease: "expo.out" },{ scale: 1, opacity: 1, ease: "expo.out" });

                    letterAudio.currentTime = 0;
                    letterAudio.play();

                    word_container[word_page].children[letter_page].textContent =
                        x.textContent;

                    gsap.fromTo(word_container[word_page].children[letter_page],{ scale: 0, opacity: 0, ease: "expo.out" },{ scale: 1, opacity: 1, ease: "expo.out" } );
                    checkOverRange();
                }
            });
        }

        Backspace.addEventListener("mousedown", function () {

            if (word_container[word_page].children[0].textContent !== "") {

                Backspace.className += " active";
                backspaceAudio.currentTime = 0;
                backspaceAudio.play();

                gsap.fromTo(".keyboard-backspace",{ scale: 0, opacity: 0, ease: "expo.out" },{ scale: 1, opacity: 1, ease: "expo.out" });

                checkUnderRange();
                word_container[word_page].children[letter_page].textContent = "";
                gsap.fromTo(word_container[word_page].children[letter_page],{ scale: 0, opacity: 0, ease: "expo.out" },{ scale: 1, opacity: 1, ease: "expo.out" });
            }
        });
    });

    //START UP ANIMATION
    const startAnimation = gsap.timeline({ delay: 0.5 });

    startAnimation.from("header", { scale: 0, y: -60, opacity: 0, ease: "expo.out",});
    startAnimation.from(".word-container",{ scale: 0, opacity: 0, ease: "expo.out", stagger: { amount: 0.3 } },"<.1");
    startAnimation.from(".row",{ scale: 0, opacity: 0, ease: "expo.out", stagger: { amount: 0.2 } },"<.3"
    );

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
