let vh = window.innerHeight * 0.01;

document.documentElement.style.setProperty("--vh", `${vh}px`);

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
let endContainer = document.querySelector('#end-container');
let button = document.querySelectorAll(".keyboard-key");
let enter = document.querySelector(".keyboard-enter");
let Backspace = document.querySelector(".keyboard-backspace");
let word_container = document.querySelectorAll(".word-container");
let retryButton = document.querySelector('#retry-btn');

const letterAudio = new Audio("./click.mp3");
const enterAudio = new Audio("./enter.mp3");
const backspaceAudio = new Audio("./backspace.mp3");

fetch("words.txt")
    .then((response) => response.text())
    .then((text) => (word = text))
    .then(function (word) {
        //function for getting another word
        function getNewWord() {
            capitalText = word.toUpperCase();
            separateWords = capitalText.match(/.{1,5}/g);
            arrayWords = Array.from(separateWords);
            randomizeWord = Math.floor(Math.random() * arrayWords.length);
            selectedWord = arrayWords[randomizeWord].toUpperCase().split("");
            console.log(selectedWord);
        }

        getNewWord();


        // getNewWord();
        // console.log(selectedWord);

        // getNewWord();
        // console.log(selectedWord);


        letter_page = 0;
        word_page = 0;

        document.addEventListener("keydown", function (e) {
            if (word_page === 6) {

                //ADD HERE PLAY AGAIN FUNCTION
                return;

            } else {
                if (
                    e.key.charCodeAt() <= 122 &&
                    e.key.charCodeAt() >= 97 &&
                    word_container[word_page].children[4].textContent === ""
                ) {
                    letterAudio.currentTime = 0;
                    letterAudio.play();

                    if (word_page === 6) {
                        return;
                    } else {
                        word_container[word_page].children[letter_page].textContent =
                            e.key.toUpperCase();
                        gsap.fromTo(
                            word_container[word_page].children[letter_page],
                            { scale: 0, opacity: 0, ease: "expo.out" },
                            { scale: 1, opacity: 1, ease: "expo.out" }
                        );
                        checkOverRange();
                    }
                } else if (
                    e.key === "Backspace" &&
                    word_container[word_page].children[0].textContent !== ""
                ) {
                    backspaceAudio.currentTime = 0;
                    backspaceAudio.play();

                    checkUnderRange();
                    word_container[word_page].children[letter_page].textContent = "";
                    gsap.fromTo(
                        word_container[word_page].children[letter_page],
                        { scale: 0, opacity: 0, ease: "expo.out" },
                        { scale: 1, opacity: 1, ease: "expo.out" }
                    );
                } else if (e.key === "Enter") {
                    enterAudio.currentTime = 0;
                    enterAudio.play();

                    validateCompletion();
                } else {
                    return;
                }
            }
        });

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

        function checkIncomplete() {
            if (word_container[word_page].children[4].textContent !== "") {
                checkInput();
            } else {
                popUp("Not enough letters", "#EDE0D4");
            }
        }

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

        function letterAlgo() {
            let algoTl = gsap.timeline({ delay: 0.5 });


            gsap.to(word_container[word_page].children, { scale: 0, opacity: 0 });

            for (let i = 0; i <= 4; i++) {
                if (array[i] === selectedWord[i]) {
                    algoTl.to(
                        word_container[word_page].children[i],
                        { backgroundColor: "rgb(68,175,105)" },
                        "<"
                    );
                } else {
                    if (selectedWord.includes(array[i])) {
                        algoTl.to(
                            word_container[word_page].children[i],
                            { backgroundColor: "rgb(234,157,52)" },
                            "<"
                        );
                    } else {
                        algoTl.to(
                            word_container[word_page].children[i],
                            { backgroundColor: "rgb(149,163,179)" },
                            "<"
                        );
                    }
                }
            }
            gsap.to(word_container[word_page].children, {
                delay: 0.5,
                scale: 1,
                opacity: 1,
                stagger: 0.2,
            });
        }

        function popUp(message, bg) {
            let popUpMessage = document.createElement("p");

            let popUpTimeline = gsap.timeline();

            popUpContainer.innerHTML = "";

            popUpMessage.textContent = message;
            popUpMessage.classList.add("pop-up");
            popUpContainer.appendChild(popUpMessage);
            popUpMessage.style.backgroundColor = bg;
            popUpTimeline.to(".pop-up", {
                display: "block",
                opacity: 1,
                ease: "expo.out",
                y: 30,
            });
            popUpTimeline.to(".pop-up", {
                delay: 2,
                display: "none",
                opacity: 0,
                ease: "expo.out",
            });
        }

        enter.addEventListener("mousedown", function () {
            enterAudio.currentTime = 0;
            enterAudio.play();
            gsap.fromTo(
                ".keyboard-enter",
                { scale: 0, opacity: 0, ease: "expo.out" },
                { scale: 1, opacity: 1, ease: "expo.out" }
            );

            validateCompletion();
        });



        function retry() {
            const endTl = gsap.timeline({ delay: .8 });
            endTl.fromTo('#end-bg', { display: 'none', opacity: 0, ease: 'expo.out' }, { display: 'block', opacity: .9, ease: 'expo.out' })
            endTl.fromTo('#end-container', { display: 'none', opacity: 0, scale: 0, ease: 'expo.out' }, { display: 'block', opacity: 1, scale: 1, ease: 'expo.out' })
        }


        retryButton.addEventListener('click', () => {

            let letterContainer = document.querySelectorAll('.letter-container');
            // for (let i = 0; i < letterContainer.length; i++) {
            //     letterContainer[i].textContent = '';
            // }

            word_page = 0;
            letter_page = 0;
            const retryTl = gsap.timeline({});
            retryTl.to('#end-container', { opacity: 0, display: 'none', scale: 0, ease: 'expo.out' })
            retryTl.to('#end-bg', { opacity: 0, display: 'none', ease: 'expo.out' })
            retryTl.to(letterContainer, { scale: 0, ease: 'expo.out', stagger: { from: 'end', amount: .3 } })
            retryTl.to(letterContainer, { backgroundColor: '#EDE0D4', textContent: '', ease: 'expo.out' })
            retryTl.to(letterContainer, { scale: 1, ease: 'expo.out', stagger: { from: 'start', amount: .3 } })
            endBg.style.display = 'none';
            endContainer.style.display = 'none';


            getNewWord();


        })
    });

