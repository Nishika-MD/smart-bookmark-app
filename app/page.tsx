"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  useEffect(() => {
    if (user) fetchBookmarks();
  }, [user]);

  const addBookmark = async () => {
    if (!title || !url) return;

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
    fetchBookmarks();
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  const filtered = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle =
    "px-4 py-3 rounded-lg border w-full outline-none transition placeholder-opacity-100 " +
    (dark
      ? "bg-white/5 text-white border-white/10 placeholder-gray-400 focus:ring-2 focus:ring-[#6B90A8]"
      : "bg-white/80 text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-[#135E8A]");

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A2540]">
        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: "google" })
          }
          className="bg-white text-[#0A2540] px-6 py-3 rounded-lg text-lg hover:scale-105 transition"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition duration-500 relative overflow-hidden ${
        dark
          ? "bg-gradient-to-br from-[#0A2540] via-[#0E3A5D] to-[#020617]"
          : "bg-gradient-to-br from-[#E6F2F7] via-[#DCEFF6] to-[#F8FDFF]"
      }`}
    >
      {/* 🌊 Animated aqua glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow glow1"></div>
        <div className="glow glow2"></div>
      </div>

      <div className="w-full max-w-xl px-4 animate-fadeIn relative">

        {/* GLASS CARD */}
        <div
          className={`relative rounded-3xl p-10 space-y-8 backdrop-blur-xl border transition transform hover:-translate-y-2 hover:scale-[1.01] ${
            dark
              ? "bg-white/5 border-white/10 shadow-[0_30px_80px_rgba(19,94,138,0.35)] text-white"
              : "bg-white/80 border-white/60 shadow-[0_30px_80px_rgba(19,94,138,0.18)] text-gray-900"
          }`}
        >
          {/* ✨ Glass shine reflection */}
          <div className="shine"></div>

          {/* 🏆 HERO HEADER */}
          <div className="space-y-3 pb-3 border-b border-white/20">

            {/* 🔷 Logo Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#135E8A] to-[#0E3A5D] flex items-center justify-center text-white font-bold text-lg shadow-md">
                SB
              </div>
              <span className="font-semibold tracking-wide text-sm opacity-80">
                Smart Bookmark
              </span>
            </div>

            <h1
              className={`text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-[#0A2540] to-[#135E8A] bg-clip-text text-transparent ${
                dark && "drop-shadow-[0_0_12px_rgba(19,94,138,0.6)]"
              }`}
            >
              Welcome
            </h1>

            <p className={`${dark ? "text-[#B8CAD6]" : "text-[#0E3A5D]"} text-lg`}>
              {user.email}
            </p>

          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="px-4 py-2 rounded-lg bg-[#135E8A] text-white hover:bg-[#0E3A5D] shadow-md transition"
            >
              {dark ? "Light" : "Dark"}
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 shadow-md transition"
            >
              Logout
            </button>
          </div>

          {/* INPUTS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputStyle}
            />

            <input
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputStyle}
            />

            <button
              onClick={addBookmark}
              className="bg-[#135E8A] text-white px-6 py-3 rounded-lg hover:bg-[#0E3A5D] shadow-lg transition whitespace-nowrap sm:w-auto w-full"
            >
              Add
            </button>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <input
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputStyle} pl-10`}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B90A8]">
              🔍
            </span>
          </div>

        </div>
      </div>

      {/* ✨ ANIMATIONS */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.7s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .glow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.35;
          animation: floatGlow 14s ease-in-out infinite alternate;
        }

        .glow1 {
          background: #135e8a;
          top: -120px;
          left: -120px;
        }

        .glow2 {
          background: #6b90a8;
          bottom: -140px;
          right: -120px;
          animation-delay: 4s;
        }

        @keyframes floatGlow {
          from {
            transform: translateY(0) translateX(0);
          }
          to {
            transform: translateY(40px) translateX(30px);
          }
        }

        .shine {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: linear-gradient(
            120deg,
            transparent 40%,
            rgba(255,255,255,0.25),
            transparent 60%
          );
          opacity: 0.35;
          animation: shineMove 6s infinite;
        }

        @keyframes shineMove {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}








