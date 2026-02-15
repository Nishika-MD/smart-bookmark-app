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
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user);
    });
  }, []);

  const fetchBookmarks = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  useEffect(() => {
    if (user?.id) fetchBookmarks();
  }, [user]);

  const addBookmark = async () => {
    if (!title || !url) return;
    await supabase.from("bookmarks").insert([{ title, url, user_id: user.id }]);
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
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle =
    "px-4 py-3 rounded-lg border w-full outline-none transition placeholder-gray-500 " +
    (dark
      ? "bg-white/5 text-white border-white/10"
      : "bg-white/70 text-gray-900 border-gray-300");

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#083A66] via-[#0EA5C6] to-[#0B4F80]">

        {/* aqua glow lights */}
        <div className="glow glow1"></div>
        <div className="glow glow2"></div>

        <div className="backdrop-blur-xl bg-white/15 border border-white/30 shadow-2xl rounded-3xl p-10 text-center space-y-6 text-white max-w-md animate-fadeIn">

          <img
            src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png"
            className="w-16 mx-auto drop-shadow-lg"
          />

          <h1 className="text-3xl font-bold tracking-wide">
            Smart Bookmark
          </h1>

          <p className="text-sm opacity-90">
            Capture ideas. Organize knowledge.
          </p>

          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({ provider: "google" })
            }
            className="flex items-center justify-center gap-3 bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg w-full"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
        dark
          ? "bg-gradient-to-br from-[#020617] via-[#083A66] to-[#031B2F]"
          : "bg-gradient-to-br from-[#BFE9FF] via-[#E3F7FF] to-[#F7FDFF]"
      }`}
    >
      {/* aqua glow background */}
      <div className="glow glow1"></div>
      <div className="glow glow2"></div>

      <div className="w-full max-w-xl px-4">

        {/* SKY BLUE GLASS CARD */}
        <div
          className={`rounded-3xl p-10 space-y-8 backdrop-blur-xl border shadow-xl ${
            dark
              ? "bg-[#083A66]/60 border-white/10 text-white shadow-[0_0_40px_rgba(14,165,198,0.35)]"
              : "bg-[#CFEFFF]/70 border-white/40 text-gray-900 shadow-[0_0_40px_rgba(14,165,198,0.25)]"
          }`}
        >

          {/* Animated Welcome */}
          <div>
            <h1 className="welcomeText">Welcome</h1>
            <p className={dark ? "text-white/80" : "text-[#083A66]"}>
              {user.email}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="px-4 py-2 rounded-lg bg-[#0EA5C6] text-white hover:bg-[#083A66] shadow-md"
            >
              {dark ? "Light" : "Dark"}
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 shadow-md"
            >
              Logout
            </button>
          </div>

          {/* Add bookmark */}
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
              className="bg-[#0EA5C6] text-white px-6 py-3 rounded-lg hover:bg-[#083A66] shadow-lg"
            >
              Add
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputStyle} pl-10`}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0EA5C6]">
              🔍
            </span>
          </div>

          {/* Bookmarks */}
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className={`flex justify-between items-center px-4 py-3 rounded-xl ${
                  dark ? "bg-white/10" : "bg-white/80"
                }`}
              >
                <a
                  href={b.url}
                  target="_blank"
                  className={`font-semibold ${
                    dark ? "text-white" : "text-[#083A66]"
                  }`}
                >
                  {b.title}
                </a>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-rose-500 font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style jsx>{`
        .welcomeText {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(90deg, #083a66, #0ea5c6, #9feaff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          color: transparent;
          animation: shine 4s linear infinite;
        }

        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }

        .glow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.4;
        }

        .glow1 {
          background: rgba(14,165,198,0.5);
          top: -120px;
          left: -120px;
        }

        .glow2 {
          background: rgba(159,234,255,0.5);
          bottom: -140px;
          right: -120px;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

























