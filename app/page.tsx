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

  // get user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // fetch bookmarks
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

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0];

  /* ================= LOGIN SCREEN ================= */

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">

        <div className="bg-white rounded-3xl shadow-2xl px-10 py-12 text-center w-[360px]">

          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-3xl shadow-lg">
            📚
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-800">
            Welcome Back
          </h2>

          <p className="text-slate-500 mb-8 text-sm">
            Sign in to manage your bookmarks
          </p>

          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({ provider: "google" })
            }
            className="w-full flex items-center justify-center gap-3 border border-slate-300 py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-slate-50 transition"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              className="w-5"
            />
            <span className="font-semibold text-slate-700">
              Continue with Google
            </span>
          </button>
        </div>
      </div>
    );
  }

  /* ================= MAIN APP ================= */

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition ${
        dark
          ? "bg-slate-900"
          : "bg-gradient-to-br from-slate-200 to-slate-300"
      }`}
    >
      <div className="w-full max-w-xl px-4">

        <h1 className="text-4xl font-extrabold text-center text-slate-800 mb-2">
          Smart Bookmark
        </h1>

        <p className="text-center text-slate-500 mb-8">
          Organize your web smarter
        </p>

        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* header */}
          <div className="flex justify-between items-center bg-slate-100 px-5 py-4 rounded-xl mb-6">
            <h2 className="font-semibold text-slate-700">
              Welcome <span className="text-slate-900">{name}</span>
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setDark(!dark)}
                className="px-3 py-1 rounded-md bg-slate-400 text-white text-sm"
              >
                {dark ? "Light" : "Dark"}
              </button>

              <button
                onClick={logout}
                className="px-3 py-1 rounded-md bg-slate-800 text-white text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* inputs */}
          <div className="flex gap-3 mb-4">
            <input
              placeholder="Bookmark title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none"
            />

            <input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none"
            />

            <button
              onClick={addBookmark}
              className="bg-slate-800 text-white px-6 rounded-lg hover:bg-slate-700 transition"
            >
              Add
            </button>
          </div>

          {/* search */}
          <input
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 mb-6 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-500 outline-none"
          />

          {/* bookmarks */}
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-lg hover:shadow transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${b.url}`}
                    className="w-5 h-5"
                  />
                  <a
                    href={b.url}
                    target="_blank"
                    className="font-medium text-slate-700 hover:underline"
                  >
                    {b.title}
                  </a>
                </div>

                <div className="flex gap-4 text-sm">
                  <button
                    onClick={() => navigator.clipboard.writeText(b.url)}
                    className="text-slate-500 hover:text-slate-800"
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




