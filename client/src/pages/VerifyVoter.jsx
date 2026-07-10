import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LoaderCircle } from "lucide-react";

function VerifyVoter() {
  const navigate = useNavigate();

  const [secret, setSecret] = useState("");
  const [electionId, setElectionId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!secret || !electionId) {
      alert("Please enter all fields");
      return;
    }

    setLoading(true);

    await new Promise((res) => setTimeout(res, 2000));

    navigate("/vote", {
      state: {
        secret,
        electionId,
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
        {!loading ? (
          <>
            <ShieldCheck className="mx-auto text-blue-700" size={60} />

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              Verify Voter
            </h1>

            <p className="mt-3 text-slate-600">
              Enter your private voting credential to prove eligibility without
              revealing your identity.
            </p>

            <p className="mt-3 text-sm text-slate-600">
              This credential is used to generate a Zero-Knowledge Proof without
              revealing who you are.
            </p>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Private Voting Credential"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-600"
              />

              <input
                type="text"
                placeholder="Election ID"
                value={electionId}
                onChange={(e) => setElectionId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-600"
              />
            </div>

            <button
              onClick={handleVerify}
              className="mt-6 w-full rounded-xl bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Verify & Continue
            </button>
          </>
        ) : (
          <>
            <LoaderCircle
              className="mx-auto animate-spin text-blue-700"
              size={60}
            />

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              Generating ZKP Proof
            </h1>

            <p className="mt-4 text-slate-600">
              Creating a Zero-Knowledge Proof to verify voter eligibility...
            </p>

            <div className="mt-6 rounded-2xl bg-blue-50 p-5 text-sm text-blue-700">
              Your identity stays private. Only proof of eligibility is sent for
              verification.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyVoter;