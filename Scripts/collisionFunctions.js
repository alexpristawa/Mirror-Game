let circleSquareCollision = (circle, square) => {
    // Circle: {x, y} coordinates for the center and laserWidth as diameter
    // Square: {x, y} coordinates for the center and mirrorWidth as the side length

    // Calculate half width/height of the square
    let halfSquareWidth = mirrorWidth / 2;

    // Calculate the circle's radius
    let circleRadius = laserWidth / 2;

    // Calculate the absolute distance between the centers
    let distanceX = Math.abs(circle.x - square.x);
    let distanceY = Math.abs(circle.y - square.y);

    // If the distance is greater than halfSquareWidth + circleRadius, they cannot be colliding
    if (distanceX > (halfSquareWidth + circleRadius) || distanceY > (halfSquareWidth + circleRadius)) {
        return false;
    }

    // If the distance is less than halfSquareWidth, they are definitely colliding
    if (distanceX <= halfSquareWidth || distanceY <= halfSquareWidth) {
        return true;
    }

    // Calculate the corner distance squared
    let cornerDistanceSq = Math.pow(distanceX - halfSquareWidth, 2) + Math.pow(distanceY - halfSquareWidth, 2);

    // Check if the closest corner is within the circle's radius
    return cornerDistanceSq <= Math.pow(circleRadius, 2);
}

let collisionInformation = (circle, square, hDirection, vDirection, oldSlope) => {
    let squareSides = {
        l: square.x - mirrorWidth/2,
        r: square.x + mirrorWidth/2,
        t: square.y - mirrorWidth/2,
        b: square.y + mirrorWidth/2
    }
    if(circle.x > squareSides.l - 0.5 && circle.x < squareSides.r + 0.5) {
        if(circle.y < squareSides.t) {
            return [false, -1, false];
        } else if(circle.y > squareSides.b) {
            return [false, 1, false];
        }
    } else if(circle.y > squareSides.t - 0.5 && circle.y < squareSides.b + 0.5) {
        if(circle.x < squareSides.l) {
            return [-1, false, false];
        } else if(circle.x > squareSides.r) {
            return [1, false, false];
        }
    } else {
        let changeX;
        let changeY;
        let newVDirection = 1;
        let newHDirection = 1;
        if(circle.x < squareSides.l) {
            changeX = circle.x - squareSides.l;
            if(circle.y <= squareSides.t) {
                changeY = circle.y - squareSides.t;
            } else {
                changeY = circle.y - squareSides.b;
            }
        } else {
            changeX = circle.x - squareSides.r;
            if(circle.y <= squareSides.t) {
                changeY = circle.y - squareSides.t;
            } else {
                changeY = circle.y - squareSides.b;
            }
        }
        if(changeY < 0) {
            newVDirection = -1;
        }
        if(changeX < 0) {
            newHDirection = -1;
        }
        
        return [newHDirection, newVDirection, Math.abs(changeY/changeX)];
    }
}