let studyMode = 'chronological-adaptive';
let filteredEvents = [
    { year: "1", event: "E1" },
    { year: "2", event: "E2" },
    { year: "3", event: "E3" }
];

let adaptiveActivePool = [];
let adaptiveUnintroduced = [];

let pool = filteredEvents.map(e => ({ ...e, correctCount: 0 }));
adaptiveUnintroduced = pool;
adaptiveActivePool.push(adaptiveUnintroduced.shift());

function loadQuestion() {
    let neededItems = adaptiveActivePool.filter(e => e.correctCount < 2);
    if (neededItems.length === 0) {
        if (adaptiveUnintroduced.length === 0) {
            console.log("WIN"); return;
        } else {
            adaptiveActivePool.push(adaptiveUnintroduced.shift());
            adaptiveActivePool.forEach(e => e.correctCount = 0);
            neededItems = adaptiveActivePool;
            console.log("CYCLE ADVANCE. Active pool size:", adaptiveActivePool.length);
        }
    }
    const randomIndex = 0; // deterministic pick for test
    let currentAdaptiveItem = neededItems[randomIndex];
    console.log("Draw:", currentAdaptiveItem.event, "count:", currentAdaptiveItem.correctCount);
    currentAdaptiveItem.correctCount++;
    loadQuestion(); // recursively answer correct
}

loadQuestion();
