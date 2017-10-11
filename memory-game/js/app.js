/*
 * Create a list that holds all of your cards
 */
let cardsArray = [];
let openCards = [];
let matchCount = 0;
let moveCount = 0;

// the 3 difficulty levels
const easy = "Easy";
const medium = "Medium";
const hard = "Hard";

//default difficulty level
let difficulty = "Easy";

/*
 * To change the number of stars displayed based on moveCount and difficulty level
 * [0] -> Easy
 * [1] -> Medium
 * [2] -> Hard
 */
let starCount = 3;
let selectedStarRating = [];
const starRating = [
    [8, 12, 16],
    [16, 24, 32],
    [45, 60, 75]
];

let timer;
let isTimer = false;
let timerValue;

//default background color
let backgroundColor = "#d6fbfe";

/* Defined local storage and keys to store the score.
 * Limit is set at 5 scores for storage
 */
localStorage.name = "score";
const maxStoreNumber = 5;
const scoreCardKeys = ["score1", "score2", "score3", "score4", "score5"];

const colorKey = "color";
const difficultyKey = "difficulty";
let storedScore = [];

// cards for the game based on the difficulty level
const easyArray = ["book", "spring", "recycling", "switch",
    "book", "spring", "recycling", "switch"
];

const mediumArray = ["book", "spring", "recycling", "switch",
    "lamp", "diamond", "smart_watch", "archive2",
    "book", "spring", "recycling", "switch",
    "lamp", "diamond", "smart_watch", "archive2"
];

const hardArray = ["book", "book", "spring", "spring",
    "recycling", "recycling", "switch", "switch",
    "helmet", "helmet", "shield", "shield",
    "diamond", "diamond", "smart_watch", "smart_watch",
    "archive2", "archive2", "lamp", "lamp",
    "vr", "vr", "smart_watch", "smart_watch"
];

//at launch, initialize and generate board, attach listeners
resetBoard();
saveBackgroundColor(backgroundColor);
saveDifficultyLevel(difficulty);
setupNavBarListener();
initializeScoreBoard();

//to close the dropdown when there is a click elsewhere in the document
$(document).on("click", function(event) {
    hideDropdownMenus(event);
});

/*
 * Refresh/Resets the game. Shuffles the cards, displays the grid
 * and attaches listener to each card
 */
function resetBoard() {

    cardsArray.length = 0;
    var output = "";
    matchCount = 0;
    //localStorage.clear();

    resetMoveCount();
    resetStar();
    resetTimer();

    backgroundColor = getBackgroundColor();
    setBackgroundColor(backgroundColor);

    difficulty = getDifficultyLevel();
    cardsArray = shuffle(getDifficultyArray(difficulty));

    for (let i = 0; i < cardsArray.length; i++) {
        var className = cardsArray[i];

        output += `<img src="img/${className}.png" class="card hidden" id="${className}">`
    }

    $(".deck").html(`</div>${output}`);
    // console.log("output string is \n " + output);
    cardsArray = $(".deck").children().toArray();
    setUpCardListener();
    displayGrid(difficulty);
    $(".restart").on("click", resetBoard);
}

/*
 * Writes the background color to the localStorage
 */
function saveBackgroundColor(backgroundColor) {
    if(localStorage) {
        // console.log("saving color to localStorage");
        localStorage.setItem(colorKey, backgroundColor);
    }
}

/*
 * Retrieves the background color from the localStorage
 */
function getBackgroundColor() {
    let color;
    if(localStorage) {
        color = localStorage.getItem(colorKey);
    }
    // console.log("color from localStorage is " + color);
    if(color === null || color === 'undefined') {
        color = backgroundColor;
    }
    return color;
}

/*
 * Writes the difficulty level to localStorage
 */
function saveDifficultyLevel(difficulty) {
    if(localStorage) {
        // console.log("saving difficulty to localStorage");
        localStorage.setItem(difficultyKey, difficulty);
    }
}

/*
 * Retrieves the difficulty level from LocalStorage
 */
function getDifficultyLevel() {
    let savedDifficulty;
    if(localStorage) {
        savedDifficulty = localStorage.getItem(difficultyKey);
    }
    // console.log("difficulty from localStorage is " + savedDifficulty);
    if(savedDifficulty === null || savedDifficulty === 'undefined') {
        savedDifficulty = difficulty;
    }
    return savedDifficulty;
}

/*
 * Increments moveCount on every card click and displays the number of moves
 */
function setMoveCount() {
    moveCount += 1;
    $(".moves").text(moveCount);
}

/*
 * Initialized the moveCount to zero
 */
function resetMoveCount() {
    moveCount = 0;
    $(".moves").text("");
}

