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
      className={`min-h-screen flex items-center justify-center transition duration-500 ${
        dark
         dark
  ? "bg-gradient-to-br from-[#0A2540] via-[#0E3A5D] to-[#0A2540]"
  : "bg-gradient-to-br from-[#E6F2F7] via-[#F0F8FB] to-white"

      }`}
    >
      <div className="w-full max-w-xl px-4 animate-fadeIn">

        {/* GLASS CARD */}
        <div
          className={`rounded-3xl p-10 space-y-8 backdrop-blur-xl border transition ${
            dark
              ? "bg-white/5 border-white/10 shadow-[0_0_35px_rgba(19,94,138,0.35)] text-white"
              : "bg-white/80 border-white/60 shadow-xl text-gray-900"
          }`}
        >

          {/* BIG STYLISH WELCOME */}
          <div className="space-y-2">
            <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${
              dark ? "text-white" : "text-[#0A2540]"
            }`}>
              Welcome
            </h1>

            <p className={`text-lg sm:text-xl font-medium break-words ${
              dark ? "text-[#B8CAD6]" : "text-[#135E8A]"
            }`}>
              {user.email}
            </p>
          </div>

          {/* CONTROLS */}
          <div className="flex justify-between items-center flex-wrap gap-3">
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

          {/* BOOKMARK LIST */}
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className={`flex justify-between items-center px-4 py-3 rounded-xl border transition ${
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
                    className="font-medium truncate hover:text-[#135E8A] transition"
                  >
                    {b.title}
                  </a>
                </div>

                <div className="flex gap-4 text-lg">
                  <button
                    onClick={() => navigator.clipboard.writeText(b.url)}
                    className="text-gray-400 hover:text-[#135E8A] transition"
                  >
                    📋
                  </button>

                  <button
                    onClick={() => deleteBookmark(b.id)}
                    className="text-gray-400 hover:text-rose-500 transition"
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
            transform: translateY(25px);
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







