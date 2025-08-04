import confetti from "canvas-confetti";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { getLeaderboards } from "./api/leaderboard.js";
import { useCountdown } from "./composable/useCountdown.js";
import GameLeaderBoard from "./GameLeaderBoard/GameLeaderBoard.tsx";
import GameSaveRecord from "./GameSaveRecord/GameSaveRecord.js";
import Header from "./header/Header.js";
import Modal from "./Modal/Modal.js";
import { calculateScore } from "./utils/calculateScore.js";
import { formatTime } from "./utils/formatTime.js";

function generateAnswer(length) {
  const digits = [];
  while (digits.length < length) {
    const r = Math.floor(Math.random() * 10);
    if (!digits.includes(r)) digits.push(r);
  }
  return digits;
}

function getResult(answer, guess) {
  let A = 0,
    B = 0;
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
  const [isOpenBoard, setIsOpenBoard] = useState(false);
  const [isOpenSaveRecord, setIsOpenSaveRecord] = useState(false);

  const [leaderboard, setLeaderboard] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const data = await getLeaderboards();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      alert("無法獲取排行榜，請稍後再試。");
    }
  };

  useEffect(() => {
    fetchLeaderboard().catch();
  }, []);

  const handleChange = (value, index) => {
    const digit = value.slice(-1); // 只取最後一個字符

    if (!/^\d?$/.test(digit)) return;

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // 自動聚焦到下一個輸入框
    if (digit && index < size - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      // 按下 Enter 鍵提交
      handleSubmit();
      return;
    }
    if (e.key === "Backspace" && digits[index] === "" && index > 0) {
      // 如果當前輸入框是空的，則聚焦到前一個輸入框
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    if (finished) return;

    if (digits.some((d) => d === "")) {
      alert("請填寫所有數字！");
      return;
    }

    if (new Set(digits).size < size) {
      alert("數字不能重複！");
      return;
    }

    startTimer();

    const result = getResult(answer, digits.map(Number));
    const newLog = { guess: digits, result };

    const newLogs = [...logs, newLog];
    setLogs(newLogs);
    setDigits(Array(size).fill(""));

    if (result === `${size}A0B`) {
      setFinished(true);
      stopTimer();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      const score = calculateScore({ guesses: newLogs.length, time: 0 }); // 計算分數

      if (leaderboard.length >= 5) {
        const lastScore = leaderboard[leaderboard.length - 1]?.score;
        if (score >= lastScore) {
          // 如果分數沒小於第五名則不開啟保存記錄的對話框
          return;
        }
      }

      setIsOpenSaveRecord(true);
    } else {
      // 聚焦到第一個輸入框
      inputsRef.current[0].focus();
    }
  };

  const { time, startTimer, stopTimer, resetTimer } = useCountdown();

  const handleRestart = useCallback(() => {
    setAnswer(generateAnswer(size));
    setDigits(Array(size).fill(""));
    setLogs([]);
    setFinished(false);
    resetTimer();
  }, [size, resetTimer]);

  useEffect(() => {
    handleRestart();
  }, [handleRestart, size]);

  return (
    <div className="flex flex-col items-center">
      <Modal
        title="排行榜"
        isOpen={isOpenBoard}
        onClose={() => setIsOpenBoard(false)}
      >
        <GameLeaderBoard leaderboard={leaderboard} />
      </Modal>
      <Modal
        isOpen={isOpenSaveRecord}
        onClose={() => setIsOpenSaveRecord(false)}
        showClose={false}
      >
        <GameSaveRecord
          time={time}
          guesses={logs.length}
          fetchLeaderboard={fetchLeaderboard}
          openLeaderboard={() => setIsOpenBoard(true)}
          closeModal={() => setIsOpenSaveRecord(false)}
        />
      </Modal>

      <Header
        title="猜數字"
        renderLeft={() => (
          <select
            name="size-select"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            style={{
              fontSize: "1rem",
              padding: "0.3rem 0.6rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value={3}>3 位數</option>
            <option value={4}>4 位數</option>
            <option value={5}>5 位數</option>
          </select>
        )}
        renderRight={() => (
          <button
            className="text-blue-700 font-medium cursor-pointer"
            onClick={() => setIsOpenBoard(true)}
          >
            排行榜
          </button>
        )}
      />

      <div className="pt-5">
        <div className="mb-4 text-center">
          開始計時：
          <span className="font-mono">{formatTime(time)}</span>
        </div>

        <div className="mb-4 text-center">
          <ul>
            {logs.map((log, idx) => (
              <li
                key={idx}
                style={{
                  fontFamily: "monospace",
                  fontSize: "1rem",
                }}
              >
                <span className="w-16 inline-flex justify-between">
                  <span>第</span>
                  <span>{idx + 1}</span>
                  <span>次</span>
                </span>
                ：{log.guess} → {log.result}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center">
          {digits.map((val, i) => (
            <input
              className="digit-input"
              name={`digit-${i}`}
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={val}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              disabled={finished}
              inputMode={"numeric"}
            />
          ))}
        </div>
      </div>

      <button
        className="my-4 bg-blue-400 rounded px-4 py-2 font-medium cursor-pointer"
        onClick={handleSubmit}
        disabled={finished}
      >
        猜！
      </button>

      {finished && (
        <p>
          🎉 恭喜你猜對了！答案是：<b>{answer.join("")}</b>
        </p>
      )}

      {finished && (
        <button
          className="my-4 bg-red-400 rounded px-4 py-2 font-medium cursor-pointer"
          onClick={handleRestart}
        >
          重新開始
        </button>
      )}
    </div>
  );
}