const startAnimation = gsap.timeline({ delay: 0.5 });

startAnimation.from("header", {
    scale: 0,
    y: -60,
    opacity: 0,
    ease: "expo.out",
});
startAnimation.from(
    ".word-container",
    { scale: 0, opacity: 0, ease: "expo.out", stagger: { amount: 0.3 } },
    "<.1"
);
startAnimation.from(
    ".row",
    { scale: 0, opacity: 0, ease: "expo.out", stagger: { amount: 0.2 } },
    "<.3"
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


// FOR MOUSE
for (let x of button) {
    x.addEventListener("mousedown", function () {
        if (word_container[word_page].children[4].textContent === "") {
            x.className = "active";

            gsap.fromTo(
                x,
                { scale: 0, opacity: 0, ease: "expo.out" },
                { scale: 1, opacity: 1, ease: "expo.out" }
            );

            letterAudio.currentTime = 0;
            letterAudio.play();

            word_container[word_page].children[letter_page].textContent =
                x.textContent;

            gsap.fromTo(
                word_container[word_page].children[letter_page],
                { scale: 0, opacity: 0, ease: "expo.out" },
                { scale: 1, opacity: 1, ease: "expo.out" }
            );
            checkOverRange();
        }
    });


}






Backspace.addEventListener("mousedown", function () {
    if (word_container[word_page].children[0].textContent !== "") {
        Backspace.className += " active";
        backspaceAudio.currentTime = 0;
        backspaceAudio.play();

        gsap.fromTo(
            ".keyboard-backspace",
            { scale: 0, opacity: 0, ease: "expo.out" },
            { scale: 1, opacity: 1, ease: "expo.out" }
        );

        checkUnderRange();
        word_container[word_page].children[letter_page].textContent = "";
        gsap.fromTo(
            word_container[word_page].children[letter_page],
            { scale: 0, opacity: 0, ease: "expo.out" },
            { scale: 1, opacity: 1, ease: "expo.out" }
        );
    }
});
