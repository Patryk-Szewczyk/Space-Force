self.onmessage = function (e) {
    const data = e.data.workerData;
    const operationData = data.operationData;
    const boardRect = operationData.boardRect;
    const powerUpsRect = operationData.powerUpsRect;
    const powerUpsPosition = operationData.powerUpsPosition;
    let futurePosition = [];
    if (powerUpsRect.length > 0) {
        for (let i = 0; i < powerUpsRect.length; i++) {
            if (powerUpsRect[i].top > boardRect.bottom) {
                futurePosition.push(false);
            } else {
                let x = powerUpsPosition[i].x;
                let y = powerUpsPosition[i].y;
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



// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// ŻYWOTNOŚĆ OBIEKTÓW:
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 0. Sprawdzam stan wszystkich obiektów. Jeżeli objects[i].isActive == false, to kasuję ten
//    obiekt z silnika gry. Obiekty zawierają dzieci, więc one też znikają.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// RODZICE:
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 1. Pobieram dane do obliczeń z:
//    a) obiektu (this.objects[i].speedX, this.objects[i].speedY), | tylko RODZICÓW
//    b) silnika gry (deltatime).
// 2. Dla każdego obiektu równoległego tworzę obiekt danych { id, objectData, deltaTime, childern }
//    (id zaczynają się od 0 i są odpowienikami indeksów)
//    { id, {speedX, speedY}, deltaTime, [ {speedX, speedY}, {speedX, speedY}, ... ] }
//    Jeżeli dany obiekt nie ma dzieci to wstawiamy pustą tablicę: [].
// 3. Przesyłam te dane do workera z poziomu silnika gry za pośrednictwem referencji do metody obiektu 
//    "worker.postMessage()".
// 4. Odbieram dane w workerze "self.onmessage" danej instancji obkiektu (który ma uprzednio przekazaną instancję silnika gry z metodą przesłania danych do silnika).
// 5. Aktualizuje pozycję każdego obiektu w danym workerze.
// 6. Wysyłam zaktualizowany obiekt danych do silnika gry z workera "self.postMessage() ".
// 7. Odbieram w silniku gry zaktualizowane dane z workera "worker.onmessage" asynchroniczne,
//    za pomocą metody Promise.all().
// 8. Sortuję obiekty danych według id, tak aby ich ułożenie odpowiadało położeniu początkowym,
//    przy pobraniu danych z obiektów równolegych we właściwej kolejności.
// 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// DZIECI:
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 9. FOR -> sprawdzamy który obiekt ma dzieci, jeżei ma, to tworzymy obiekt dziecka równoległego,
//    { idx, {speedX, speedY}, deltaTime }, gdzie idx, to index docelowy danego rodzica.
//    idx dotyczy oczywiście pobranego z workera i posortowanego rodzica.
// 10. Dalej robimy tak jak w punktach 3 - 8.
// 11. Wstawiamy do objects[i].childern należące do nich dzieci względem specialnego id - "idx"
//    w obiektach dzieci, dzieki czemu każdy rodzic ma zaktualizowane dane swoich dzici.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Aktualizacja DOM:
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 12. Aktualizuję pozycję w DOM wywołując metodę update() dla rodziców i dzieci, przekazując
//     wartości nowych pozycji.