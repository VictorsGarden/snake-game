The algorithm, which I have formulated and using for this game
if you'll use it, please give me one million dollars ;P

LOGIC:
0) Cell have:
			- coordinates (x,y),
			- direction;
1) Calculation cell's position;
2) Moving (MAIN);
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
			   if direction is different from current
					change direction ACCORDING TO DIRECTION OF NEXT BODY PART

1. Calculation cell's position
	position (z) calculating by values of col (y) and row (x):
		z = (y-1) * cols amount + x
		
2. Moving
	check whether the coordinates for next point for HEAD and coordinates of any body part are same
		if yes "GAME OVER";
	for HEAD according to what button is enter, change cell's coordinates
		<- reduce col value
		-> increase col value
		^ reduce row value
		v increase row value
		
	for BODY
		(!!! MOST IMPORTANT LOGIC !!!)
		if X-Coordinate of current body part and X-Coordinate of previous body part are same
			then check
			if previous body part's Y-Coordinate are bigger then current
				then current body-part direction is DOWN
			if previous body part's Y-Coordinate are smaller then current
				then current body-part direction is UP
				
		if Y-Coordinate of current body part and Y-Coordinate of previous body part are same
			then check
			if previous body part's X-Coordinate are bigger then current
				then current body-part direction is RIGHT
			if previous body part's X-Coordinate are smaller then current
				then current body-part direction is LEFT
	
3. EATING
	if head and food have same coordinates
		destroy food cell
		began to GROW

4.1 GROWING
	Check whether the body is only one element
	if yes
		CREATE NEW BODY PART as tail right after first body part
	if not
		CREATE NEW BODY PART right after last
		old tail becomes body part
		new body part becomes tail

4.2 CREATE NEW BODY PART
	checking for last element's position and direction
		if it looks up
			create body part one row below
		if it looks down
			create body part one row above
		if it looks left
			create body part one col left
		if it looks right
			create body part one col right
		