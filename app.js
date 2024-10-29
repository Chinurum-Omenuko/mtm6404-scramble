/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/



const Word = ({ words, onGuess, currentWord, scrambledWord, gameOver, showResetButton}) => {
  const [playerResponse, setPlayerResponse] = React.useState('');
 

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuess(playerResponse);
    setPlayerResponse('');
  };

  return (
  <div className="form">
      <p id="word" style={{ textAlign: 'center' }}>{scrambledWord}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={playerResponse}
          disabled={gameOver || showResetButton}
          onChange={(e) => setPlayerResponse(e.target.value)}
        />
      </form>
      {showResetButton && <button onClick={() => setShowResetButton(true)}>Play Again</button>}
  </div>
  ); }
  










const Score = ({points, strikes}) => {
  
  return (
    <div id="scores">
      <div className="points">{points} points</div>
      <div className="strikes">{strikes} strikes</div>
    </div>

  );
}





const Pass = ({ remainingPasses, onUsePass }) => {
  return (
    <div id="pass">
      <button onClick={onUsePass} disabled={remainingPasses <= 0}>
        Pass ({remainingPasses} left)
      </button>
    </div>
  );
};





const ResetButton = ({ onReset }) => {
  return (
    <button onClick={onReset} id="reset-button">
      Play Again
    </button>
  );
};



const App = () => {
  const [points, setPoints] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [tries, setTries] = React.useState(3);
  const [selectedWord, setSelectedWords] = React.useState(null);
  const [currentWord, setCurrentWord] = React.useState(null);
  const [scrambledWord, setScrambledWord] = React.useState('');
  const [usedWords, setUsedWords] = React.useState([]);
  const [passesRemaining, setPassesRemaining] = React.useState(3);
  const [gameOver, setGameOver] = React.useState(false);
  const [showResetButton, setShowResetButton] = React.useState(false);



  const countries = [
      "iran", "mexico", "canada", "spain", "egypt",
      "france", "china", "hungary", "italy", "japan",
    ];
    

  React.useEffect(() => {
      loadUsedWords();
      chooseWord();

      if (allWordsUsed()) {
          endGame();
      }
  }, []);



  const loadUsedWords = () => {
    const storedWords = localStorage.getItem('usedWords');
    if (storedWords) {
      setUsedWords(JSON.parse(storedWords));
    }
  };

  const saveUsedWords = () => {
    localStorage.setItem('usedWords', JSON.stringify(usedWords));
  };

  const chooseWord = () => {
    const randomIndex = Math.floor(Math.random() * countries.length);
    const chosenWord = countries[randomIndex];
    
    if (!usedWords.includes(chosenWord)) {
      const scrambled = shuffle(chosenWord);
      
      setCurrentWord(chosenWord);
      setScrambledWord(scrambled);
      setUsedWords([...usedWords, chosenWord]);
      saveUsedWords();
    } else {
      setTimeout(() => chooseWord(), 100);
    }
  };
  

  const usePass = () => {
    if (passesRemaining > 0) {
      setPassesRemaining(passesRemaining - 1);
      chooseWord();
    } else {
      alert("No passes left!");
    }
  };

  const checkAnswer = (guess) => {
      if (guess.toLowerCase() === currentWord.toLowerCase()) {
        setPoints(points + 1);
        alert('Correct!');
        
        // Check if all words have been used
        if (usedWords.length === countries.length) {
          endGame();
        } else {
          chooseWord();
        }
      } else {
        setStrikes(strikes + 1);
        alert(`Incorrect. The correct answer was ${currentWord}.`);
        
        if (strikes >= tries) {
          endGame();
        } else {
          chooseWord();
        }
      }
  };
    
  const allWordsUsed = () => {
      return usedWords.length === countries.length;
  };

  const endGame = () => {
    alert(`Game over! Your final score is ${points} points.`);
    setPoints(0);
    setStrikes(0);
    setTries(3);
    setGameOver(true);
    setPassesRemaining(0)
    setShowResetButton(true);
    chooseWord();

  };

  return (
    <div className="container">
      <h1>Welcome to Scramble</h1>
      <Score points={points} strikes={strikes}/>
      <Word 
        words={countries}
        onGuess={checkAnswer}
        currentWord={currentWord}
        scrambledWord={scrambledWord}
        gameOver={gameOver}
      />
      <Pass remainingPasses={passesRemaining} onUsePass={usePass}/>
      {showResetButton && <ResetButton onReset={() => {
        setPoints(0);
        setStrikes(0);
        setTries(3);
        setPassesRemaining(3)
        setGameOver(false);
        setShowResetButton(false);
        chooseWord();
        window.location.reload();
      }} />}

    </div>
  );
};

const container = document.getElementById("app");
const root = ReactDOM.createRoot(container);

root.render(<App />);