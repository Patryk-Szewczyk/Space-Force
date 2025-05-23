self.onmessage = function (e) {
    const data = e.data.workerData;
    const operationData = data.operationData;
    const boardRect = operationData.boardRect;
    let dy = operationData.speedY * data.deltaTime;
    let futureY = undefined;
    let futurePosition = [];
    for (let i = 0; i < operationData.partsAmount; i++) {
        const partRect = operationData.partRect[i];
        if (partRect.top > boardRect.bottom) {
            // Reset pozycji:
            futureY = boardRect.height * -1;
        } else {
            // Idziemy w dół:
            futureY = (partRect.top - boardRect.top) + dy;
        }
        futurePosition.push({ y: futureY });
    }
    self.postMessage({ id: e.data.id, futurePosition });
};

// worker.postMessage()	  Obiekt w silniku gry → Worker
// self.onmessage	      Worker odbiera dane od aplikacji
// self.postMessage()	  Worker → Główna aplikacja
// worker.onmessage	      Obiekt odbiera dane z Workera i wysyła do silnika gry