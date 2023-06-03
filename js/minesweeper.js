'use strict'

const MINE = '💣'
const FLAG = '🚩'
const SAD = '🤯'
const NORMAL = '😃'
const HAPPY = '😎'

var gBoard
var gGame
var gRandomMines
var gElMsg = document.querySelector('.game-over')
var gElSmiley = document.querySelector('.smiley')
var gCurrentTime = new Date()
var gLives = 3
var gLevel = {
    size: 4,
    mines: 2
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    gRandomMines = getRndMines(gLevel.mines)
    clearTimer()
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    checkVictory(gBoard)
    gElSmiley.innerHTML = NORMAL
    gElMsg.innerHTML = ''
}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []

        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < gLevel.size; j++) {
            var minesAround = setMinesNegsCount(board, i, j)
            board[i][j].minesAroundCount = minesAround
            var currCell = board[i][j]
            var cellContent

            if (!currCell.isShown) cellContent = ''
            if (currCell.isMarked) {
                cellContent = FLAG
            }

            if (currCell.isMine && currCell.isShown) {
                cellContent = MINE
                if (cellContent === MINE && currCell.isMarked) {
                    cellContent = FLAG
                }
            }

            if (!currCell.isMine && currCell.isShown) {
                cellContent = minesAround
            }

            const className = `cell cell-${i}-${j}`
            strHTML += `<td class="${className}" 
                            onclick="onCellClicked(this, ${i}, ${j})" 
                            oncontextmenu="onCellMarked(event,this,${i},${j})"
                            >${cellContent}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function setMinesNegsCount(board, rowIdx, colIdx) { //counting the numbers of negs for each cell
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.isMine) count++

        }
    }
    return count
}

function getRndMines(mineNumber) { //get random place for mines, mines count grow by the size of the game
    var size = gLevel.size
    var minesCount = 0
    while (minesCount < mineNumber) {
        var rowIdx = getRandomInt(0, size - 1)
        var colIdx = getRandomInt(0, size - 1)

        if (!gBoard[rowIdx][colIdx].isMine) {
            gBoard[rowIdx][colIdx].isMine = true
            minesCount++
        }
    }
}

function onCellClicked(elCell, i, j) {
    var cell = gBoard[i][j]
    if (gGame.isOn) return
    if (cell.isMarked) return
    if (cell.isShown) return
    if (!gTimerInterval) {
        startTimer()
    }

    if (cell.isMine) {
        cell.isShown = true
        gLives--
        document.querySelector('.smiley-container span').innerHTML = gLives
        if (gLives === 0) {
            revealMines(gBoard)
            gElMsg.innerHTML = `You lost, try one more time`
            gElSmiley.innerHTML = SAD
            gGame.isOn = true
            stopTimer()
        }
    }

    if (!cell.isMine && !cell.isMarked) {
        cell.isShown = true
        gGame.shownCount++
        checkVictory(gBoard)
        if (cell.minesAroundCount === 0) {
            expandShown(gBoard, this, i, j)
        }
    }

    renderBoard(gBoard)
}

function onCellMarked(event, elCell, i, j) {
    event.preventDefault()
    var cell = gBoard[i][j]
    cell.isMarked = !cell.isMarked

    if (cell.isMarked && cell.isMine) {
        gGame.markedCount++
    }
    else if (!cell.isMarked && cell.isMine) {
        gGame.markedCount--
    }

    checkVictory(gBoard)
    renderBoard(gBoard)
}

function expandShown(board, elCell, i, j) {//expand every cell neg that have 0 negs count
    for (var r = i - 1; r <= i + 1; r++) {
        if (r < 0 || r > board.length - 1) continue

        for (var c = j - 1; c <= j + 1; c++) {
            if (c < 0 || c > board[0].length - 1) continue
            if (r === i && c === j) continue

            var minesAround = setMinesNegsCount(board, i, j)
            var currCell = board[r][c]

            if (minesAround > 0) return
            if (!currCell.isMine && !currCell.isMarked && !currCell.isShown) {
                currCell.isShown = true
                gGame.shownCount++
                if (minesAround === 0) {
                    expandShown(gBoard, elCell, r, c)
                }
            }
        }
    }

    renderBoard(board)
}

function checkVictory(board) {
    if (gGame.markedCount + gGame.shownCount === gLevel.size ** 2) {
        gElMsg.innerHTML = 'You Win'
        gElSmiley.innerHTML = HAPPY
        gGame.isOn = false
        stopTimer()
    }
}

function restartGame() {
    gLives = 3
    document.querySelector('.smiley-container span').innerHTML = 3
    gBoard = buildBoard()
    renderBoard(gBoard)
    gRandomMines = getRndMines(gLevel.mines)
    stopTimer()
    clearTimer()
    gTimerInterval = false
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    document.querySelector('.smiley').innerHTML = NORMAL
    document.querySelector('.game-over').innerHTML = ''
}

function setLevel(size, mines) {
    gLevel.size = size
    gLevel.mines = mines
    gBoard = buildBoard()
    gLives = 3
    document.querySelector('.smiley-container span').innerHTML = 3
    gGame.isOn = false
    gElSmiley.innerHTML = NORMAL
    gElMsg.innerHTML = ''
    renderBoard(gBoard)
    getRndMines(gLevel.mines)
    stopTimer()
    clearTimer()
    gTimerInterval = false
}

function revealMines(board) {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var tile = board[i][j]
            if (tile.isMine === true) {
                tile.isShown = true
            }
        }
    }
}





