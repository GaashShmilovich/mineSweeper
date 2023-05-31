'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gBoard
var gGame
var gLevel = {
    size: 4,
    mines: 2
}


function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    getRndBomb(gBoard)
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
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
                isMarked: true
            }

        }
    }
    // board[2][2].isMine = true
    // board[3][2].isMine = true
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

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.size; j++) {
            var minesAround = setMinesNegsCount(board, i, j)
            var currCell = board[i][j]
            if (!currCell.isShown) currCell = ''
            else {
                if (currCell.isMine) currCell = MINE
                else if (!currCell.isMine) currCell = minesAround
            }
            board[i][j].minesAroundCount = minesAround
            const className = `cell cell-${i}-${j}`
            // console.table(currCell)
            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this)">${currCell}</td>`

        }
        strHTML += '</tr>'

    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML

}

function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    gGame.isOn = true
    cell.isShown = true
    if (!cell.isMine) gGame.shownCount++
    renderBoard(gBoard)
    console.log('gGame.shownCount', gGame.shownCount)
}

function onCellMarked(elCell) {
    elCell.innerHTML = FLAG
    elCell.isShown = true



}

function getRndBomb(board) {
    for (var i = 0; i < gLevel.mines; i++) {
        var currCell = board[getRandomInt(0, gLevel.size)][getRandomInt(0, gLevel.size)]
        // console.log('currCell', currCell)
        if (currCell === MINE) return
        currCell.isMine = true
    }
}

function checkGameOver() {
    console.log('Game Over')
    gGame.isOn = false


}

function expandShown(board, elCell, i, j) {

}