import { useState } from "react";
import { useNavigate } from "react-router-dom";

const candidates = [
  { id: 1, name: "Candidate 1", party: "Party A" },
  { id: 2, name: "Candidate 2", party: "Party B" },
  { id: 3, name: "Candidate 3", party: "Party C" },
];

export default function Vote() {
  const [selectedVote, setSelectedVote] = useState(null);
  const navigate = useNavigate();

  const selectedCandidate =
    candidates.find((c) => c.id === selectedVote) || null;

  const handleVoteSubmit = () => {
    if (!selectedVote) {
      alert("Please select a candidate");
      return;
    }

    // ✅ ONLY navigate, no backend call here
    navigate("/processing", {
      state: { candidate: selectedCandidate },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-4xl font-bold text-slate-900">Vote Page</h1>
        <p className="mb-8 text-slate-600">Select your preferred candidate.</p>

        <div className="grid gap-6 md:grid-cols-3">
          {candidates.map((candidate) => (
            <button
              key={candidate.id}
              onClick={() => setSelectedVote(candidate.id)}
              className={`rounded-2xl border p-6 text-left shadow-sm transition ${
                selectedVote === candidate.id
                  ? "border-blue-700 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-400"
              }`}
            >
              <h2 className="text-2xl font-bold text-slate-900">
                {candidate.name}
              </h2>
              <p className="mt-2 text-slate-600">{candidate.party}</p>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={handleVoteSubmit}
            className="rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Cast Vote
          </button>
        </div>
      </div>
    </div>
  );
}