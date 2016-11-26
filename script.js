// The reason why I use prototypical logic is that to
// give user possibility to set amount of cols and rows,
// which implies usage of Matrix's essence with it's own number of cols and rows

//Functions:
// matrixCreate: create field of DOM elements
// getCellElement: Get cell element from DOM
// colouredRandomCell

// Set up constants for key-codes
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

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

function Food() {
    this.position = 0;
}

Food.prototype.getPosition = function() {
    return this.position;
};

Food.prototype.remove = function() {
    this.position = -1;
};


function BodyPart(xCoordinate, yCoordinate, role, colsAmount) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;

    this.position = calculateCellPosition(xCoordinate, yCoordinate, colsAmount);
    this.direction = UP;
    this.role = role;
}

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
    snakeImage.setAttribute("src", "img/dead-snake.jpg");
    document.body.appendChild(snakeWrapper);
    document.body.children[0].appendChild(snakeImage);
};

/***
 * @param diapason int
 * @returns {int}
 */
Matrix.prototype.generateRandomCoordinate = function(diapason) {
    return Math.floor(Math.random() * diapason + 1);
}

/***
 * Calculating position of cell using it's coordinates
 */
calculateCellPosition = function(xCoordinate, yCoordinate, colsAmount) {
    return (yCoordinate - 1) * colsAmount + xCoordinate;
};

/***
 * Add color to random cell
 */
Matrix.prototype.generateRandomCell = function() {
    var randomXCoordinate = this.generateRandomCoordinate(this.cols);
    var randomYCoordinate = this.generateRandomCoordinate(this.rows);
    return calculateCellPosition(randomXCoordinate, randomYCoordinate, this.cols);
};

/***
 * Add color to cell
 * @param cellNumber
 */
Matrix.prototype.colouredCell = function(cellNumber, colour) {
    if (colour == undefined)
        colour = "black";
    if(this.matrix.children[cellNumber].style.backgroundColor != colour){
        this.matrix.children[cellNumber].style.backgroundColor = colour;
    }
};

/***
 * @param cellNumber int
 */
Matrix.prototype.uncolouredCell = function(cellNumber) {
    if(this.matrix.children[cellNumber].style.backgroundColor != "white"){
        this.matrix.children[cellNumber].style.backgroundColor = "white";
    }
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
 * @param currentCell int
 * @param directionNumber int
 * @returns {position int}
 */
Matrix.prototype.changePosition = function(currentCell, xChange, yChange) {
    this.uncolouredCell(currentCell.position);
    currentCell.xCoordinate += xChange;
    currentCell.yCoordinate += yChange;
    currentCell.position = calculateCellPosition(currentCell.xCoordinate, currentCell.yCoordinate, this.cols);
    this.colouredCell(currentCell.position);
    return currentCell.position;
};

/***
 * Remove color from old position, change cell number according to key number and add color to the new
 * @param int movingCell
 * @returns int movingCell
 */
Matrix.prototype.move = function(bodyPart, direction) {

    switch(direction) {
        case LEFT:
            if ((bodyPart.position == 0) || (bodyPart.position % this.cols == 0)) {
                this.gameOver();
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, -1, 0);
			break;
        case UP:
            if (bodyPart.position - this.cols < 0) {
                this.gameOver();
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, 0, -1);
            break;
        case RIGHT:
            if ((bodyPart.position + 1 > this.cellsAmount) || (bodyPart.position + 1) % this.cols == 0) {
                this.gameOver();
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, 1, 0);
			break;
        case DOWN:
            if (bodyPart.position + this.cols >= this.cellsAmount) {
                this.gameOver();
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, 0, 1);
			break;
    }
};

/***
 * @param bodyPart Object
 * @param direction int
 * @returns {position int}
 */
Matrix.prototype.setPositionForNewBodyPart = function(bodyPart, direction) {
    var xCoordinate = bodyPart.xCoordinate;
    var yCoordinate = bodyPart.yCoordinate;

    switch(direction) {
        case LEFT:
            xCoordinate = bodyPart.xCoordinate + 1;
            break;
        case UP:
            yCoordinate = bodyPart.yCoordinate + 1;
            break;
        case RIGHT:
            xCoordinate = bodyPart.xCoordinate - 1;
            break;
        case DOWN:
            yCoordinate = bodyPart.yCoordinate - 1;
            break;
    }

    return coordinates = [xCoordinate, yCoordinate];
    console.log(coordinates);
};

Matrix.prototype.createBodyPart = function(snake, bodyPartNumber, bodyAmount, direction) {
    if(bodyAmount == 1) {
        var tailCoordinates = this.setPositionForNewBodyPart(snake[0], direction);
        var tail = new BodyPart(tailCoordinates[0], tailCoordinates[1], "tail", this.cols);
        snake[1] = tail;
        this.colouredCell(tail.position);

    } else {
        var oldTailPosition = bodyAmount - 1;
        var newTailPosition = this.setPositionForNewBodyPart(
            snake[oldTailPosition],
            snake[oldTailPosition].direction
        );

        snake[oldTailPosition].role = "part";
        var newTail = new BodyPart(newTailPosition[0], newTailPosition[1], "tail", this.cols);
        snake[oldTailPosition + 1] = newTail;
        this.colouredCell(newTail.position);
    }

    console.log(snake);
}

Matrix.prototype.createFood = function(food) {
    food.position = this.generateRandomCell()
    this.colouredCell(food.getPosition(), "green");
}

window.onload = function() {
    var myMatrix = new Matrix(20, 20);

    var head = new BodyPart(10, 10, "head", myMatrix.cols);

    //Snake
    var snake = new Array();
    snake[0] = head;

    myMatrix.colouredCell(snake[0].position);

    var food = new Food();

    //food appearance
    setTimeout(function(){
        myMatrix.createFood(food);
    },1000);

    //Button click handler
    document.onkeydown = function(event) {
        if((event.keyCode >= 37) && (event.keyCode <= 40)) {
            var keyCode = event.keyCode;

            for(var i = 0; i < snake.length; i++) {
                if(snake[i].role == "head") {
                    snake[i].direction = keyCode;
                    myMatrix.move(snake[i], keyCode);
                } else {
                    myMatrix.move(snake[i], keyCode);
                    snake.direction = keyCode;
                }
            }

            if(snake[0].position == food.getPosition()){
                food.remove();
                myMatrix.createBodyPart(snake, i, snake.length, keyCode);
                setTimeout(function(){
                        myMatrix.createFood(food);
                    }, 2000
                );

            }
        }
    }

};