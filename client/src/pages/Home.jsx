import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Vote, Lock, X, CheckCircle2 } from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="w-full border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-900">
              SecureVote
            </h1>
            <p className="text-sm text-slate-500">
              Zero-Knowledge Based Digital Voting System
            </p>
          </div>
          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Election Portal
          </div>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Secure • Anonymous • Verifiable
          </p>

          <h2 className="mb-6 text-5xl font-bold leading-tight text-slate-900">
            Cast Your Vote
            <span className="block text-blue-700">
              Safely and Transparently
            </span>
          </h2>

          <p className="mb-8 max-w-xl text-lg leading-8 text-slate-600">
            A modern digital voting platform powered by Zero-Knowledge Proofs,
            ensuring voter privacy, election integrity, and secure verification.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/verify")}
              className="rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-blue-800"
            >
              Start Voting
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="rounded-xl border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid gap-6"
        >
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck className="text-blue-700" size={28} />
              <h3 className="text-xl font-bold">Verified Security</h3>
            </div>
            <p className="text-slate-600">
              Every vote is protected with cryptographic security and proof-based
              verification.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="text-blue-700" size={28} />
              <h3 className="text-xl font-bold">Anonymous Voting</h3>
            </div>
            <p className="text-slate-600">
              Your identity remains private while your vote remains valid and
              verifiable.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <Vote className="text-blue-700" size={28} />
              <h3 className="text-xl font-bold">Transparent Results</h3>
            </div>
            <p className="text-slate-600">
              Election data can be verified without exposing sensitive voter
              information.
            </p>
          </div>
        </motion.div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  How SecureVote Works
                </h2>
                <p className="mt-2 text-slate-600">
                  SecureVote combines Zero-Knowledge Proofs with blockchain-based
                  storage for private and transparent voting.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-full bg-slate-100 p-2 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-1 text-green-600" size={22} />
                <p className="text-slate-700">
                  Voters prove eligibility without revealing their identity.
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="mt-1 text-green-600" size={22} />
                <p className="text-slate-700">
                  A nullifier prevents the same voter from voting twice.
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="mt-1 text-green-600" size={22} />
                <p className="text-slate-700">
                  Verified votes are stored on blockchain for transparency.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-8 w-full rounded-xl bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Home;