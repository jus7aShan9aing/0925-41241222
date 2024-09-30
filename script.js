const deck1 = {
    back: 'photo/ph99.jpg',
    fronts: [
        'photo/ph0.png',
        'photo/ph1.png',
        'photo/ph2.png',
        'photo/ph3.png',
        'photo/ph4.png',
        'photo/ph5.png',
        'photo/ph6.png',
        'photo/ph7.png'
    ]
};

const deck2 = {
    back: 'photo/10.png',
    fronts: [
        'photo/11.png',
        'photo/12.png',
        'photo/13.png',
        'photo/14.png',
        'photo/15.png',
        'photo/16.png',
        'photo/17.png',
        'photo/18.png'
    ]
};

const gameBoard = document.getElementById('gameBoard');
const restartBtn = document.getElementById('restartBtn');
const flipCoverBtn = document.getElementById('flipCoverBtn');
const styleToggleBtn = document.getElementById('styleToggleBtn');
const startBtn = document.getElementById('startBtn');
let currentDeck = deck1;
let cardValues = [];
let firstCard, secondCard;
let lockBoard = false;
let matchedCards = 0;
let isFlippingAll = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    gameBoard.innerHTML = '';
    matchedCards = 0;
    cardValues = [...currentDeck.fronts, ...currentDeck.fronts];
    shuffle(cardValues);
    cardValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face front">
                    <img src="${currentDeck.back}" alt="卡片背面">
                </div>
                <div class="card-face back">
                    <img src="${value}" alt="卡片正面">
                </div>
            </div>
        `;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this.classList.contains('flipped')) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    firstCard.classList.add('scale');
    secondCard.classList.add('scale');

    setTimeout(() => {
        checkForMatch();
    }, 600);
}

function checkForMatch() {
    const action = document.querySelector('input[name="cardAction"]:checked').value;
    const isMatch = firstCard.querySelector('.back img').src === secondCard.querySelector('.back img').src;

    if (isMatch) {
        matchedCards += 2;
        if (action === 'remove') {
            firstCard.style.visibility = 'hidden';
            secondCard.style.visibility = 'hidden';
        }
        resetCards();

        if (matchedCards === cardValues.length) {
            setTimeout(() => alert('恭喜你，遊戲結束！'), 500);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetCards();
        }, 1000);
    }
}

function resetCards() {
    firstCard.classList.remove('scale');
    secondCard.classList.remove('scale');
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function flipOrCoverCards() {
    const allCards = document.querySelectorAll('.card');

    if (!isFlippingAll) {
        allCards.forEach(card => {
            card.classList.add('flipped');
        });
        flipCoverBtn.textContent = '覆蓋所有卡片';
    } else {
        allCards.forEach(card => {
            card.classList.remove('flipped');
        });
        flipCoverBtn.textContent = '翻開所有卡片';
    }

    isFlippingAll = !isFlippingAll;
}

function toggleCardDeck() {
    currentDeck = currentDeck === deck1 ? deck2 : deck1;
    createBoard();
}

function startGame() {
    createBoard(); // 創建遊戲板
    const allCards = document.querySelectorAll('.card');
    
    // 翻開所有卡片讓玩家記憶
    allCards.forEach(card => {
        card.classList.add('flipped');
    });
    
    setTimeout(() => {
        // 10秒後翻回背面
        allCards.forEach(card => {
            card.classList.remove('flipped');
        });
    }, 10000); // 設置為10秒後翻回
}

// 按鈕事件
restartBtn.addEventListener('click', createBoard);
flipCoverBtn.addEventListener('click', flipOrCoverCards);
styleToggleBtn.addEventListener('click', toggleCardDeck);
startBtn.addEventListener('click', startGame); // 綁定開始遊戲按鈕事件
