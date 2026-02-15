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
      ? "bg-white/5 text-white border-white/10 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
      : "bg-white/70 text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500");

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600">
        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: "google" })
          }
          className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:scale-105 transition"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition duration-500 ${
        dark
          ? "bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617]"
          : "bg-gradient-to-br from-[#eef2ff] via-white to-[#f8fafc]"
      }`}
    >
      <div className="w-full max-w-xl px-4 animate-fadeIn">

        {/* MAIN GLASS CARD */}
        <div
          className={`rounded-2xl p-8 space-y-6 backdrop-blur-xl border transition duration-300 ${
            dark
              ? "bg-white/5 border-white/10 shadow-[0_0_25px_rgba(99,102,241,0.15)] text-white"
              : "bg-white/70 border-white/60 shadow-xl text-gray-900"
          }`}
        >

          {/* HEADER */}
          <div
            className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-6 py-5 rounded-xl border ${
              dark
                ? "bg-white/5 border-white/10"
                : "bg-white/60 border-white/50"
            }`}
          >
            <h2 className="font-semibold text-lg leading-relaxed break-words">
              Welcome
              <span
                className={`ml-2 ${
                  dark ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                {user.email}
              </span>
            </h2>

            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => setDark(!dark)}
                className="px-3 py-1.5 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 shadow-md hover:shadow-indigo-500/40 transition"
              >
                {dark ? "Light" : "Dark"}
              </button>

              <button
                onClick={logout}
                className="bg-rose-500 text-white px-3 py-1.5 rounded-md hover:bg-rose-600 shadow-md hover:shadow-rose-500/40 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* INPUT ROW */}
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
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/40 transition whitespace-nowrap sm:w-auto w-full"
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          {/* BOOKMARK LIST */}
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className={`flex justify-between items-center px-4 py-3 rounded-lg border transition ${
                  dark
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white border-gray-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${b.url}`}
                    className="w-5 h-5"
                  />
                  <a
                    href={b.url}
                    target="_blank"
                    className="font-medium truncate hover:text-indigo-500 transition"
                  >
                    {b.title}
                  </a>
                </div>

                <div className="flex gap-4 text-lg">
                  <button
                    onClick={() => navigator.clipboard.writeText(b.url)}
                    className="text-gray-400 hover:text-indigo-500 transition"
                    title="Copy"
                  >
                    📋
                  </button>

                  <button
                    onClick={() => deleteBookmark(b.id)}
                    className="text-gray-400 hover:text-rose-500 transition"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* FADE ANIMATION */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}






