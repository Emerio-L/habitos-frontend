"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHabitos } from "@/store/slices/habitosSlice";

export default function Home() {
  const dispatch = useAppDispatch();
  const { habitos, loading } = useAppSelector((state) => state.habitos);

  useEffect(() => {
    dispatch(fetchHabitos());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-800 text-black">
      <div className="bg-white rounded-xl py-6 px-4 shadow-2xl w-[260px]">
        <h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight">Habitos</h1>

        {loading && <p className="text-center text-sm text-gray-500 mb-4">Cargando...</p>}

        {!loading && habitos.length === 0 && (
          <p className="text-center text-sm text-gray-500">No hay hábitos todavía.</p>
        )}

        <ul className="flex flex-col gap-4">
          {habitos.map((habito) => (
            <li key={habito._id} className="flex items-center justify-between gap-1">
              <span className="text-xs font-semibold truncate w-[60px]" title={habito.nombre}>
                {habito.nombre}
              </span>
              
              {/* Barra de progreso (estática por ahora) */}
              <div className="w-[50px] h-2.5 flex shrink-0">
                <div className="w-1/2 bg-[#22C55E] h-full"></div>
                <div className="w-1/2 bg-gray-300 h-full"></div>
              </div>

              {/* Botón de "Done" (Hecho) */}
              <button 
                type="button"
                className="bg-[#F97316] hover:bg-orange-600 text-white px-3 py-1 rounded-md text-xs font-medium shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 transition-all"
                onClick={() => console.log(`Marcar como hecho: ${habito._id}`)}
              >
                Hecho
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}