/*
 * Displays the number of stars based on the starRating
 */
function setStar() {
    if (moveCount > selectedStarRating[0]) {
        if ((moveCount < selectedStarRating[1]) && (starCount === 3)) {
            starCount = 2;
            $("#star1").hide();
        } else if ((moveCount > selectedStarRating[2]) && (starCount === 2)) {
            starCount = 1;
            $("#star2").hide();
        }
    }
}

/*
 * Sets the display back to 3 stars
 */
function resetStar() {
    starCount = 3;
    $("#star1").show();
    $("#star2").show();
}

/*
 * Start the timer
 */
function startTimer() {
    if (!isTimer) {
        isTimer = true;
        let startTime = new Date().getTime();

        //this is to ensure that timer starts immediately first time
        displayTimer(startTime);

        //console.log("time is "+ startTime.getHours() +":" + startTime.getMinutes() + ":" + startTime.getSeconds());
        timer = setInterval(function() {
            // console.log("set interval");
            displayTimer(startTime);
        }, 1000);

        // console.log("timer returned by setInterval "+ timer);
    }
}

/*
 * Display timer information on the game screen
 */
function displayTimer(startTime) {
    // console.log("display timer");
    let currentTime = new Date().getTime();
    let ms = currentTime - startTime;

    let currentHours = Math.floor(ms / 1000 / 60 / 60);
    ms -= currentHours * 1000 * 60 * 60;

    let currentMins = Math.floor(ms / 1000 / 60);
    ms -= currentMins * 1000 * 60;

    let currentSecs = Math.floor(ms / 1000);
    ms -= currentSecs * 1000;

    currentHours = (currentHours < 10) ? "0" + currentHours : currentHours;
    currentMins = (currentMins < 10) ? "0" + currentMins : currentMins;
    currentSecs = (currentSecs < 10) ? "0" + currentSecs : currentSecs;
    timerValue = `${currentHours}:${currentMins}:${currentSecs}`;
    // console.log("timer value " + timerValue);
    $(".timer").text(timerValue);
}

/*
 * Resets the timer
 */
