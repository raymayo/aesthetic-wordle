let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

//Variables
let word;
let capitalText;
let separateWords;
let arrayWords;
let randomizeWord;
let selectedWord;
let word_checker;
let array;

//Queries
let popUpContainer = document.querySelector('#popUp-container');
let endContainer = document.querySelector('#end-container');
let button = document.querySelectorAll('.keyboard-key');
let enter = document.querySelector('.keyboard-enter');
let Backspace = document.querySelector('.keyboard-backspace');
let word_container = document.querySelectorAll('.word-container');
let retryButton = document.querySelector('#retry-btn');
let exitButton = document.querySelector('#exit-btn');
let guideContainer = document.querySelector('#guide-container');
let letterContainer = document.querySelectorAll('.letter-container');

let letter_page = 0;
let word_page = 0;

//SOUND EFFECTS
const letterAudio = new Audio('/click.mp3');
const enterAudio = new Audio('./enter.mp3');
const backspaceAudio = new Audio('./backspace.mp3');

//FETCH WORDS
fetch('words.txt')
	.then((response) => response.text())
	.then((text) => (word = text))
	.then(function (word) {

		//FUNCTION FOR GETTING WORD
		function getNewWord() {
			capitalText = word.toUpperCase();
			separateWords = capitalText.match(/.{1,5}/g);
			arrayWords = Array.from(separateWords);
			randomizeWord = Math.floor(Math.random() * arrayWords.length);
			selectedWord = arrayWords[randomizeWord].toUpperCase().split('');
			console.log(selectedWord);
			// alert(selectedWord)
		}

		getNewWord();

		setTimeout(() => {
			//TYPE EVENTS FOR KEYBOARD
			document.addEventListener('keydown', function (e) {
				if (word_page === 6) {
					return;
				} else {
					if (
						e.key.charCodeAt() <= 122 &&
						e.key.charCodeAt() >= 97 &&
						word_container[word_page].children[4].textContent === '' &&
						guideContainer.style.display === 'none'
					) {
						playSFX(letterAudio);

						if (word_page !== 6) {
							word_container[word_page].children[letter_page].textContent =
								e.key.toUpperCase();
							gsap.fromTo(
								word_container[word_page].children[letter_page],
								{ scale: 0.5, ease: 'expo.in' },
								{ scale: 1, ease: 'expo.out' }
							);

							for (let key of button) {
								if (e.key.toUpperCase() === key.textContent) {
									gsap.to(key, {
										scale: 0.7,
										backgroundColor: '#292929',
										color: '#DDDDDD',
										ease: 'expo.out',
									});
								}
							}
							checkOverRange();
						}
						return;
					} else if (
						e.key === 'Backspace' &&
						word_container[word_page].children[0].textContent !== ''
					) {
						playSFX(backspaceAudio);
						checkUnderRange();
						word_container[word_page].children[letter_page].textContent = '';
						scaleAnimation(word_container[word_page].children[letter_page]);
						gsap.to('.keyboard-backspace', {
							scale: 0.7,
							backgroundColor: '#DDDDDD',
							color: '#292929',
							ease: 'expo.out',
						});
					} else if (e.key === 'Enter' && word_page <= 5) {
						playSFX(enterAudio);
						gsap.to('.keyboard-enter', {
							scale: 0.7,
							backgroundColor: '#292929',
							color: '#DDDDDD',
							ease: 'expo.out',
						});
						validateCompletion();
					}

					return;
				}
			});
		}, 1800);

		// console.log(guideContainer.style.display)

		if (guideContainer.style.display === 'none') {
			document.addEventListener('keydown', function (e) {
				if (e.key === 'Enter') {
					guideExit();
				}
			});
		}

		//CHECK IF INPUT IS CORRECT OR NOT
		function validateCompletion() {
			word_checker = word_container[word_page];
			array = Array.from(word_checker.innerText);
			array = array.filter((e) => e % 2 !== 0);

			if (array.join('').toString() === selectedWord.join('').toString()) {
				letterAlgo();
				popUp('Well Played!', '#73a46d');
				retry();
			} else if (
				word_container[5].children[4].textContent !== '' &&
				word_page > 0
			) {
				letterAlgo();
				retry();
			} else {
				checkIncomplete();
			}
			return;
		}

		//FUNCTION FOR CHECKING IF ALL LETTERS ARE FILLED
		function checkIncomplete() {
			if (word_container[word_page].children[4].textContent !== '') {
				checkInput();
			} else if (letter_page > 0) {
				popUp('Not enough letters', '#DDDDDD');
			}
		}

		//FUNCTION FOR CHECKING IF THE INPUT IS IN THE WORD LIST
		function checkInput() {
			if (arrayWords.includes(array.join('').toString())) {
				letterAlgo();
				letter_page = 0;
			} else {
				popUp('Not in word list', '#DDDDDD');
			}
		}

		function getNumOfOccurrencesInWord(word, letter) {
			let result = 0;
			for (let i = 0; i < word.length; i++) {
				if (word[i] === letter) {
					result++;
				}
			}
			return result;
		}

		function getPositionOfOccurrence(word, letter, position) {
			let result = 0;
			for (let i = 0; i <= position; i++) {
				if (word[i] === letter) {
					result++;
				}
			}
			return result;
		}

		//FUNCTION FOR GIVING THE RIGHT COLORS IN THE INPUT
		function letterAlgo() {
			const algoTl = gsap.timeline({ delay: 0.5, ease: 'expo.inout' });

			gsap.to(word_container[word_page].children, {
				scale: 0,
				opacity: 0,
				ease: 'expo.inout',
				stagger: 0.05,
			});

			for (let i = 0; i < 5; i++) {
				const letter = array[i];
				const secret = selectedWord.join('');
				const guess = array.join('');
				const numOfOccurrencesSecret = getNumOfOccurrencesInWord(secret, letter);
				const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
				const letterPosition = getPositionOfOccurrence(guess, letter, i);

				for (const e of button) {
					if (numOfOccurrencesGuess > numOfOccurrencesSecret && letterPosition > numOfOccurrencesSecret) {
						algoTl.to(word_container[word_page].children[i], { backgroundColor: 'rgb(149,163,179)' }, '<');

						if (word_container[word_page].children[i].textContent === e.textContent && e.style.backgroundColor !== 'rgb(221,164,72)') {
							if (e.style.backgroundColor !== 'rgb(115,164,109)') {
								algoTl.to(e, { backgroundColor: 'rgb(149,163,179)' }, '<');
							}
						}
					} else {
						if (array[i] === selectedWord[i]) {
							algoTl.to(word_container[word_page].children[i], { backgroundColor: 'rgb(115,164,109)' }, '<');
							if (word_container[word_page].children[i].textContent === e.textContent && e.style.backgroundColor !== 'rgb(221,164,72)' && e.style.backgroundColor !== 'rgb(149,163,179)') {
								algoTl.to(e, { backgroundColor: 'rgb(115,164,109)' }, '<');
							}
						} else if (selectedWord.includes(array[i])) {
							algoTl.to(word_container[word_page].children[i], { backgroundColor: 'rgb(221,164,72)' }, '<');
							if (word_container[word_page].children[i].textContent === e.textContent && e.style.backgroundColor !== 'rgb(68, 175, 105)' && e.style.backgroundColor !== '#ede0d4' && e.style.backgroundColor !== 'rgb(149,163,179)') {
								algoTl.to(e, { backgroundColor: 'rgb(221,164,72)' }, '<');
							}
						} else {
							return;
						}
					}
				}

			}

			gsap.to(word_container[word_page].children, {
				delay: 0.4,
				scale: 1,
				opacity: 1,
				stagger: 0.1,
				ease: 'expo.inout',
			});

			word_page++;
		}


		//POP UP MESSAGE
		function popUp(message, bg) {
			let popUpMessage = document.createElement('p');
			let popUpTimeline = gsap.timeline();

			popUpContainer.innerHTML = '';

			popUpMessage.textContent = message;
			popUpMessage.classList.add('pop-up');
			popUpContainer.appendChild(popUpMessage);
			popUpMessage.style.backgroundColor = bg;
			popUpTimeline.fromTo(
				'.pop-up',
				{ display: 'block', opacity: 0, scale: 1, y: -100, ease: 'expo.out' },
				{ display: 'block', opacity: 1, scale: 1, y: 0, ease: 'expo.out' }
			);
			popUpTimeline.to('.pop-up', {
				delay: 3,
				display: 'none',
				opacity: 0,
				ease: 'expo.out',
			});
		}

		function retry() {
			if (word_page === 6) {
				showEndScreen();
				retryButton.textContent = `Play Again`;
			} else if (
				array.join('').toString() === selectedWord.join('').toString()
			) {
				showEndScreen();
				retryButton.textContent = `Play Again`;
			}
			return;
		}

		function showEndScreen() {
			const endTl = gsap.timeline({ delay: 0.8 });
			endTl.fromTo(
				'#end-bg',
				{ display: 'none', opacity: 0, ease: 'expo.out' },
				{ display: 'block', opacity: 0.5, ease: 'expo.out' }
			);
			endTl.fromTo(
				'#end-container',
				{ display: 'none', opacity: 0, scale: 0, ease: 'expo.out' },
				{ display: 'grid', opacity: 1, scale: 1, ease: 'expo.out' },
				'<'
			);
		}

		retryButton.addEventListener('pointerdown', () => {
			playSFX(enterAudio);
			gsap.to(retryButton, { scale: 0.7, ease: 'expo.out' });
		});

		retryButton.addEventListener('pointerleave', () => {
			playSFX(enterAudio);
			gsap.to(retryButton, { scale: 1, ease: 'expo.out' });
		});

		retryButton.addEventListener('pointerup', () => {
			letter_page = 0;
			const retryTl = gsap.timeline();
			retryTl.to(retryButton, { scale: 1, ease: 'expo.out' });
			retryTl.to(
				'#end-container',
				{ opacity: 0, display: 'none', ease: 'expo.out' },
				'<.1'
			);
			retryTl.to(
				'#end-bg',
				{ opacity: 0, display: 'none', ease: 'expo.out' },
				'<.3'
			);

			for (e of button) {
				gsap.to(e, {
					backgroundColor: '#dddddd',
					ease: 'expo.out',
					delay: 0.6,
					duration: 2,
				});
			}

			retryTl.to(letterContainer, {
				scale: 0,
				ease: 'expo.out',
				stagger: { from: 'end', amount: 0.3 },
			});
			retryTl.to(letterContainer, {
				backgroundColor: '#dddddd',
				textContent: '',
				ease: 'expo.out',
			});
			retryTl.to(letterContainer, {
				scale: 1,
				ease: 'expo.out',
				stagger: { from: 'start', amount: 0.3 },
			});
			getNewWord();

			word_page = 0;
		});

		//MOBILE KEYBOARD EVENT LISTENER
		enter.addEventListener('pointerdown', function () {
			enterAudio.play();
			gsap.to('.keyboard-enter', {
				scale: 0.7,
				backgroundColor: '#DDDDDD',
				color: '#292929',
				ease: 'expo.out',
			});
			validateCompletion();
		});

		enter.addEventListener('pointerup', function () {
			gsap.to('.keyboard-enter', {
				scale: 1,
				backgroundColor: '#292929',
				color: '#DDDDDD',
				ease: 'expo.out',
			});
		});

		enter.addEventListener('pointerleave', function () {
			gsap.to('.keyboard-enter', {
				scale: 1,
				backgroundColor: '#292929',
				color: '#DDDDDD',
				ease: 'expo.out',
			});
		});

		for (let x of button) {
			x.addEventListener('pointerdown', function () {
				playSFX(letterAudio);
				gsap.to(x, {
					scale: 0.7,
					backgroundColor: '#292929',
					color: '#DDDDDD',
					ease: 'expo.out',
				});
				if (word_container[word_page].children[4].textContent === '') {
					x.className = 'keyboard-key active';
					word_container[word_page].children[letter_page].textContent =
						x.textContent;
					gsap.fromTo(
						word_container[word_page].children[letter_page],
						{ scale: 0.5, ease: 'expo.in' },
						{ scale: 1, ease: 'expo.out' }
					);
					checkOverRange();
				}
			});
		}

		for (let x of button) {
			x.addEventListener('pointerup', function () {
				gsap.to(x, {
					scale: 1,
					backgroundColor: '#DDDDDD',
					color: '#292929',
					ease: 'expo.out',
				});
			});
		}

		for (let x of button) {
			x.addEventListener('pointerleave', function () {
				gsap.to(x, {
					scale: 1,
					backgroundColor: '#DDDDDD',
					color: '#292929',
					ease: 'expo.out',
				});
			});
		}

		Backspace.addEventListener('pointerdown', function () {
			gsap.to('.keyboard-backspace', {
				scale: 0.7,
				backgroundColor: '#DDDDDD',
				color: '#292929',
				ease: 'expo.out',
			});
			playSFX(backspaceAudio);
			if (word_container[word_page].children[0].textContent !== '') {
				Backspace.className = 'keyboard-backspace active';
				checkUnderRange();
				word_container[word_page].children[letter_page].textContent = '';
				gsap.fromTo(
					word_container[word_page].children[letter_page],
					{ scale: 0.5, ease: 'expo.in' },
					{ scale: 1, ease: 'expo.out' }
				);
			}
		});

		Backspace.addEventListener('pointerup', function () {
			gsap.to('.keyboard-backspace', {
				scale: 1,
				backgroundColor: '#292929',
				color: '#DDDDDD',
				ease: 'expo.out',
			});
		});

		Backspace.addEventListener('pointerleave', function () {
			gsap.to('.keyboard-backspace', {
				scale: 1,
				backgroundColor: '#292929',
				color: '#DDDDDD',
				ease: 'expo.out',
			});
		});

		function guideExit() {
			let exitAnimation = gsap.timeline();

			exitAnimation.to(exitButton, { scale: 1, ease: 'expo.out' });
			exitAnimation.to(
				'#guide-container',
				{ y: 100, opacity: 0, display: 'none', ease: 'expo.inout' },
				'<.1'
			);
			exitAnimation.to(
				'#guide-bg',
				{ opacity: 0, display: 'none', ease: 'expo.inout' },
				'<.3'
			);
		}

		exitButton.addEventListener('pointerdown', () => {
			gsap.to(exitButton, { scale: 0.8, ease: 'expo.out' });
			playSFX(enterAudio);
		});

		exitButton.addEventListener('pointerleave', () => {
			gsap.to(exitButton, { scale: 1, ease: 'expo.out' });
		});

		exitButton.addEventListener('pointerup', () => {
			guideExit();
		});

		function playSFX(sound) {
			sound.currentTime = 0;
			sound.play();
		}

		function scaleAnimation(element) {
			gsap.fromTo(
				element,
				{ scale: 0.5, ease: 'expo.in' },
				{ scale: 1, ease: 'expo.out' }
			);
		}


		wordDefinition();
	});

