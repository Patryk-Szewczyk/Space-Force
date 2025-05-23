self.onmessage = function (e) {
    const data = e.data.workerData;
    const operationData = data.operationData;
    const boardRect = operationData.boardRect;
    const starsRect = operationData.starsRect;
    const starsPosition = operationData.starsPosition;
    let futurePosition = [];
    if (starsRect.length > 0) {
        for (let i = 0; i < starsRect.length; i++) {
            if (starsRect[i].top > boardRect.bottom) {
                futurePosition.push(false);
            } else {
                let x = starsPosition[i].x;
                let y = starsPosition[i].y;
                let dy = operationData.speedY * data.deltaTime;
                let futureY = dy + y;
                futurePosition.push({  x: x, y: futureY });
            }
        }
    }
    self.postMessage({ id: e.data.id, futurePosition });
};

// worker.postMessage()	  Obiekt w silniku gry → Worker
// self.onmessage	      Worker odbiera dane od aplikacji
// self.postMessage()	  Worker → Główna aplikacja
// worker.onmessage	      Obiekt odbiera dane z Workera i wysyła do silnika gry