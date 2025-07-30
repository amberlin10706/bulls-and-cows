// supabase.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mirleyricxpbiflejtan.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcmxleXJpY3hwYmlmbGVqdGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTgxNzYsImV4cCI6MjA2OTQzNDE3Nn0.YaFca3G84MBE6tw2A0z7_CZhX3hmdnXj8rVzar_6HFM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
