"use client";

import Link from "next/link";
import { Linkedin } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  description?: string;
}

export default function TeamGrid({
  members,
  compact = false,
}: {
  members: TeamMember[];
  compact?: boolean;
}) {
  return (
    <div className={`grid gap-6 ${
      compact
        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
    }`}>
      {members.map((member, idx) => (
        <div
          key={idx}
          className={`group relative flex rounded-2xl bg-[#0b0b0b] border border-white/10
          transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40
          hover:shadow-[0_0_35px_rgba(251,191,36,0.12)]
          ${compact ? "flex-col items-center text-center p-4 gap-3" : "flex-row gap-6 p-7 min-h-[320px]"}`}
        >
          {/* GLOW */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300
          bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.08),transparent_70%)] pointer-events-none" />

          {/* PROFILE IMAGE */}
          <div className={`relative z-10 shrink-0 rounded-xl overflow-hidden bg-neutral-900
            ${compact ? "w-16 h-16" : "w-24 h-24"}`}>
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes("yellow.png")) {
                  target.src = "/yellow.png";
                }
              }}
            />
          </div>

          {/* TEXT */}
          <div className={`relative z-10 flex flex-col ${compact ? "items-center gap-1" : "justify-between"}`}>
            <div>
              <h3 className={`font-semibold text-white leading-tight ${compact ? "text-sm" : "text-lg"}`}>
                {member.name}
              </h3>
              <p className={`uppercase tracking-wide text-slate-400 ${compact ? "text-[10px] mt-0.5" : "text-xs mt-1"}`}>
                {member.role}
              </p>
              {!compact && member.description && (
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {member.description}
                </p>
              )}
            </div>

            {!compact && (
              <Link
                href={member.linkedin}
                target="_blank"
                aria-label={`${member.name} LinkedIn`}
                className="mt-5 inline-flex items-center gap-3 text-sm font-medium text-blue-400 hover:text-blue-300 transition"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-md
                border border-blue-500/30 bg-blue-500/10 group-hover:bg-blue-500/20 transition">
                  <Linkedin size={16} />
                </span>
                <span>LinkedIn</span>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}