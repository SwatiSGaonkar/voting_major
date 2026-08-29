import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoaderCircle, CheckCircle2 } from "lucide-react";
import { groth16 } from "snarkjs";

const steps = [
  "Preparing vote...",
  "Loading voter proof data...",
  "Generating zero-knowledge proof...",
  "Sending vote to server...",
  "Verifying zero-knowledge proof...",
];

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

function Processing() {
  const navigate = useNavigate();
  const location = useLocation();

  const candidate = location.state?.candidate;
  const voterId = location.state?.voterId;
  const secret = location.state?.secret;
  const electionId = location.state?.electionId;

  const [currentStep, setCurrentStep] = useState(0);

  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;

    hasProcessed.current = true;

    if (!candidate || !voterId || !secret || !electionId) {
     navigate("/verify-voter");
      return;
    }

    const processVote = async () => {
      try {
        // --------------------------------------------------
        // STEP 1
        // --------------------------------------------------

        setCurrentStep(0);

        await new Promise((res) =>
          setTimeout(res, 800)
        );

        // --------------------------------------------------
        // STEP 2
        // Load voter proof information
        // --------------------------------------------------

        setCurrentStep(1);

        const voterDataResponse = await fetch(
          "/voterProofData.json"
        );

        if (!voterDataResponse.ok) {
          throw new Error(
            "Voter proof data not found"
          );
        }

        const voterData =
          await voterDataResponse.json();

        const voter = voterData.voters.find(
          (v) => v.voterId === voterId
        );

        if (!voter) {
          throw new Error(
            "Voter proof information not found"
          );
        }

        if (
          electionId.toString() !==
          voterData.electionId.toString()
        ) {
          throw new Error(
            "Invalid Election ID"
          );
        }

        if (!voter.nullifierHash) {
          throw new Error(
            "Nullifier hash not found for voter"
          );
        }

        await new Promise((res) =>
          setTimeout(res, 800)
        );

        // --------------------------------------------------
        // STEP 3
        // Generate ZKP
        // --------------------------------------------------

        setCurrentStep(2);

        console.log(
          "Generating ZKP proof..."
        );

        // Convert secret exactly the same way
        // as registerVoter.js
        const secretBigInt =
          secretToBigInt(secret);

        // Prepare vote selector signals
        const isVote1 =
          candidate.id === 1 ? "1" : "0";

        const isVote2 =
          candidate.id === 2 ? "1" : "0";

        const isVote3 =
          candidate.id === 3 ? "1" : "0";

        const input = {
          secret:
            secretBigInt.toString(),

          electionId:
            electionId.toString(),

          vote:
            candidate.id.toString(),

          pathElements:
            voter.pathElements,

          pathIndices:
            voter.pathIndices,

          root:
            voterData.root,

          nullifierHash:
            voter.nullifierHash,

          isVote1,

          isVote2,

          isVote3,
        };

        console.log(
          "ZKP input prepared:",
          {
            voterId,
            electionId,
            vote: candidate.id,
            root: voterData.root,
            nullifierHash:
              voter.nullifierHash,
          }
        );

        console.log(
          "Calling groth16.fullProve..."
        );

        const { proof, publicSignals } =
          await groth16.fullProve(
            input,
            "/Vote.wasm",
            "/Vote_final.zkey"
          );

        console.log(
          "ZKP proof generated successfully!"
        );

        console.log(
          "Public signals:",
          publicSignals
        );

        // --------------------------------------------------
        // STEP 4
        // Send proof to backend
        // --------------------------------------------------

        setCurrentStep(3);

        const response = await fetch(
          "http://localhost:3000/vote",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              proof,
              publicSignals,
              vote: candidate.id,
            }),
          }
        );

        const data =
          await response.json();

        console.log(
          "Backend response:",
          data
        );

        await new Promise((res) =>
          setTimeout(res, 800)
        );

        // --------------------------------------------------
        // STEP 5
        // Verification result
        // --------------------------------------------------

        setCurrentStep(4);

        await new Promise((res) =>
          setTimeout(res, 800)
        );

        if (data.success) {
          navigate("/success", {
            state: {
              candidate,
              votes: data.votes,
              message: data.message,
              transactionHash:
                data.transactionHash,
              blockNumber:
                data.blockNumber,
            },
          });

          return;
        }

        if (
          data.message?.includes(
            "Duplicate vote"
          )
        ) {
          navigate(
            "/duplicate-vote",
            {
              state: {
                candidate,
              },
            }
          );

          return;
        }

navigate("/error", {
  state: {
    candidate,
    message:
      data.message ||
      "Vote verification failed.",
  },
});

return;

        navigate("/error", {
          state: {
            candidate,
            message:
              data.message ||
              "Vote failed",
          },
        });

      } catch (error) {
        console.error(
          "Vote processing error:",
          error
        );

        navigate("/error", {
          state: {
            candidate,
            message:
              error.message ||
              "Something went wrong while processing the vote",
          },
        });
      }
    };

    processVote();
  }, [
    candidate,
    voterId,
    secret,
    electionId,
    navigate,
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">

      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">

        <LoaderCircle
          className="mx-auto animate-spin text-blue-700"
          size={60}
        />

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Processing Vote
        </h1>

        <p className="mt-4 text-slate-600">
          {steps[currentStep]}
        </p>

        <div className="mt-6 space-y-3 text-left">

          {steps.map(
            (step, index) => (
              <div
                key={index}
                className="flex items-center gap-3"
              >

                {index <
                currentStep ? (
                  <CheckCircle2
                    className="text-green-600"
                  />
                ) : index ===
                  currentStep ? (
                  <LoaderCircle
                    className="animate-spin text-blue-700"
                    size={20}
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-slate-300" />
                )}

                <span className="text-slate-700">
                  {step}
                </span>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}

export default Processing;