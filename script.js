let myScore = 0;
let computerScore = 0;
let deckId = '';
const drawBtn = document.getElementById('draw-btn');
const winnerMsgEl = document.getElementById('winner-message')
const remainingCardsEl = document.getElementById('remaining-cards');
const computerScoreEl = document.getElementById('computer-score');
const myScoreEl = document.getElementById('my-score');

document.getElementById('new-deck-btn').addEventListener('click', getNewDeck);
drawBtn.addEventListener('click', drawTwoCards);

function getNewDeck(){
    if (deckId !== '') {
        computerScore = 0;
        myScore = 0;
        computerScoreEl.textContent = '';
        myScoreEl.textContent = '';
        winnerMsgEl.textContent = '';
        drawBtn.disabled = false;
    }
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id;
            displayRemainingCards(data.remaining);
        });
}

function drawTwoCards() {
    if(deckId === '') {
        remainingCardsEl.textContent = 'Get a new deck first';
        return;
    }
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            data.cards.forEach((card, index) => {
                const cardImg = document.createElement('img');
                cardImg.setAttribute('src', card.image);
                document.getElementById(`card-slot-${index}`).innerHTML = '';
                document.getElementById(`card-slot-${index}`).append(cardImg);
            })
            displayRemainingCards(data.remaining); 
            determineRoundWinner(data.cards[0].value, data.cards[1].value);
            if(data.remaining === 0) {
                drawBtn.disabled = true;
                setTimeout(displayGameOverMsg, 1000);
            }
        });
}

function determineRoundWinner(card1Value, card2Value) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"];
    const card1ValueIndex = valueOptions.indexOf(card1Value);
    const card2ValueIndex = valueOptions.indexOf(card2Value);
    let roundWinnerMsg = '';
    if (card1ValueIndex > card2ValueIndex) {
        computerScore++;
        roundWinnerMsg = 'You lose the round!'
    } else if (card2ValueIndex > card1ValueIndex) {
        myScore++;
        roundWinnerMsg = 'You win the round!'
    } else {
        roundWinnerMsg = 'War!'
    }
    computerScoreEl.textContent = `Computer Score: ${computerScore}`;
    myScoreEl.textContent = `My Score: ${myScore}`;
    winnerMsgEl.textContent = roundWinnerMsg;
}

function displayRemainingCards(remainingCards) {
    remainingCardsEl.textContent = `Remaining cards: ${remainingCards}`;
}

function displayGameOverMsg() {
    const gameOverMsg = computerScore > myScore ? 'Game over! You lose ☹️' : myScore > computerScore ? 'Game over! You win! 😀' : 'Game over! It\'s a tie!';
    winnerMsgEl.textContent = gameOverMsg;
}