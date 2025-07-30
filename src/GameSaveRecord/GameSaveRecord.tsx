import { useEffect, useState } from "react";
import { calculateScore } from "../utils/calculateScore";
import { submitScore } from "../api/leaderboard";

const LOCAL_STORAGE_KEY = "bulls-and-cows-game-record-name";

interface GameSaveRecordProps {
  guesses: number;
  closeModal: () => void;
  fetchLeaderboard: () => void;
}

export default function GameSaveRecord({
  guesses,
  closeModal,
  fetchLeaderboard,
}: GameSaveRecordProps) {
  const [name, setName] = useState("");

  const handleSubmitScore = async () => {
    const time = 0; // todo
    const score = calculateScore({ guesses, time }); // 計算分數
    try {
      await submitScore({
        name,
        guesses,
        time,
        score,
      });

      fetchLeaderboard();
      closeModal();
      localStorage.setItem(LOCAL_STORAGE_KEY, name);
    } catch (error) {
      alert("提交失敗：" + error.message);
    }
  };

  useEffect(() => {
    // 嘗試從 localStorage 獲取之前的名字
    const savedName = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedName) {
      setName(savedName);
    }
  }, []);

  return (
    <div>
      <div className="text-xl font-bold">恭喜您破紀錄了</div>
      <div className="font-medium">請輸入您的姓名，將為您顯示在排行榜上</div>
      <form action="#">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-2 py-1 mt-2 w-full"
        />
      </form>
      <div className="mt-4 text-right">
        <button
          className="mr-4 bg-gray-400 rounded px-4 py-2 font-medium cursor-pointer"
          onClick={closeModal}
        >
          不用了
        </button>
        <button
          className="bg-blue-400 rounded px-4 py-2 font-medium cursor-pointer"
          onClick={handleSubmitScore}
        >
          儲存
        </button>
      </div>
    </div>
  );
}
