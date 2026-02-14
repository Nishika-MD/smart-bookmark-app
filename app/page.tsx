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
      className={`min-h-screen flex items-center justify-center transition ${
        dark
          ? "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"
          : "bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100"
      }`}
    >
      <div className="w-full max-w-xl px-4">

        {/* MAIN CARD */}
        <div
          className={`rounded-2xl p-6 shadow-xl transition ${
            dark ? "bg-slate-900 text-white" : "bg-white text-gray-900"
          }`}
        >

          {/* HEADER (CLEAN & BALANCED) */}
          <div
            className={`flex justify-between items-center px-5 py-4 rounded-xl mb-6 border ${
              dark
                ? "bg-slate-800 border-slate-700"
                : "bg-gray-100 border-gray-200"
            }`}
          >
            <h2 className="font-semibold text-lg">
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
                className="px-3 py-1.5 rounded-md bg-gray-400 text-white hover:opacity-90 transition"
              >
                {dark ? "Light" : "Dark"}
              </button>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:opacity-90 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* INPUT ROW */}
          <div className="flex gap-3 mb-4">
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
              className="bg-indigo-600 text-white px-5 rounded-lg hover:scale-105 transition"
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
                className={`flex justify-between items-center px-4 py-3 rounded-lg shadow-sm transition ${
                  dark ? "bg-slate-800" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${b.url}`}
                    className="w-5 h-5"
                  />
                  <a
                    href={b.url}
                    target="_blank"
                    className="font-medium hover:underline"
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
    </div>
  );
}
