const eventsData = [
    // Period 1
    { year: "1455", event: "End of the War of the Roses", period: "1" },
    { year: "1504", event: "Michaelangelo's David", period: "1" },
    { year: "1517", event: "95 Theses", period: "1" },
    { year: "1532", event: "Machiavelli published The Prince", period: "1" },
    { year: "1555", event: "Peace of Augsburg/Calvin established theocracy in Geneva", period: "1" },
    { year: "1588", event: "Defeat of the Spanish Armada", period: "1" },
    { year: "1598", event: "Edict of Nantes", period: "1" },
    { year: "1600", event: "British East India Company Established", period: "1" },
    { year: "1603", event: "End of the Tudor Dynasty/Beginning of Stuart Dynasty", period: "1" },
    { year: "1618", event: "Beginning of the 30 Years War", period: "1" },
    { year: "1648", event: "Peace of Westphalia", period: "1" },

    // Period 2
    { year: "1649", event: "English Interregnum (Cromwell)", period: "2" },
    { year: "1656", event: "Velasquez's Las Meninas", period: "2" },
    { year: "1660", event: "Royal Society founded/Restoration of the English Monarchy", period: "2" },
    { year: "1662", event: "Peter the Great crowned", period: "2" },
    { year: "1688", event: "Glorious Revolution in England/Locke's 2nd Treatise on Government", period: "2" },
    { year: "1715", event: "Death of Louis XIV", period: "2" },
    { year: "1776", event: "Adam Smith wrote Wealth of Nations", period: "2" },
    { year: "1789", event: "French Revolution began", period: "2" },
    { year: "1793", event: "The Terror", period: "2" },
    { year: "1799", event: "Napoleon's Coup d'etat", period: "2" },
    { year: "1804", event: "Haitian Revolution", period: "2" },
    { year: "1815", event: "Napoleon's exile/Congress of Vienna", period: "2" },

    // Period 3
    { year: "1829", event: "Greek Independence", period: "3" },
    { year: "1830", event: "July Revolution", period: "3" },
    { year: "1848", event: "Revolutions of 1848/Marx/Engels wrote the Communist Manifesto", period: "3" },
    { year: "1856", event: "Bessemer Process Invented", period: "3" },
    { year: "1857", event: "Sepoy Mutiny/Creation of the Raj", period: "3" },
    { year: "1861", event: "Unification of Italy/Russian Serfs Freed", period: "3" },
    { year: "1863", event: "Impressionist movement began", period: "3" },
    { year: "1871", event: "Unification of Germany", period: "3" },
    { year: "1884", event: "Berlin Conference", accepted: ["1884", "1885", "1884-5", "1884-1885"], period: "3" },
    { year: "1890", event: "Bismarck's dismissal", period: "3" },
    { year: "1905", event: "Russo-Japanese War/Russian Revolution of 1905", period: "3" },
    { year: "1914", event: "Beginning of World War I", period: "3" },

    // Period 4
    { year: "1914", event: "World War I Began", period: "4" },
    { year: "1917", event: "Beginning of the Russian Revolution", period: "4" },
    { year: "1919", event: "Treaty of Versailles", period: "4" },
    { year: "1923", event: "Beer Hall Putsch", period: "4" },
    { year: "1937", event: "Picasso's Guernica", period: "4" },
    { year: "1939", event: "Nazi Invasion of Poland", period: "4" },
    { year: "1945", event: "Beginning of the Cold War", period: "4" },
    { year: "1947", event: "Partition of India", period: "4" },
    { year: "1956", event: "Hungarian Revolt", period: "4" },
    { year: "1968", event: "Prague Spring", period: "4" },
    { year: "1989", event: "Fall of the Soviet Union", period: "4" },
    { year: "1993", event: "Maastricht Treaty (formation of the EU)", period: "4" }
];

// Shuffle array
function shuffle(array) {
    let cloned = [...array];
    for (let i = cloned.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
    }
    return cloned;
}

// Global State
let studyMode = 'normal';

// Normal/Forever State Elements
let studyList = [];
let baseStudyList = [];
let currentIndex = 0;
let score = 0;

// Adaptive State Elements
let adaptiveUnintroduced = [];
let adaptiveActivePool = [];
let currentAdaptiveItem = null;

let attemptsOnCurrent = 0;
let startTime = 0;
let timerInterval = null;
let hintsUsed = 0;

// DOM Elements
const startScreen = document.getElementById('startScreen');
const topBar = document.getElementById('topBar');
const flashcardArea = document.getElementById('flashcardArea');
const controlsArea = document.getElementById('controlsArea');
const modeSelect = document.getElementById('modeSelect');
const periodSelect = document.getElementById('periodSelect');
const startBtn = document.getElementById('startBtn');

