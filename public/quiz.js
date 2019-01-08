var quiz = [
    {
        "question": "Little interest or pleasure in doing things?",
        "choices": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
        "answer": [0, 1, 2, 3]
    }, {
        "question": "Feeling down, depressed, or hopeless?",
        "choices": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
        "answer": [0, 1, 2, 3]
    }, {
        "question": "Trouble falling or staying asleep, or sleeping too much?",
        "choices": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
        "answer": [0, 1, 2, 3]
    },{
        "question": "Feeling tired or having little energy?",
        "choices": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
        "answer": [0, 1, 2, 3]
    },{
        "question": "Feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
        "choices": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
        "answer": [0, 1, 2, 3]
    },{
        "question": "Poor appetite or overeating?",
        "choices": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
        "answer": [0, 1, 2, 3]
    },{
        "question": "Trouble concentrating on things, such as reading the newspaper or watching television?",
        "choices": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
        "answer": [0, 1, 2, 3]
    },{
        "question": "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
        "choices": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
        "answer": [0, 1, 2, 3]
    },{
        "question": "Thoughts that you would be better off dead, or of hurting yourself in some way?",
        "choices": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
        "answer": [0, 1, 2, 3]
    }
];
// define elements

// init vars
var currentQuestion = 0,
    score = 0;

function $(id) { // shortcut for document.getElementById
    return document.getElementById(id);
}

var content = $("content"),
    questionContainer = $("questionContainer"),
    choicesContainer = $("choicesContainer"),
    scoreContainer = $("scoreContainer"),
    submitBtn = $("submitBtn");

    var quizC = document.getElementById("quizContainer");

function askQuestion() {
    var choices = quiz[currentQuestion].choices,
        choicesHtml = "";

    // loop through choices, and create radio buttons
    for (var i = 0; i < choices.length; i++) {
        choicesHtml += "<input type='radio' name='quiz" + currentQuestion +
        "' id='choice" + (i + 1) +
        "' value='" + choices[i] + "'>" +
        " <label for='choice" + (i + 1) + "'>" + choices[i] + "</label><br>";
    }

    // load the question
    questionContainer.textContent = "Q" + (currentQuestion + 1) + ". " +
    quiz[currentQuestion].question;

    // load the choices
    choicesContainer.innerHTML = choicesHtml;
}
function showFinalResults() {
    quizC.style.display = 'none';
    var resultString = "";
    for (var i = 0; i < 1; i += 1) {
        resultString += score + "<br />";
    }
    questionContainer.innerHTML = "";
    content.innerHTML =
     "<h2>You've completed the quiz!</h2>" +
    "<h2>Below are your results:</h2>" +
    resultString;
}

function checkAnswer() {
    // determine which radio button they clicked
    var radios = document.getElementsByName("quiz" + currentQuestion);
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) { // if this radio button is checked
            score = score + quiz[currentQuestion].answer[i];
        }
    }

    // if we're not on last question, increase question number
    if (currentQuestion < quiz.length - 1) {
        currentQuestion++;
        askQuestion();
    } else {
        showFinalResults();
    }

}



window.addEventListener("load", askQuestion, false);
submitBtn.addEventListener("click", checkAnswer, false);