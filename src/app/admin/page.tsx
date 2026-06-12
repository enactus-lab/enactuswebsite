"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Papa from "papaparse";

export default function AdminPage() {
  const router = useRouter();

  const [announcement, setAnnouncement] = useState("");
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [existingAnnouncements, setExistingAnnouncements] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [memberName, setMemberName] = useState("");
  const [memberRoll, setMemberRoll] = useState("");
  const [memberYear, setMemberYear] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberDesc, setMemberDesc] = useState("");
  const [memberLinkedin, setMemberLinkedin] = useState("");
  const [memberSection, setMemberSection] = useState("core");
  const [memberImage, setMemberImage] = useState<File | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [replaceLoading, setReplaceLoading] = useState(false);
  const [confirmReplace, setConfirmReplace] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchTasks();
    fetchAnnouncements();
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase.from("team").select("*").order("created_at", { ascending: false });
    if (data) setMembers(data);
  };

  const fetchTasks = async () => {
    const { data } = await supabase.from("tasks").select("*");
    if (data) setTasks(data);
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setExistingAnnouncements(data);
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const { error } = await supabase.from("team").insert(results.data as any);
        if (error) alert("Upload failed: " + error.message);
        else { alert("Team members added successfully!"); fetchMembers(); }
      },
    });
  };

  const handleReplaceTeam = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!confirmReplace) {
      alert("Please tick the confirmation checkbox before replacing the team.");
      event.target.value = "";
      return;
    }
    setReplaceLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const { error: deleteError } = await supabase
          .from("team")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000");
        if (deleteError) {
          alert("Failed to delete old team: " + deleteError.message);
          setReplaceLoading(false);
          return;
        }
        const { error: insertError } = await supabase.from("team").insert(results.data as any);
        if (insertError) alert("Failed to insert new team: " + insertError.message);
        else {
          alert(`✅ Team replaced! ${results.data.length} members added.`);
          fetchMembers();
          setConfirmReplace(false);
        }
        setReplaceLoading(false);
        event.target.value = "";
      },
    });
  };

  const handleAddMember = async () => {
    if (!memberName) return;
    let imageUrl = "/yellow.png";
    if (memberImage) {
      const filePath = `members/${Date.now()}-${memberImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from("member-images")
        .upload(filePath, memberImage);
      if (!uploadError) {
        const { data } = supabase.storage.from("member-images").getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
    }
    const { error } = await supabase.from("team").insert([{
      name: memberName,
      roll: memberRoll,
      year: memberYear,
      role: memberRole,
      description: memberDesc,
      image_url: imageUrl,
      linkedin: memberLinkedin || "https://linkedin.com",
      section: memberSection,
    }]);
    if (error) {
      alert("Failed to add member: " + error.message);
    } else {
      setMemberName(""); setMemberRoll(""); setMemberYear("");
      setMemberRole(""); setMemberDesc(""); setMemberImage(null);
      setMemberLinkedin(""); setMemberSection("core");
      fetchMembers();
      alert(" Member added!");
    }
  };

  return (
    <main className="min-h-screen bg-[#000000] px-6 py-14">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
          <p className="text-sm text-white/60">Internal access · Enactus Aryabhatta</p>
        </div>
        <button
          onClick={async () => { await supabase.auth.signOut(); router.replace("/admin/login"); }}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── TEAM MANAGEMENT ── */}
        <div className="bg-[#1f1b1b] rounded-2xl p-6 shadow-sm border border-zinc-800">
          <h2 className="text-lg font-semibold text-blue-500 mb-4">Team Management</h2>

          <div className="space-y-3">
            <p className="text-xs text-zinc-400 uppercase tracking-widest">Add Single Member</p>
            <input className="admin-input" placeholder="Name *" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
            <input className="admin-input" placeholder="Role (e.g. Marketing Head)" value={memberRole} onChange={(e) => setMemberRole(e.target.value)} />
            <select className="admin-input" value={memberSection} onChange={(e) => setMemberSection(e.target.value)}>
              <option value="core">Core Team</option>
              <option value="senior">Senior Member</option>
              <option value="associate">Associate</option>
            </select>
            <input className="admin-input" placeholder="LinkedIn URL" value={memberLinkedin} onChange={(e) => setMemberLinkedin(e.target.value)} />
            <textarea className="admin-input" placeholder="Description (optional)" value={memberDesc} onChange={(e) => setMemberDesc(e.target.value)} />
            <input className="admin-input" placeholder="Roll Number (optional)" value={memberRoll} onChange={(e) => setMemberRoll(e.target.value)} />
            <input className="admin-input" placeholder="Year (optional)" value={memberYear} onChange={(e) => setMemberYear(e.target.value)} />
            <div className="space-y-1">
              <p className="text-xs text-zinc-500">Profile Picture (leave empty to use default)</p>
              <input type="file" accept="image/*" onChange={(e) => setMemberImage(e.target.files?.[0] || null)} className="border border-zinc-700 p-2 rounded w-full text-white text-sm" />
              {!memberImage && <p className="text-xs text-amber-500/70">No image selected — will use default yellow avatar</p>}
            </div>
            <button className="admin-btn-blue" onClick={handleAddMember}>+ Add Member</button>
          </div>

          {/* ADD VIA CSV */}
          <div className="mt-6 pt-5 border-t border-zinc-700 space-y-2">
            <p className="text-xs text-zinc-400 uppercase tracking-widest">Add Members via CSV</p>
            <p className="text-xs text-zinc-500">CSV columns: name, role, section, linkedin, description, image_url, roll_number, year</p>
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="border border-zinc-700 p-2 rounded w-full text-white text-sm" />
          </div>

          {/* REPLACE ENTIRE TEAM */}
          <div className="mt-6 pt-5 border-t border-red-900 space-y-3">
            <p className="text-xs text-red-400 uppercase tracking-widest font-bold">⚠️ Replace Entire Team</p>
            <p className="text-xs text-zinc-400">
              This will <span className="text-red-400 font-semibold">permanently delete all current members</span> and replace with the uploaded CSV.
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={confirmReplace} onChange={(e) => setConfirmReplace(e.target.checked)} className="w-4 h-4 accent-red-500" />
              <span className="text-sm text-zinc-300">I understand this will delete all existing members</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleReplaceTeam}
                disabled={!confirmReplace || replaceLoading}
                className={`border p-2 rounded w-full text-sm transition ${confirmReplace ? "border-red-500 text-white cursor-pointer" : "border-zinc-700 text-zinc-600 cursor-not-allowed opacity-50"}`}
              />
              {replaceLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded text-white text-xs">
                  Replacing team...
                </div>
              )}
            </div>
          </div>

          {/* EXISTING MEMBERS — SEARCHABLE */}
          <div className="pt-6 border-t border-zinc-700 mt-6">
            <h3 className="text-sm font-semibold text-white mb-2">Existing Members ({members.length})</h3>
            <input
              className="admin-input mb-3"
              placeholder="Search by name..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
            />
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {members.length === 0 && <p className="text-xs text-zinc-500">No members in database.</p>}
              {members
                .filter((m) => m.name.toLowerCase().includes(memberSearch.toLowerCase()))
                .map((member) => (
                  <div key={member.id} className="admin-list-item">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{member.name}</span>
                      <span className="text-xs text-zinc-500">{member.role} · {member.section || "—"}</span>
                    </div>
                    <span className="text-red-500 cursor-pointer text-xs shrink-0" onClick={async () => {
                      await supabase.from("team").delete().eq("id", member.id);
                      setMembers(members.filter((m) => m.id !== member.id));
                    }}>Delete</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-8">

          {/* ANNOUNCEMENT */}
          <div className="bg-[#1f1b1b] rounded-2xl p-6 shadow-sm border border-zinc-800">
            <h2 className="text-lg font-semibold text-yellow-500 mb-4">📢 Announcement</h2>
            <div className="space-y-3">
              <input className="admin-input" placeholder="Title (e.g. Orientation 2025)" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} />
              <textarea className="admin-input" rows={3} placeholder="Write announcement text..." value={announcement} onChange={(e) => setAnnouncement(e.target.value)} />
              <button
                className="admin-btn-yellow"
                onClick={async () => {
                  if (!announcement) return;
                  const { error } = await supabase.from("announcements").insert([
                    { title: announcementTitle || "Announcement", content: announcement }
                  ]);
                  if (error) alert("Failed: " + error.message);
                  else { setAnnouncement(""); setAnnouncementTitle(""); alert("✅ Published!"); fetchAnnouncements(); }
                }}
              >
                Publish Announcement
              </button>
            </div>
            <div className="pt-4 space-y-2 border-t border-zinc-700 mt-4">
              <h3 className="text-sm font-semibold text-white">Live Announcements ({existingAnnouncements.length})</h3>
              {existingAnnouncements.length === 0 && <p className="text-xs text-zinc-500">No active announcements.</p>}
              {existingAnnouncements.map((ann) => (
                <div key={ann.id} className="admin-list-item flex-col gap-1 items-start">
                  <div className="flex justify-between w-full">
                    <span className="font-semibold text-sm">{ann.title}</span>
                    <span className="text-red-500 cursor-pointer text-xs" onClick={async () => {
                      await supabase.from("announcements").delete().eq("id", ann.id);
                      setExistingAnnouncements(existingAnnouncements.filter((a) => a.id !== ann.id));
                    }}>Delete</span>
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TASKS */}
          <div className="bg-[#1f1b1b] rounded-2xl p-6 shadow-sm border border-zinc-800">
            <h2 className="text-lg font-semibold text-green-500 mb-4">Tasks</h2>
            <div className="space-y-3">
              <input className="admin-input" placeholder="Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
              <textarea className="admin-input" placeholder="Description" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
              <button
                className="admin-btn-green"
                onClick={async () => {
                  if (!taskTitle) return;
                  const { data } = await supabase.from("tasks").insert([{ title: taskTitle, description: taskDesc }]).select();
                  if (data) { setTasks([...tasks, data[0]]); setTaskTitle(""); setTaskDesc(""); fetchTasks(); }
                }}
              >
                Add Task
              </button>
              <div className="pt-4 space-y-2 border-t border-zinc-700">
                <h3 className="text-sm font-semibold text-white">Existing Tasks</h3>
                {tasks.map((task, index) => (
                  <div key={index} className="admin-list-item">
                    <span>{task.title}</span>
                    <span className="text-red-500 cursor-pointer text-xs" onClick={async () => {
                      await supabase.from("tasks").delete().eq("id", task.id);
                      setTasks(tasks.filter((t) => t.id !== task.id));
                    }}>Delete</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .admin-input { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid #3f3f46; background: #09090b; font-size: 14px; outline: none; color: #fff; }
        .admin-input::placeholder { color: #71717a; }
        .admin-input:focus { border-color: #94a3b8; }
        .admin-btn-blue { width: 100%; background: #2563eb; color: white; padding: 10px; border-radius: 10px; font-weight: 500; }
        .admin-btn-green { width: 100%; background: #16a34a; color: white; padding: 10px; border-radius: 10px; font-weight: 500; }
        .admin-btn-yellow { width: 100%; background: #d97706; color: white; padding: 10px; border-radius: 10px; font-weight: 500; }
        .admin-list-item { display: flex; justify-content: space-between; align-items: center; background: #18181b; padding: 10px 12px; border-radius: 10px; font-size: 14px; color: #e4e4e7; border: 1px solid #3f3f46; }
      `}</style>
    </main>
  );
}