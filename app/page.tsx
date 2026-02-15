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
    "px-4 py-3 rounded-lg border w-full outline-none transition placeholder-gray-400 " +
    (dark
      ? "bg-white/5 text-white border-white/10"
      : "bg-white text-gray-900 border-gray-300");

  // 🌟 LOGIN PAGE (REFERENCE STYLE)
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0f3e46] via-[#1e5f66] to-[#2d7a82]">

        <div className="backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl rounded-2xl p-10 text-center space-y-6 text-white w-80 animate-fadeIn">

          <h2 className="tracking-widest text-sm text-white/70">
            USER LOGIN
          </h2>

          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            className="w-10 mx-auto opacity-90"
          />

          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({ provider: "google" })
            }
            className="bg-[#4fd1c5] text-[#0f3e46] font-semibold py-3 rounded-lg w-full hover:brightness-110 transition"
          >
            Continue with Google
          </button>

          <p className="text-xs text-white/60">
            Secure access • Fast login
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9f8fb] via-[#d7f0f5] to-[#f8fdff]">

      <div className="w-full max-w-xl px-4">

        {/* CARD */}
        <div className="rounded-3xl p-10 space-y-8 backdrop-blur-xl border bg-white/85 shadow-xl">

          {/* Animated Welcome */}
          <div>
            <h1 className="welcomeText">Welcome</h1>
            <p className="text-[#1e5f66]">{user.email}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="px-4 py-2 rounded-lg bg-[#4fd1c5] text-[#0f3e46]"
            >
              Toggle Theme
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-rose-500 text-white"
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
              className="bg-[#4fd1c5] text-[#0f3e46] px-6 py-3 rounded-lg"
            >
              Add
            </button>
          </div>

          {/* Search */}
          <input
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputStyle}
          />

          {/* Bookmarks */}
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center px-4 py-3 rounded-xl border bg-white hover:shadow-md"
              >
                <a href={b.url} target="_blank" className="font-semibold">
                  {b.title}
                </a>
                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-rose-500"
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
          background: linear-gradient(90deg, #1e5f66, #4fd1c5, #1e5f66);
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
















