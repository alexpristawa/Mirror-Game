document.addEventListener('keydown', (event) => {
    let key = event.key;
    if(key == 'n') {
        gameIntervalIsHappening = false;
        newGame();
    }
    if(key == 'ArrowRight') {
        let index = speedMultiplierOptions.indexOf(speedMultiplier);
        if(speedMultiplierOptions.length > index+1) {
            speedMultiplier = speedMultiplierOptions[index+1];
        }
        setBottomInfo(`${speedMultiplier*100}% Speed`);
    }
    if(key == 'ArrowLeft') {
        let index = speedMultiplierOptions.indexOf(speedMultiplier);
        if(index-1 >= 0) {
            speedMultiplier = speedMultiplierOptions[index-1];
        }
        setBottomInfo(`${speedMultiplier*100}% Speed`);
    }
    if(key == ' ') {
        spaceBar = true;
    }
});

document.addEventListener('keyup', (event) => {
    let key = event.key;
    if(key == ' ') {
        spaceBar = false;
    }
});