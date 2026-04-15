import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoaderCircle, CheckCircle2 } from "lucide-react";

const steps = [
  "Preparing vote...",
  "Loading proof data...",
  "Sending vote to server...",
  "Verifying zero-knowledge proof...",
];

function Processing() {
  const navigate = useNavigate();
  const location = useLocation();
  const candidate = location.state?.candidate;

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!candidate) {
      navigate("/vote");
      return;
    }

    const processVote = async () => {
      try {
        setCurrentStep(0);
        await new Promise((res) => setTimeout(res, 800));

        setCurrentStep(1);
        const proofRes = await fetch("/demo/proof.json");
        const publicRes = await fetch("/demo/public.json");

        const proof = await proofRes.json();
        const publicSignals = await publicRes.json();

        await new Promise((res) => setTimeout(res, 800));

        setCurrentStep(2);
        const response = await fetch("http://localhost:3000/vote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            proof,
            publicSignals,
            vote: candidate.id,
          }),
        });

        const data = await response.json();

        await new Promise((res) => setTimeout(res, 800));

        setCurrentStep(3);
        await new Promise((res) => setTimeout(res, 800));

        if (data.success) {
          navigate("/success", {
            state: { candidate, votes: data.votes },
          });
        } else {
          alert(data.message || "Vote failed");
          navigate("/vote");
        }
      } catch (error) {
        console.error("Vote processing error:", error);
        alert("Something went wrong while processing the vote");
        navigate("/vote");
      }
    };

    processVote();
  }, [candidate, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <LoaderCircle className="mx-auto animate-spin text-blue-700" size={60} />

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Processing Vote
        </h1>

        <p className="mt-4 text-slate-600">{steps[currentStep]}</p>

        <div className="mt-6 space-y-3 text-left">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              {index < currentStep ? (
                <CheckCircle2 className="text-green-600" />
              ) : index === currentStep ? (
                <LoaderCircle className="animate-spin text-blue-700" size={20} />
              ) : (
                <div className="h-5 w-5 rounded-full border border-slate-300" />
              )}
              <span className="text-slate-700">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Processing;