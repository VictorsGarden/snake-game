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

/***
 * Class Matrix, which create field of DOM elements
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
 * Overing a game by two different causes - smashing into the wall and eat itself - uroboros =)
 * @param cause string
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
 * @param diapason int
 * @returns {int}
 */
Matrix.prototype.generateRandomCoordinate = function(diapason) {
    return Math.floor(Math.random() * diapason + 1);
};

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
 * Check whether the cell, which must be painted or cleared doesn't contains the following color
 * @param partForCheck
 * @returns {boolean}
 */
Matrix.prototype.checkThereIsNotColor = function(cellNumber, partForCheck) {
    return (this.matrix.children[cellNumber].style.backgroundColor != partForCheck);
};

/***
 * Coloured cell according to it's role for game
 * @param cellNumber int
 * @param bodyRole string
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
 * @param cellNumber int
 */
Matrix.prototype.uncolouredCell = function(cellNumber) {
    if(this.checkThereIsNotColor(cellNumber, tailColor)){
        this.matrix.children[cellNumber].style.backgroundColor = backgroundColor;
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
Matrix.prototype.changePosition = function(currentCell, xChange, yChange, bodyRole) {
    this.uncolouredCell(currentCell.position);
    currentCell.xCoordinate += xChange;
    currentCell.yCoordinate += yChange;
    currentCell.position = calculateCellPosition(currentCell.xCoordinate, currentCell.yCoordinate, this.cols);
    this.colouredCell(currentCell.position, bodyRole);
    return currentCell.position;
};

/***
 * One basic iteration for change position according to new direction
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
            bodyPart.position = this.changePosition(bodyPart, -1, 0, bodyRole);
            break;

        case UP:
            if (bodyPart.position - this.cols < 0) {
                this.gameOver("crash");
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, 0, -1, bodyRole);
            break;

        case RIGHT:
            if ((bodyPart.position + 1 > this.cellsAmount) || (bodyPart.position + 1) % this.cols == 0) {
                this.gameOver("crash");
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, 1, 0, bodyRole);
            break;

        case DOWN:
            if (bodyPart.position + this.cols >= this.cellsAmount) {
                this.gameOver("crash");
                break;
            }
            bodyPart.position = this.changePosition(bodyPart, 0, 1, bodyRole);
            break;
    }
};

/***
 * The main function of this entire game
 * which do smart algorithm to find new way for moving
 * @param snake array
 * @param bodyPart Obj
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

/***
 * Moving entire snake's body
 * @param snake Obj
 * @param food Obj
 */
Matrix.prototype.movingLoop = function(snake, food) {
    for (var i = 0; i < snake.length; i++) {
        this.move(snake, i, snake[i].direction);
    }

    if (snake[0].position == food.position) {
        food.remove();
        this.createBodyPart(snake, snake.length, snake[0].direction);
        setTimeout(this.createFood(food, snake), 2000);
    }
};

/***
 * Check in all cases whether the current tail not near borders and handle all situations if it is
 * @param xCoordinate int
 * @param yCoordinate int
 * @param direction
 * @returns {int[]}
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
 * @param bodyPart Obj
 * @param direction int
 * @returns {position int}
 */
Matrix.prototype.setPositionForNewTail = function(bodyPart, direction) {
    var xCoordinate = bodyPart.xCoordinate;
    var yCoordinate = bodyPart.yCoordinate;

    var checkedOnBordersCoordinates = this.checkTheBorders(xCoordinate, yCoordinate, direction);

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
 * @param snake Obj
 * @param bodyAmount
 * @param direction
 */
Matrix.prototype.createBodyPart = function(snake, bodyAmount, direction) {
    if(bodyAmount == 1) {
        var tailCoordinates = this.setPositionForNewTail(snake[0], direction);
        var tail = new BodyPart(tailCoordinates[0], tailCoordinates[1], "tail", this.cols);
        snake[1] = tail;
        snake[1].direction = snake[0].direction;
        this.colouredCell(tail.position, tail.role, tail.direction);

    } else {
        var oldTailBodyPart = bodyAmount - 1;
        var newTailPosition = this.setPositionForNewTail(
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
};

/***
 * Creating random food cell within the matrix instance
 * @param food Obj
 * @param snake Obj
 */
Matrix.prototype.createFood = function(food, snake) {
    food.position = this.generateRandomCell();

    for (var i = 0; i < snake.length; i++) {

        if (food.position == snake[i].position) {
            i = 0;
            food.position = this.generateRandomCell();
        }
    }
    this.colouredCell(food.position, "food", UP);
};

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
        var snake = new Array();
        snake[0] = head;
        myMatrix.colouredCell(snake[0].position, snake[0].role, snake[0].direction);

        // Food appearance
        var food = new Food();
        myMatrix.createFood(food, snake);

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