//START UP ANIMATION
const startAnimation = gsap.timeline({ delay: 0.5 });

startAnimation.from('header', {
	scale: 0,
	y: -60,
	opacity: 0,
	ease: 'expo.out',
});
startAnimation.from(
	'.word-container',
	{ scale: 0, opacity: 0, ease: 'expo.out', stagger: { amount: 0.3 } },
	'<.1'
);
startAnimation.from(
	'.row',
	{ scale: 0, opacity: 0, ease: 'expo.out', stagger: { amount: 0.2 } },
	'<.3'
);
startAnimation.from('#guide-bg', { display: 'none', opacity: 0 }, '<.5');
startAnimation.from(
	'#guide-container',
	{ display: 'none', opacity: 0, scale: 0, ease: 'expo.inout' },
	'<.1'
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

github.addEventListener('pointerenter', () => {
	gsap.fromTo(
		github,
		{ rotate: 0, ease: 'expo.inout' },
		{ rotate: 360, ease: 'expo.inout' }
	);
});

github.addEventListener('pointerleave', () => {
	gsap.fromTo(
		github,
		{ rotate: 360, ease: 'expo.inout' },
		{ rotate: 0, ease: 'expo.inout' }
	);
});

setTimeout(() => {
	//TYPE EVENTS FOR KEYBOARD
	document.addEventListener('keyup', function (e) {
		if (
			e.key.charCodeAt() <= 122 &&
			e.key.charCodeAt() >= 97 &&
			guideContainer.style.display === 'none'
		) {
			if (word_page !== 6) {
				for (let key of button) {
					if (e.key.toUpperCase() === key.textContent) {
						gsap.to(key, {
							scale: 1,
							backgroundColor: '#DDDDDD',
							color: '#292929',
							ease: 'expo.out',
						});
					}
				}
			}
			return;
		} else if (e.key === 'Backspace') {
			gsap.to('.keyboard-backspace', {
				scale: 1,
				backgroundColor: '#292929',
				color: '#DDDDDD',
				ease: 'expo.out',
			});
		} else if (e.key === 'Enter' && word_page <= 5) {
			gsap.to('.keyboard-enter', {
				scale: 1,
				backgroundColor: '#292929',
				color: '#DDDDDD',
				ease: 'expo.out',
			});
		}
	});
}, 1800);

const date = new Date();
let year = date.getFullYear();
let copyrightYear = document.querySelector('#cYear').textContent = year;




// fetch(url)
// 	.then(response => {
// 		if (!response.ok) {
// 			throw new Error('Network response was not ok');
// 		}
// 		return response.json();
// 	})
// 	.then(data => {
// 		if (data.title && data.title === "No Definitions Found") {
// 			document.getElementById("definition").innerText = "No definition found for this word";
// 		} else {
// 			const definition = data[0].meanings[0].definitions[0].definition;
// 			document.getElementById("definition").innerText = definition;
// 		}
// 	})
// 	.catch(error => {
// 		console.error('There was a problem with the fetch operation:', error);
// 		document.getElementById("definition").innerText = "An error occurred while fetching the definition";
// 	});

function wordDefinition() {
	let wordDef = selectedWord.toString();
	let meaningContent = document.getElementById('word-meaning')
	let wordContent = document.getElementById('word-selected')
	wordDef = wordDef.replace(/,/g, '');
	console.log(wordDef.replace(/,/g, ''));

	const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordDef}`;

	fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json(); // Parse the JSON from the response
		})
		.then(data => {
			// Do something with the parsed data
			console.log(data[0].meanings[0].definitions[0].definition);
			wordContent.textContent = wordDef;
			meaningContent.textContent = data[0].meanings[0].definitions[0].definition;
		})
		.catch(error => {
			// Handle errors
			console.error('There was a problem with the fetch operation:', error);
		});

}





