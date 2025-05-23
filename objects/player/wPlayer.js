self.onmessage = function (e) {
    const data = e.data.workerData;

    let futurePosition_player = undefined;
    const operationData_player = data.operationData;
    {
        const boardRect = operationData_player.boardRect;
        const playerRect = operationData_player.playerRect;
        let directions = operationData_player.directions;
        const speed = operationData_player.speed;
        const dx = operationData_player.speedX * data.deltaTime;
        const dy = operationData_player.speedY * data.deltaTime;

        // 1. Określanie czy gracz wychodzi poza granice planszy
        let eliminatedDirections = [];

        if (playerRect.left + dx < boardRect.left) {
            operationData_player.speedX = 0;
            directions = directions.filter(value => value != 'ArrowLeft');
            eliminatedDirections.push('ArrowLeft');
        }
        if (playerRect.right + dx > boardRect.right) {
            operationData_player.speedX = 0;
            directions = directions.filter(value => value != 'ArrowRight');
            eliminatedDirections.push('ArrowRight');
        }
        if (playerRect.top + dy < boardRect.top) {
            operationData_player.speedY = 0;
            directions = directions.filter(value => value != 'ArrowUp');
            eliminatedDirections.push('ArrowUp');
        }
        if (playerRect.bottom + dy > boardRect.bottom) {
            operationData_player.speedY = 0;
            directions = directions.filter(value => value != 'ArrowDown');
            eliminatedDirections.push('ArrowDown');
        }

        //2. Określanie prędkości względem położenia gracza na planszy, w kontekście stykania z granicami:
        let futureSpeedX = 0;
        let futureSpeedY = 0;

        if (directions.length === 0) {
            futureSpeedX = 0;
            futureSpeedY = 0;
        } else if (directions.length === 1) {
            switch (directions[0]) {
                case 'ArrowUp':
                    futureSpeedY = speed * -1;
                    break;
                case 'ArrowDown':
                    futureSpeedY = speed;
                    break;
                case 'ArrowLeft':
                    futureSpeedX = speed * -1;
                    break;
                case 'ArrowRight':
                    futureSpeedX = speed;
                    break;
            }
        } else if (directions.includes('ArrowUp') && directions.includes('ArrowLeft')) {
            futureSpeedX = speed * -1;
            futureSpeedY = speed * -1;
        }
        else if (directions.includes('ArrowUp') && directions.includes('ArrowRight')) {
            futureSpeedX = speed;
            futureSpeedY = speed * -1;
        }
        else if (directions.includes('ArrowDown') && directions.includes('ArrowLeft')) {
            futureSpeedX = speed * -1;
            futureSpeedY = speed;
        }
        else if (directions.includes('ArrowDown') && directions.includes('ArrowRight')) {
            futureSpeedX = speed;
            futureSpeedY = speed;
        }

        // 3. Deklaracja zmiennych nowej pocycji:
        let newX = operationData_player.x + futureSpeedX * data.deltaTime;
        let newY = operationData_player.y + futureSpeedY * data.deltaTime;

        if (eliminatedDirections.includes('ArrowLeft') || eliminatedDirections.includes('ArrowRight')) {
            newX = operationData_player.x; // zatrzymujemy X
        }
        if (eliminatedDirections.includes('ArrowUp') || eliminatedDirections.includes('ArrowDown')) {
            newY = operationData_player.y; // zatrzymujemy Y
        }

        futurePosition_player = {
            x: newX,
            y: newY,
            speedX: futureSpeedX,
            speedY: futureSpeedY
        };
    }

    let futurePosition_cannon = [];
    if (data) {
        const operationData_cannon = data.children[0].operationData;
        const boardRect = operationData_cannon.boardRect;
        const bulletsRect = operationData_cannon.bulletsRect;
        const bulletsPosition = operationData_cannon.bulletsPosition;
        if (bulletsRect.length > 0) {
            for (let i = 0; i < bulletsRect.length; i++) {
                if (bulletsRect[i].top < boardRect.top) {
                    futurePosition_cannon.push(false);
                } else {
                    let x = bulletsPosition[i].x;
                    let y = bulletsPosition[i].y;
                    let dy = operationData_cannon.speedY * data.deltaTime;
                    let futureY = dy + y;
                    futurePosition_cannon.push({ x: x, y: futureY });
                }
            }
        }
    }

    const futurePosition = {
        player: futurePosition_player,
        cannon: futurePosition_cannon,
    }

    self.postMessage({ id: e.data.id, futurePosition });
};

// worker.postMessage()	  Obiekt w silniku gry → Worker
// self.onmessage	      Worker odbiera dane od aplikacji
// self.postMessage()	  Worker → Główna aplikacja
// worker.onmessage	      Obiekt odbiera dane z Workera i wysyła do silnika gry