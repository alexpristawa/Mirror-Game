const root = document.querySelector(':root');
const body = document.querySelector('body');
const gameBoard = document.getElementById('gameBoard');
let columns = 60;
let rows = 35;
let playerWidth = window.innerWidth/20;
let choosing = 0;
let mirrorsRemaining = 0;
let mirrorsOwned = [
    [],
    []
];
let gameIntervalIsHappening = false;
let spaceBar = false;
let resultsHolder = document.getElementById('resultsHolder');
let winnerH3 = document.querySelector('#winnerH3');
let bottomInfo = document.getElementById('bottomInfo');
let topInfo = document.getElementById('topInfo');
let laserSlopes = [];
let defaultLaserSpeed = 20;
let laserSpeed = defaultLaserSpeed;
let mirrorNumber = 7;
let mirrorWidth = window.innerHeight/50;
let lasers;
let bottomRightDiv;
let laserWidth = window.innerHeight/100;
let previousTime;
let deltaTime;
let callsPerFrame = 5;
let speedMultiplier = 1;
let speedMultiplierOptions = [0.1, 0.25, 0.5, 1, 2, 3, 5];
let playerTargetCoordinates = [{},{}];

let resetGrid = (eventListener = true) => {
    let elements = document.querySelectorAll('#gameBoard > .gridSquare');
    elements.forEach(e => {e.remove();});
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < columns; j++) {
            let div = document.createElement('div');
            div.classList.add('gridSquare');
            div.style.gridColumn = j+1;
            div.style.gridRow = i+1;
            div.dataset.active = 'false';
            gameBoard.appendChild(div);
            if(!eventListener) {
                let clickHandler = () => {
                    if(choosing > 0 && choosing < 3) {
                        div.removeEventListener('mousedown', clickHandler);
                        div.removeEventListener('mousemove', mousemoveHandler);
                        mirrorsOwned[choosing-1].push({
                            column: j,
                            row: i,
                            element: div,
                            x: div.getX(gameBoard),
                            y: div.getY(gameBoard)
                        });
                        div.style.backgroundColor = 'var(--mirrorColor)';
                        mirrorsRemaining--;
                        topInfo.innerHTML = `Mirrors Remaining: ${mirrorsRemaining}`;
                        if(mirrorsRemaining == 0) {
                            choosing *= 10;
                            laser();
                        }
                    }
                }
                let mousemoveHandler = () => {
                    if(spaceBar) {
                        clickHandler();
                    }
                }
                div.addEventListener('mousedown', clickHandler);
                div.addEventListener('mouseover', mousemoveHandler);
            }
            if(i == rows-1 && j == columns-1) {
                div.dataset.active = 'true';
                bottomRightDiv = div;
            }
        }
    }
}

let newGame = () => {
    gameBoard.innerHTML = '';
    topInfo.innerHTML = '';
    gameBoard.style.backgroundColor = 'transparent';
    mirrorsOwned = [[], []];
    laserSlopes = [];
    resultsHolder.fadeOut(500, false);
    speedMultiplier = 1;
    Player.instances = [];
    Laser.instances = [];
    let coordinates = [{}, {x: 'empty'}];
    if(Math.random() < 0.5) {
        while(coordinates[1].x == 'empty') {
            coordinates[0].x = randomNumber(playerWidth, gameBoard.offsetWidth-playerWidth);
            coordinates[0].y = randomNumber(playerWidth, gameBoard.offsetHeight-playerWidth);

            let newX = randomNumber(playerWidth, gameBoard.offsetWidth-playerWidth);
            let newY = randomNumber(playerWidth, gameBoard.offsetHeight-playerWidth);
            if((coordinates[0].x - newX)**2 + (coordinates[0].y - newY)**2 > (playerWidth*2)**2) {
                coordinates[1].x = newX;
                coordinates[1].y = newY;
            }
        }
    } else {
        while(coordinates[1].x == 'empty') {
            coordinates[1].x = randomNumber(playerWidth, gameBoard.offsetWidth-playerWidth);
            coordinates[1].y = randomNumber(playerWidth, gameBoard.offsetHeight-playerWidth);

            let newX = randomNumber(playerWidth, gameBoard.offsetWidth-playerWidth);
            let newY = randomNumber(playerWidth, gameBoard.offsetHeight-playerWidth);
            if((coordinates[1].x - newX)**2 + (coordinates[1].y - newY)**2 > (playerWidth*2)**2) {
                coordinates[0].x = newX;
                coordinates[0].y = newY;
            }
        }
    }
    let players = [new Player(coordinates[0].x, coordinates[0].y, "red", 0), new Player(coordinates[1].x, coordinates[1].y, "blue", 1)];
    choosing = 0;
    continueSetup();
}

