import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ShieldCheck } from "lucide-react";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  const candidate = location.state?.candidate;
  const votes = location.state?.votes;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <div className="mb-6 flex justify-center">
          <CheckCircle2 size={70} className="text-emerald-600" />
        </div>

        <h1 className="mb-4 text-4xl font-bold text-slate-900">
          Vote Submitted Successfully
        </h1>

        <p className="mb-6 text-lg text-slate-600">
          Your vote has been securely recorded and verified.
        </p>

        {candidate && (
          <div className="mb-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Selected Candidate</p>
            <p className="mt-1 text-2xl font-bold text-blue-800">
              {candidate.name}
            </p>
            <p className="text-slate-600">{candidate.party}</p>
          </div>
        )}

        {votes && (
          <div className="mb-6 rounded-2xl bg-slate-50 p-5 text-left">
            <p className="mb-3 text-sm font-semibold text-slate-500">
              Current Vote Count
            </p>
            <p className="text-slate-700">Candidate 1: {votes[1]}</p>
            <p className="text-slate-700">Candidate 2: {votes[2]}</p>
            <p className="text-slate-700">Candidate 3: {votes[3]}</p>
          </div>
        )}

        <div className="mb-8 flex items-center justify-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700">
          <ShieldCheck size={22} />
          <span className="font-medium">
            Proof verified without revealing voter identity
          </span>
        </div>

        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white transition hover:bg-blue-800"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Success;