self.onmessage = function (e) {
    const data = e.data.workerData;
    const operationData = data.operationData;
    let futureX = undefined;
    let futureY = undefined;
    let speedX = undefined;
    let speedY = undefined;
    let onPosition = undefined;

    let futurePosition_parent = undefined;
    {
        const movementArgs = operationData.movementArgs;
        switch (operationData.movementType) {
            case 'bottom': {
                const dy = movementArgs.speedY * data.deltaTime;
                futureX = operationData.x;
                futureY = dy + operationData.y;
            }
            break;
            case 'horizontal': {
                const dx = movementArgs.speedX * data.deltaTime;
                futureX = dx + operationData.x;
                futureY = operationData.y;
            }
            break;
            case 'bias': {
                const dx = movementArgs.speedX * data.deltaTime;
                const dy = movementArgs.speedY * data.deltaTime;
                futureX = dx + operationData.x;
                futureY = dy + operationData.y;
            }
            break;
            case 'topWave': {
                speedX = movementArgs.speedX;
                speedY = movementArgs.speedY;

                const dy = movementArgs.speedY * data.deltaTime;
                futureY = dy + operationData.y;

                const parentRect = movementArgs.parentRect;
                onPosition = movementArgs.onPosition;

                if (parentRect.top < movementArgs.stopY && onPosition == false) {
                    futureX = operationData.x;
                } else {
                    onPosition = true;

                    const dx = movementArgs.speedX * data.deltaTime;
                    futureX = dx + operationData.x;

                    if (parentRect.left + dx < movementArgs.rightLimit) {
                        futureX = (dx * -1) + operationData.x;
                        speedX *= -1;
                    }
                    if (parentRect.left + dx > movementArgs.leftLimit) {
                        futureX = (dx * -1) + operationData.x;
                        speedX *= -1;
                    }
                    if (parentRect.top + dy > movementArgs.bottomLimit) {
                        futureY = (dy * -1) + operationData.y;
                        speedY *= -1;
                    }
                    if (parentRect.top + dy < movementArgs.topLimit) {
                        futureY = (dy * -1) + operationData.y;
                        speedY *= -1;
                    }
                }
            }
            break;
            case 'topZigzag': {
                speedX = movementArgs.speedX;
                speedY = movementArgs.speedY;

                const parentRect = movementArgs.parentRect;

                const dx = movementArgs.speedX * data.deltaTime;
                const dy = movementArgs.speedY * data.deltaTime;
                futureX = dx + operationData.x;
                futureY = dy + operationData.y;

                if (parentRect.left + dx < movementArgs.rightLimit) {
                    futureX = (dx * -1) + operationData.x;
                    speedX *= -1;
                }
                if (parentRect.left + dx > movementArgs.leftLimit) {
                    futureX = (dx * -1) + operationData.x;
                    speedX *= -1;
                }
                if (parentRect.top + dy > movementArgs.bottomLimit) {
                    futureY = (dy * -1) + operationData.y;
                    speedY *= -1;
                }
                if (parentRect.top + dy < movementArgs.topLimit) {
                    futureY = (dy * -1) + operationData.y;
                    speedY *= -1;
                }
            }
            break;
        }
        futurePosition_parent = { x: futureX, y: futureY, speedX, speedY, onPosition };
    }

    let futurePosition_cannon = [];
    if (data) {
        const operationData_cannon = data.children[0].operationData;
        const boardRect = operationData_cannon.boardRect;
        const bulletsRect = operationData_cannon.bulletsRect;
        const bulletsPosition = operationData_cannon.bulletsPosition;
        if (bulletsRect.length > 0) {
            for (let i = 0; i < bulletsRect.length; i++) {
                if (
                    bulletsRect[i].top < boardRect.top
                    || bulletsRect[i].bottom > boardRect.bottom
                    || bulletsRect[i].left < boardRect.left
                    || bulletsRect[i].right > boardRect.right
                ) {
                    futurePosition_cannon.push(false);
                } else {
                    let x = bulletsPosition[i].x;
                    let y = bulletsPosition[i].y;
                    let dx = undefined;
                    let dy = undefined;
                    let futureX = x;
                    let futureY = y;
                    switch (operationData_cannon.movementType) {
                        case 'horizontal':
                            dx = operationData_cannon.speedX * data.deltaTime;
                            futureX = dx + x;
                            break
                        case 'bias':
                            dx = operationData_cannon.speedX * data.deltaTime;
                            dy = operationData_cannon.speedY * data.deltaTime;
                            futureX = dx + x;
                            futureY = dy + y;
                            break
                        default:
                            dy = operationData_cannon.speedY * data.deltaTime;
                            futureY = dy + y;
                    }
                    futurePosition_cannon.push({ x: futureX, y: futureY });
                }
            }
        }
    }

    const futurePosition = {
        parent: futurePosition_parent,
        cannon: futurePosition_cannon,
    }

    self.postMessage({ id: e.data.id, futurePosition });
};

// worker.postMessage()	  Obiekt w silniku gry → Worker
// self.onmessage	      Worker odbiera dane od aplikacji
// self.postMessage()	  Worker → Główna aplikacja
// worker.onmessage	      Obiekt odbiera dane z Workera i wysyła do silnika gry