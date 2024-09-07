// App.js

import './App.css';
import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import StartGame from './components/StartGame/StartGame';
import click from "./assets/click.mp3"
// import restartsound from "./assets/game.mp3"

function App() {
  const [game, setGame] = useState(new Chess());
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (game) {
        const audio = new window.Audio(click);
        audio.volume = 1.0; 
        audio.play().catch(error => {
            console.error("Failed to play audio:", error);
        });
    }
}, [game]);

  // Let's perform a function on the game state
  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  // Movement of computer
  function makeRandomMove() {
    const possibleMove = game.moves();

    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMove.length === 0) {
      setGameOver(true);
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      setWinner(winner);
      return;
    }

    // select random move
    const randomIndex = Math.floor(Math.random() * possibleMove.length);
    // play random move
    safeGameMutate((game) => {
      game.move(possibleMove[randomIndex]);
    });
  }

  // Perform an action when a piece is dropped by a user
  function onDrop(source, target) {
    if (gameOver) return false;

    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: source,
        to: target,
        promotion: 'q',
      });
    });
    // illegal move
    if (move === null) return false;
    // valid move
    setTimeout(makeRandomMove, 1000);
    return true;
  }

  // Reset the game
  function restartGame() {
    setGame(new Chess());
    setGameOver(false);
    setWinner(null);
  }

  // Listen for Enter key press to restart the game
  useEffect(() => {
    function handleKeyPress(event) {
      if (event.key === 'Enter') {
        restartGame();
      }
    }
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);


  //rules of the game
  const shoot = () => {
    alert("1. उद्देश्य: आपके राजा को शह और मात से बचाते हुए विरोधी के राजा को शह और मात देना है।\n\
      2. मूवमेंट: प्रत्येक मोहरे की चाल अलग होती है। जैसे प्यादा सीधा चलता है, हाथी सीधी लाइन में चलता है, ऊँट तिरछी दिशा में, घोड़ा 'L' आकार में चलता है, और रानी किसी भी दिशा में चल सकती है।\n\
      3. बारी: खिलाड़ी बारी-बारी से एक मोहरा चलाते हैं।\n\
      4. शह: जब राजा खतरे में हो, तो उसे 'शह' कहते हैं। इस स्थिति में राजा को बचाने के लिए आपको चाल चलनी होगी।\n\
      5. शह और मात: जब राजा शह से नहीं बच सकता, तो उसे 'शह और मात' कहते हैं, और खेल खत्म हो जाता है।\n\
      6. खेल का अंत: अगर राजा को शह और मात दी जाती है या दोनों खिलाड़ियों के पास पर्याप्त चालें नहीं बची होतीं, तो खेल खत्म हो जाता है।"
    );
      
  }

  return (
    <div className="app">
      <StartGame />
      <div className="header">
        <div className="game-info">
          <h1>Chess.Com</h1>
        </div>
      </div>
      <h2 className='show' onClick={shoot}>Game rules</h2>
      <div className="chessboard-container">
        <Chessboard position={game.fen()} onPieceDrop={onDrop} />
        {gameOver && (
          <div className="game-over">
            <p className='over'>Game Over</p>
            <p>Winner: {winner}</p>
            <p>Press Enter to restart</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
