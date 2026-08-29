import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LoaderCircle } from "lucide-react";
import { poseidon1 } from "poseidon-lite";

function secretToBigInt(secret) {
  if (!secret) {
    throw new Error("Secret credential is missing");
  }

  const bytes = new TextEncoder().encode(secret);

  let hex = "";

  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }

  return BigInt("0x" + hex);
}

function VerifyVoter() {
  const navigate = useNavigate();

  const [voterId, setVoterId] = useState("");
  const [secret, setSecret] = useState("");
  const [electionId, setElectionId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!voterId || !secret || !electionId) {
      alert("Please enter all fields");
      return;
    }

    setLoading(true);

    try {
      // --------------------------------------------------
      // Load registered voter information
      // --------------------------------------------------

      const response = await fetch("/voterProofData.json");

      if (!response.ok) {
        throw new Error("Voter proof data not found");
      }

      const voterData = await response.json();

      // --------------------------------------------------
      // Find voter using Voter ID
      // --------------------------------------------------

      const voter = voterData.voters.find(
        (v) =>
          v.voterId.toLowerCase() ===
          voterId.trim().toLowerCase()
      );

      if (!voter) {
        navigate("/invalid-credentials", {
          state: {
            message: "Voter ID not found.",
          },
        });
        return;
      }

      // --------------------------------------------------
      // Check Election ID
      // --------------------------------------------------

      if (
        electionId.trim() !==
        voterData.electionId.toString()
      ) {
        navigate("/invalid-credentials", {
          state: {
            message:
              "Invalid Secret Key or Election ID.",
          },
        });
        return;
      }

      // --------------------------------------------------
      // Verify Secret Key using Poseidon commitment
      // --------------------------------------------------

     const secretBigInt = secretToBigInt(secret);

console.log("Entered secret:", secret);
console.log("Secret BigInt:", secretBigInt.toString());

const calculatedCommitment =
  poseidon1([secretBigInt]).toString();

      console.log(
        "Calculated commitment:",
        calculatedCommitment
      );

      console.log(
        "Registered commitment:",
        voter.commitment
      );

      // --------------------------------------------------
      // Compare calculated commitment with registered one
      // --------------------------------------------------

      if (
        calculatedCommitment !==
        voter.commitment.toString()
      ) {
        navigate("/invalid-credentials", {
          state: {
            message:
              "Invalid Secret Key. The credential does not match the registered voter.",
          },
        });
        return;
      }

      // --------------------------------------------------
      // Verification successful
      // --------------------------------------------------

      await new Promise((res) =>
        setTimeout(res, 1000)
      );

      console.log("VERIFICATION SUCCESS");
console.log("NAVIGATING TO VOTE WITH:", {
  voterId: voter.voterId,
  secret,
  electionId,
  nullifierHash: voter.nullifierHash,
});

      // Continue to voting page
   navigate("/vote", {
  state: {
    voterId: voter.voterId,
    secret,
    electionId,
    nullifierHash: voter.nullifierHash,
  },
});

    } catch (error) {
      console.error(
        "Voter verification error:",
        error
      );

      navigate("/invalid-credentials", {
        state: {
          message:
            error.message ||
            "Unable to verify voter.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">

      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">

        {!loading ? (
          <>
            <ShieldCheck
              className="mx-auto text-blue-700"
              size={60}
            />

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              Verify Voter
            </h1>

            <p className="mt-3 text-slate-600">
              Enter your voter credentials to prove
              eligibility without revealing your identity.
            </p>

            <p className="mt-3 text-sm text-slate-600">
              Your private credential is never sent to
              the server. It is used to generate the
              Zero-Knowledge Proof.
            </p>

            <div className="mt-6 space-y-4">

              <input
                type="text"
                placeholder="Voter ID (e.g. VOTER-0001)"
                value={voterId}
                onChange={(e) =>
                  setVoterId(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-600"
              />

              <input
                type="text"
                placeholder="Private Voting Credential"
                value={secret}
                onChange={(e) =>
                  setSecret(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-600"
              />

              <input
                type="text"
                placeholder="Election ID"
                value={electionId}
                onChange={(e) =>
                  setElectionId(e.target.value)
                }
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
              Verifying Voter
            </h1>

            <p className="mt-4 text-slate-600">
              Checking voter eligibility and credential...
            </p>

            <div className="mt-6 rounded-2xl bg-blue-50 p-5 text-sm text-blue-700">
              Your private credential remains private
              and is used locally to generate the
              Zero-Knowledge Proof.
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default VerifyVoter;