let continueSetup = () => {
    mirrorsRemaining = mirrorNumber;
    resetGrid(false);
    choosing++;
    if(choosing == 3) {
        gameplay();
        topInfo.innerHTML = '';
    } else {
        topInfo.innerHTML = `Mirrors Remaining: ${mirrorsRemaining}`;
        topInfo.style.color = `var(--player${choosing}Color)`;
    }
}

let laser = () => {
    topInfo.innerHTML = "Aim and shoot the laser!";
    let playerX = Player.instances[choosing/10-1].x;
    let playerY = Player.instances[choosing/10-1].y;
    let playerYB = Player.instances[choosing/10-1].element.getYB(gameBoard) + playerWidth/2;
    let laser = document.createElement('div');
    laser.classList.add('testingLaser');
    laser.style.left = `${playerX}px`;
    laser.style.top = `${playerY - window.innerHeight/200}px`;
    gameBoard.appendChild(laser);
    let value;
    let hDirection;
    let vDirection;

    let handleMouseMove = (event) => {
        if(mirrorsRemaining != 0) {
            gameBoard.removeEventListener('mousemove', handleMouseMove);
            gameBoard.removeEventListener('click', handleClick);
            return;
        }
        let x = event.clientX - gameBoard.getX();
        let y = gameBoard.offsetHeight - (event.clientY - gameBoard.getY());
        let angle = -Math.atan((y - playerYB)/(x - playerX))/Math.PI*180;
        value = (y - playerYB)/(x - playerX);
        hDirection = (x-playerX)/Math.abs(x-playerX);
        vDirection = -(y - playerYB)/Math.abs(y - playerYB);
        if(x-playerX < 0) {
            angle = 180 + angle;
        }

        laser.style.transform = `rotate(${angle}deg)`;
    }
    let handleClick = () => {
        if(mirrorsRemaining != 0) {
            gameBoard.removeEventListener('mousemove', handleMouseMove);
            gameBoard.removeEventListener('click', handleClick);
            return;
        }
        laserSlopes.push({
            value: Math.abs(value),
            hDirection: hDirection,
            vDirection: vDirection
        });
        laser.style.opacity = 0;
        laser.style.display = 'none';
        gameBoard.removeEventListener('mousemove', handleMouseMove);
        gameBoard.removeEventListener('click', handleClick);
        choosing /= 10;
        continueSetup();
    }
    gameBoard.addEventListener('mousemove', handleMouseMove);
    setTimeout(() => {
        gameBoard.addEventListener('click', handleClick);
    },200);
}

