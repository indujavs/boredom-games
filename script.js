// Little Break game logic. Each card opens one small game below the cards.
const gameContent = document.querySelector('#game-content');
const playArea = document.querySelector('#play-area');
const playTitle = document.querySelector('#play-title');

document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => openGame(card.dataset.game));
});
document.querySelector('#close-game').addEventListener('click', () => {
  playArea.hidden = true;
  document.querySelector('#games').scrollIntoView({ behavior: 'smooth' });
});

function openGame(game) {
  playArea.hidden = false;
  if (game === 'tic') ticTacToe();
  if (game === 'quiz') characterQuiz();
  if (game === 'rps') rockPaperScissors();
  if (game === 'coin') coinFlip();
  playArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function frame(title, html) {
  playTitle.textContent = title;
  gameContent.innerHTML = `<div class="game-body">${html}</div>`;
}

// TIC-TAC-TOE: the player is X and the computer is O.
function ticTacToe(you = 0, computer = 0) {
  const board = Array(9).fill('');
  let finished = false;
  playTitle.textContent = 'Tic-Tac-Toe';
  gameContent.innerHTML = `<div class="game-body"><p class="game-status" id="status">Your turn — you are X.</p><div class="ttt-board" id="ttt-board"></div><p class="game-status" id="ttt-score">You: ${you}  ·  Computer: ${computer} (first to 10)</p><button class="game-action secondary" id="ttt-reset">Next round</button></div>`;
  const boardElement = document.querySelector('#ttt-board');
  const status = document.querySelector('#status');
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function winner() {
    for (const [a,b,c] of lines) if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
    return board.every(Boolean) ? 'tie' : '';
  }
  function draw() {
    boardElement.innerHTML = board.map((mark, index) => `<button class="ttt-cell ${mark === 'O' ? 'computer' : ''}" data-index="${index}" aria-label="Square ${index + 1}${mark ? `, ${mark}` : ''}">${mark}</button>`).join('');
    boardElement.querySelectorAll('button').forEach(button => button.addEventListener('click', () => move(Number(button.dataset.index))));
  }
  function finishIfNeeded() {
    const result = winner();
    if (!result) return false;
    finished = true;
    if (result === 'X') you++;
    if (result === 'O') computer++;
    if (you >= 10) { you = 0; computer = 0; status.textContent = 'You reached 10 points! The score is back to 0. New game!'; }
    else status.textContent = result === 'tie' ? "It's a tie! Nice game." : result === 'X' ? 'You win this round!' : 'The computer wins this round.';
    document.querySelector('#ttt-score').textContent = `You: ${you}  ·  Computer: ${computer} (first to 10)`;
    return true;
  }
  function move(index) {
    if (finished || board[index]) return;
    board[index] = 'X'; draw();
    if (finishIfNeeded()) return;
    status.textContent = 'Computer is thinking…';
    window.setTimeout(() => {
      // Take a winning move if possible, otherwise block, otherwise pick an open square.
      const findMove = mark => {
        for (const line of lines) {
          const empty = line.filter(i => !board[i]);
          if (empty.length === 1 && line.filter(i => board[i] === mark).length === 2) return empty[0];
        }
        return -1;
      };
      let pick = findMove('O');
      if (pick < 0) pick = findMove('X');
      if (pick < 0) {
        const open = board.map((value, i) => value ? -1 : i).filter(i => i >= 0);
        pick = open[Math.floor(Math.random() * open.length)];
      }
      board[pick] = 'O'; draw();
      if (!finishIfNeeded()) status.textContent = 'Your turn — you are X.';
    }, 350);
  }
  document.querySelector('#ttt-reset').addEventListener('click', () => ticTacToe(you, computer));
  draw();
}

// CHARACTER QUIZ: answer the clue before the computer reveals the answer.
const questions = [
  { clue: 'I live in a pineapple under the sea, and I work at the Krusty Krab. Who am I?', choices: ['SpongeBob', 'Shrek', 'Pikachu'], answer: 'SpongeBob' },
  { clue: 'I am a young wizard with a lightning-shaped scar and round glasses. Who am I?', choices: ['Peter Pan', 'Harry Potter', 'Aladdin'], answer: 'Harry Potter' },
  { clue: 'I am a snowman who loves warm hugs in the kingdom of Arendelle. Who am I?', choices: ['Olaf', 'Baymax', 'Winnie the Pooh'], answer: 'Olaf' },
  { clue: 'I am a super-powered mouse Pokémon who says my own name. Who am I?', choices: ['Sonic', 'Pikachu', 'Stitch'], answer: 'Pikachu' },
  { clue: 'I am an ogre who enjoys his swamp and has a donkey friend. Who am I?', choices: ['Shrek', 'Hulk', 'Gru'], answer: 'Shrek' },
  { clue: 'I am a toy cowboy who says, “There’s a snake in my boot!” Who am I?', choices: ['Woody', 'Buzz Lightyear', 'Lightning McQueen'], answer: 'Woody' },
  { clue: 'I am a space ranger toy who believes he can fly. Who am I?', choices: ['Woody', 'Buzz Lightyear', 'Wall-E'], answer: 'Buzz Lightyear' },
  { clue: 'I am a young lion who grows up to become king of the Pride Lands. Who am I?', choices: ['Simba', 'Mowgli', 'Dumbo'], answer: 'Simba' },
  { clue: 'I am a magical nanny who arrives with an umbrella. Who am I?', choices: ['Cinderella', 'Mary Poppins', 'Tinker Bell'], answer: 'Mary Poppins' },
  { clue: 'I am a mermaid princess who dreams of living on land. Who am I?', choices: ['Moana', 'Ariel', 'Elsa'], answer: 'Ariel' },
  { clue: 'I am a brave young wayfinder who sails across the ocean with Maui. Who am I?', choices: ['Moana', 'Mulan', 'Rapunzel'], answer: 'Moana' },
  { clue: 'I have very long magical hair and leave my tower to explore the world. Who am I?', choices: ['Belle', 'Rapunzel', 'Anna'], answer: 'Rapunzel' },
  { clue: 'I am a friendly alien who becomes best friends with a girl named Lilo. Who am I?', choices: ['Stitch', 'Dobby', 'E.T.'], answer: 'Stitch' },
  { clue: 'I am a small yellow bear who loves honey and lives in the Hundred Acre Wood. Who am I?', choices: ['Paddington', 'Winnie the Pooh', 'Baloo'], answer: 'Winnie the Pooh' },
  { clue: 'I am a clever young detective with a magnifying glass and a famous address on Baker Street. Who am I?', choices: ['Sherlock Holmes', 'Scooby-Doo', 'Tintin'], answer: 'Sherlock Holmes' },
  { clue: 'I am a dog who solves mysteries with my friends and loves Scooby Snacks. Who am I?', choices: ['Snoopy', 'Scooby-Doo', 'Goofy'], answer: 'Scooby-Doo' },
  { clue: 'I am a fast blue hedgehog who loves running and collecting rings. Who am I?', choices: ['Sonic', 'Pikachu', 'Donkey Kong'], answer: 'Sonic' },
  { clue: 'I am a kind robot who helps people and gives very good hugs. Who am I?', choices: ['Wall-E', 'Baymax', 'Optimus Prime'], answer: 'Baymax' },
  { clue: 'I am a small green Jedi who speaks with my words in a different order. Who am I?', choices: ['Yoda', 'Shrek', 'Kermit'], answer: 'Yoda' },
  { clue: 'I am a young girl who follows a white rabbit into a curious fantasy world. Who am I?', choices: ['Alice', 'Dorothy', 'Wendy'], answer: 'Alice' },
  { clue: 'I am a friendly bear from Peru who loves marmalade sandwiches. Who am I?', choices: ['Baloo', 'Paddington', 'Po'], answer: 'Paddington' }
];
function characterQuiz(score = 0, usedQuestions = []) {
  // Use each clue once per run, then start a fresh shuffled-feeling round.
  if (usedQuestions.length === questions.length) usedQuestions = [];
  const available = questions.map((_, index) => index).filter(index => !usedQuestions.includes(index));
  const questionIndex = available[Math.floor(Math.random() * available.length)];
  const question = questions[questionIndex];
  const updatedUsedQuestions = [...usedQuestions, questionIndex];
  frame('Guess the Character', `<p class="quiz-clue">${question.clue}</p><div class="quiz-options">${question.choices.map(choice => `<button data-answer="${choice}">${choice}</button>`).join('')}</div><p class="game-status" id="quiz-status"></p><p class="game-status" id="quiz-score">Your score: ${score} (10 points resets it)</p><button class="game-action secondary" id="quiz-next">Another clue</button>`);
  document.querySelectorAll('.quiz-options button').forEach(button => button.addEventListener('click', () => {
    const status = document.querySelector('#quiz-status');
    if (button.dataset.answer === question.answer) {
      score++;
      if (score >= 10) { score = 0; status.textContent = `Correct! It's ${question.answer}. You reached 10 points, so your score is back to 0! 🎉`; }
      else status.textContent = `You got it! It's ${question.answer}. 🎉`;
      document.querySelector('#quiz-score').textContent = `Your score: ${score} (10 points resets it)`;
    }
    else status.textContent = `Good guess! The answer is ${question.answer}.`;
    document.querySelectorAll('.quiz-options button').forEach(option => option.disabled = true);
  }));
  document.querySelector('#quiz-next').addEventListener('click', () => characterQuiz(score, updatedUsedQuestions));
}

// ROCK, PAPER, SCISSORS: play rounds against a randomly chosen computer move.
function rockPaperScissors() {
  let you = 0;
  let computer = 0;
  const moves = [
    { name: 'Rock', emoji: '✊' },
    { name: 'Paper', emoji: '✋' },
    { name: 'Scissors', emoji: '✌️' }
  ];
  frame('Rock, Paper, Scissors', '<p class="game-status" id="rps-status">Choose your move to start!</p><div class="rps-choices">' + moves.map(move => `<button class="rps-choice" data-move="${move.name}"><span>${move.emoji}</span>${move.name}</button>`).join('') + '</div><p class="game-status" id="rps-score">You: 0 &nbsp;·&nbsp; Computer: 0</p><button class="game-action secondary" id="rps-reset">Reset score</button>');
  document.querySelectorAll('.rps-choice').forEach(button => button.addEventListener('click', () => {
    const playerMove = button.dataset.move;
    const computerMove = moves[Math.floor(Math.random() * moves.length)].name;
    let result;
    if (playerMove === computerMove) result = "It's a tie!";
    else if ((playerMove === 'Rock' && computerMove === 'Scissors') || (playerMove === 'Paper' && computerMove === 'Rock') || (playerMove === 'Scissors' && computerMove === 'Paper')) {
      you++;
      result = 'You win this round!';
    } else {
      computer++;
      result = 'The computer wins this round!';
    }
    if (you >= 10) { you = 0; computer = 0; result = 'You reached 10 points! Both scores are back to 0. New game!'; }
    const playerEmoji = moves.find(move => move.name === playerMove).emoji;
    const computerEmoji = moves.find(move => move.name === computerMove).emoji;
    document.querySelector('#rps-status').textContent = `${playerEmoji} ${playerMove} vs ${computerEmoji} ${computerMove} — ${result}`;
    document.querySelector('#rps-score').textContent = `You: ${you}  ·  Computer: ${computer}`;
  }));
  document.querySelector('#rps-reset').addEventListener('click', rockPaperScissors);
}

// HEADS OR TAILS: choose a side, then flip against the computer.
function coinFlip() {
  frame('Heads or Tails', '<p class="game-status" id="coin-status">Pick a side. Can you call the flip?</p><div class="choices"><button class="choice-button" data-side="Heads">☀ Heads</button><button class="choice-button" data-side="Tails">☾ Tails</button></div><p class="game-status" id="coin-score">You: 0 &nbsp;·&nbsp; Computer: 0</p><button class="game-action secondary" id="coin-reset">Reset score</button>');
  let you = 0, computer = 0;
  document.querySelectorAll('.choice-button').forEach(button => button.addEventListener('click', () => {
    const result = Math.random() < .5 ? 'Heads' : 'Tails';
    if (button.dataset.side === result) you++; else computer++;
    let message = `${result}! ${button.dataset.side === result ? 'You called it!' : 'The computer gets this one.'}`;
    if (you >= 10) { you = 0; computer = 0; message = 'You reached 10 points! Both scores are back to 0. New game!'; }
    document.querySelector('#coin-status').textContent = message;
    document.querySelector('#coin-score').textContent = `You: ${you}  ·  Computer: ${computer}`;
  }));
  document.querySelector('#coin-reset').addEventListener('click', coinFlip);
}
