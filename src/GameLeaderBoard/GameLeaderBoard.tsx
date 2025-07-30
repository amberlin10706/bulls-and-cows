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
    <div className="pt-3">
      <div className="space-y-3">
        {leaderboard.map((player, idx) => (
          <div className="border rounded py-2 px-4 shadow">
            <div>
              <strong>
                # {idx + 1} {player.name}
              </strong>
            </div>
            <div className="text-sm">猜測次數：{player.guesses} 次</div>
            <div className="text-sm">花費時間：{formatTime(player.time)}</div>
            <div className="text-sm">分數：{player.score}</div>
            <div className="text-sm">
              遊戲時間：
              {new Date(player.created_at).toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-sm text-gray-600">
        <div>*排名計算方式</div>
        <div>每猜一次多10分，每過10秒多1分。</div>
        <div>分數越低排名越高，若分數相同則按時間排序。</div>
      </div>
    </div>
  );
}
