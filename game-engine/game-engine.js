// Mój autorski silnik do zarządzania renderowaniem obiektów w grze - ich czasem życia.

// [OK] 1. Pobranie danych ze wszystkich obiektów.
// [OK] 2. Wysłanie danych z delta time do odpowiednich workerów.
// [OK] 3. Zaktualizowanie danych w workerach.
// [OK] 4. Odebranie danych z workerów.
// [WORK] 5. Powtózyć to samo dla dzieci obiektów.
// [OK] 6. Przekazanie danych do metody aktualizującej pozycje obiektów.


// Równoległo-synchroniczna wersja silnika:
class ParallelGameEngine {
    isStop = false;
    maxFPS = undefined;
    minFrameTime = undefined;
    lastFrameTime = performance.now();
    lastUpdateTime = performance.now();
    objects = [];
    children = [];
    childrenIDCounterIdx = -1;
    workerPostmessages = [];
    updatedObjectsPosition = [];
    preparedObjectsData = [];
    preparedObjectsChildrenData = [];
    constructor(maxFPS = 60) {
        this.maxFPS = maxFPS;
        this.minFrameTime = 1000 / this.maxFPS;
        this.gameEngine = this.gameEngine.bind(this);
    }
    async gameEngine(currentTime) {

        const timeSinceLastFrame = currentTime - this.lastFrameTime;
        if (timeSinceLastFrame >= this.minFrameTime) {
            const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
            this.lastUpdateTime = currentTime;
            
            // Kasowanie nieaktywnych obiektów i dzieci:
            for (let i = 0; i < this.objects.length; i++) {  // Obiekt główny: (rodzic)
                if (!this.objects[i].isActive) {
                    this.objects.splice(i--, 1);
                    continue;
                }
                if (this.objects[i].children.length > 0) {
                    for (let j = 0; j < this.objects[i].children.length; j++) {  // Obiekty dodatkowe: (dzieci)
                        if (!this.objects[i].children[j].isActive) {
                            this.objects[i].children.splice(j--, 1);
                            continue;
                        }
                    }
                }
            }
            
            // Resetowanie danych "klatkowych":
            this.updatedObjectsPosition = [];
            this.preparedObjectsData = [];
            this.preparedObjectsChildrenData = [];
            let dataObjects = [];

            // Przygotowanie zestawu danych operacyjnych z poszczegóolnych obiektów i ich dzieci:
            // Metody prepare...() wykonują synchronicznie kod danego rodzica oraz dziecka, który
            // jest powiązany z manipulacją elementami DOM, przygotowując przy tym dane operacyjne
            // dla workera odpowiedniego rodzica. Worker rodzica liczy pozycję dla rodzica i jego
            // dzieci. Następnie wprzesyła dane do rodzica, a ten wysyła go do silnika gry, poprzez
            // wywołanie metody silnika gry (przy inicjacji obiektu rodzica, jest przekazywana do
            // niego instancja silnika gry).
            this.objects.forEach((object, i) => {
                object.prepareObjectData();  // przygotowanie danych danego obiektu dla jego workera
                dataObjects.push(
                    {
                        operationData: this.preparedObjectsData[i],  // indywidualny zestaw danych dla każdego obiektu
                        deltaTime: deltaTime,
                        children: []
                    }
                );
                if (object.children.length > 0) {
                    this.objects[i].children.forEach((child, j) => {
                        child.prepareObjectChildData();  // przygotowanie danych danego dziecka obiektu dla jego workera tego obiektu
                    });
                }
            });

            // Pushowanie odpowiednich dzieci względem ich rodziców po wzpólnym id:
            for (let i = 0; i < this.objects.length; i++) {
                if (this.objects[i].children.length > 0) {
                    for (let j = 0; j < this.preparedObjectsChildrenData.length; j++) {
                        if (this.objects[i].childrenId == this.preparedObjectsChildrenData[j].id) {
                            dataObjects[i].children.push({ operationData: this.preparedObjectsChildrenData[j].data });
                        }
                    }
                }
            }
            // Mają być takie same pod kątem zawartości dzieci: OK
            // console.log(this.preparedObjectsChildrenData);
            // console.log(dataObjects);

            // Równoległe wykonywanie operacji workerów i synchroniczne pobieranie wyników (w onmessage obiektów):
            const tasks = [];
            for (let i = 0; i < this.objects.length; i++) {
                const promise = this.objects[i].handleWorkerPostmessage(
                    {
                        id: i,
                        workerData: dataObjects[i]
                    }
                );
                tasks.push(promise);
            }
            await Promise.all(tasks);
            

            // console.log(this.objects);
            // console.log(this.updatedObjectsPosition);
            // Wywołanie metody aktualizacji DOM wszystkich obiektów, wraz z przekazaniem im odpowiednich
            // danych wynikowych do aktualizacji:
            for (let i = 0; i < this.updatedObjectsPosition.length; i++) {
                this.objects[i].update(this.updatedObjectsPosition[i]);
            }

            // Określenie czasu wszystkich operacji w jednej klatce gry:
            this.lastFrameTime = currentTime;
        }

        // Warunek zatrzymania silnika gry:
        if (!this.isStop) {
            requestAnimationFrame(this.gameEngine);   // TODO: Nie zapomnij odblokować!
        }
    }
    fromObjectPrepareData(parentData) {  // {id, payload}
        this.preparedObjectsData.push(parentData);
    }
    fromObjectChildPrepareData(parentId, childData) {
        this.preparedObjectsChildrenData.push({ id: parentId, data: childData });
    }
    fromWorkerData(data) {
        // Wkładanie pobranych z obiektów danych w odpowiednie miejsce, względem ich id.
        // Dzięki temu nie muszę robić metody sortującej - gdybym zdecydował się na push().
        this.updatedObjectsPosition[data.id] = data.payload;
    }
    startGame() {
        this.isStop = false;
        requestAnimationFrame(this.gameEngine);
    }
    stopGame() {
        this.isStop = true;
    }
    addObject(object) {
        if (object) {
            this.objects.push(object);
            this.childrenIDCounterIdx++;
            return this.childrenIDCounterIdx;
        }
    }
}





