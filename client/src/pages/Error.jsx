import { useLocation, useNavigate } from "react-router-dom";
import { XCircle, Home } from "lucide-react";

function Error() {
  const navigate = useNavigate();
  const location = useLocation();

  const message =
    location.state?.message ||
    "Your vote could not be submitted.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">

        <XCircle
          className="mx-auto text-red-600"
          size={72}
        />

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Vote Not Submitted
        </h1>

        <p className="mt-4 text-slate-600">
          {message}
        </p>

        <div className="mt-6 rounded-2xl bg-red-50 p-5 text-red-700">
          <p className="font-semibold">
            The voting process could not be completed.
          </p>

          <p className="mt-2 text-sm">
            Please try again. If the problem continues, contact the
            election administrator.
          </p>
        </div>

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

export default Error;