// The reason why I use prototypical logic is that to
// give user possibility to set amount of cols and rows,
// which implies usage of Matrix's essence with it's own number of cols and rows

// Set up constants for key-codes
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

// Establish cell's color
color = "silver";

// Establish images for snake parts
headUp = 'resources/snake-up-right.png';
headDown = 'resources/snake-down-left.png';
headRight = 'resources/snake-right.png';
headLeft = 'resources/snake-left.png';

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

/***
 * Food class
 */
function Food() {
    this.position = 0;
}

/***
 * getter for food's position
 * @returns {position int}
 */
Food.prototype.getPosition = function() {
    return this.position;
};

/***
 * We cannot just kill the object in JS, therefore we hide it
 */
Food.prototype.remove = function() {
    this.position = -1;
};

/***
 * BodyPart Class
 * @param xCoordinate int
 * @param yCoordinate int
 * @param role string
 * @param colsAmount int
 */
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
Matrix.prototype.gameOver = function(cause) {
    clearInterval(this.timerId);
    document.body.removeChild(document.body.children[0]);
    var snakeWrapper = document.createElement("div");
    var snakeImage = document.createElement("img");
    snakeWrapper.className = "snake-wrapper";
    snakeImage.className = "snake-image";
    snakeImage.setAttribute("src", "resources/" + cause + ".jpg");
    document.body.appendChild(snakeWrapper);
    document.body.children[0].appendChild(snakeImage);
    var newGameButton = document.createElement('button');
    newGameButton.className = "new-game";
    newGameButton.innerHTML = "START NEW GAME";
    document.body.children[0].appendChild(newGameButton);
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
 * @param xCoordinate int
 * @param yCoordinate int
 * @param colsAmount
 * @returns {int}
 */
calculateCellPosition = function(xCoordinate, yCoordinate, colsAmount) {
    return (yCoordinate - 1) * colsAmount + xCoordinate;
};

/***
 * Generate cell with random X and Y coordinates
 * @returns {int}
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
Matrix.prototype.colouredCell = function(cellNumber, bodyRole, direction) {
    switch (bodyRole) {
        case "head":
            var image = "head";
            switch (direction) {
                case LEFT:
                    image = headLeft;
                    break;
                case UP:
                    image = headUp;
                    break;
                case RIGHT:
                    image = headRight;
                    break;
                case DOWN:
                    image = headDown;
                    break;
            }
            if(this.matrix.children[cellNumber].style.backgroundColor != "gray"){
                this.matrix.children[cellNumber].style.backgroundColor = "gray";
            }
            break;

        case "part":
            if(this.matrix.children[cellNumber].style.backgroundColor != "#006600"){
                this.matrix.children[cellNumber].style.backgroundColor = "#006600";
            }
            break;

        case "tail":
            if(this.matrix.children[cellNumber].style.backgroundColor != "#00e600"){
                this.matrix.children[cellNumber].style.backgroundColor = "#00e600";
            }
            break;

        case "food":
            if(this.matrix.children[cellNumber].style.backgroundColor != "#cc0000"){
                this.matrix.children[cellNumber].style.backgroundColor = "#cc0000";
            }
            break;
    }
};

/***
 * Clear cell's colour to default
 * @param cellNumber int
 */
Matrix.prototype.uncolouredCell = function(cellNumber) {
    if(this.matrix.children[cellNumber].style.backgroundColor != color){
        this.matrix.children[cellNumber].style.backgroundColor = color;
    }
};

/***
 * The very basic iteration for change colour to old
 * and give it to the new cell's position
 * @param currentCell int
 * @param xChange int
 * @param yChange int
 * @returns {position int}
 */
Matrix.prototype.changePosition = function(currentCell, xChange, yChange, bodyRole, direction) {
    this.uncolouredCell(currentCell.position);
    currentCell.xCoordinate += xChange;
    currentCell.yCoordinate += yChange;
    currentCell.position = calculateCellPosition(currentCell.xCoordinate, currentCell.yCoordinate, this.cols);
    this.colouredCell(currentCell.position, bodyRole, direction);
    return currentCell.position;
};

/***
 * One basic iteration for change poisition according new direction
 * @param bodyPart Obj
 * @param direction int
 */
Matrix.prototype.moveIteration = function(bodyPart, direction, bodyRole) {
    switch(direction) {
        case LEFT:
            if ((bodyPart.position == 0) || (bodyPart.position % this.cols == 0)) {
                this.gameOver("crash");
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, -1, 0, bodyRole, direction);
            break;
        case UP:
            if (bodyPart.position - this.cols < 0) {
                this.gameOver("crash");
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, 0, -1, bodyRole, direction);
            break;
        case RIGHT:
            if ((bodyPart.position + 1 > this.cellsAmount) || (bodyPart.position + 1) % this.cols == 0) {
                this.gameOver("crash");
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, 1, 0, bodyRole, direction);
            break;
        case DOWN:
            if (bodyPart.position + this.cols >= this.cellsAmount) {
                this.gameOver("crash");
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, 0, 1, bodyRole, direction);
            break;
    }
}

/***
 * The main function of this entire game
 * which do smart alhorythm to find new way for
 * @param snake array
 * @param bodyPart Object
 * @param direction int
 */
Matrix.prototype.move = function(snake, bodyPart, direction) {

    if (bodyPart == 0) {
        snake[bodyPart].direction = direction;
        this.moveIteration(snake[bodyPart], direction, snake[bodyPart].role);
        for (var i = 1; i < snake.length; i++) {
            if (snake[bodyPart].position == snake[i].position) {
                this.gameOver("uroboros");
            }
        }
    } else {
        this.moveIteration(snake[bodyPart], snake[bodyPart].direction, snake[bodyPart].role);

        if(snake[bodyPart].xCoordinate == snake[bodyPart - 1].xCoordinate) {

            if(snake[bodyPart].yCoordinate < snake[bodyPart - 1].yCoordinate) {
                snake[bodyPart].direction = DOWN;

            } else if(snake[bodyPart].yCoordinate > snake[bodyPart - 1].yCoordinate) {
                snake[bodyPart].direction = UP;
            }
        } else if(snake[bodyPart].yCoordinate == snake[bodyPart - 1].yCoordinate) {

            if(snake[bodyPart].xCoordinate < snake[bodyPart - 1].xCoordinate) {
                snake[bodyPart].direction = RIGHT;

            } else if(snake[bodyPart].xCoordinate > snake[bodyPart - 1].xCoordinate) {
                snake[bodyPart].direction = LEFT;
            }
        }
    }
};

Matrix.prototype.movingLoop = function(snake, food) {
    for (var i = 0; i < snake.length; i++) {
        this.move(snake, i, snake[i].direction);
    }

    if (snake[0].position == food.getPosition()) {
        food.remove();
        this.createBodyPart(snake, i, snake.length, snake[0].direction);

        setTimeout(this.createFood(food), 2000);
    }
}

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
    // console.log(coordinates);
};