//Stara wersja silnika - synchroniczna:
class GameEngine {
    engineRef = undefined;
    isStop = false;
    maxFPS = undefined;
    minFrameTime = undefined;
    lastFrameTime = performance.now();
    lastUpdateTime = performance.now();
    objects = [];
    constructor(maxFPS = 60) {
        this.maxFPS = maxFPS;
        this.minFrameTime = 1000 / this.maxFPS;
        this.gameEngine = this.gameEngine.bind(this);
    }
    gameEngine(currentTime) {
        if (this.isStop) {
            return;
        }
        const timeSinceLastFrame = currentTime - this.lastFrameTime;
        if (timeSinceLastFrame >= this.minFrameTime) {
            const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
            this.lastUpdateTime = currentTime;
            for (let i = 0; i < this.objects.length; i++) {  // Obiekt główny: (rodzic)
                if (!this.objects[i].isActive) {
                    this.objects.splice(i--, 1);
                    continue;
                }
                this.objects[i].update(this.objects[i].speedX * deltaTime, this.objects[i].speedY * deltaTime);
                if (this.objects[i].haveChildren) {
                    for (let j = 0; j < this.objects[i].children.length; j++) {  // Obiekty dodatkowe: (dzieci)
                        if (!this.objects[i].children[j].isActive) {
                            this.objects[i].children.splice(j--, 1);
                            continue;
                        }
                        this.objects[i].children[j].update(this.objects[i].children[j].speedX * deltaTime, this.objects[i].children[j].speedY * deltaTime);
                    }
                }
            }
            this.lastFrameTime = currentTime;
        }
        requestAnimationFrame(this.gameEngine);
    }
    startGame() {
        this.isStop = false;
        requestAnimationFrame(this.gameEngine);
    }
    stopGame() {
        this.isStop = true;
    }
    addObject(object) {
        this.objects.push(object);
    }
}





// Test "Promise.all()":
// function simulateAsyncTask(name, duration, shouldFail = false) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if (shouldFail) {
//           reject(`Task ${name} failed`);
//         } else {
//           resolve(`Task ${name} completed in ${duration}ms`);
//         }
//       }, duration);
//     });
//   }
  
//   // Testujemy Promise.all
//   function testPromiseAll() {
//     const tasks = [
//       simulateAsyncTask("A", 1000),
//       simulateAsyncTask("B", 1500),
//       simulateAsyncTask("C", 500)
//     ];
  
//     console.log("Starting tasks...");
  
//     Promise.all(tasks)
//       .then((results) => {
//         console.log("All tasks completed!");
//         results.forEach(result => console.log(result));
//       })
//       .catch((error) => {
//         console.error("One of the tasks failed:", error);
//       });
//   }
  
//   testPromiseAll();