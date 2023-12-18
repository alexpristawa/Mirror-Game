class Laser {
    static instances = [];

    constructor(x, y, slope, hDirection, vDirection, color, playerIndex) {
        let div = document.createElement('div');
        div.classList.add('laser');
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        gameBoard.appendChild(div);

        this.x = x;
        this.y = y;
        this.slope = slope;
        this.hDirection = hDirection;
        this.vDirection = vDirection;
        this.playerIndex = playerIndex;
        this.playerTargetIndex = this.playerIndex+1;
        if(this.playerTargetIndex == 2) {
            this.playerTargetIndex = 0;
        }
        this.color = color;

        this.elements = [div];

        Laser.instances.push(this);
    }

    addChain(DOM = false) {
        if(gameIntervalIsHappening) {
            if(DOM) {
                let div;
                if(this.elements.length > 40) {
                    this.elements.push(this.elements[0]);
                    div = this.elements[0];
                    this.elements.splice(0,1);
                } else {
                    div = document.createElement('div');
                    div.classList.add('laser');
                    gameBoard.appendChild(div);
                    this.elements.push(div);
                }
                div.style.left = `${this.x}px`;
                div.style.top = `${this.y}px`;
                div.style.backgroundColor = this.color;
            }
            let changes = squaresSum(1, this.slope, laserSpeed);
            this.x += changes[0]*this.hDirection/callsPerFrame/deltaFrames*60;
            this.y += changes[1]*this.vDirection/callsPerFrame/deltaFrames*60;

            if(this.x - laserWidth < 0 || this.x + laserWidth > gameBoard.offsetWidth) {
                this.hDirection *= -1;
            } else if(this.y - laserWidth < 0 || this.y + laserWidth > gameBoard.offsetHeight) {
                this.vDirection *= -1;
            }
            
            let majorInfo = [];
            for(let i = 0; i < mirrorsOwned.length; i++) {
                if(circleSquareCollision({x: this.x, y: this.y}, {x: mirrorsOwned[i].x + mirrorWidth/2, y: mirrorsOwned[i].y + mirrorWidth/2})) {
                    let info = collisionInformation({x: this.x, y: this.y}, {x: mirrorsOwned[i].x + mirrorWidth/2, y: mirrorsOwned[i].y + mirrorWidth/2}, this.hDirection, this.vDirection, this.slope);
                    
                    if(majorInfo.length == 0) {
                        majorInfo = [...info];
                    } else if(majorInfo[2] != false && info[2] == false) {
                        majorInfo = [...info];
                    } else if(majorInfo[2] == false && info[2] == false) {
                        if(info[0] != false) {
                            this.hDirection = info[0];
                        }
                        if(info[1] != false) {
                            this.vDirection = info[1];
                        }
                        if(info[2] != false) {
                            this.slope = info[2];
                        }
                    }

                }
            }
            if(majorInfo.length != 0) {
                if(majorInfo[0] != false) {
                    this.hDirection = majorInfo[0];
                }
                if(majorInfo[1] != false) {
                    this.vDirection = majorInfo[1];
                }
                if(majorInfo[2] != false) {
                    this.slope = majorInfo[2];
                }
            }
            
            if((playerTargetCoordinates[this.playerTargetIndex].x - this.x)**2 + (playerTargetCoordinates[this.playerTargetIndex].y - this.y)**2 < (laserWidth/2 + playerWidth/2)**2) {
                confettiExplosion(window.innerWidth/2, window.innerHeight/2, 500, 2500);
                gameIntervalIsHappening = false;

                resultsHolder.fadeIn(undefined, 'flex');
                if(this.playerIndex == 1) {
                    winnerH3.style.color = 'blue';
                } else {
                    winnerH3.style.color = 'red';
                }
                winnerH3.innerHTML = `Player ${this.playerIndex+1} Wins!`;
            }
        }
    }
}