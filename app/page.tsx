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

  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  const inputStyle =
    "px-4 py-3 rounded-lg border w-full outline-none transition placeholder-opacity-100 " +
    (dark
      ? "bg-white/5 text-white border-white/10 placeholder-gray-400 focus:ring-2 focus:ring-[#6B90A8]"
      : "bg-white/85 text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-[#135E8A]");

  // 🌟 SIGN-IN PAGE (CREATIVE)
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#135E8A] to-[#0E3A5D]">

        {/* glowing lights */}
        <div className="absolute glow glow1"></div>
        <div className="absolute glow glow2"></div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 text-center space-y-6 text-white max-w-md">

          <h1 className="text-3xl font-bold">Smart Bookmark</h1>

          <p className="text-sm opacity-90">
            “Organize your knowledge.  
            Save what matters.  
            Build your digital memory.”
          </p>

          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({ provider: "google" })
            }
            className="bg-white text-[#0A2540] px-6 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
        dark
          ? "bg-gradient-to-br from-[#0A2540] via-[#0E3A5D] to-[#020617]"
          : "bg-gradient-to-br from-[#E6F2F7] via-[#DCEFF6] to-[#F8FDFF]"
      }`}
    >
      {/* aqua glow */}
      <div className="absolute glow glow1"></div>
      <div className="absolute glow glow2"></div>

      <div className="w-full max-w-xl px-4 relative">

        <div
          className={`relative rounded-3xl p-10 space-y-8 backdrop-blur-xl border transition ${
            dark
              ? "bg-white/5 border-white/10 shadow-[0_30px_80px_rgba(19,94,138,0.35)] text-white"
              : "bg-white/80 border-white/60 shadow-[0_30px_80px_rgba(19,94,138,0.18)] text-gray-900"
          }`}
        >

          {/* 🌟 Animated Welcome */}
          <div className="space-y-3 pb-3 border-b border-white/20">
            <h1 className="welcomeText">
              Welcome
            </h1>

            <p className={`${dark ? "text-[#B8CAD6]" : "text-[#0E3A5D]"} text-lg`}>
              {user.email}
            </p>
          </div>

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

          {/* inputs */}
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
              className="bg-[#135E8A] text-white px-6 py-3 rounded-lg hover:bg-[#0E3A5D] shadow-lg transition"
            >
              Add
            </button>
          </div>

          {/* search */}
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

      {/* ✨ CSS ANIMATIONS */}
      <style jsx>{`
        .welcomeText {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(90deg, #0a2540, #135e8a, #6b90a8);
          -webkit-background-clip: text;
          color: transparent;
          animation: shimmer 4s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: -300px; }
          100% { background-position: 300px; }
        }

        .glow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.35;
          animation: floatGlow 12s ease-in-out infinite alternate;
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
          animation-delay: 3s;
        }

        @keyframes floatGlow {
          from { transform: translateY(0) translateX(0); }
          to { transform: translateY(40px) translateX(30px); }
        }
      `}</style>
    </div>
  );
}









