"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");

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

  /* ================= LOGIN SCREEN ================= */

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#C7D7E2]">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-[380px] text-center border border-gray-200">

          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#2F6F91] flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl">📚</span>
          </div>

          <h2 className="text-2xl font-bold text-[#0B2E4F]">
            Smart Bookmark
          </h2>

          <p className="text-[#6F97B3] text-sm mt-2 mb-6">
            Save links. Stay organized.
          </p>

          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({ provider: "google" })
            }
            className="w-full py-3 rounded-lg text-white font-semibold
            bg-[#2F6F91] hover:bg-[#0E4A6B] transition shadow-md"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  /* ================= MAIN APP ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#C7D7E2]">

      <div className="w-full max-w-2xl">

        <h1 className="text-4xl font-bold text-center text-[#0B2E4F] mb-2">
          Smart Bookmark
        </h1>
        <p className="text-center text-[#2F6F91] mb-6">
          Organize your web smarter
        </p>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">

          {/* HEADER */}
          <div className="flex justify-between items-center bg-[#F1F5F9] rounded-xl px-4 py-3 mb-6">
            <span className="font-semibold text-[#0B2E4F]">
              Welcome {user.user_metadata?.full_name || user.email}
            </span>

            <button
              onClick={logout}
              className="bg-[#0B2E4F] text-white px-4 py-1 rounded-md hover:bg-[#0E4A6B]"
            >
              Logout
            </button>
          </div>

          {/* INPUT */}
          <div className="flex gap-3 mb-4">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2F6F91]"
            />

            <input
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2F6F91]"
            />

            <button
              onClick={addBookmark}
              className="px-6 rounded-lg text-white font-semibold
              bg-[#2F6F91] hover:bg-[#0E4A6B] transition"
            >
              Add
            </button>
          </div>

          {/* SEARCH */}
          <input
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 mb-5 focus:ring-2 focus:ring-[#2F6F91]"
          />

          {/* LIST */}
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center px-4 py-3 rounded-lg bg-[#F8FAFC] border"
              >
                <a
                  href={b.url}
                  target="_blank"
                  className="font-medium text-[#0E4A6B] hover:underline"
                >
                  {b.title}
                </a>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-red-500 font-medium"
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



