import { useLocation, useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";

function InvalidCredentials() {
  const navigate = useNavigate();
  const location = useLocation();

  const message =
    location.state?.message || "The voter credentials could not be verified.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">

        <XCircle
          size={72}
          className="mx-auto text-red-600"
        />

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Verification Failed
        </h1>

        <p className="mt-4 text-slate-600">
          {message}
        </p>

        <div className="mt-6 rounded-2xl bg-red-50 p-5 text-red-700">
          <p className="font-semibold">
            Your voter credentials are invalid.
          </p>

          <p className="mt-2 text-sm">
            Please verify your Secret Key and Election ID and try again.
          </p>
        </div>

        <button
          onClick={() => navigate("/verify-voter")}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-800"
        >
          <ArrowLeft size={20} />
          Try Again
        </button>

      </div>
    </div>
  );
}

export default InvalidCredentials;