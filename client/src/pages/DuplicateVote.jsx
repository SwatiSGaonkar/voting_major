import { useLocation, useNavigate } from "react-router-dom";
import { ShieldX, Home } from "lucide-react";

function DuplicateVote() {
  const navigate = useNavigate();
  const location = useLocation();

  const candidate = location.state?.candidate;

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 px-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">

        <ShieldX
          className="mx-auto text-red-600"
          size={72}
        />

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Vote Already Submitted
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          You have already voted in this election.
        </p>

        <div className="mt-6 rounded-2xl bg-red-50 p-5 text-red-700">
          <p className="font-semibold">
            Duplicate Vote Detected
          </p>

          <p className="mt-2 text-sm">
            Your Zero-Knowledge Proof was valid, but the
            nullifier associated with this voter has already
            been used.
          </p>

          {candidate && (
            <p className="mt-3 text-sm">
              Attempted candidate:{" "}
              <span className="font-semibold">
                {candidate.name}
              </span>
            </p>
          )}
        </div>

        <p className="mt-6 text-sm text-slate-500">
  Your previous vote remains recorded. No second vote was
  submitted to the blockchain.
</p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-800"
        >
          <Home size={20} />
          Back to Home
        </button>

      </div>
    </div>
  );
}

export default DuplicateVote;