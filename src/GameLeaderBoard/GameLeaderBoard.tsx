export type LeaderboardResponse = {
  id: number;
  name: string;
  guesses: number;
  time: number;
  score: number;
  created_at: string;
};

interface GameLeaderBoardProps {
  leaderboard: LeaderboardResponse[];
}

function formatTime(second: number): string {
  const minutes = Math.floor(second / 60);
  const seconds = second % 60;

  return `${String(minutes).padStart(2, "0")}分${String(seconds).padStart(2, "0")}秒`;
}

export default function GameLeaderBoard({ leaderboard }: GameLeaderBoardProps) {
  return (
    <div>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>排名</th>
            <th>玩家</th>
            <th>猜測次數</th>
            <th>花費時間</th>
            <th>分數</th>
            <th>遊戲時間</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, idx) => (
            <tr key={player.id}>
              <td>{idx + 1}</td>
              <td>{player.name}</td>
              <td>{player.guesses} 次</td>
              <td>{formatTime(player.time)}</td>
              <td>{player.score}</td>
              <td>
                {new Date(player.created_at).toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-sm text-gray-600">
        <div>*排名計算方式</div>
        <div>每猜一次多10分，每過10秒多1分。</div>
        <div>分數越低排名越高，若分數相同則按時間排序。</div>
      </div>
    </div>
  );
}
