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

var gLevel = {
    size: 4,
    mines: 2
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    gRandomMines = getRndMines(gBoard)
    clearTimer()
    startTimer()
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    checkGameOver(gBoard)
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

function setMinesNegsCount(board, rowIdx, colIdx) {
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

function getRndMines(board) {
    for (var i = 0; i < gLevel.mines; i++) {
        var currCell = board[getRandomInt(0, gLevel.size)][getRandomInt(0, gLevel.size)]

        if (currCell === MINE) return

        else currCell.isMine = true
    }
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
            }

            if (!currCell.isMine && currCell.isShown) {
                cellContent = minesAround
            }

            const className = `cell cell-${i}-${j}`
            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(event,this,${i},${j})">${cellContent}</td>`

        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function setLevel(size, mines) {
    gLevel.size = size
    gLevel.mines = mines
    gBoard = buildBoard()
    renderBoard(gBoard)
    getRndMines(gBoard)
    gGame.isOn = false
    gElSmiley.innerHTML = NORMAL
    gElMsg.innerHTML = ''
    stopTimer()
    clearTimer()

}

function onCellClicked(elCell, i, j) {
    var cell = gBoard[i][j]
    if (gGame.isOn) return
    cell.isShown = true


    if (cell.isMarked) return

    if (cell.isMine) {
        gElMsg.innerHTML = `You lost, try one more time`
        gElSmiley.innerHTML = SAD
        gGame.isOn = true
        stopTimer()
    }

    else if (!cell.isMine && !cell.isMarked) {
        expandShown(gBoard, this, i, j)

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

    renderBoard(gBoard)
    checkGameOver(gBoard)
}

function checkGameOver(board) {
    for (var i = 0; i < gLevel.size - 1; i++) {
        for (var j = 0; j < gLevel.size - 1; j++)
            if (gGame.markedCount === gLevel.mines) {
                gElMsg.innerHTML = 'You Win'
                gElSmiley.innerHTML = HAPPY
                gGame.isOn = false
                stopTimer()
            }
    }
}

function expandShown(board, elCell, i, j) {
    var count = 0

    for (var r = i - 1; r <= i + 1; r++) {
        if (r < 0 || r > board.length - 1) continue

        for (var c = j - 1; c <= j + 1; c++) {
            if (c < 0 || c > board[0].length - 1) continue
            if (r === i && c === j) continue

            var currCell = board[r][c]

            if (board[i][j].minesAroundCount > 0) return

            if (!currCell.isMine && !currCell.isMarked) {
                currCell.isShown = true
                count++

                renderBoard(board)
            }
        }
    }
}

function restartGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    startTimer()
    gRandomMines = getRndMines(gBoard)
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    document.querySelector('.smiley').innerHTML = NORMAL
    document.querySelector('.game-over').innerHTML = ''
}



