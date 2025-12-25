import { NextRequest, NextResponse } from "next/server";
import { supabase, LeaderboardEntry } from "@/lib/supabase";

// GET leaderboard entries
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch leaderboard" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet_address, score } = body;

    if (!wallet_address || typeof score !== "number") {
      return NextResponse.json(
        { error: "Missing wallet_address or score" },
        { status: 400 }
      );
    }

    // Check if this wallet already has a score
    const { data: existingEntry } = await supabase
      .from("leaderboard")
      .select("score")
      .eq("wallet_address", wallet_address)
      .single();

    // Only update if score is higher
    if (existingEntry && existingEntry.score >= score) {
      return NextResponse.json({
        message: "Score not higher than existing score",
        data: existingEntry,
      });
    }

    // Upsert (insert or update if exists)
    const { data, error } = await supabase
      .from("leaderboard")
      .upsert(
        {
          wallet_address,
          score,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "wallet_address",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to submit score" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, message: "Score submitted successfully" });
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