function resetTimer() {
    if (isTimer) {
        // console.log("inside clear interval " + timer);
        clearInterval(timer);
        timerValue = "00:00:00";
        $(".timer").text("00:00:00");
        isTimer = false;
    }
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card"s HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/245097"
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * Displays the cards according to the grid size (based on difficulty)
 */
function displayGrid(difficulty) {
    if (difficulty === easy) {
        if ($(".deck").hasClass("hard")) {
            $(".deck").removeClass("hard");
        }
        $(".deck").addClass("easy");
    } else if (difficulty === hard) {
        if ($(".deck").hasClass("easy")) {
            $(".deck").removeClass("easy");
        }
        $(".deck").addClass("hard");
    } else {

        if ($(".deck").hasClass("easy")) {
            $(".deck").removeClass("easy");
        }

        if ($(".deck").hasClass("hard")) {
            $(".deck").removeClass("hard");
        }
    }
    $(".displayDifficulty").html(difficulty);
}

/*
 * Attaches click listener to each card in the deck
 */
function setUpCardListener() {
    for (let i = 0; i < cardsArray.length; i++) {
        $(cardsArray[i]).one("click", function(event) {
            clickCard(event);
        });
    }
}

/*
 * Attach click listener to the NavBar menu items
 */
function setupNavBarListener() {
    $(".dropbtn").on("click", function(event){
        selectMenu(event);
    });
    $("#score").on("click", function(event) {
        printScoreCard(event);
    });
}

/*
 * Hides the dropdown menus in navbar
 */
function hideDropdownMenus(event) {
    if (!$(event.target).hasClass("show")) {
        $("#myDifficulty").removeClass("show");
        $("#mySettings").removeClass("show");
    }
}

/*
 * Selects difficulty level, settings menu
 */
function selectMenu(event) {
     event.stopPropagation();
    if (event.target.matches(".dropbtn")) {

        //select difficulty level and generates the board
        let menu = $(event.currentTarget).attr("id");
        if (menu === "difficulty") {
            $("#myDifficulty").addClass("show");
            $(".level").on("click", function(event) {
                event.stopPropagation();
                difficulty = $(event.currentTarget).text();
                saveDifficultyLevel(difficulty);
                $("#myDifficulty").removeClass("show");
                resetBoard();
            });
        }

        if (menu === "settings") {
            $("#mySettings").addClass("show");

            //select the color from color picker
            $("#colorPicker").on("click", function(event) {
                event.stopPropagation();
                $("#colorPicker").on("change", function(event) {
                    backgroundColor = $("#colorPicker").val();
                    setBackgroundColor(backgroundColor);
                    saveBackgroundColor(backgroundColor);
                    // console.log("saved backgroundColor " + getBackgroundColor());
                    $("#mySettings").removeClass("show");
                });
            });
        }
    }
}

/*
 * Sets the selected background color
 */
function setBackgroundColor(color) {
    $(".deck").css("background-color", color);
    saveBackgroundColor(color);
}

/*
 * Returns the array corresponding to the difficulty level
 * and also sets the star rating card
 */
function getDifficultyArray(difficulty) {
    switch (difficulty) {
        case easy:
            selectedStarRating = starRating[0];
            return easyArray;

        case medium:
            selectedStarRating = starRating[1];
            return mediumArray;

        case hard:
            selectedStarRating = starRating[2];
            return hardArray;
    }
}

/*
 * Reads and stores the values from localStorage in to the storeScore variable
 */
function initializeScoreBoard() {
    if (localStorage && localStorage.length > 0) {
        for (let i = 0; i < localStorage.length; i++) {
            let val = localStorage.getItem(scoreCardKeys[i]);
            if (val != null) {
                storedScore[i] = val;
            }
        }
    }
}

/*
 * Displays the score card in another html
 */
function printScoreCard(e) {
    window.location.href = "score.html";
}

/*
 * Writes the storedScore array into the localStorage
 */
function saveIntoLocalStore() {
    if (localStorage) {
        for (let i = 0; i < storedScore.length; i++) {
            localStorage.setItem(scoreCardKeys[i], storedScore[i]);
        }
    }
}

/*
 * If maxStoreNumber of entries are present in the storedScore obj,
 * the first score entry is removed and the new score is pushed in
 */
function updateLocalStorage() {
    let scoreObj = [difficulty, moveCount, timerValue];
    let storeNum = storedScore.length;
    if (storeNum === maxStoreNumber) {
        storedScore.shift();
    }

    storedScore.push(scoreObj);
    saveIntoLocalStore();
}

/*
 * On clicking each card, the cards are checked for match. If one card is clicked
 * the board waits for the 2nd card to be clicked. If they match, then appropriate
 * animation is done. If no more cards are there to be flipped, game is over and
 * appropriate winning page is displayed, score is written into local storage.
 * If the cards do not match, appropriate animation is performed and cards are closed.
 */
function clickCard(event) {
    // console.log("card is clicked " + $(event.target).attr('class'));
    startTimer();
    hideDropdownMenus(event);

    event.stopPropagation();

    if (openCards.length < 2) {

        setMoveCount();
        setStar();

        openCards.push($(event.target));
        $(event.target).toggleClass("open");

        if (openCards.length === 2) {
            var card1 = openCards[0];
            var card2 = openCards[1];

            if (($(card1).attr("id")) === ($(card2).attr("id"))) {
                if (setCardMatch(card1, card2)) {
                    updateLocalStorage();
                    displayBoardWin();
                }
                clearOpenCards();
            } else {
                setCardMismatch(card1, card2);
                clearOpenCards();
                setTimeout(function() {
                    $(card1).removeClass("open mismatch");
                    $(card2).removeClass("open mismatch");
                }, 400);
            }
        }
    } else {
        clearOpenCards();
    }
}

/*
 * Animates the cards for the match and the click listener is removed to avoid
 * the player clicking again on the open cards. If all the cards are matched, true
 * is returned, else false
 */
function setCardMatch(card1, card2) {
    matchCount += 2;
    $(card1).addClass("match");
    $(card2).addClass("match");
    $(card1).parent().off();
    $(card2).parent().off();

    if (matchCount === cardsArray.length)
        return true;
    return false;
}

/*
 * Launches the winning html page
 */
function displayBoardWin() {
    setTimeout(function() {
        window.location.href = `win.html?moves=${moveCount}&stars=${starCount}&timer=${timerValue}`;
        //alert("Congratulations! You Won");
        resetTimer();
    }, 400);
}

/*
 * If the cards don't match, mismatch animation is shown and click event is
 * registered
 */
function setCardMismatch(card1, card2) {
    $(card1).addClass("mismatch");
    $(card2).addClass("mismatch");
    $(card1).one("click", function(event){
        clickCard(event);
    });
    $(card2).one("click", function(event){
        clickCard(event);
    });
}

/*
 * The mismatched cards are closed back
 */
function hideCards() {
    $(openCards[0]).removeClass("open show mismatch");
    $(openCards[1]).removeClass("open show mismatch");
    clearOpenCards();
}

/*
 * Clearing the values of the two open cards
 */
function clearOpenCards() {
    openCards.length = 0;
}