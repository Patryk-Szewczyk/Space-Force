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

    let futurePosition_cannon_orb = {left: [], right: [], top: [], bottom: [], leftBottom: [], rightBottom: [], leftTop: [], rightTop: []};
    if (data.children[0]) {  // ORB  // TODO: POPRAW TEN WARUNEK DLA WROGÓW, gdyż brakuje .children[0]
        const operationData_cannon = data.children[0].operationData;
        const boardRect = operationData_cannon.boardRect;
        const bulletsRect = operationData_cannon.bulletsRect;
        const bulletsPosition = operationData_cannon.bulletsPosition;
        ['left', 'right', 'top', 'bottom', 'leftBottom', 'rightBottom', 'leftTop', 'rightTop'].forEach(side => {
            if (bulletsRect[side].length > 0) {
                for (let i = 0; i < bulletsRect[side].length; i++) {
                    if (
                        bulletsRect[side][i].top < boardRect.top
                        || bulletsRect[side][i].bottom > boardRect.bottom
                        || bulletsRect[side][i].left < boardRect.left
                        || bulletsRect[side][i].right > boardRect.right
                    ) {
                        futurePosition_cannon_orb[side].push(false);
                    } else {
                        let x = bulletsPosition[side][i].x;
                        let y = bulletsPosition[side][i].y;
                        let dx = operationData_cannon.speedX[side] * data.deltaTime;
                        let dy = operationData_cannon.speedY[side] * data.deltaTime;
                        futureX = dx + x;
                        futureY = dy + y;
                        futurePosition_cannon_orb[side].push({ x: futureX, y: futureY });
                    }
                }
            }
        });
    }
    
    let futurePosition_cannon_multi = {left: [], center: [], right: []};
    if (data.children[1]) {  // MULTI
        const operationData_cannon = data.children[1].operationData;
        const boardRect = operationData_cannon.boardRect;
        const bulletsRect = operationData_cannon.bulletsRect;
        const bulletsPosition = operationData_cannon.bulletsPosition;
        ['left', 'center', 'right'].forEach(side => {
            if (bulletsRect[side].length > 0) {
                for (let i = 0; i < bulletsRect[side].length; i++) {
                    if (
                        bulletsRect[side][i].top < boardRect.top
                        || bulletsRect[side][i].bottom > boardRect.bottom
                        || bulletsRect[side][i].left < boardRect.left
                        || bulletsRect[side][i].right > boardRect.right
                    ) {
                        futurePosition_cannon_multi[side].push(false);
                    } else {
                        let x = bulletsPosition[side][i].x;
                        let y = bulletsPosition[side][i].y;
                        let dx = operationData_cannon.speedX[side] * data.deltaTime;
                        let dy = operationData_cannon.speedY[side] * data.deltaTime;
                        futureX = dx + x;
                        futureY = dy + y;
                        futurePosition_cannon_multi[side].push({ x: futureX, y: futureY });
                    }
                }
            }
        });
    }

    let futurePosition_cannon_leftShooter = [];
    if (data.children[2]) {  // LEFT SHOOOTER
        const operationData_cannon = data.children[2].operationData;
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
                    futurePosition_cannon_leftShooter.push(false);
                } else {
                    let x = bulletsPosition[i].x;
                    let y = bulletsPosition[i].y;
                    let dy = undefined;
                    let futureX = x;
                    let futureY = y;
                    dy = operationData_cannon.speedY * data.deltaTime;
                    futureY = dy + y;
                    futurePosition_cannon_leftShooter.push({ x: futureX, y: futureY });
                }
            }
        }
    }

    let futurePosition_cannon_rightShooter = [];
    if (data.children[3]) {  // RIGHT SHOOOTER
        const operationData_cannon = data.children[3].operationData;
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
                    futurePosition_cannon_rightShooter.push(false);
                } else {
                    let x = bulletsPosition[i].x;
                    let y = bulletsPosition[i].y;
                    let dy = undefined;
                    let futureX = x;
                    let futureY = y;
                    dy = operationData_cannon.speedY * data.deltaTime;
                    futureY = dy + y;
                    futurePosition_cannon_rightShooter.push({ x: futureX, y: futureY });
                }
            }
        }
    }

    let futurePosition_cannon_leftFlamer = [];
    if (data.children[4]) {  // LEFT FLAMER
        const operationData_cannon = data.children[4].operationData;
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
                    futurePosition_cannon_leftFlamer.push(false);
                } else {
                    let x = bulletsPosition[i].x;
                    let y = bulletsPosition[i].y;
                    let dy = undefined;
                    let futureX = x;
                    let futureY = y;
                    dy = operationData_cannon.speedY * data.deltaTime;
                    futureY = dy + y;
                    futurePosition_cannon_leftFlamer.push({ x: futureX, y: futureY });
                }
            }
        }
    }

    let futurePosition_cannon_rightFlamer = [];
    if (data.children[5]) {  // RIGHT FLAMER
        const operationData_cannon = data.children[5].operationData;
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
                    futurePosition_cannon_rightFlamer.push(false);
                } else {
                    let x = bulletsPosition[i].x;
                    let y = bulletsPosition[i].y;
                    let dy = undefined;
                    let futureX = x;
                    let futureY = y;
                    dy = operationData_cannon.speedY * data.deltaTime;
                    futureY = dy + y;
                    futurePosition_cannon_rightFlamer.push({ x: futureX, y: futureY });
                }
            }
        }
    }

    let futurePosition_cannon_leftBomber = [];
    if (data.children[6]) {  // LEFT BOMBER
        const operationData_cannon = data.children[6].operationData;
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
                    futurePosition_cannon_leftBomber.push(false);
                } else {
                    let x = bulletsPosition[i].x;
                    let y = bulletsPosition[i].y;
                    let dy = undefined;
                    let futureX = x;
                    let futureY = y;
                    dy = operationData_cannon.speedY * data.deltaTime;
                    futureY = dy + y;
                    futurePosition_cannon_leftBomber.push({ x: futureX, y: futureY });
                }
            }
        }
    }

    let futurePosition_cannon_rightBomber = [];
    if (data.children[7]) {  // RIGHT BOMBER
        const operationData_cannon = data.children[7].operationData;
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
                    futurePosition_cannon_rightBomber.push(false);
                } else {
                    let x = bulletsPosition[i].x;
                    let y = bulletsPosition[i].y;
                    let dy = undefined;
                    let futureX = x;
                    let futureY = y;
                    dy = operationData_cannon.speedY * data.deltaTime;
                    futureY = dy + y;
                    futurePosition_cannon_rightBomber.push({ x: futureX, y: futureY });
                }
            }
        }
    }

    const futurePosition = {
        parent: futurePosition_parent,
        cannon_orb: futurePosition_cannon_orb,
        cannon_multi: futurePosition_cannon_multi,
        cannon_leftShooter: futurePosition_cannon_leftShooter,
        cannon_rightShooter: futurePosition_cannon_rightShooter,
        cannon_leftFlamer: futurePosition_cannon_leftFlamer,
        cannon_rightFlamer: futurePosition_cannon_rightFlamer,
        cannon_leftBomber: futurePosition_cannon_leftBomber,
        cannon_rightBomber: futurePosition_cannon_rightBomber
    }

    self.postMessage({ id: e.data.id, futurePosition });
};

// worker.postMessage()	  Obiekt w silniku gry → Worker
// self.onmessage	      Worker odbiera dane od aplikacji
// self.postMessage()	  Worker → Główna aplikacja
// worker.onmessage	      Obiekt odbiera dane z Workera i wysyła do silnika gry