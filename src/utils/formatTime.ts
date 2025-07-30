export function formatTime(second: number): string {
  const minutes = Math.floor(second / 60);
  const seconds = second % 60;

  return `${String(minutes).padStart(2, "0")}分${String(seconds).padStart(2, "0")}秒`;
}