const timerText = document.getElementById('timerText');
const scoreText = document.getElementById('scoreText');
const percentText = document.getElementById('percentText');
const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const hintDisplay = document.getElementById('hintDisplay');
const hintBtn = document.getElementById('hintBtn');
const checkBtn = document.getElementById('checkBtn');
const flagBtn = document.getElementById('flagBtn');
let flaggedItems = JSON.parse(localStorage.getItem('apHistoryFlags') || '[]');
const endSessionBtn = document.getElementById('endSessionBtn');
const finishModal = document.getElementById('finishModal');
const finalScoreText = document.getElementById('finalScoreText');
const finalTimeText = document.getElementById('finalTimeText');
const restartBtn = document.getElementById('restartBtn');
const homeBtn = document.getElementById('homeBtn');
const validationError = document.getElementById('validationError');


// Start Activity
function startActivity() {
    startScreen.classList.add('hidden');
    topBar.classList.remove('hidden');
    flashcardArea.classList.remove('hidden');
    controlsArea.classList.remove('hidden');
    init();
}

// Initialize
function init() {
    const selectedMode = modeSelect.value;
    const selectedPeriod = periodSelect.value;
    studyMode = selectedMode;
    
    let filteredEvents = eventsData;
    if (selectedPeriod === 'flagged') {
        filteredEvents = eventsData.filter(e => flaggedItems.includes(e.event));
        if (filteredEvents.length === 0) {
            alert("You don't have any flagged questions yet! Flag some questions during practice first.");
            showStartScreen();
            return;
        }
    } else if (selectedPeriod !== 'all') {
        if (selectedPeriod.startsWith('set-')) {
            const setIndex = parseInt(selectedPeriod.replace('set-', '')) - 1;
            const sortedEvents = [...eventsData].sort((a, b) => {
                const yearA = parseInt(a.year.match(/\d+/)[0]);
                const yearB = parseInt(b.year.match(/\d+/)[0]);
                return yearA - yearB;
            });
            filteredEvents = sortedEvents.slice(setIndex * 5, setIndex * 5 + 5);
        } else {
            filteredEvents = eventsData.filter(e => e.period === selectedPeriod);
        }
    }
    
    startTime = Date.now();
    hintsUsed = 0;
    attemptsOnCurrent = 0;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    if (studyMode === 'normal' || studyMode === 'forever') {
        baseStudyList = filteredEvents;
        studyList = shuffle([...baseStudyList]);
        currentIndex = 0;
        score = 0;
        updateScoreNormal();
        
        if (studyMode === 'forever') endSessionBtn.classList.remove('hidden');
        else endSessionBtn.classList.add('hidden');
    } else if (studyMode === 'disappearing') {
        endSessionBtn.classList.add('hidden');
        adaptiveActivePool = shuffle(filteredEvents).map(e => ({ ...e, correctCount: 0 }));
        updateScoreDisappearing();
    } else {
        endSessionBtn.classList.add('hidden');
        // Prepare adaptive logic structs
        let pool = [];
        if (studyMode === 'chronological-adaptive') {
            const sorted = [...filteredEvents].sort((a, b) => {
                const yearA = parseInt(a.year.match(/\d+/)[0]);
                const yearB = parseInt(b.year.match(/\d+/)[0]);
                return yearA - yearB;
            });
            pool = sorted.map(e => ({ ...e, correctCount: 0 }));
        } else {
            pool = shuffle(filteredEvents).map(e => ({ ...e, correctCount: 0 }));
        }
        adaptiveUnintroduced = pool;
        adaptiveActivePool = [];
        
        // Grab the first two items to start!
        if (adaptiveUnintroduced.length > 0) {
            adaptiveActivePool.push(adaptiveUnintroduced.shift());
        }
        if (adaptiveUnintroduced.length > 0) {
            adaptiveActivePool.push(adaptiveUnintroduced.shift());
        }
        updateScoreAdaptive();
    }
    
    loadQuestion();
    finishModal.classList.remove('active');
    answerInput.focus();
}

// Timer
function updateTimer() {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
    timerText.textContent = `${minutes}:${seconds}`;
}

// Score display
function updateScoreNormal(justAnsweredCorrectly = false) {
    let denominator = currentIndex;
    if (!justAnsweredCorrectly && attemptsOnCurrent > 0) {
        denominator = currentIndex + 1;
    }
    
    if (studyMode === 'forever') {
        scoreText.textContent = `${score}/${denominator}`;
    } else {
        scoreText.textContent = `${score}/${studyList.length}`;
    }
    const percent = denominator === 0 ? 0 : Math.round((score / denominator) * 100);
    percentText.textContent = `${percent}%`;
}

