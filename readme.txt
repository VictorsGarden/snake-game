LOGIC:
0) Cell have:
			- coordinates (x,y),
			- direction;
1) Calculation cell's position;
2) Moving;
3) Eating;
4) Growing.

0. CELL
	the direction register take value by different ways, depending on body part:
		the head's register change direction depending on what button-direction was pressed
		other snake's body parts are dependent on next part and so up to the head
		
	so when player press button UP f.e.
		HEAD BEHAVIOR
			1) change direction ACCORDING TO WHAT BUTTON WAS PRESSED
			2) move
		BODY PART BEHAVIOR
			1) move according to old direction
			2) check for direction of next body part
			2) if direction is different from current
				change direction ACCORDING TO DIRECTION OF NEXT BODY PART

1. Calculation cell's position
	position (z) calculating by values of col (y) and row (x):
		z = (x-1) * x + y
		
2. Moving
	check whether the coordinates for next point for HEAD and coordinates of any body part are same
		if yes "GAME OVER";
	according to what button is enter, change cell's coordinates
		<- reduce col value
		-> increase col value
		^ reduce row value
		v increase row value
	
3. EATING
	if head and food have same coordinates
		destroy food cell
		began to GROW

4. GROWING
	checking for tail's position and direction
		if tail looks up
			create body part one row below
		if tail looks down
			create body part one row above
		if tail looks left
			create body part one col left
		if tail looks right
			create body part one col right
	this body part became a tail
		