let gameplay = () => {
    let gridItems = document.querySelectorAll('#gameBoard > .gridSquare');
    let index = 0;
    let interval = setInterval(() => {
        let div = gridItems[mirrorsOwned[0][index].row * columns + mirrorsOwned[0][index].column];
        if(div.dataset.active == 'false') {
            div.dataset.active = 'true';
            div.style.transition = 'background-color 0.5s ease, border-color 0.5s ease';
            setTimeout(() => {
                div.style.backgroundColor = 'var(--mirrorColor)';
                //div.style.border = '0.5px solid var(--player1Color)'
            });
        }
        index++;
        if(index >= mirrorsOwned[0].length) {
            clearInterval(interval);
            setTimeout(() => {
                index = 0;
                interval = setInterval(() => {
                    let div = gridItems[mirrorsOwned[1][index].row * columns + mirrorsOwned[1][index].column];
                    if(div.dataset.active == 'false') {
                        div.dataset.active = 'true';
                        div.style.transition = 'background-color 0.5s ease, border-color 0.5s ease';
                        setTimeout(() => {
                            div.style.backgroundColor = 'var(--mirrorColor)';
                            //div.style.border = '0.5px solid var(--player2Color)'
                        });
                    } else {
                        div.dataset.active = 'false';
                        div.style.transition = 'background-color 0.25s ease, border-color 0.5s ease';
                        for(let i = 0; i < mirrorsOwned[0].length; i++) {
                            if(mirrorsOwned[0][i].row == mirrorsOwned[1][index].row && mirrorsOwned[0][i].column == mirrorsOwned[1][index].column) {
                                mirrorsOwned[0].splice(i, 1);
                                break;
                            }
                        }
                        mirrorsOwned[1].splice(index, 1);
                        index--;
                        setTimeout(() => {
                            div.style.backgroundColor = 'rgb(74, 19, 19)';
                            setTimeout(() => {
                                div.style.backgroundColor = 'black';
                            },250);
                            //div.style.border = '0.5px solid var(--player1Color)'
                        });
                    }
                    index++;
                    if(index >= mirrorsOwned[1].length) {
                        clearInterval(interval);
                        setTimeout(() => {
                            document.querySelectorAll('.testingLaser')[0].fadeIn(undefined, 'flex');
                            setTimeout(() => {
                                document.querySelectorAll('.testingLaser')[1].fadeIn(undefined, 'flex');
                                setTimeout(() => {
                                    document.querySelectorAll('.testingLaser').forEach(joe => {joe.fadeOut()});
                                    setTimeout(() => {
                                        shootLasers();
                                    },750);
                                },1500);
                            },1000);
                        },500);
                    }
                },100);
            },500);
        }
    },100);
}

let shootLasers = () => {
    mirrorsOwned = [...mirrorsOwned[0], ...mirrorsOwned[1]];
    let elements = document.querySelectorAll('#gameBoard > .gridSquare');
    elements.forEach(e => {
        if(e.dataset.active == 'false') {
            e.remove();
        }
    });
    gameBoard.style.backgroundColor = 'black';
    bottomRightDiv.style.border = '0px';
    gameBoard.style.gridTemplateRows = 'repeat(1fr, 35)';
    gameBoard.style.gridTemplateColumns = 'repeat(1fr, 60)';
    lasers = [
        new Laser(Player.instances[0].x, Player.instances[0].y, laserSlopes[0].value, laserSlopes[0].hDirection, laserSlopes[0].vDirection, 'red', 0),
        new Laser(Player.instances[1].x, Player.instances[1].y, laserSlopes[1].value, laserSlopes[1].hDirection, laserSlopes[1].vDirection, 'blue', 1)
    ];
    previousTime = Date.now();
    gameIntervalIsHappening = true;
    requestAnimationFrame(gameInterval);
}

let gameInterval = () => {
    deltaTime = Date.now() - previousTime;
    previousTime = Date.now();
    deltaFrames = 1000/deltaTime;

    let thisMultiplier = speedMultiplier;
    if(speedMultiplier < 1) {
        deltaFrames /= speedMultiplier;
        thisMultiplier = 1;
    }
    for(let i = 0; i < 4*thisMultiplier; i++) {
        if((i+1)%2 == 0) {
            lasers.forEach(laser => {laser.addChain(true)});
        } else {
            lasers.forEach(laser => laser.addChain());
        }
    }

    if(gameIntervalIsHappening){
        requestAnimationFrame(gameInterval);
    }
};

let setBottomInfo = (text, length = 2250) => {
    let key = Date.now();
    bottomInfo.dataset.key = key;
    bottomInfo.innerHTML = text;
    bottomInfo.style.opacity = 0;
    setTimeout(() => {
        bottomInfo.fadeIn(250, 'block');
    });
    setTimeout(() => {
        if(bottomInfo.dataset.key == key) {
            bottomInfo.fadeOut(250, false);
        }
    },length);
}