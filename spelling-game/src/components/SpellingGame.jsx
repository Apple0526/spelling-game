import React, { useState } from "react";
import correctSound from "../assets/correct.mp3";

const SpellingGame = () => {
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const audio = new Audio(correctSound);

  const word = "蘋果"; // 中文題目
  const checkAnswer = () => {
    if (answer === word) {
      setMessage("答對了！");
      audio.play();
    } else {
      setMessage("再試一次！");
    }
  };

  return (
    <div className="game-container">
      <h1>拼字遊戲</h1>
      <p>請將英文單字對應成中文: apple → ?</p>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button onClick={checkAnswer}>檢查答案</button>
      <p>{message}</p>

      <style>{
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }

        @keyframes scaleUp {
          0% { transform: scale(1); color: #4f46e5; }
          50% { transform: scale(1.5); color: #22c55e; }
          100% { transform: scale(1); color: #4f46e5; }
        }

        .game-container button:active {
          animation: scaleUp 0.3s ease;
        }

        .game-container input:invalid {
          animation: shake 0.3s ease;
        }
      }</style>
    </div>
  );
};

export default SpellingGame;
