import React, { useState, useEffect } from 'react';

export default function SpellingGame() {
  const [nickname, setNickname] = useState('');
  const [hasNickname, setHasNickname] = useState(false);
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [newWord, setNewWord] = useState('');
  const [wordPool, setWordPool] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const savedWords = JSON.parse(localStorage.getItem('words'));
    const initialWords = savedWords?.length ? savedWords : ['apple','banana','orange'];
    setWords(initialWords);
    setWordPool(initialWords);
    setLeaderboard(JSON.parse(localStorage.getItem('leaderboard')) || []);
  }, []);

  useEffect(() => {
    if (wordPool.length > 0) {
      setCurrentWord(wordPool[Math.floor(Math.random() * wordPool.length)]);
    }
  }, [wordPool]);

  useEffect(() => {
    localStorage.setItem('words', JSON.stringify(words));
  }, [words]);

  const gameOver = () => {
    new Audio('/gameover.mp3').play();
    alert('Game Over! 分數: ' + score);

    const updated = [...leaderboard, { name: nickname, score }]
      .sort((a,b)=>b.score - a.score)
      .slice(0,10);

    setLeaderboard(updated);
    localStorage.setItem('leaderboard', JSON.stringify(updated));

    // 重置（不選新字）
    setScore(0);
    setLives(3);
  };

  const nextWord = () => {
    if (wordPool.length === 0) return;
    setCurrentWord(wordPool[Math.floor(Math.random() * wordPool.length)]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.toLowerCase() === currentWord.toLowerCase()) {
      new Audio('/correct.mp3').play();
      setScore(s => s + 1);
      nextWord();
    } else {
      new Audio('/gameover.mp3').play();

      setLives(prev => {
        const next = prev - 1;

        if (next <= 0) {
          // ⭐ 先顯示 0 顆心，再 GameOver
          setTimeout(() => gameOver(), 100);
          return 0;
        }

        return next;
      });
    }

    setInput('');
  };

  const handleAddWord = () => {
    const trimmed = newWord.trim();
    if (trimmed && !words.includes(trimmed)) {
      const updated = [...words, trimmed];
      setWords(updated);
      setWordPool(updated);
      setNewWord('');
    }
  };

  const handleDeleteWord = (w) => {
    const updated = words.filter(word => word !== w);
    setWords(updated);
    setWordPool(updated);
  };

  const handleStart = () => {
    if (!nickname.trim()) {
      alert('請輸入暱稱');
      return;
    }
    setHasNickname(true);
  };

  if (!hasNickname) {
    return (
      <div style={styles.centerScreen}>
        <div style={styles.card}>
          <h1>拼字遊戲</h1>
          <input style={styles.input} value={nickname} onChange={e=>setNickname(e.target.value)} />
          <button style={styles.button} onClick={handleStart}>開始遊戲</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.layout}>
      <div style={styles.side}>
        <h3>單字庫</h3>
        {words.map((w,i)=>(
          <div key={i}>
            {w}
            <button style={styles.del} onClick={()=>handleDeleteWord(w)}>刪除</button>
          </div>
        ))}
        <input style={styles.input} value={newWord} onChange={e=>setNewWord(e.target.value)} />
        <button style={styles.button} onClick={handleAddWord}>新增</button>
      </div>

      <div style={styles.center}>
        <h1>拼字遊戲</h1>
        <p>分數: {score} ｜ 生命值: {'❤️'.repeat(lives)}</p>
        <p>請拼出: <strong>{currentWord}</strong></p>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} value={input} onChange={e=>setInput(e.target.value)} />
          <button style={styles.button}>確認</button>
        </form>
      </div>

      <div style={styles.side}>
        <h3>排行榜</h3>
        {leaderboard.map((e,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between'}}>
            <span>{e.name}</span>
            <span>{e.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  centerScreen:{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'},
  layout:{display:'flex',height:'100vh'},
  side:{width:'25%',padding:'1rem',background:'#fff'},
  center:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'},
  card:{background:'#fff',padding:'2rem'},
  input:{padding:'0.5rem',margin:'0.25rem 0',width:'100%'},
  button:{padding:'0.5rem 1rem'},
  del:{marginLeft:'0.5rem'}
};
