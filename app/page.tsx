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

  // ⭐ AI-like smart title suggestion
  const suggestTitle = async () => {
    if (!url) return;
    try {
      const res = await fetch(`https://textance.herokuapp.com/title/${url}`);
      const text = await res.text();
      if (text) setTitle(text);
    } catch (err) {}
  };

  const filtered = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle =
    "px-4 py-3 rounded-lg border w-full outline-none transition placeholder-gray-500 " +
    (dark
      ? "bg-slate-800 text-white border-slate-600 focus:ring-2 focus:ring-indigo-400"
      : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-2 focus:ring-indigo-500");

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500">
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
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50"
      }`}
    >
      <div className="w-full max-w-xl px-4 animate-fadeIn">

        {/* MAIN CARD */}
        <div
          className={`rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition duration-300 ${
            dark
              ? "bg-slate-800 text-white border border-slate-700"
              : "bg-white text-gray-900 border border-gray-200"
          }`}
        >

          {/* HEADER */}
          <div
            className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-5 py-4 rounded-xl mb-6 border ${
              dark
                ? "bg-slate-700 border-slate-600"
                : "bg-indigo-50 border-indigo-100"
            }`}
          >
            <h2 className="font-semibold text-lg break-all">
              Welcome
              <span
                className={`ml-2 ${
                  dark ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                {user.email}
              </span>
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setDark(!dark)}
                className="px-3 py-1.5 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
              >
                {dark ? "Light" : "Dark"}
              </button>

              <button
                onClick={logout}
                className="bg-rose-500 text-white px-3 py-1.5 rounded-md hover:bg-rose-600 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* INPUT ROW */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
              onBlur={suggestTitle}
              className={inputStyle}
            />

            <button
              onClick={addBookmark}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition whitespace-nowrap sm:w-auto w-full"
            >
              Add
            </button>
          </div>

          {/* SEARCH */}
          <div className="relative mb-5">
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
                className={`flex justify-between items-center px-4 py-3 rounded-lg shadow-sm hover:scale-[1.01] transition ${
                  dark
                    ? "bg-slate-700"
                    : "bg-white border border-gray-200"
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
                    className="font-medium hover:underline truncate"
                  >
                    {b.title}
                  </a>
                </div>

                <div className="flex gap-4 text-sm">
                  <button
                    onClick={() => navigator.clipboard.writeText(b.url)}
                    className="text-gray-500 hover:text-indigo-500"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => deleteBookmark(b.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* simple fade animation */}
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





