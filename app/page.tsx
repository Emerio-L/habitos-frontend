"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHabitosThunk, markAsDoneThunk, createHabitThunk } from "@/store/slices/habitosSlice";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useAppDispatch();
  const { habitos, loading, status } = useAppSelector((state) => state.habitos);
  const { user, token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [newHabitTitle, setNewHabitTitle] = useState("");
  const isCreating = status['creating'] === "loading";
  const [activeHabits, setActiveHabits] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Conditionally Redirect if no user found
    } else if (token) {
      dispatch(fetchHabitosThunk(token));
    }
  }, [dispatch, user, token, router]);

  const handleMarkAsDone = (habitId: string) => {
    if (token) dispatch(markAsDoneThunk({ habitId, token }));
  };

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim() || !token) return;
    dispatch(createHabitThunk({ title: newHabitTitle, description: "Hábito creado desde UI", token }));
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
            <h1 className="text-3xl font-bold tracking-tighter text-black">Habitos</h1>
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
             const lastDoneDate = habito.lastDone ? new Date(habito.lastDone) : null;
             // Un hábito recién creado tiene lastDone por defécto a hoy, pero days en 0
             const isDoneToday = lastDoneDate ? (new Date().toDateString() === lastDoneDate.toDateString() && habito.days > 0) : false;

             const isUpdating = status[habito._id] === "loading";
             const title = habito.title || habito.nombre || "Sin Título";

             const isActivated = activeHabits[habito._id];

             let statusText = "No iniciada";
             let showButton = false;
             let progressPercentage = 0;

             if (isDoneToday) {
                 statusText = "Done";
                 showButton = true;
                 progressPercentage = 100;
             } else if (isActivated) {
                 statusText = "En progreso";
                 showButton = true;
                 progressPercentage = 5; // Un pequeño color verde para indicar que inició
             } else {
                 statusText = "No iniciada";
                 showButton = false;
                 progressPercentage = 0;
             }

             const handleBarClick = () => {
                 if (!isDoneToday && !isActivated) {
                     setActiveHabits(prev => ({...prev, [habito._id]: true}));
                 }
             };

             return (
              <li key={habito._id} className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-800 w-14 truncate" title={title}>
                  {title}
                </span>

                {/* Status text "No iniciada", "En progreso" o "Done" */}
                <span className="text-[10px] text-gray-500 italic w-16 text-center shrink-0">
                  {statusText}
                </span>
                
                {/* Dynamic Progress Bar */}
                <div 
                  className="w-16 h-3.5 bg-[#8b8b8b] flex-shrink-0 rounded-sm overflow-hidden cursor-pointer" 
                  onClick={handleBarClick}
                >
                  <div 
                    className="h-full bg-[#1e8b24] transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                {/* Botón de "Done" que solo aparece cuando está en progreso o terminado */}
                {showButton ? (
                  <button 
                    type="button"
                    disabled={isUpdating || isDoneToday}
                    className={`${isDoneToday ? 'bg-green-600 outline-none cursor-default' : 'bg-[#F97319] hover:bg-[#e06516]'} disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-[11px] font-medium shrink-0 ml-auto transition-colors`}
                    onClick={() => handleMarkAsDone(habito._id)}
                  >
                    {isUpdating ? "..." : (isDoneToday ? "Done" : "Mark as Done")}
                  </button>
                ) : (
                  <div className="px-3 py-1.5 shrink-0 ml-auto w-[90px]"></div>
                )}
              </li>
             );
          })}
        </ul>
      </div>
    </div>
  );
}