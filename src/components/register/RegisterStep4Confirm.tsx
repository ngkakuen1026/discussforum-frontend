interface RegisterStep4ConfirmProps {
  isLoading: boolean;
  handleRegister: () => void;
  handleCancel: () => void;
  handleBackStep: () => void;
  isPending: boolean;
}

const RegisterStep4Confirm = ({
  isLoading,
  handleRegister,
  handleCancel,
  handleBackStep,
  isPending,
}: RegisterStep4ConfirmProps) => (
  <div className="text-center space-y-8">
    <h3 className="text-3xl font-bold text-white">Ready to Join?</h3>
    <p className="text-xl text-gray-400">One click and you're in the discussion</p>
    <div className="flex justify-center gap-6">
      <button
        onClick={handleRegister}
        disabled={isLoading}
        className="py-4 px-12 bg-linear-to-br from-gray-500 to-white hover:from-gray-400 hover:to-white text-white font-bold rounded-2xl transform hover:scale-110 transition-all disabled:opacity-50 text-lg shadow-2xl cursor-pointer"
      >
        {isPending ? "Creating Account..." : "Create Account"}
      </button>
      <button
        onClick={handleCancel}
        disabled={isLoading}
        className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-3 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl text-lg"
      >
        Cancel
      </button>
    </div>
    <button
      onClick={handleBackStep}
      className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
    >
      ← Go back
    </button>
  </div>
);

export default RegisterStep4Confirm;
