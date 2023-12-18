class Player {
    static instances = [];

    constructor(x = randomNumber(playerWidth, gameBoard.offsetWidth-playerWidth), y = randomNumber(playerWidth, gameBoard.offsetHeight-playerWidth), color, index) {
        this.x = x;
        this.y = y;
        playerTargetCoordinates[index].x = x;
        playerTargetCoordinates[index].y = y;
        this.element = document.createElement('div');
        this.element.classList.add('player');
        gameBoard.appendChild(this.element);
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        this.element.style.backgroundColor = color;

        Player.instances.push(this);
    }
}