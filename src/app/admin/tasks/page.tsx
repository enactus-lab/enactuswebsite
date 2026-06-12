"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  description: string;
};

type Volunteer = {
  id: string;
  task_id: string;
  name: string;
  email: string;
  phone: string;
};

export default function TeamTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [volName, setVolName] = useState("");
  const [volEmail, setVolEmail] = useState("");
  const [volPhone, setVolPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchVolunteers();
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (data) setTasks(data);
  };

  const fetchVolunteers = async () => {
    const { data } = await supabase.from("task_volunteers").select("*");
    if (data) setVolunteers(data);
  };

  const handleVolunteer = async () => {
    if (!volName || !showModal) return;
    setSubmitting(true);

    const { error } = await supabase.from("task_volunteers").insert([{
      task_id: showModal,
      name: volName,
      email: volEmail,
      phone: volPhone,
    }]);

    if (error) {
      alert("Failed: " + error.message);
    } else {
      setSuccess(volName);
      fetchVolunteers();
      setVolName(""); setVolEmail(""); setVolPhone("");
      setTimeout(() => { setShowModal(null); setSuccess(null); }, 2000);
    }
    setSubmitting(false);
  };

  const volunteersForTask = (taskId: string) =>
    volunteers.filter((v) => v.task_id === taskId);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-white">
      <h1 className="text-4xl font-bold mb-2">Team Tasks</h1>
      <p className="text-slate-400 mb-10 text-sm">Click "I'm Working" to volunteer for a task.</p>

      <div className="grid gap-6">
        {tasks.length === 0 && (
          <p className="text-slate-500">No tasks available right now.</p>
        )}
        {tasks.map((task) => {
          const vols = volunteersForTask(task.id);
          return (
            <div key={task.id} className="rounded-xl border border-slate-700 bg-slate-900 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{task.title}</h2>
                  <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                </div>
              </div>

              {/* VOLUNTEERS */}
              <div className="mt-4 text-sm">
                <span className="text-slate-400 font-medium">
                  Volunteers ({vols.length}):
                </span>
                {vols.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {vols.map((v) => (
                      <span key={v.id} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                        {v.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-600 ml-2">No volunteers yet</span>
                )}
              </div>

              <button
                onClick={() => setShowModal(task.id)}
                className="mt-5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
              >
                I'm Working
              </button>
            </div>
          );
        })}
      </div>

      {/* VOLUNTEER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#111] border border-slate-700 rounded-2xl p-8 w-full max-w-md">
            {success ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-white font-semibold text-lg">Thanks, {success}!</p>
                <p className="text-slate-400 text-sm mt-1">You've been added as a volunteer.</p>
              </div>
            ) : (
              <>
                <h3 className="text-white font-bold text-lg mb-1">Volunteer for Task</h3>
                <p className="text-slate-400 text-sm mb-6">
                  {tasks.find(t => t.id === showModal)?.title}
                </p>

                <div className="space-y-3">
                  <input
                    className="vol-input"
                    placeholder="Your Name *"
                    value={volName}
                    onChange={(e) => setVolName(e.target.value)}
                  />
                  <input
                    className="vol-input"
                    placeholder="Email (optional)"
                    value={volEmail}
                    onChange={(e) => setVolEmail(e.target.value)}
                  />
                  <input
                    className="vol-input"
                    placeholder="Phone (optional)"
                    value={volPhone}
                    onChange={(e) => setVolPhone(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => { setShowModal(null); setVolName(""); setVolEmail(""); setVolPhone(""); }}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 text-sm hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVolunteer}
                    disabled={!volName || submitting}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm transition"
                  >
                    {submitting ? "Submitting..." : "Confirm"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .vol-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #3f3f46;
          background: #09090b;
          font-size: 14px;
          outline: none;
          color: #fff;
        }
        .vol-input::placeholder { color: #71717a; }
        .vol-input:focus { border-color: #94a3b8; }
      `}</style>
    </div>
  );
}