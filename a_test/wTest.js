self.onmessage = function (e) {
    const data = e.data.workerData;

    let futurePosition_parent = undefined;
    const operationData_parent = data.operationData;
    {
        let dx = operationData_parent.speedX * data.deltaTime;
        let dy = operationData_parent.speedY * data.deltaTime;
        let futureX = dx + operationData_parent.x;
        let futureY = dy + operationData_parent.y;
        futurePosition_parent = { x: futureX, y: futureY };
    }

    let futurePosition_child1 = undefined;
    if (data.children[0]) {  // Obsługa usunięcia dziecka, kiedy "children[i]" jest puste
        const operationData_child1 = data.children[0].operationData;
        let dx = operationData_child1.speedX * data.deltaTime;
        let dy = operationData_child1.speedY * data.deltaTime;
        let futureX = dx + operationData_child1.x;
        let futureY = dy + operationData_child1.y;
        futurePosition_child1 = { x: futureX, y: futureY };
    }

    let futurePosition_child2 = undefined;
    if (data.children[1]) {
        const operationData_child2 = data.children[1].operationData;
        let dx = operationData_child2.speedX * data.deltaTime;
        let dy = operationData_child2.speedY * data.deltaTime;
        let futureX = dx + operationData_child2.x;
        let futureY = dy + operationData_child2.y;
        futurePosition_child2 = { x: futureX, y: futureY };
    }

    const futurePosition = {
        parent: futurePosition_parent,
        child1: futurePosition_child1,
        child2: futurePosition_child2
    }

    self.postMessage({ id: e.data.id, futurePosition });
};

// worker.postMessage()	  Obiekt w silniku gry → Worker
// self.onmessage	      Worker odbiera dane od aplikacji
// self.postMessage()	  Worker → Główna aplikacja
// worker.onmessage	      Obiekt odbiera dane z Workera i wysyła do silnika gry