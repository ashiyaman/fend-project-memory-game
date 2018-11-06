/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


/*      initialize variables */

let starCount = 3;

let openCards = [];

let matchedCounter = 0;

let moveCounter = 0;

let isTimer = false;

let milliseconds = 0;

let deck = document.querySelector('#deck');

const resetClicked = document.querySelector('#restart');

const cards = document.querySelectorAll('.card');

document.addEventListener('DOMContentLoaded', function() {
  displayCards();
})

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/*      add individual cards to deck           */

addCardToDeck = (cardsListItems) => {
  cardsListItems.forEach(function(cardToAppend) {
    deck.appendChild(cardToAppend);
  });
}

/*        display cards by shuffling and creating necessary html        */

displayCards = () => {
  /*        convert node to array coz shuffle function accepts array       */
  let cardsListItems = [...deck.querySelectorAll('li')];
  shuffle(cardsListItems);
  addCardToDeck(cardsListItems);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*        toggle open and show class of cards to flip the cards        */

toggleCard = (...cards) => {
  cards.forEach(function(card, index, cards) {
    card.classList.toggle('open');
    card.classList.toggle('show');
  });
}

/*        create array of opened cards and add newly added card        */

addOpenCards = (card) => {
  openCards.push(card);
  incrementMove();
  decrementStarRating();
}

/*        check if the 2 opened cards match or not       */
/*        if matched check if won or else close the opened cards       */

checkMatch = () => {
  let firstCard = openCards[0];
  let lastCard = openCards[1];
  if (firstCard.firstElementChild.className === lastCard.firstElementChild.className) {
    toggleMatchClass(firstCard, lastCard);
    toggleCard(firstCard, lastCard);
    openCards = [];
    matchedCounter += 1;
    if (matchedCounter === 8) {
      won();
    }
  } else {
    setTimeout(() => {
      toggleCard(firstCard, lastCard);
      openCards = [];
    }, 500);
  }
}

/*        toggle match class of the cards        */

toggleMatchClass = (...cards) => {
  cards.forEach(function(card, index, cards) {
    toggleCard(card);
    card.classList.toggle('match');
  });
}

/*        increase move counter        */

incrementMove = () => {
  moveCounter += 1;
  displayMove();
}

/*        display the number of moves     */
  let moveHtml = document.getElementById('moves');
displayMove = () => {
  moveHtml.innerHTML = moveCounter;
}


/*        Reset Move                 */

resetMove = () => {
  moveCounter = 0;
  displayMove();
}

/*        decrese rating for every 5 moves       */

decrementStarRating = () => {
  if ((moveCounter === 7) || (moveCounter === 13)) {
    removeStar();
  }
}

/*        remove star from html star rating        */

removeStar = () => {
  let starList = document.querySelectorAll('#stars li');
  let lastStar = starList[starList.length - 1];
  lastStar.remove();
  starCount -= 1;
}

/*          Reset star to 3 stars on clicking reset button         */

resetStar = () => {
  let starList = document.querySelector('#stars');
  console.log(starCount);
  if (starCount < 3) {
    for (let i=starCount; i < 3; i++) {
      let starToAppend = createStar();
      console.log(starToAppend);
      starList.appendChild(starToAppend);
    }
  }
  starCount = 3;
}

/*         HTML to create star              */

createStar = () => {
    let star = document.createElement('li');
    let icon = document.createElement('i');
    icon.setAttribute('class', 'fa fa-star');
    star.appendChild(icon);
    return star;
}

/*        display win modal box        */

won = () => {
  displayModal();
}

const modal = document.querySelector('.modal_container');

/*        toggle modal box       */

toggleModal = () => {
  modal.classList.toggle('hide');
}

/*        get all status message to be displayed in modal box        */

getModalStatus = () => {
  document.querySelector('.getMove').innerHTML = moveCounter;
  document.querySelector('.getRating').innerHTML = starCount;
  document.querySelector('.getTime').innerHTML = milliseconds;
}

getStars = () => {
  let starList = document.querySelectorAll('#stars li');
  starList.forEach(function(star) {
    starCount += 1;
  });
  return starCount;
}

/*        display modal box        */

displayModal = () => {
  toggleModal();
  getModalStatus();
}

const replayButton = modal.querySelector('button');

/*        set and stop timer for game        */
let timer;
const ms = document.querySelector('#timer');
startTimer = () => {
  timer = setInterval(() => {
        milliseconds += 1;
        ms.innerHTML = milliseconds;
      }, 1000);
}

stopTimer = () => {
  milliseconds = 0;
  isTimer = false;
  clearInterval(timer);
  ms.innerHTML = milliseconds;
}

/*        respond to card click       */

respondToClick = (event) => {
  if (!isTimer) {
    startTimer();
    isTimer = true;
  }
  let eventTarget = event.target;
  if ((eventTarget.classList.contains('card')) && (!openCards.includes(eventTarget))) {
    toggleCard(eventTarget);
    addOpenCards(eventTarget);
    if (openCards.length == 2) {
      checkMatch();
    }
  }
}

/*        respond to reset button        */

respondToReset = () => {
  /*        reset all values     */
  displayCards();
  stopTimer();
  openCards = [];
  matchedCounter = 0;
  resetStar();
  resetMove();
  cards.forEach(function(card) {
    if ((card.className.includes('open')) || card.className.includes('show')) {
      card.classList.toggle('open');
      card.classList.toggle('show');
    } else if (card.className.includes('match')) {
      card.classList.toggle('match');
    }
  })
}

/*        respond to play again       */

respondToReplay = () => {
  respondToReset();
  toggleModal();
}

deck.addEventListener('click', respondToClick);
resetClicked.addEventListener('click', respondToReset);
replayButton.addEventListener('click', respondToReplay);
