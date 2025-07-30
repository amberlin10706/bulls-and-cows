import { supabase } from "../supabase";

export async function getLeaderboards() {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("score", { ascending: true })
    .limit(5);

  if (error) {
    throw error;
  } else {
    return data;
  }
}

export async function submitScore({
  name,
  guesses,
  time,
  score,
}: {
  name: string;
  guesses: number;
  time: number;
  score: number;
}) {
  const { error } = await supabase
    .from("leaderboard")
    .insert([{ name, guesses, time, score }]);

  if (error) {
    throw error;
  }
}
