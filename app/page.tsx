"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHabitosThunk, markAsDoneThunk, createHabitThunk } from "@/store/slices/habitosSlice";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useAppDispatch();
  const { habitos, loading, status } = useAppSelector((state) => state.habitos);
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [newHabitTitle, setNewHabitTitle] = useState("");
  const isCreating = status['creating'] === "loading";

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Conditionally Redirect if no user found
    } else {
      dispatch(fetchHabitosThunk());
    }
  }, [dispatch, user, router]);

  const handleMarkAsDone = (habitId: string) => {
    dispatch(markAsDoneThunk({ habitId }));
  };

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    dispatch(createHabitThunk({ title: newHabitTitle, description: "Hábito creado desde UI" }));
    setNewHabitTitle("");
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return nothing while checking auth or during SSR to prevent layout splash and hydration mismatch
  if (!mounted || !user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-800 text-black">
      <div className="bg-white rounded-xl py-6 px-4 shadow-2xl w-[320px]">
        <div className="relative mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-black">Habits</h1>
            <button 
              onClick={handleLogout}
              className="absolute right-0 top-2 text-[10px] font-semibold text-gray-400 hover:text-gray-800 transition-colors"
            >
              Salir
            </button>
        </div>

        {/* Añadir Hábito Form (Kept useful functionality but restyled slightly) */}
        <form onSubmit={handleCreateHabit} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="Add new habit..."
              className="flex-grow px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button 
              type="submit" 
              disabled={!newHabitTitle.trim() || isCreating}
              className="bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white px-2 py-1.5 rounded text-xs font-bold"
            >
              {isCreating ? "..." : "+"}
            </button>
        </form>

        {loading && <p className="text-center text-xs text-gray-500 mb-4">Cargando...</p>}

        {!loading && habitos.length === 0 && (
          <p className="text-center text-xs text-gray-500 mb-4">No hay hábitos todavía.</p>
        )}

        <ul className="flex flex-col gap-3">
          {habitos.map((habito) => {
             // Assuming a 21-day goal for streak 100% visualization
             const streakDays = habito.days || 0;
             const progressPercentage = Math.min(100, (streakDays / 21) * 100);
             const isUpdating = status[habito._id] === "loading";
             const title = habito.title || habito.nombre || "Sin Título";

             return (
              <li key={habito._id} className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-800 w-14 truncate" title={title}>
                  {title}
                </span>
                
                {/* Dynamic Progress Bar (Matching strict green/grey rectangles) */}
                <div className="w-16 h-3.5 bg-[#8b8b8b] flex-shrink-0 rounded-sm overflow-hidden">
                  <div 
                    className="h-full bg-[#1e8b24] transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                {/* Botón de "Done" modificado (Color F97319) */}
                <button 
                  type="button"
                  disabled={isUpdating}
                  className="bg-[#F97319] hover:bg-[#e06516] disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-[11px] font-medium shrink-0 ml-auto transition-colors"
                  onClick={() => handleMarkAsDone(habito._id)}
                >
                  {isUpdating ? "..." : "Mark as Done"}
                </button>
              </li>
             );
          })}
        </ul>
      </div>
    </div>
  );
}