"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0];

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
    if (!title || !url) {
      toast.error("Please enter title & URL");
      return;
    }

    setLoading(true);

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
    fetchBookmarks();
    toast.success("Bookmark added!");
    setLoading(false);
  };

  const deleteBookmark = async (id: string) => {
    if (!confirm("Delete this bookmark?")) return;
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
    toast("Deleted", { icon: "🗑️" });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  const filtered = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500">
        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: "google" })
          }
          className="bg-white px-8 py-3 rounded-lg shadow-lg font-semibold hover:scale-105 transition"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 transition"
      style={{
        background: dark
          ? "linear-gradient(135deg,#020617,#1e1b4b,#020617)"
          : "linear-gradient(135deg,#667eea,#764ba2,#6dd5ed)",
      }}
    >
      <Toaster position="top-center" />

      <div className="w-full max-w-xl">

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-center text-white drop-shadow-lg tracking-wide">
          Smart Bookmark
        </h1>

        <p className="text-center text-blue-100 italic mb-6">
          Save • Organize • Access Anywhere
        </p>

        {/* MAIN CARD */}
        <div className="rounded-2xl p-6 shadow-2xl bg-white/80 backdrop-blur-xl">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-3 rounded-xl">
            <h2 className="font-semibold text-gray-800">
              Welcome <span className="text-indigo-600">{displayName}</span>
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
                className="px-3 py-1 rounded-md bg-red-500 text-white"
              >
                Logout
              </button>
            </div>
          </div>

          {/* ADD */}
          <div className="flex gap-2 mb-4">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBookmark()}
              className="flex-1 px-4 py-2 rounded-lg border bg-gray-50"
            />
            <input
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBookmark()}
              className="flex-1 px-4 py-2 rounded-lg border bg-gray-50"
            />
            <button
              onClick={addBookmark}
              className="bg-indigo-600 text-white px-4 rounded-lg hover:scale-105 transition"
            >
              {loading ? "..." : "Add"}
            </button>
          </div>

          {/* SEARCH */}
          <input
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-lg border bg-gray-50"
          />

          {/* COUNT */}
          <p className="text-sm text-gray-500 mb-2">
            {filtered.length} bookmarks
          </p>

          {/* LIST */}
          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No bookmarks yet ⭐
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((b) => (
                <div
                  key={b.id}
                  className="flex justify-between items-center px-4 py-3 rounded-lg bg-white shadow hover:shadow-md transition"
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

                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(b.url)
                      }
                      className="text-indigo-600"
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
          )}

        </div>
      </div>
    </div>
  );
}

