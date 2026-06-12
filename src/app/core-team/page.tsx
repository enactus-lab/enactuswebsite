"use client";

import React, { useEffect, useState } from "react";
import TeamGrid from "@/app/components/TeamGrid";
import { supabase } from "@/lib/supabase";

export default function CoreTeamPage() {
  const [coreTeam, setCoreTeam] = useState<any[]>([]);
  const [seniorMembers, setSeniorMembers] = useState<any[]>([]);
  const [associates, setAssociates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase
        .from("team")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) {
        const map = (m: any) => ({
          name: m.name,
          role: m.role,
          description: m.description || "",
          image: m.image_url || "/yellow.png",
          linkedin: m.linkedin || "https://linkedin.com",
        });

        setCoreTeam(data.filter((m) => m.section === "core").map(map));
        setSeniorMembers(data.filter((m) => m.section === "senior").map(map));
        setAssociates(data.filter((m) => m.section === "associate").map(map));
      }
      setLoading(false);
    };

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-400 text-sm">Loading team...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <section className="flex flex-col items-center text-center px-4 pt-16 pb-14 max-w-6xl mx-auto">
        <p className="mb-2 tracking-[0.3em] text-amber-300 uppercase text-sm">Meet Our Team</p>
        <h1 className="mb-4 text-3xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 to-white bg-clip-text text-transparent">
          Our People
        </h1>
        <p className="max-w-xl text-slate-400">Leaders driving social impact through entrepreneurial action</p>
      </section>

      {coreTeam.length > 0 && (
        <section className="px-4 pb-28 max-w-7xl mx-auto">
          <h2 className="mb-10 text-2xl md:text-3xl font-semibold text-white">CORE TEAM</h2>
          <TeamGrid members={coreTeam} />
        </section>
      )}

      {seniorMembers.length > 0 && (
        <section className="px-4 pb-28 max-w-7xl mx-auto">
          <h2 className="mb-10 text-2xl md:text-3xl font-semibold text-white">SENIOR MEMBERS</h2>
          <TeamGrid members={seniorMembers} compact />
        </section>
      )}

      {associates.length > 0 && (
        <section className="px-4 pb-36 max-w-7xl mx-auto">
          <h2 className="mb-10 text-2xl md:text-3xl font-semibold text-white">ASSOCIATES</h2>
          <TeamGrid members={associates} compact />
        </section>
      )}

      {coreTeam.length === 0 && seniorMembers.length === 0 && associates.length === 0 && (
        <div className="flex items-center justify-center py-40">
          <p className="text-zinc-500 text-sm">No team members found.</p>
        </div>
      )}

    </main>
  );
}