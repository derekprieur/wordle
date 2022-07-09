const tileContainer = document.querySelector('.tile-container')
const keyContainer = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message')
const numTiles = 30
const rowSize = 5
let wordle = 'elite'
const tiles = []
let guesses = []
const completedRows = [[], [], [], [], [], []]
const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '«',
]
let colors = []
let newRowStart = 0
let currentTilePosition = 0
let isGameOver = false

function getWordle() {
    fetch('http://localhost:8000/word')
        .then(response => response.json())
        .then(json => {
            wordle = json
        })
        .catch(err => console.log(err))
}

function startGame() {
    // getWordle()
    generateTiles()
    generateKeys()
}

function generateTiles() {
    for (let i = 0; i < numTiles; i++) {
        const newTile = document.createElement('div')
        newTile.classList.add('tile')
        newTile.setAttribute('id', i)
        tileContainer.appendChild(newTile)
        tiles.push(newTile)
    }
}

function generateKeys() {
    keys.forEach(key => {
        const newKey = document.createElement('div')
        newKey.classList.add('key')
        newKey.textContent = key
        newKey.setAttribute('id', key)
        keyContainer.appendChild(newKey)
        newKey.addEventListener('click', keyClicked)
    })
}

function keyClicked() {
    if (!isGameOver) {
        if (this.textContent == '«') {
            removeLetter()
        } else if (this.textContent == 'ENTER') {
            checkRow()
        }
        else {
            addLetter(this.textContent)
        }
    }
}

function addLetter(letter) {
    if (currentTilePosition < (newRowStart + 5)) {
        tiles[currentTilePosition].textContent = letter
        currentTilePosition++
        guesses.push(letter)
    }

}

function removeLetter() {

    if (currentTilePosition > 0 && currentTilePosition > newRowStart) {
        currentTilePosition--
        tiles[currentTilePosition].textContent = ''
        guesses.pop()
    }
}

function checkRow() {
    const guess = guesses.join('')
    if (guesses.length == 5) {
        fetch(`http://localhost:8000/check/?word=${guess}`)
            .then(response => response.json())
            .then(json => {
                console.log(json)

            }).catch(err => console.log(err))

        let wordMatch = true
        let count = 0
        while (count < guesses.length && wordMatch) {
            if (wordle[count] == guesses[count].toLowerCase()) {
                count++
            } else {
                wordMatch = false
            }
        }
        newRowStart = currentTilePosition
        if (wordMatch) {
            flipTile()
            showMessage('Magnificent!')
            isGameOver = true
        } else {
            flipTile()
            showMessage('Not a match')
            guesses = []
        }
    }
}

function showMessage(message) {
    messageDisplay.innerHTML = message
    messageDisplay.style.visibility = 'visible'
    setTimeout(hideMessage, 1000)
}

function hideMessage() {
    messageDisplay.style.visibility = 'hidden'
}

function flipTile() {
    let wordleIndex = 0
    for (let i = (newRowStart - rowSize); i < (currentTilePosition); i++) {
        if (tiles[i].innerHTML == wordle[wordleIndex].toUpperCase()) {
            colors.push('green')
            // changeKeyColor('green', tiles[i].innerHTML)
        } else if (wordle.includes(tiles[i].innerHTML.toLowerCase())) {
            colors.push('yellow')
            // changeKeyColor('yellow', tiles[i].innerHTML)
        } else {
            colors.push('grey')
            // changeKeyColor('grey', tiles[i].innerHTML)
        }
        setTimeout(() => {
            changeKeyColor(colors[i], tiles[i].innerHTML)
            tiles[i].classList.add(colors[i])
            tiles[i].classList.add('flip')
        }, 500 * wordleIndex)
        wordleIndex++
    }
}

function changeKeyColor(color, key) {
    currentKey = document.getElementById(key)
    currentKey.classList.add(color)
}

startGame()