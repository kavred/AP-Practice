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

// Normal State Elements
let studyList = [];
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
const successNotification = document.getElementById('successNotification');

const timerText = document.getElementById('timerText');
const scoreText = document.getElementById('scoreText');
const percentText = document.getElementById('percentText');
const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const hintDisplay = document.getElementById('hintDisplay');
const hintBtn = document.getElementById('hintBtn');
const checkBtn = document.getElementById('checkBtn');
const finishModal = document.getElementById('finishModal');
const finalScoreText = document.getElementById('finalScoreText');
const finalTimeText = document.getElementById('finalTimeText');
const restartBtn = document.getElementById('restartBtn');
const homeBtn = document.getElementById('homeBtn');


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
    if (selectedPeriod !== 'all') {
        filteredEvents = eventsData.filter(e => e.period === selectedPeriod);
    }
    
    startTime = Date.now();
    hintsUsed = 0;
    attemptsOnCurrent = 0;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    if (studyMode === 'normal') {
        studyList = shuffle(filteredEvents);
        currentIndex = 0;
        score = 0;
        updateScoreNormal();
    } else {
        // Prepare adaptive logic structs
        let pool = shuffle(filteredEvents).map(e => ({ ...e, correctCount: 0 }));
        adaptiveUnintroduced = pool;
        adaptiveActivePool = [];
        
        // Grab the single first item to start!
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
function updateScoreNormal() {
    scoreText.textContent = `${score}/${currentIndex}`;
    const percent = currentIndex === 0 ? 0 : Math.round((score / currentIndex) * 100);
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
    if (studyMode === 'normal') {
        if (currentIndex >= studyList.length) {
            endStudy();
            return;
        }
        const currentItem = studyList[currentIndex];
        displayQuestion(currentItem);
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
        answerInput.focus();
    }, 200);
}

// Check Answer
function checkAnswer() {
    const userInput = answerInput.value.trim();
    if (!userInput) return;

    const currentItem = studyMode === 'normal' ? studyList[currentIndex] : currentAdaptiveItem;
    
    const isCorrect = currentItem.accepted ? 
                        currentItem.accepted.includes(userInput) : 
                        userInput === currentItem.year;

    if (isCorrect) {
        answerInput.classList.add('correct');
        answerInput.classList.remove('shake');
        
        if (studyMode === 'normal') {
            if (attemptsOnCurrent === 0) score++;
            currentIndex++;
            updateScoreNormal();
        } else {
            // Give them a point toward this cycle for the specific element
            currentAdaptiveItem.correctCount++;
        }
        
        answerInput.disabled = true;
        
        setTimeout(() => {
            answerInput.disabled = false;
            loadQuestion();
        }, 600);
        
    } else {
        attemptsOnCurrent++;
        answerInput.classList.remove('shake');
        void answerInput.offsetWidth;
        answerInput.classList.add('shake');
        // Incorrect basically skips receiving a point, and loads dynamically back into next needed items draws
    }
}

// Hint System
function showHint() {
    const currentItem = studyMode === 'normal' ? studyList[currentIndex] : currentAdaptiveItem;
    hintsUsed++;
    
    let hintText = "";
    if (hintsUsed === 1) {
        hintText = `Starts with ${currentItem.year.substring(0, 2)}...`;
    } else {
        hintText = `It's mostly ${currentItem.year.substring(0, 3)}_`;
    }
    
    hintDisplay.textContent = hintText;
    hintDisplay.classList.add('visible');
    
    if (attemptsOnCurrent === 0) {
        attemptsOnCurrent = 1; 
    }
    answerInput.focus();
}

// Adaptive 5 Second Notification logic
function triggerAdaptiveWin() {
    clearInterval(timerInterval);
    successNotification.classList.add('show');
    
    // Hold banner for 5 seconds
    setTimeout(() => {
        successNotification.classList.remove('show');
        endStudyAdaptive();
    }, 5000);
}

// End Game Normal
function endStudy() {
    clearInterval(timerInterval);
    finalScoreText.textContent = `${score}/${studyList.length} (${Math.round((score / studyList.length) * 100)}%)`;
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
    successNotification.classList.remove('show');
}

// Event Listeners
startBtn.addEventListener('click', startActivity);
checkBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});
hintBtn.addEventListener('click', showHint);
restartBtn.addEventListener('click', showStartScreen);
homeBtn.addEventListener('click', showStartScreen);
