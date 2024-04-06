import React, { useState, useEffect } from 'react';
import './AimTrainer.css';

function AimTrainer() {
  const [score, setScore] = useState(0);
  const [targetPosition, setTargetPosition] = useState({
    top: -100,
    left: -100
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameDuration, setGameDuration] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [targetSize, setTargetSize] = useState(30); // Default target size
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy'); // Default selected difficulty

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }

    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft]);

  const generateTarget = () => {
    let randomPosition;
    do {
      randomPosition = {
        top: Math.random() * (window.innerHeight - 100),
        left: Math.random() * (window.innerWidth - 100)
      };
      const distance = Math.sqrt(
        Math.pow(randomPosition.top - targetPosition.top, 2) +
        Math.pow(randomPosition.left - targetPosition.left, 2)
      );
      if (distance > 100) {
        setTargetPosition(randomPosition);
        break;
      }
    } while (true);
  };

  const startGame = () => {
    setScore(0);
    const duration = parseInt(inputValue.trim());
    setGameDuration(duration);
    setTimeLeft(duration);
    setGameStarted(true);
    generateTarget();
  };

  const handleTargetClick = () => {
    setScore(score + 1);
    generateTarget();
  };

  const endGame = () => {
    setGameStarted(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleStartButtonClick = () => {
    if (inputValue.trim() !== '') {
      startGame();
    }
  };

  const handleDifficultyChange = (event) => {
    const difficulty = event.target.value;
    setSelectedDifficulty(difficulty);
    setTargetSizeByMode(difficulty);
  };

  const setTargetSizeByMode = (mode) => {
    switch (mode) {
      case 'easy':
        setTargetSize(80); // Change target size for easy mode
        break;
      case 'normal':
        setTargetSize(40); // Change target size for normal mode
        break;
      case 'hard':
        setTargetSize(20); // Change target size for hard mode
        break;
      default:
        setTargetSize(40); // Default target size
        break;
    }
  };

  return (
    <div className="AimTrainer">
      <h1>AimTrainer</h1>
      {!gameStarted && (
        <div>
          <input
            type="number"
            placeholder="Enter game time (seconds)"
            value={inputValue}
            onChange={handleInputChange}
            style={{ width: 200 }}
          />
          <button onClick={handleStartButtonClick} style={{ margin: 10 }}>Start Game</button>
        </div>
      )}
      {gameStarted && (
        <>
          <p>Time Left: {timeLeft} seconds</p>
          <p>Click to hit the target!</p>
          <div
            className="target"
            style={{
              top: targetPosition.top,
              left: targetPosition.left,
              width: targetSize,
              height: targetSize
            }}
            onClick={handleTargetClick}
          ></div>
          <div className="score">Score: {score}</div>
        </>
      )}
      {!gameStarted && timeLeft === 0 && score !== 0 && (
        <div className="score">Game Over! Total Score: {score}</div>
      )}
      {!gameStarted && (
        <div>
          <p>Select difficulty:</p>
          <div>
            <input type="radio" id="difficulty-easy" name="difficulty" value="easy" checked={selectedDifficulty === 'easy'} onChange={handleDifficultyChange} />
            <label htmlFor="difficulty-easy">Easy</label>
          </div>
          <div>
            <input type="radio" id="difficulty-normal" name="difficulty" value="normal" checked={selectedDifficulty === 'normal'} onChange={handleDifficultyChange} />
            <label htmlFor="difficulty-normal">Normal</label>
          </div>
          <div>
            <input type="radio" id="difficulty-hard" name="difficulty" value="hard" checked={selectedDifficulty === 'hard'} onChange={handleDifficultyChange} />
            <label htmlFor="difficulty-hard">Hard</label>
          </div>
        </div>
      )}
    </div>
  );
}

export default AimTrainer;