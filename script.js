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
    this.matrix = document.getElementById("matrix");

    for (var i = 0; i < this.cellsAmount; i++) {
        var div = document.createElement("div");
        div.className = "cell " + i;
        this.matrix.appendChild(div);
    }
}

function BodyPart() {
    this.positionX = 0;
    this.positionY = 0;
    this.direction = "up";
}

function Food() {
    this.position = 0;
}

Food.prototype.getPosition = function() {
    return this.position;
};

Food.prototype.remove = function() {
    this.position = -1;
};

/***
 * Show image, when game is over
 */
Matrix.prototype.gameOver = function() {
    alert("GAME OVER");
    document.body.removeChild(document.body.children[0]);
    var snakeWrapper = document.createElement("div");
    var snakeImage = document.createElement("img");
    snakeWrapper.className = "snake-wrapper";
    snakeImage.className = "snake-image";
    snakeImage.setAttribute("src", "img/dead-snake.jpg")
    document.body.appendChild(snakeWrapper);
    document.body.children[0].appendChild(snakeImage);
};

/***
 * Add color to random cell
 */
Matrix.prototype.generateRandomCell = function() {
    var colsDiapason = this.cols;
    var rowsDiapason = this.rows;
    var randomXCoordinate = Math.floor(Math.random() * colsDiapason + 1);
    var randomYCoordinate = Math.floor(Math.random() * rowsDiapason + 1);
    return this.calculateCellPosition(randomXCoordinate, randomYCoordinate);
};

/***
 * Calculating position of cell using it's coordinates
 */
Matrix.prototype.calculateCellPosition = function(xCoordinate, yCoordinate) {
    return (xCoordinate - 1) * this.cols + yCoordinate;
};

/***
 * Add color to cell
 * @param cellNumber
 */
Matrix.prototype.colouredCell = function(cellNumber, colour) {
    if (colour == undefined)
        colour = "green";
    if(this.matrix.children[cellNumber].style.backgroundColor != colour){
        this.matrix.children[cellNumber].style.backgroundColor = colour;
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
    this.colouredCell(currentCell, "black");
    return currentCell;
};

/***
 * Calculating cell's coordinates, using position number and x/y values of matrix
 */
//TODO fix algorythm
Matrix.prototype.getCoordinatesFromPosition = function(position) {
    var xCoordinate = 0;
    var yCoordinate = 0;

    if((position % this.cols) === 0) {
        xCoordinate = this.cols;
        yCoordinate = position / this.cols;
    } else if ((position % this.cols) > 0) {

        if (position < this.cols) {
            xCoordinate = position % this.cols;
            yCoordinate = 0;
        } else {
            xCoordinate = position % this.cols;
            yCoordinate = Math.ceil(position / this.cols);
        }
    }
    yCoordinate = position % this.cols;
    var coordinates = [xCoordinate, yCoordinate];
    return coordinates;
};

/***
 * Remove color from old position, change cell number according to key number and add color to the new
 * 37 - Left, 38 - Up, 39 - Right, 40 - Down
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
            break;
        case 39:
            if ((Matrix.currentCell + 1 > this.cellsAmount) || (Matrix.currentCell + 1) % 20 == 0) {
                this.gameOver();
                break;
            }
            Matrix.currentCell = this.changePosition(Matrix.currentCell, 1);
			break;
        case 40:
            if (Matrix.currentCell + 20 >= this.cellsAmount) {
                this.gameOver();
                break;
            }
            Matrix.currentCell = this.changePosition(Matrix.currentCell, 20);
			break;
    }
};

window.onload = function() {
    var myMatrix = new Matrix(20, 20);

    Matrix.currentCell = myMatrix.generateRandomCell();

    // var coordinates = myMatrix.getCoordinatesFromPosition(currentCell);

    // console.log(coordinates);
    myMatrix.colouredCell(Matrix.currentCell, "black");
    var food = new Food();

    setTimeout(function(){
        food.position = myMatrix.generateRandomCell()
        myMatrix.colouredCell(food.getPosition());
    },1000);

    //Snake
    snake = new Array();

    var head = new BodyPart();

    

    console.log(Matrix.currentCell);
    //Button click handler
    document.onkeydown = function(event) {
        if((event.keyCode >= 37) && (event.keyCode <= 40)) {
            var keyCode = event.keyCode;
            myMatrix.keyPressHandle(keyCode);

            if(Matrix.currentCell == food.getPosition()){
                food.remove();



                setTimeout(function(){
                    food.position = myMatrix.generateRandomCell();
                    myMatrix.colouredCell(food.getPosition());
                }, 2000
                );

            }
        }
    }

};