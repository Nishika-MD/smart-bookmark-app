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
      : "bg-white text-gray-900 border-gray-300");

  // ⭐ BEAUTIFUL LOGIN PAGE
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#083A66] via-[#0E6BA8] to-[#0B4F80]">

        {/* animated glow lights */}
        <div className="glow glow1"></div>
        <div className="glow glow2"></div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 text-center space-y-6 text-white max-w-md animate-fadeIn">

          <h1 className="text-3xl font-bold tracking-wide">Smart Bookmark</h1>

          <p className="text-sm leading-relaxed opacity-90">
            “Capture ideas.<br/>
            Organize knowledge.<br/>
            Build your digital brain.”
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E4EFF6] via-[#D6E7F1] to-[#F4FAFD]">

      <div className="w-full max-w-xl px-4">

        {/* darker inner background for contrast */}
        <div className="rounded-3xl p-10 space-y-8 backdrop-blur-xl border bg-white/90 shadow-[0_30px_80px_rgba(11,79,128,0.18)]">

          {/* animated welcome */}
          <div>
            <h1 className="welcomeText">
              Welcome
            </h1>
            <p className="text-lg text-[#0B4F80]">{user.email}</p>
          </div>

          {/* buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="px-4 py-2 rounded-lg bg-[#0E6BA8] text-white hover:bg-[#083A66] shadow-md"
            >
              Dark
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 shadow-md"
            >
              Logout
            </button>
          </div>

          {/* add bookmark */}
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
              className="bg-[#0E6BA8] text-white px-6 py-3 rounded-lg hover:bg-[#083A66] shadow-lg"
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F94A8]">
              🔍
            </span>
          </div>

          {/* bookmarks */}
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center px-4 py-3 rounded-xl border bg-white hover:shadow-md"
              >
                <a
                  href={b.url}
                  target="_blank"
                  className="font-semibold text-[#083A66]"
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

      {/* animations */}
      <style jsx>{`
        .welcomeText {
          font-size: 3.2rem;
          font-weight: 800;
          background: linear-gradient(90deg, #083a66, #0e6ba8, #6f94a8);
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
          opacity: 0.35;
          animation: floatGlow 10s ease-in-out infinite alternate;
        }

        .glow1 {
          background: #0e6ba8;
          top: -120px;
          left: -120px;
        }

        .glow2 {
          background: #6f94a8;
          bottom: -140px;
          right: -120px;
        }

        @keyframes floatGlow {
          from { transform: translateY(0) translateX(0); }
          to { transform: translateY(40px) translateX(30px); }
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













