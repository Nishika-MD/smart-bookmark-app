
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

  /* ================= LOGIN SCREEN ================= */

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500
">

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]
w-[360px] p-8 text-center border border-white/40">


          {/* Avatar */}
          <div className="flex justify-center -mt-16">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
              <span className="text-white text-3xl">📚</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Sign in to manage your smart bookmarks
          </p>

          {/* Google Button */}
         <button
  onClick={() =>
    supabase.auth.signInWithOAuth({ provider: "google" })
  }
  className="w-full bg-white border border-gray-300 py-3 rounded-lg
  flex items-center justify-center gap-3 font-semibold text-gray-700
  shadow-md hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50
  active:scale-95 transition"
>
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.2 3.6l6.85-6.85C35.73 2.36 30.27 0 24 0 14.82 0 6.91 5.64 3.44 13.64l7.98 6.19C13.3 13.03 18.2 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.63-.15-3.2-.42-4.7H24v9.02h12.73c-.55 2.96-2.21 5.48-4.71 7.18l7.28 5.66C43.98 37.7 46.5 31.67 46.5 24.5z"/>
    <path fill="#FBBC05" d="M11.42 28.83a14.5 14.5 0 010-9.16l-7.98-6.19a24.003 24.003 0 000 21.54l7.98-6.19z"/>
    <path fill="#34A853" d="M24 48c6.27 0 11.73-2.07 15.64-5.64l-7.28-5.66c-2.02 1.36-4.6 2.17-8.36 2.17-5.8 0-10.7-3.53-12.58-8.33l-7.98 6.19C6.91 42.36 14.82 48 24 48z"/>
  </svg>

  <span>Sign in with Google</span>
</button>

        </div>
      </div>
    );
  }

  /* ================= MAIN APP ================= */


return (
  <div
    className="min-h-screen flex items-center justify-center transition"
    style={{
      background: dark
        ? "linear-gradient(135deg, #020617, #1e1b4b, #020617)"
        : "linear-gradient(135deg, #1f8d82, #1d4ed8, #4338ca)",
    }}
>

    <div className="w-full max-w-xl px-4 text-center">

  <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-wide">
    Smart Bookmark
  </h1>

  <p className="text-blue-100 italic mt-2 mb-6 text-lg">
    Save links. Stay organized. Browse smarter.
  </p>



        <div
          className={`rounded-2xl p-6 shadow-xl transition ${
            dark ? "bg-slate-900 text-white" : "bg-white text-gray-900"
          }`}
        >

          {/* HEADER */}
          <div
            className={`flex justify-between items-center px-5 py-4 rounded-xl mb-6 border ${
              dark
                ? "bg-slate-800 border-slate-700"
                : "bg-gray-100 border-gray-200"
            }`}
          >
            <h2 className="font-semibold text-lg">
              
              <span className={`${dark ? "text-indigo-300" : "text-indigo-600"} ml-2`}>
                {user.email}
              </span>
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setDark(!dark)}
                className="px-3 py-1.5 rounded-md bg-gray-400 text-white"
              >
                {dark ? "Light" : "Dark"}
              </button>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1.5 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>

          {/* INPUT */}
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
              className="bg-indigo-600 text-white px-5 rounded-lg"
            >
              Add
            </button>
          </div>

          {/* SEARCH */}
          <input
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputStyle + " mb-4"}
          />

          {/* LIST */}
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className={`flex justify-between items-center px-4 py-3 rounded-lg ${
                  dark ? "bg-slate-800" : "bg-gray-50"
                }`}
              >
                <a href={b.url} target="_blank" className="font-medium hover:underline">
                  {b.title}
                </a>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
