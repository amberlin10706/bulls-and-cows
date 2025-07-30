import { useCallback, useState } from "react";

export function useCountdown() {
  // 計時
  const [time, setTime] = useState(0); // 單位：秒
  const [timerId, setTimerId] = useState(null);

  function startTimer() {
    if (timerId) return; // 如果已經有計時器在運行，則不啟動新的計時器
    const id = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    setTimerId(id);
  }

  const stopTimer = useCallback(() => {
    setTimerId((prevId) => {
      if (prevId) {
        clearInterval(prevId);
      }
      return null;
    });
  }, [setTimerId]);

  const resetTimer = useCallback(() => {
    setTime(0);
    stopTimer();
  }, [stopTimer]);

  return {
    time,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
