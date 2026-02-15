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
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setLoginSuccess(true);
        setTimeout(() => setLoginSuccess(false), 2000);
      }
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

  /* ================= LOGIN SCREEN ================= */

  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-sky-200">

        {/* floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="absolute bg-white/50 rounded-full animate-ping"
              style={{
                width: Math.random() * 6 + 4,
                height: Math.random() * 6 + 4,
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animationDuration: Math.random() * 4 + 3 + "s",
              }}
            />
          ))}
        </div>

        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center w-[360px] border border-white/40">

          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
            <span className="text-white text-3xl">📚</span>
          </div>

          <h1 className="text-3xl font-extrabold mt-4 text-slate-700">
            Smart Bookmark
          </h1>

          <p className="text-gray-500 mb-6">
            Capture ideas. Organize knowledge.
          </p>

          <button
            onClick={async () => {
              setLoading(true);
              await supabase.auth.signInWithOAuth({ provider: "google" });
            }}
            className="w-full bg-white py-3 rounded-xl
            flex items-center justify-center gap-3
            font-semibold text-gray-700
            shadow-lg hover:shadow-2xl
            hover:scale-105 active:scale-95
            transition duration-300"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  className="w-5 h-5"
                />
                Continue with Google
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */

  return (
    <div
      className="min-h-screen flex items-center justify-center transition"
      style={{
        background: dark
          ? "linear-gradient(135deg,#020617,#1e1b4b,#020617)"
          : "linear-gradient(135deg,#dbeafe,#bfdbfe,#93c5fd)",
      }}
    >
      <div className="w-full max-w-xl px-4 text-center animate-fadeUp">

        <h1 className="text-4xl font-extrabold text-slate-800 drop-shadow">
          Smart Bookmark
        </h1>
        <p className="text-slate-600 italic mt-2 mb-4">
          Save links. Stay organized. Browse smarter.
        </p>

        {loginSuccess && (
          <div className="mb-4">
            <span className="px-4 py-2 bg-green-500 text-white rounded-full shadow animate-bounce">
              Login Successful
            </span>
          </div>
        )}

        <div className={`rounded-2xl p-6 shadow-xl ${dark ? "bg-slate-900 text-white" : "bg-white"}`}>

          {/* HEADER */}
          <div className="flex justify-between items-center px-4 py-3 rounded-xl mb-6 bg-gray-100">
            <h2 className="font-semibold">
              Welcome {user.user_metadata?.full_name || "User"}
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setDark(!dark)}
                className="px-3 py-1 rounded-md bg-gray-400 text-white"
              >
                {dark ? "Light" : "Dark"}
              </button>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>

          {/* INPUTS */}
          <div className="flex gap-3 mb-4">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-3 rounded-lg border w-full"
            />
            <input
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="px-4 py-3 rounded-lg border w-full"
            />
            <button
              onClick={addBookmark}
              className="bg-indigo-600 text-white px-5 rounded-lg hover:scale-105 hover:shadow-lg transition"
            >
              Add
            </button>
          </div>

          {/* SEARCH */}
          <input
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 rounded-lg border w-full mb-4"
          />

          {/* LIST */}
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center px-4 py-3 rounded-lg bg-gray-50 hover:-translate-y-1 hover:shadow-lg transition"
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


