function updateScoreDisappearing() {
    const total = adaptiveActivePool.length;
    const remaining = adaptiveActivePool.filter(e => e.correctCount < 3).length;
    scoreText.textContent = `Remaining: ${remaining} / Total: ${total}`;
    const percent = total === 0 ? 0 : Math.round(((total - remaining) / total) * 100);
    percentText.textContent = `${percent}%`;
}

function updateScoreAdaptive() {
    const total = adaptiveActivePool.length + adaptiveUnintroduced.length;
    const learned = Math.max(0, adaptiveActivePool.length - 1);
    scoreText.textContent = `${learned}/${total} Learned`;
    const percent = total === 0 ? 0 : Math.round((learned / total) * 100);
    percentText.textContent = `${percent}%`;
}

// Load Question
function loadQuestion() {
    if (studyMode === 'normal' || studyMode === 'forever') {
        if (currentIndex >= studyList.length) {
            if (studyMode === 'forever') {
                studyList = studyList.concat(shuffle([...baseStudyList]));
            } else {
                endStudy();
                return;
            }
        }
        const currentItem = studyList[currentIndex];
        displayQuestion(currentItem);
    } else if (studyMode === 'disappearing') {
        let neededItems = adaptiveActivePool.filter(e => e.correctCount < 3);
        
        if (neededItems.length === 0) {
            triggerAdaptiveWin();
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * neededItems.length);
        currentAdaptiveItem = neededItems[randomIndex];
        displayQuestion(currentAdaptiveItem);
    } else {
        let neededItems = adaptiveActivePool.filter(e => e.correctCount < 2);
        
        if (neededItems.length === 0) {
            // Cycle fully completed!
            if (adaptiveUnintroduced.length === 0) {
                // Out of questions - completely done!
                triggerAdaptiveWin();
                return;
            } else {
                // Advance cycle: Introduce exactly 1 new random unintroduced piece of data
                adaptiveActivePool.push(adaptiveUnintroduced.shift());
                // Reset internal requirement trackers for ALL active items (new requirement: complete cycle twice)
                adaptiveActivePool.forEach(e => e.correctCount = 0);
                
                neededItems = adaptiveActivePool;
                updateScoreAdaptive();
            }
        }
        
        // Pull randomly from neededItems ensuring they continue the draw!
        const randomIndex = Math.floor(Math.random() * neededItems.length);
        currentAdaptiveItem = neededItems[randomIndex];
        displayQuestion(currentAdaptiveItem);
    }
}

function displayQuestion(item) {
    attemptsOnCurrent = 0;
    hintsUsed = 0;
    
    questionText.style.opacity = '0';
    
    setTimeout(() => {
        questionText.textContent = item.event;
        questionText.style.opacity = '1';
        answerInput.value = '';
        answerInput.classList.remove('correct', 'shake');
        hintDisplay.classList.remove('visible');
        hintDisplay.textContent = '';
        
        if (flaggedItems.includes(item.event)) {
            flagBtn.classList.add('active');
            flagBtn.innerHTML = '<i class="fa-solid fa-flag"></i> Flagged';
        } else {
            flagBtn.classList.remove('active');
            flagBtn.innerHTML = '<i class="fa-regular fa-flag"></i> Flag';
        }
        
        answerInput.focus();
    }, 200);
}

// Check Answer
function checkAnswer() {
    const userInput = answerInput.value.trim();
    if (!userInput) return;

    if (!/^\d{4}$/.test(userInput)) {
        validationError.classList.add('show');
        setTimeout(() => validationError.classList.remove('show'), 1200);
        return;
    }

    const currentItem = (studyMode === 'normal' || studyMode === 'forever') ? studyList[currentIndex] : currentAdaptiveItem;
    
    const isCorrect = currentItem.accepted ? 
                        currentItem.accepted.includes(userInput) : 
                        userInput === currentItem.year;

    if (isCorrect) {
        answerInput.classList.add('correct');
        answerInput.classList.remove('shake');
        
        if (studyMode === 'normal' || studyMode === 'forever') {
            if (attemptsOnCurrent === 0) score++;
            currentIndex++;
            updateScoreNormal(true);
        } else if (studyMode === 'disappearing') {
            if (attemptsOnCurrent === 0) {
                currentAdaptiveItem.correctCount++;
            }
            updateScoreDisappearing();
        } else {
            // Give them a point toward this cycle ONLY if there were zero mistakes or hints utilized on this attempt!
            if (attemptsOnCurrent === 0) {
                currentAdaptiveItem.correctCount++;
            }
        }
        
        answerInput.disabled = true;
        
        setTimeout(() => {
            answerInput.disabled = false;
            loadQuestion();
        }, 600);
        
    } else {
        if (studyMode !== 'normal' && studyMode !== 'forever' && studyMode !== 'disappearing' && attemptsOnCurrent === 0) {
            // A wrong answer causes the ENTIRE loop to reset for strict memory locking
            adaptiveActivePool.forEach(e => e.correctCount = 0);
        }

        attemptsOnCurrent++;
        answerInput.classList.remove('shake');
        void answerInput.offsetWidth;
        answerInput.classList.add('shake');
        
        if (studyMode === 'normal' || studyMode === 'forever') {
            updateScoreNormal();
        }
    }
}

