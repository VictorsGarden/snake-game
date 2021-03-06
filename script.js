// The reason why I use prototypical logic is that to
// give user possibility to set amount of cols and rows,
// which implies usage of Matrix's essence with it's own number of cols and rows

// Set up constants for key-codes
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

// Establish colors for snake's part
backgroundColor = "silver";
headColor = "#1FFF80";
bodyPartColor = "#58C912";
tailColor = "#1D6122";
foodColor = "#cc0000";

window.onload = function() {
    $(".greetings input").click(function(e){
        var name = $(e.target).attr('name');
        var namesAmount = document.getElementsByName(name);

        for(var i = 0; i < namesAmount.length; i++) {
            $(namesAmount[i]).removeClass('active');
        }
        var className = $(this).attr('class');
        $('.greetings label.' + className).addClass("active");
    });
    $('.start, .new-game').on('click', function(){

        $("#matrix").addClass('active');

        var gridAmount = (Number)(document.querySelector('input[name="gridAmount"]:checked').value);
        var gameSpeed = (Number)(document.querySelector('input[name="gameLevel"]:checked').value);
        $('.greetings').remove();

        var myMatrix = new Matrix(gridAmount, gridAmount);
        document.getElementById('matrix').style.width = gridAmount * 20 + "px";
        document.getElementById('matrix').style.height = gridAmount * 20 + "px";

        var head = new BodyPart(Math.floor(gridAmount/ 2), Math.floor(gridAmount/ 2), "head", myMatrix.cols);

        // Snake appearance
        var snake = new Snake();
        snake.body[0] = head;
        myMatrix.colouredCell(snake.body[0].position, snake.body[0].role, snake.body[0].direction);

        // Food appearance
        var food = new Food();
        myMatrix.createFood(food, snake);

        myMatrix.timerId = setInterval(function() {
            snake.movingLoop(myMatrix, food)
        }, gameSpeed);

        //Button click handler
        document.onkeydown = function(event) {
            if((event.keyCode >= 37) && (event.keyCode <= 40)) {
                var keyCode = event.keyCode;
                if (!(snake.body[0].direction == UP && keyCode == DOWN)
                    && !(snake.body[0].direction == DOWN && keyCode == UP)
                    && !(snake.body[0].direction == LEFT && keyCode == RIGHT)
                    && !(snake.body[0].direction == RIGHT && keyCode == LEFT)) {

                    snake.body[0].direction = keyCode;
                }
            }
        }
    });
};

/***
 * Class Matrix, which create field of DOM elements
 * @param {number} cols
 * @param {number} rows
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
 * Snake Class
 */
function Snake() {
    this.body = [];
}

/***
 * Food class
 */
function Food() {
    this.position = 0;
}

/***
 * We cannot just kill the object in JS, therefore we hide it
 */
Food.prototype.remove = function() {
    this.position = -1;
};

/***
 * BodyPart Class
 * @param {number} xCoordinate
 * @param {number} yCoordinate
 * @param {string} role
 * @param {number} colsAmount
 */
function BodyPart(xCoordinate, yCoordinate, role, colsAmount) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.position = calculateCellPosition(xCoordinate, yCoordinate, colsAmount);
    this.direction = UP;
    this.role = role;
}

/***
 * Overing a game by two different causes - smashing into the wall and eat itself - uroboros =)
 * @param {string} cause
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
    
    $(newGameButton).click(function() {
        location.reload();
    });
};

/***
 * @param {number} diapason
 * @returns {number}
 */
Matrix.prototype.generateRandomCoordinate = function(diapason) {
    return Math.floor(Math.random() * diapason + 1);
};

/***
 * Calculating position of cell using it's coordinates
 * @param {number} xCoordinate
 * @param {number} yCoordinate
 * @param {number} colsAmount
 * @returns {number}
 */
calculateCellPosition = function(xCoordinate, yCoordinate, colsAmount) {
    return (yCoordinate - 1) * colsAmount + xCoordinate;
};

/***
 * Generate cell with random X and Y coordinates
 * @returns {number}
 */
Matrix.prototype.generateRandomCell = function() {
    var randomXCoordinate = this.generateRandomCoordinate(this.cols);
    var randomYCoordinate = this.generateRandomCoordinate(this.rows);
    return calculateCellPosition(randomXCoordinate, randomYCoordinate, this.cols);
};

/***
 * Check whether the cell, which must be painted or cleared doesn't contains the following color
 * @param {number} cellNumber
 * @param {number} partForCheck
 * @returns {boolean}
 */
Matrix.prototype.checkThereIsNotColor = function(cellNumber, partForCheck) {
    return (this.matrix.children[cellNumber].style.backgroundColor != partForCheck);
};

/***
 * Coloured cell according to it's role for game
 * @param {number} cellNumber
 * @param {string} bodyRole
 */
