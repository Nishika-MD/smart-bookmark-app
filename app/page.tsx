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

  // FETCH BOOKMARKS
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setBookmarks(data || []);
  };

  useEffect(() => {
    if (user) fetchBookmarks();
  }, [user]);

  // ADD BOOKMARK
  const addBookmark = async () => {
    if (!title || !url) return alert("Enter title & URL");

    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setUrl("");
    fetchBookmarks();
  };

  // DELETE BOOKMARK
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  // SEARCH
  const filtered = bookmarks.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle =
    "px-4 py-3 rounded-lg border w-full outline-none transition placeholder-opacity-100 " +
    (dark
      ? "bg-white/5 text-white border-white/10 placeholder-gray-400"
      : "bg-white text-gray-900 border-gray-300 placeholder-gray-500");

  // ⭐ CREATIVE SIGN-IN PAGE
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0A2540] via-[#135E8A] to-[#0E3A5D]">

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 text-center space-y-6 text-white max-w-md">

          <h1 className="text-3xl font-bold">Smart Bookmark</h1>

          <p className="text-sm opacity-90 leading-relaxed">
            “Organize your knowledge.<br/>
            Save what matters.<br/>
            Build your digital memory.”
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
      className={`min-h-screen flex items-center justify-center ${
        dark
          ? "bg-gradient-to-br from-[#0A2540] via-[#0E3A5D] to-[#020617]"
          : "bg-gradient-to-br from-[#E6F2F7] via-[#DCEFF6] to-[#F8FDFF]"
      }`}
    >
      <div className="w-full max-w-xl px-4">

        <div className="rounded-3xl p-10 space-y-8 backdrop-blur-xl border bg-white/80 shadow-xl">

          {/* WELCOME */}
          <div>
            <h1 className="text-5xl font-extrabold text-[#0A2540]">
              Welcome
            </h1>
            <p className="text-lg text-[#135E8A]">{user.email}</p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="px-4 py-2 rounded-lg bg-[#135E8A] text-white hover:bg-[#0E3A5D] shadow-md"
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

          {/* INPUTS */}
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
              className="bg-[#135E8A] text-white px-6 py-3 rounded-lg hover:bg-[#0E3A5D] shadow-lg"
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
                className="flex justify-between items-center px-4 py-3 rounded-xl border bg-white hover:shadow-md"
              >
                <a href={b.url} target="_blank" className="font-medium">
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
    </div>
  );
}