// Hint System
function showHint() {
    const currentItem = (studyMode === 'normal' || studyMode === 'forever') ? studyList[currentIndex] : currentAdaptiveItem;
    hintsUsed++;
    
    let hintText = "";
    if (hintsUsed === 1) {
        hintText = `Starts with ${currentItem.year.substring(0, 2)}...`;
    } else if (hintsUsed === 2) {
        hintText = `It's mostly ${currentItem.year.substring(0, 3)}_`;
    } else {
        hintText = `The answer is ${currentItem.year}`;
    }
    
    hintDisplay.textContent = hintText;
    hintDisplay.classList.add('visible');
    
    if (attemptsOnCurrent === 0) {
        if (studyMode !== 'normal' && studyMode !== 'forever' && studyMode !== 'disappearing') {
            // Relying on a hint also resets the entire loop
            adaptiveActivePool.forEach(e => e.correctCount = 0);
        }
        attemptsOnCurrent = 1; 
        
        if (studyMode === 'normal' || studyMode === 'forever') {
            updateScoreNormal();
        }
    }
    answerInput.focus();
}

// Adaptive notification logic
function triggerAdaptiveWin() {
    clearInterval(timerInterval);
    endStudyAdaptive();
}

// End Game Normal/Forever
function endStudy() {
    clearInterval(timerInterval);
    const total = studyMode === 'forever' ? currentIndex : studyList.length;
    finalScoreText.textContent = `${score}/${total} (${total === 0 ? 0 : Math.round((score / total) * 100)}%)`;
    finalTimeText.textContent = timerText.textContent;
    finishModal.classList.add('active');
}

// End Game Adaptive
function endStudyAdaptive() {
    const total = adaptiveActivePool.length;
    finalScoreText.textContent = `${total}/${total} Learned (100%)!`;
    finalTimeText.textContent = timerText.textContent;
    finishModal.classList.add('active');
}

// Escape Route
function showStartScreen() {
    clearInterval(timerInterval);
    finishModal.classList.remove('active');
    startScreen.classList.remove('hidden');
    topBar.classList.add('hidden');
    flashcardArea.classList.add('hidden');
    controlsArea.classList.add('hidden');
}

// Flag System
function toggleFlag() {
    const currentItem = (studyMode === 'normal' || studyMode === 'forever') ? studyList[currentIndex] : currentAdaptiveItem;
    if (!currentItem) return;
    
    const index = flaggedItems.indexOf(currentItem.event);
    if (index > -1) {
        flaggedItems.splice(index, 1);
        flagBtn.classList.remove('active');
        flagBtn.innerHTML = '<i class="fa-regular fa-flag"></i> Flag';
    } else {
        flaggedItems.push(currentItem.event);
        flagBtn.classList.add('active');
        flagBtn.innerHTML = '<i class="fa-solid fa-flag"></i> Flagged';
    }
    localStorage.setItem('apHistoryFlags', JSON.stringify(flaggedItems));
    answerInput.focus();
}

// Event Listeners
startBtn.addEventListener('click', startActivity);
checkBtn.addEventListener('click', checkAnswer);
flagBtn.addEventListener('click', toggleFlag);
endSessionBtn.addEventListener('click', endStudy);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});
hintBtn.addEventListener('click', showHint);
restartBtn.addEventListener('click', showStartScreen);
homeBtn.addEventListener('click', showStartScreen);

// Populate mini sets
const sortedForSets = [...eventsData].sort((a, b) => {
    const yearA = parseInt(a.year.match(/\d+/)[0]);
    const yearB = parseInt(b.year.match(/\d+/)[0]);
    return yearA - yearB;
});
const numSets = Math.ceil(sortedForSets.length / 5);
const optGroup = document.createElement('optgroup');
optGroup.label = "Mini Sets (5 Terms Each)";
for (let i = 0; i < numSets; i++) {
    const option = document.createElement('option');
    option.value = `set-${i + 1}`;
    option.textContent = `Set ${i + 1}`;
    optGroup.appendChild(option);
}
periodSelect.appendChild(optGroup);