Matrix.prototype.colouredCell = function(cellNumber, bodyRole) {
    switch (bodyRole) {
        case "head":
            if(this.checkThereIsNotColor(cellNumber, headColor)) {
                this.matrix.children[cellNumber].style.backgroundColor = headColor;
            }
            break;

        case "part":
            if(this.checkThereIsNotColor(cellNumber, bodyPartColor)) {
                this.matrix.children[cellNumber].style.backgroundColor = bodyPartColor;
            }
            break;

        case "tail":
            if(this.checkThereIsNotColor(cellNumber, tailColor)){
                this.matrix.children[cellNumber].style.backgroundColor = tailColor;
            }
            break;

        case "food":
            if(this.matrix.children[cellNumber].style.backgroundColor != foodColor){
                this.matrix.children[cellNumber].style.backgroundColor = foodColor;
            }
            break;
    }
};

/***
 * Clear cell's colour to default
 * @param {number} cellNumber
 */
Matrix.prototype.uncolouredCell = function(cellNumber) {
    if(this.checkThereIsNotColor(cellNumber, tailColor)){
        this.matrix.children[cellNumber].style.backgroundColor = backgroundColor;
    }
};

/***
 * The very basic iteration for change colour to old
 * and give it to the new cell's position
 * @param {number} currentCell
 * @param {number} xChange
 * @param {number} yChange
 * @param {Matrix} myMatrix
 * @returns {number}
 */
Snake.prototype.changePosition = function(currentCell, xChange, yChange, bodyRole, myMatrix) {
    myMatrix.uncolouredCell(currentCell.position);
    currentCell.xCoordinate += xChange;
    currentCell.yCoordinate += yChange;
    currentCell.position = calculateCellPosition(currentCell.xCoordinate, currentCell.yCoordinate, myMatrix.cols);
    myMatrix.colouredCell(currentCell.position, bodyRole);
    return currentCell.position;
};

/***
 * One basic iteration for change position according to new direction
 * @param {BodyPart} bodyPart
 * @param {number} direction
 * @param {Matrix} myMatrix
 */
Snake.prototype.moveIteration = function(bodyPart, direction, bodyRole, myMatrix) {
    switch(direction) {
        case LEFT:
            if ((bodyPart.position == 0) || (bodyPart.position % myMatrix.cols == 0)) {
                myMatrix.gameOver("crash");
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, -1, 0, bodyRole, myMatrix);
            break;

        case UP:
            if (bodyPart.position - myMatrix.cols < 0) {
                myMatrix.gameOver("crash");
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, 0, -1, bodyRole, myMatrix);
            break;

        case RIGHT:
            if ((bodyPart.position + 1 > myMatrix.cellsAmount) || (bodyPart.position + 1) % myMatrix.cols == 0) {
                myMatrix.gameOver("crash");
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, 1, 0, bodyRole, myMatrix);
            break;

        case DOWN:
            if (bodyPart.position + myMatrix.cols >= myMatrix.cellsAmount) {
                myMatrix.gameOver("crash");
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, 0, 1, bodyRole, myMatrix);
            break;
    }
};

/***
 * The main function of this entire game
 * which do smart algorithm to find new way for moving
 * @param {Matrix} matrix
 * @param {BodyPart} bodyPart
 * @param {number} direction
 */
Snake.prototype.move = function(myMatrix, bodyPart, direction) {
    if (bodyPart == 0) {
        this.body[bodyPart].direction = direction;
        this.moveIteration(this.body[bodyPart], direction, this.body[bodyPart].role, myMatrix);

        for (var i = 1; i < this.body.length; i++) {
            if (this.body[bodyPart].position == this.body[i].position) {
                myMatrix.gameOver("uroboros");
            }
        }
    } else {
        this.moveIteration(this.body[bodyPart], this.body[bodyPart].direction, this.body[bodyPart].role, myMatrix);

        if(this.body[bodyPart].xCoordinate == this.body[bodyPart - 1].xCoordinate) {

            if(this.body[bodyPart].yCoordinate < this.body[bodyPart - 1].yCoordinate) {
                this.body[bodyPart].direction = DOWN;

            } else if(this.body[bodyPart].yCoordinate > this.body[bodyPart - 1].yCoordinate) {
                this.body[bodyPart].direction = UP;
            }
        } else if(this.body[bodyPart].yCoordinate == this.body[bodyPart - 1].yCoordinate) {

            if(this.body[bodyPart].xCoordinate < this.body[bodyPart - 1].xCoordinate) {
                this.body[bodyPart].direction = RIGHT;

            } else if(this.body[bodyPart].xCoordinate > this.body[bodyPart - 1].xCoordinate) {
                this.body[bodyPart].direction = LEFT;
            }
        }
    }
};

/***
 * Moving entire snake's body
 * @param {Matrix} myMatrix
 * @param {Food} food
 */
