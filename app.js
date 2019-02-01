// Требование к игре:
// - нативный JavaScript
// - по сути у нас будет три стержня, на один из которых нанизано минимум 3 (три) кольца (хорошо будет если при инициализации игры или ее запуске, это можно менять динамически)
// - кольца между стержнями (колонками) можно перетаскивать с помощью Drug’n’Drop, чуть ссылок для начала:
//     - https://learn.javascript.ru/drag-and-drop
// - https://learn.javascript.ru/drag-and-drop-objects
// - подсчет количества ходов, времени, очков, количества игр, показ ошибки если большее кольцо положили на меньшее, установка уровня сложности выбором количества колец - это все
// от того насколько у вас хватит сил, знаний и умений. Плюс неограничиваем вас в ваших фантазиях.

function CRing(DIAMETER, PLACE, X, Y, DRAGGABLE) {
    let diameter = DIAMETER;
    let place = PLACE;
    let ringDiv;
    let draggable = DRAGGABLE;

    //DRAW RING
    (function () {
        ringDiv = document.createElement('div');
        ringDiv.style.width = diameter + "px";
        ringDiv.classList.add('game__ring');
        if (draggable) {
            ringDiv.draggable = true;
            ringDiv.classList.add('draggable');
        }
        place.appendChild(ringDiv);
    }());

    ringDiv.addEventListener('dragstart', () => {
        oMain.draggedRing = ringDiv;
        oMain.draggedRingLink = this;
    });

    ringDiv.addEventListener('dragend', function (event) {
        // console.log("dragend");
    });

    function SetDraggable(DRAGGABLE) {
        draggable = DRAGGABLE;
        if (draggable) ringDiv.classList.add('draggable');
        else ringDiv.classList.remove('draggable');
    }

    return {
        diameter,
        SetDraggable
    }
}

function CTower(ID, DIV) {
    let id = ID;
    let arrRings = [];
    let div = DIV;

    div.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    div.addEventListener('drop', function (event) {
        oMain.AddNSteps();
        const newRingWidth = oMain.draggedRing.offsetWidth;

        let upperRingWidth = 0;
        const upperRing = div.lastChild;
        upperRing != null ? upperRingWidth = upperRing.offsetWidth : upperRingWidth = Number.MAX_VALUE;

        if (upperRingWidth > newRingWidth) {
            div.appendChild(oMain.draggedRing);
            oMain.RefreshRingsDraggable();
        }
    });

    function RefreshRingsDraggable() {
        let rings = div.childNodes;
        if (rings !== undefined) {
            for (let i = 0; i < rings.length; i++) {
                rings[i].draggable = false;
                rings[i].classList.remove('draggable');
            }

            let upperRing = div.lastChild;
            if (upperRing != null) {
                upperRing.draggable = true;
                upperRing.classList.add('draggable');
            }

            if (id != 1 &&
                rings.length == oMain.GetDifficalty()) {
                oMain.StopGame();
            }
        }
    }

    return {
        arrRings,
        div,
        RefreshRingsDraggable
    }
}

function CMain() {
    let timerId;
    let gameTimer;
    let timeGameStart;

    let nSteps = 0;
    let nStepsDiv;

    let btnStart;
    let difficulty;
    let gameField;
    let arrTowers = [];

    let draggedRing;
    let draggedRingLink;

    function StopGame() {
        clearInterval(timerId);
        let timeCurrent = new Date().getTime();
        let timeInGame = Math.floor((timeCurrent - timeGameStart) / 1000);
        alert("congratulations you finished the game in " + seconds2time(timeInGame) + " minutes with " + nSteps + " steps");
    }

    function OnInit() {
        console.log("OnInit STARTS");

        gameTimer = document.getElementById("game-timer");
        nStepsDiv = document.getElementById('game-steps');

        btnStart = document.getElementById("game__btn-start");
        btnStart.addEventListener("click", () => {
            console.log("START PRESSED");

            InitGame();

            timeGameStart = new Date().getTime();
            TimerStart();
        })

        gameField = document.getElementById('game__field');

        arrTowers[0] = new CTower(1, document.getElementById('tower1'));
        arrTowers[1] = new CTower(2, document.getElementById('tower2'));
        arrTowers[2] = new CTower(3, document.getElementById('tower3'));
    }

    function InitGame() {
        console.log("InitGame START");

        difficulty = document.getElementById('difficulty').value;

        if (difficulty < 3) difficulty = 3;

        let curX = 0;
        let curY = 0;
        for (let i = difficulty; i > 0; i--) {
            let draggable = false;
            if (i == 1) draggable = true;
            let curDiametr = 50 * i;
            arrTowers[0].arrRings.push(new CRing(curDiametr, arrTowers[0].div, curX, curY, draggable));
        }
    }


    function TimerStart() {
        timerId = setInterval(() => {
            let timeCurrent = new Date().getTime();
            let timeInGame = Math.floor((timeCurrent - timeGameStart) / 1000);
            gameTimer.innerHTML = seconds2time(timeInGame);
        }, 1000);
    }

    function seconds2time(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds - (hours * 3600)) / 60);
        let sec = seconds - (hours * 3600) - (minutes * 60);
        let time = "";

        hours < 10 ? time = "0" + hours : time += hours;
        minutes < 10 ? time += ":0" + minutes : time += ":" + minutes;
        sec < 10 ? time += ":0" + sec : time += ":" + sec;
        return time;
    }

    function RefreshRingsDraggable() {
        arrTowers[0].RefreshRingsDraggable();
        arrTowers[1].RefreshRingsDraggable();
        arrTowers[2].RefreshRingsDraggable();

    }

    function AddNSteps() {
        nSteps++;
        nStepsDiv.innerHTML = 'STEPS: ' + nSteps;

    }

    function GetDifficalty() {
        return difficulty
    }

    return {
        OnInit,
        AddNSteps,
        GetDifficalty,
        draggedRing,
        draggedRingLink,
        RefreshRingsDraggable,
        StopGame
    }
}

const oMain = new CMain();
oMain.OnInit();

