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

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0];

  /* ================= LOGIN SCREEN ================= */

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF4F7] to-[#DDE7ED] relative overflow-hidden">

        {/* subtle glow */}
        <div className="absolute w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40 -top-10 -left-10"></div>
        <div className="absolute w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-40 bottom-0 right-0"></div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl px-10 py-12 text-center w-[360px] animate-fadeIn">

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
      className={`min-h-screen flex items-center justify-center transition relative overflow-hidden ${
        dark
          ? "bg-slate-900"
          : "bg-gradient-to-br from-[#CBD5E1] to-[#94A3B8]"
      }`}
    >
      {/* glow background */}
      <div className="absolute w-80 h-80 bg-indigo-300 rounded-full blur-3xl opacity-20 -top-20 -left-20"></div>
      <div className="absolute w-80 h-80 bg-sky-300 rounded-full blur-3xl opacity-20 bottom-0 right-0"></div>

      <div className="w-full max-w-xl px-4">

        <h1 className="text-4xl font-extrabold text-center text-slate-800 mb-2 shineText">
          Smart Bookmark
        </h1>

        <p className="text-center text-slate-600 mb-8">
          Organize your web smarter
        </p>

        <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-xl p-8 animate-fadeIn">

          {/* header */}
          <div className="flex justify-between items-center bg-slate-100 px-5 py-4 rounded-xl mb-6">
            <h2 className="font-semibold text-slate-700">
              Welcome <span className="text-slate-900">{name}</span>
            </h2>

            <div className="flex gap-2">
              <button
                onClick={() => setDark(!dark)}
                className="px-3 py-1 rounded-md bg-slate-400 text-white text-sm hover:brightness-110"
              >
                {dark ? "Light" : "Dark"}
              </button>

              <button
                onClick={logout}
                className="px-3 py-1 rounded-md bg-slate-800 text-white text-sm hover:bg-slate-700"
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

      {/* animations */}
      <style jsx>{`
        .shineText {
          background: linear-gradient(90deg, #1e293b, #64748b, #1e293b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          color: transparent;
          animation: shine 4s linear infinite;
        }

        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}



















