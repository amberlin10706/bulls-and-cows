import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import confetti from "canvas-confetti";

function generateAnswer(length) {
  const digits = [];
  while (digits.length < length) {
    const r = Math.floor(Math.random() * 10);
    if (!digits.includes(r)) digits.push(r);
  }
  return digits;
}

function getResult(answer, guess) {
  let A = 0, B = 0;
  const answerMap = {};
  answer.forEach((num, i) => {
    if (num === guess[i]) {
      A++;
    } else {
      answerMap[num] = (answerMap[num] || 0) + 1;
    }
  });

  guess.forEach((num, i) => {
    if (num !== answer[i] && answerMap[num]) {
      B++;
      answerMap[num]--;
    }
  });

  return `${A}A${B}B`;
}

export default function App() {
  const [size, setSize] = useState(4);
  const [digits, setDigits] = useState([]);
  const inputsRef = useRef([]);
  const [answer, setAnswer] = useState([]);
  const [logs, setLogs] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setAnswer(generateAnswer(size));
    setDigits(Array(size).fill(""));
    setLogs([]);
  }, [size]);

  const handleChange = (value, index) => {
    const digit = value.slice(-1) // 只取最後一個字符

    if (!/^\d?$/.test(digit)) return

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // 自動聚焦到下一個輸入框
    if (digit && index < size - 1) {
      inputsRef.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      // 按下 Enter 鍵提交
      handleSubmit();
      return
    }
    if (e.key === "Backspace" && digits[index] === "" && index > 0) {
      // 如果當前輸入框是空的，則聚焦到前一個輸入框
      inputsRef.current[index - 1].focus();
    }
  }

  const handleSubmit = () => {
    if (finished) return;

    if (digits.some(d => d === "")) {
      alert("請填寫所有數字！");
      return;
    }

    if (new Set(digits).size < size) {
      alert("數字不能重複！");
      return;
    }

    const result = getResult(answer, digits.map(Number));
    const newLog = { guess: digits, result };

    setLogs([...logs, newLog]);
    setDigits(Array(size).fill(""));

    if (result === `${size}A0B`) {
      setFinished(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      // 聚焦到第一個輸入框
      inputsRef.current[0].focus();
    }
  };

  const handleRestart = () => {
    setAnswer(generateAnswer(size));
    setDigits(Array(size).fill(""));
    setLogs([]);
    setFinished(false);
  };

  return (
    <div className="container">
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
        columnGap: "1rem",
      }}>
        <h1>猜數字遊戲</h1>
        <select
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          style={{
            fontSize: "1rem",
            padding: "0.3rem 0.6rem",
            borderRadius: "6px",
            border: "1px solid #ccc"
        }}
        >
          <option value={3}>3 位數</option>
          <option value={4}>4 位數</option>
          <option value={5}>5 位數</option>
        </select>
      </div>
      <div>
        {
          digits.map((val, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={val}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              disabled={finished}
              inputMode={"numeric"}
              style={{
                width: "40px",
                height: "40px",
                fontSize: "1.5rem",
                textAlign: "center",
                border: "1px solid #ccc",
                borderRadius: "8px",
                margin: "0 0.2rem",
              }}
            />
          ))
        }
      </div>

      <button onClick={handleSubmit} disabled={finished}>猜！</button>

      <ul>
        {logs.map((log, i) => (
          <li key={i}>
            第 {i + 1} 次：{log.guess} → {log.result}
          </li>
        ))}
      </ul>

      {finished && <p>🎉 恭喜你猜對了！答案是：{answer.join("")}</p>}

      {finished && <button onClick={handleRestart}>重新開始</button>}
    </div>
  );
}
