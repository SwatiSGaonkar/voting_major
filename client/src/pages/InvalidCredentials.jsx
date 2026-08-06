import { useLocation, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

function InvalidCredentials() {
  const navigate = useNavigate();
  const location = useLocation();

  const message =
    location.state?.message || "Invalid voter credentials.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 px-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">

        <XCircle
          size={70}
          className="mx-auto text-red-600"
        />

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Verification Failed
        </h1>

        <p className="mt-4 text-slate-600">
          {message}
        </p>

        <div className="mt-6 rounded-2xl bg-red-100 p-4 text-red-700">
          Please check your Secret Key and Election ID and try again.
        </div>

        <button
          onClick={() => navigate("/verify")}
          className="mt-8 rounded-xl bg-red-600 px-8 py-3 font-semibold text-white hover:bg-red-700"
        >
          Back to Verification
        </button>

      </div>
    </div>
  );
}

export default InvalidCredentials;