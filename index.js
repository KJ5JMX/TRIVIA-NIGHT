///questions I want to ask


import readline from 'readline';



let userAnswers = [];//collect the answers from user

let currentQuestionIndex = 0;//index of the current question





const questions = [
    {
        question : "Who is the only president to be a convicted felon?",
        choices : [ "Bush", "Obama", "Trump", "Biden"],
        answer : "Trump"
    },
    {
        question : "What is the greatest movie of all time?",
        choices : [ "Citizen Kane", "The Godfather", "Jaws", "Pulp Fiction"],
        answer : "Jaws"
    },
    {
        question : "Which is better, Star Wars or Star Trek?",
        choices : [ "Star Wars", "Star Trek", "Neither", "Both"],
        answer : "Star Trek"
    },
    {
        question : "If you have a fever, what is the best remedy?",
        choices : [ "Take a cold shower", "Drink hot tea", "Take aspirin", "More cowbell"],
        answer : "mMre cowbell"
    },
    {
        question : "Why don't skeletons fight each other?",
        choices : ["No guts", "No brains", "No heart", "No bones"],
        answer : "No guts"
    }
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


let score = 0;

function startMenu() {
    rl.question("\n🎉 ARE YOU READY FOR TRIVIA NIGHT? 🎉(Yes/No/Maybe): ", (input) => {
        const answer = input.trim().toLowerCase();

        if (answer === 'yes') {
            askQuestion();
        } else if (answer === 'no') {
            console.log("\n Well this isn't fun. Goodbye!");
            rl.close();
        } else if (answer === 'maybe') {
            console.log("\n Well you're gonna play anyway!");
            askQuestion();
        } else {
            console.log("\n I didn't understand that. Please answer Yes, No, or Maybe.");
            startMenu(); // repeat menu
        }
    });
}

async function askQuestion() {
    const q = questions[currentQuestionIndex];

    console.log(`\nYou have 15 seconds to answer:`);

    q.choices.forEach((choice, indx) => {
        console.log(`${indx + 1}. ${choice}`);
    });

    // Display countdown in seconds
    let secondsLeft = 15;
    const countdown = setInterval(() => {
        process.stdout.write(`\r Time left: ${secondsLeft--}s `);
        if (secondsLeft < 0) clearInterval(countdown);
    }, 1000);

    const userChoice = await new Promise((resolve) => {
        const timer = setTimeout(() => {
            console.log(`\n Time's up! Moving to next question.`);
            rl.pause();
            resolve(null);
        }, 15000);

        rl.question('\nYour answer (enter the number): ', (input) => {
            clearTimeout(timer);
            clearInterval(countdown);
            resolve(q.choices[parseInt(input) - 1] || null);
        });
    });

    userAnswers.push(userChoice || 'No Answer');

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        askQuestion();
    } else {
        showResults();
    }
}

startMenu();
 
//giving the user their score

function showResults() {
    console.log(`\n ------ RESULTS ARE IN! ------\n`);

    
    const results = questions.map((q, i) => {
        const userAnswer = userAnswers[i];
        const isCorrect = userAnswer === q.answer;

        return {
            index: i + 1,
            question: q.question,
            userAnswer: userAnswer,
            correctAnswer: q.answer,
            isCorrect: isCorrect
        };
    });

    // show the results
    results.forEach(result => {
        console.log(`${result.index}. ${result.question}`);
        console.log(`   Your answer   : ${result.userAnswer}`);
        console.log(`   Correct answer: ${result.correctAnswer}`);
        console.log(result.isCorrect ? " 🤘 Correct!\n" : " 🚫 Wrong!\n");
    });

    // how many questions were answered correctly
    const correctCount = results.filter(r => r.isCorrect).length;

    console.log(`You got ${correctCount} out of ${questions.length} correct.`);

    function askToPlayAgain() {
    rl.question('\n Do you want to play again? (Yes/No): ', (input) => {
        const answer = input.trim().toLowerCase();

        if (answer === 'yes') {
            // reset state
            currentQuestionIndex = 0;
            userAnswers = [];

            // start over
            askQuestion();
        } else if (answer === 'no') {
            console.log('\n Thanks for playing. Goodbye!');
            rl.close();
        } else {
            console.log("\  Please answer 'Yes' or 'No'.");
            askToPlayAgain(); // ask again
        }
    });
}
    askToPlayAgain();
}