Snake.prototype.movingLoop = function(myMatrix, food) {
    for (var i = 0; i < this.body.length; i++) {
        this.move(myMatrix, i, this.body[i].direction);
    }

    if (this.body[0].position == food.position) {
        food.remove();
        this.createBodyPart(myMatrix);
        myMatrix.createFood(food, this);
    }
};

/***
 * Check in all cases whether the current tail not near borders and handle all situations if it is
 * @param {number} xCoordinate
 * @param {number} yCoordinate
 * @param {number} direction
 * @returns {Array<Number>}
 */
Matrix.prototype.checkTheBorders = function(xCoordinate, yCoordinate, direction) {
    if(xCoordinate % this.cols == (this.cols - 1) || xCoordinate == 0 ||
        yCoordinate == this.rows || yCoordinate == 1) {

        if (xCoordinate % this.cols == (this.cols - 1)) {
            if (yCoordinate == this.rows) {
                if (direction == UP) {
                    xCoordinate -= 1;
                } else if (direction == LEFT) {
                    yCoordinate -= 1;
                }
            } else if (yCoordinate == 1) {
                if (direction == DOWN) {
                    xCoordinate -= 1;
                } else if (direction == LEFT) {
                    yCoordinate += 1;
                }
            } else {
                if (direction == LEFT) {
                    yCoordinate += 1;
                }
            }
        } else if (xCoordinate == 0) {
            if (yCoordinate == this.rows) {
                if (direction == UP) {
                    xCoordinate += 1;
                } else if (direction == RIGHT) {
                    yCoordinate -= 1;
                }
            } else if (yCoordinate == 1) {
                if (direction == DOWN) {
                    xCoordinate += 1;
                } else if (direction == RIGHT) {
                    yCoordinate += 1;
                }
            } else {
                if (direction == RIGHT) {
                    yCoordinate += 1;
                }
            }
        } else if (yCoordinate == 1) {
            if (direction == DOWN) {
                xCoordinate += 1;
            }
        } else if (yCoordinate == this.rows) {
            if (direction == UP) {
                xCoordinate += 1;
            }
        }
    }
    return [xCoordinate, yCoordinate];
}

/***
 * Helping-function which calculates where it ought create new tail from the old one
 * @param {BodyPart} bodyPart
 * @param {number} direction
 * @param {Matrix} myMatrix
 * @returns {number}
 */
Snake.prototype.setPositionForNewTail = function(bodyPart, direction, myMatrix) {
    var xCoordinate = bodyPart.xCoordinate;
    var yCoordinate = bodyPart.yCoordinate;

    var checkedOnBordersCoordinates = myMatrix.checkTheBorders(xCoordinate, yCoordinate, direction);

    // if our tail is near border now, we already handled this situation
    if (xCoordinate != checkedOnBordersCoordinates[0] || yCoordinate != checkedOnBordersCoordinates[1]) {
        return checkedOnBordersCoordinates;
    }

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

    return [xCoordinate, yCoordinate];
};

/***
 * Creating new body part after eating to became growing
 * @param {Matrix} myMatrix
 */
Snake.prototype.createBodyPart = function(myMatrix) {
    var headDirection = this.body[0].direction;
    var bodyAmount = this.body.length;

    if(bodyAmount == 1) {
        var tailCoordinates = this.setPositionForNewTail(this.body[0], headDirection, myMatrix);
        var tail = new BodyPart(tailCoordinates[0], tailCoordinates[1], "tail", myMatrix.cols);
        this.body[1] = tail;
        this.body[1].direction = this.body[0].direction;
        myMatrix.colouredCell(tail.position, tail.role, tail.direction);

    } else {
        var oldTailBodyPart = bodyAmount - 1;
        var newTailPosition = this.setPositionForNewTail(
            this.body[oldTailBodyPart],
            this.body[oldTailBodyPart].direction,
            myMatrix
        );

        this.body[oldTailBodyPart].role = "part";
        myMatrix.colouredCell(this.body[oldTailBodyPart].position, this.body[oldTailBodyPart].role, this.body[oldTailBodyPart].direction);
        var newTail = new BodyPart(newTailPosition[0], newTailPosition[1], "tail", myMatrix.cols);
        newTail.direction = this.body[oldTailBodyPart].direction;
        this.body[oldTailBodyPart + 1] = newTail;
        myMatrix.colouredCell(newTail.position, newTail.role, newTail.direction);
    }
};

/***
 * Creating random food cell within the matrix instance
 * @param {Food} food
 * @param {Snake} snake
 */
Matrix.prototype.createFood = function(food, snake) {
    food.position = this.generateRandomCell();

    for (var i = 0; i < snake.body.length; i++) {

        if (food.position == snake.body[i].position) {
            i = 0;
            food.position = this.generateRandomCell();
        }
    }
    this.colouredCell(food.position, "food", UP);
};
