import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Results() {
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch("http://localhost:3000/results");
      const data = await res.json();
      setResults(data);
    };

    fetchResults();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <h1 className="text-3xl font-bold">Election Results</h1>

        {results ? (
          <div className="mt-6 text-left space-y-2">
            <p>Candidate 1: {results.candidate1}</p>
            <p>Candidate 2: {results.candidate2}</p>
            <p>Candidate 3: {results.candidate3}</p>
            <p className="font-bold mt-3">Total Votes: {results.total}</p>
          </div>
        ) : (
          <p className="mt-6">Loading results...</p>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-8 rounded-xl bg-blue-700 px-6 py-3 text-white"
        >
          <Home size={18} /> Back to Home
        </button>
      </div>
    </div>
  );
}

export default Results;