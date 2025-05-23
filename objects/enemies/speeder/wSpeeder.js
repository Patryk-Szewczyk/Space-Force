self.onmessage = function (e) {
    const data = e.data.workerData;
    const operationData = data.operationData;
    const dx = operationData.speedX * data.deltaTime;
    const dy = operationData.speedY * data.deltaTime;
    const futureX = dx + operationData.x;
    const futureY = dy + operationData.y;
    const futurePosition = { x: futureX, y: futureY };
    self.postMessage({ id: e.data.id, futurePosition });
};

// worker.postMessage()	  Obiekt w silniku gry → Worker
// self.onmessage	      Worker odbiera dane od aplikacji
// self.postMessage()	  Worker → Główna aplikacja
// worker.onmessage	      Obiekt odbiera dane z Workera i wysyła do silnika gry