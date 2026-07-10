import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Home, BarChart3 } from "lucide-react";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  const { candidate, votes, message, transactionHash, blockNumber } =
    location.state || {};

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <CheckCircle2 className="mx-auto text-green-600" size={72} />

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Vote Submitted Successfully
        </h1>

        <p className="mt-4 text-slate-600">{message}</p>

        <div className="mt-6 rounded-2xl bg-green-50 p-5 text-green-700">
          You voted for <b>{candidate?.name}</b>
        </div>

        {transactionHash && (
          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left text-sm text-slate-700">
            <h2 className="mb-2 font-semibold text-slate-900">
              Blockchain Transaction Details
            </h2>

            <p className="break-all">
              <b>Transaction Hash:</b> {transactionHash}
            </p>

            <p className="mt-2">
              <b>Block Number:</b> {blockNumber}
            </p>

            <p className="mt-3 text-green-700 font-medium">
               ✔ Vote recorded on blockchain successfully
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Network: Local Hardhat Blockchain (127.0.0.1:8545)
            </p>
          </div>
        )}

        {votes && (
          <div className="mt-6 text-left">
            <h2 className="mb-2 font-semibold">Current Results:</h2>
            <p>Candidate 1: {votes.candidate1}</p>
            <p>Candidate 2: {votes.candidate2}</p>
            <p>Candidate 3: {votes.candidate3}</p>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-white"
          >
            <Home size={18} /> Home
          </button>

          <button
            onClick={() => navigate("/results")}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-700 px-6 py-3 text-white"
          >
            <BarChart3 size={18} /> View Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default Success;