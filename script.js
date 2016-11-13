//Created by Victor Kapustin on 3 may 2016.
// IDE WebStorm. OS Ubuntu 14.04

//Class
// Create matrix with settings number of cols and rows

//Functions:
// matrixCreate: create field of DOM elements
// getCellElement: Get cell element from DOM
// colouredRandomCell

/***
 * create field of DOM elements
 * @param rows int
 * @param cols int
 */
function Matrix(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cellsAmount = this.cols * this.rows;
    var matrix = this.matrix;
    this.matrix = document.getElementById("matrix");

    for (var i = 0; i < this.cellsAmount; i++) {

        var div = document.createElement("div");
        div.className = "cell " + i;
        this.matrix.appendChild(div);
    }
    // console.log(Matrix);

    this.gameOver = function() {
        alert("GAME OVER");
    };
}

/***
 * Add color to random cell
 */
Matrix.prototype.generateSnakeCell = function() {
    var diapason = this.cellsAmount;
    var randomDivNumber = Math.floor(Math.random() * diapason + 1);
    return randomDivNumber;
};

/***
 * Add color to cell
 * @param cellNumber
 */
Matrix.prototype.colouredCell = function(cellNumber) {
    if(this.matrix.children[cellNumber].style.backgroundColor != "black"){
        this.matrix.children[cellNumber].style.backgroundColor = "black";
    }
};

/***
 * Remove color from the cell
 * @param cellNumber
 */
Matrix.prototype.uncolouredCell = function(cellNumber) {
    if(this.matrix.children[cellNumber].style.backgroundColor != "white"){
        this.matrix.children[cellNumber].style.backgroundColor = "white";
    }
};

/***
 * Change position of current cell according to direction
 * @param cellNumber
 */
Matrix.prototype.changePosition = function(currentCell, directionNumber) {
    this.uncolouredCell(currentCell);
    currentCell += directionNumber;
    this.colouredCell(currentCell);
    return currentCell;
};

/***
 * Remove color from old position, change cell number according to key number and add color to the new
 * @param int movingCell
 * @returns int movingCell
 */
Matrix.prototype.keyPressHandle = function(direction) {
    switch(direction) {
        case 37:
		
            if ((Matrix.currentCell == 0) || (Matrix.currentCell % this.cols == 0)) {
                this.gameOver();
                break;
            }
            Matrix.currentCell = this.changePosition(Matrix.currentCell, -1);
			break;
        case 38:
            if (Matrix.currentCell - 20 < 0) {
                this.gameOver();
                break;
            }
            Matrix.currentCell = this.changePosition(Matrix.currentCell, -20);
            console.log(Matrix.currentCell);
            break;
        case 39:
            if ((Matrix.currentCell + 1 > this.cellsAmount) || (Matrix.currentCell + 1) % 20 == 0) {
                this.gameOver();
                break;
            }
            Matrix.currentCell = this.changePosition(Matrix.currentCell, 1);
			break;
        case 40:
            if (Matrix.currentCell + 20 > this.cellsAmount) {
                this.gameOver();
                break;
            }
            Matrix.currentCell = this.changePosition(Matrix.currentCell, 20);
			break;
    }
};

window.onload = function() {
    var myMatrix = new Matrix(20, 20);
    Matrix.currentCell = 190;
    myMatrix.colouredCell(Matrix.currentCell);

    document.onkeydown = function(event) {

        if((event.keyCode >= 37) && (event.keyCode <= 40)) {
            var keyCode = event.keyCode;
            myMatrix.keyPressHandle(keyCode);
        }
    }

};