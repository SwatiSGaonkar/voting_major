<button
  onClick={handleSubmit}
  disabled={!selected || loading}
  className="mt-10 bg-blue-500 px-8 py-3 rounded-xl disabled:opacity-50 transition-all duration-300"
>
  {loading ? <Loader /> : "Submit Vote"}
</button>