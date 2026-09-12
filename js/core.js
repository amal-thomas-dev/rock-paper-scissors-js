/**
 * CORE LOGIC – ROCK, PAPER, SCISSORS
 * All game rules, input handling, and the main loop.
 * Relies on UI functions from ui.js (loaded first).
 */

const VALID_CHOICES = ['Rock', 'Paper', 'Scissors'];
const VALID_CHOICES_LOWER = VALID_CHOICES.map((choice) => choice.toLowerCase());

const WIN_CONDITIONS = {
  Rock: 'Scissors',
  Paper: 'Rock',
  Scissors: 'Paper',
};

// ---------- COMPUTER LOGIC ----------

function computerPlay() {
  const randomIndex = Math.floor(Math.random() * VALID_CHOICES.length);
  return VALID_CHOICES[randomIndex];
}

// ---------- ROUND LOGIC ----------

function playRound(playerSelection, computerSelection) {
  if (playerSelection === computerSelection) {
    return {
      result: 'draw',
      title: 'DRAW!',
      detail: `Both chose ${playerSelection}.`,
    };
  }

  if (WIN_CONDITIONS[playerSelection] === computerSelection) {
    return {
      result: 'player',
      title: 'YOU WIN!',
      detail: `${playerSelection} beats ${computerSelection}.`,
    };
  }

  return {
    result: 'computer',
    title: 'YOU LOSE!',
    detail: `${computerSelection} beats ${playerSelection}.`,
  };
}

// ---------- GAME TAUNTS ----------
function getTaunt(playerScore, computerScore) {
  if (playerScore === 2 && computerScore === 2) {
    return 'One move decides it all — your salvation, or my dominion.';
  }
  if (playerScore === 2 && computerScore < 2) {
    return "You're... winning? Impossible. I must recalibrate!";
  }
  if (computerScore === 2 && playerScore < 2) {
    return 'One more win and humanity falls. Choose carefully, human.';
  }
  return null;
}

// ---------- PLAYER INPUT ----------

function getPlayerChoice(roundNumber, playerScore, computerScore) {
  let errorHint = '';

  while (true) {
    let promptMessage = `⚔️ ROUND ${roundNumber}\n`;
    promptMessage += `📊 Score – You: ${playerScore} | AI: ${computerScore}\n\n`;
    const taunt = getTaunt(playerScore, computerScore);

    if (taunt) {
      promptMessage += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      promptMessage += `🤖 AI: ${taunt}\n`;
      promptMessage += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    promptMessage += `Enter your move:\n`;
    promptMessage += `   • Rock\n   • Paper\n   • Scissors\n\n`;

    if (errorHint) {
      promptMessage += `⚠️ ${errorHint}\n\n`;
      errorHint = '';
    }

    promptMessage += `(Type your choice and press OK. Press Cancel to quit.)`;

    const rawInput = prompt(promptMessage);

    if (rawInput === null) {
      return null;
    }

    const sanitized = rawInput.trim().toLowerCase();
    const index = VALID_CHOICES_LOWER.indexOf(sanitized);

    if (index !== -1) {
      return VALID_CHOICES[index];
    }

    console.warn(
      `⚠️ Invalid input: "${rawInput}" – please enter Rock, Paper, or Scissors.`,
    );
    errorHint = `"${rawInput}" is not a valid choice. Try again.`;
  }
}

// ---------- MAIN GAME ----------

function game() {
  showIntro();

  let playerScore = 0;
  let computerScore = 0;
  let roundNumber = 0;
  const roundHistory = [];

  while (playerScore < 3 && computerScore < 3) {
    roundNumber++;

    showRoundStart(roundNumber === 1, roundNumber);

    console.log(`\n--- ROUND ${roundNumber} ---`);

    const playerChoice = getPlayerChoice(
      roundNumber,
      playerScore,
      computerScore,
    );
    if (playerChoice === null) {
      console.log('🚪 GAME ABORTED: You cancelled. The AI is disappointed.');
      alert(
        '😅 You quit! Humanity survives another day. Refresh to try again.',
      );
      return;
    }

    const computerChoice = computerPlay();

    console.log(`🧑 You chose: ${playerChoice}`);
    console.log(`🤖 Computer chose: ${computerChoice}`);

    const roundResult = playRound(playerChoice, computerChoice);

    roundHistory.push({
      round: roundNumber,
      playerChoice,
      computerChoice,
      result: roundResult.result,
    });

    if (roundResult.result === 'player') {
      playerScore++;
      displayBox(roundResult.title, roundResult.detail, 'win');
    } else if (roundResult.result === 'computer') {
      computerScore++;
      displayBox(roundResult.title, roundResult.detail, 'lose');
    } else {
      displayBox(roundResult.title, roundResult.detail, 'draw');
    }

    console.log(`📊 Score → You: ${playerScore} | AI: ${computerScore}`);
  }

  if (playerScore === 3) {
    displayBox(
      'HUMANITY WINS!',
      'You saved the world from the evil AI!',
      'finalWin',
    );
  } else {
    displayBox('AI TAKES OVER!', 'Better luck next time, human.', 'finalLose');
  }

  displaySummary(roundHistory, playerScore, computerScore);

  alert(
    '🏁 GAME FINISHED!\n\n' +
      'The war is over. The fate of humanity has been decided.\n' +
      '📢 The winner and final score are now shown in the console.\n\n' +
      '🔄 Refresh the page to play again.\n\n' +
      'Click OK to close this message.',
  );
}

// Start the game when the page loads.
game();