/***
 * @param snake
 * @param bodyPartNumber
 * @param bodyAmount
 * @param direction
 */
Matrix.prototype.createBodyPart = function(snake, bodyPartNumber, bodyAmount, direction) {
    if(bodyAmount == 1) {
        var tailCoordinates = this.setPositionForNewBodyPart(snake[0], direction);
        var tail = new BodyPart(tailCoordinates[0], tailCoordinates[1], "tail", this.cols);
        snake[1] = tail;
        snake[1].direction = snake[0].direction;
        this.colouredCell(tail.position, tail.role, tail.direction);

    } else {
        var oldTailBodyPart = bodyAmount - 1;
        var newTailPosition = this.setPositionForNewBodyPart(
            snake[oldTailBodyPart],
            snake[oldTailBodyPart].direction
        );

        snake[oldTailBodyPart].role = "part";
        this.colouredCell(snake[oldTailBodyPart].position, snake[oldTailBodyPart].role, snake[oldTailBodyPart].direction);
        var newTail = new BodyPart(newTailPosition[0], newTailPosition[1], "tail", this.cols);
        newTail.direction = snake[oldTailBodyPart].direction;
        snake[oldTailBodyPart + 1] = newTail;
        this.colouredCell(newTail.position, newTail.role, newTail.direction);
    }
}

Matrix.prototype.createFood = function(food) {
    food.position = this.generateRandomCell()
    this.colouredCell(food.getPosition(), "food", UP);
}

window.onload = function() {

    $('.start, .new-game').on('click', function(){

        $("#matrix").addClass('active');

        var colsAmount = (Number)(document.querySelector('input[name="colsAmount"]:checked').value);
        var rowsAmount = (Number)(document.querySelector('input[name="rowsAmount"]:checked').value);
        var gameSpeed = (Number)(document.querySelector('input[name="gameLevel"]:checked').value);
        $('.greetings').remove();


        var myMatrix = new Matrix(colsAmount, rowsAmount);
        document.getElementById('matrix').style.width = colsAmount * 20 + "px";
        document.getElementById('matrix').style.height = rowsAmount * 20 + "px";

        var head = new BodyPart(colsAmount/2, rowsAmount/2, "head", myMatrix.cols);

        // Snake appearance
        var snake = new Array();
        snake[0] = head;
        myMatrix.colouredCell(snake[0].position);

        // Food appearance
        var food = new Food();
        myMatrix.createFood(food);

        myMatrix.timerId = setInterval(function() {
            myMatrix.movingLoop(snake, food)
        }, gameSpeed);

        //Button click handler
        document.onkeydown = function(event) {
            if((event.keyCode >= 37) && (event.keyCode <= 40)) {
                var keyCode = event.keyCode;
                if (!(snake[0].direction == UP && keyCode == DOWN)
                    && !(snake[0].direction == DOWN && keyCode == UP)
                    && !(snake[0].direction == LEFT && keyCode == RIGHT)
                    && !(snake[0].direction == RIGHT && keyCode == LEFT)) {

                    snake[0].direction = keyCode;
                }
            }
        }
    });
};