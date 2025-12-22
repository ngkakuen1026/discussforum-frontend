interface RegisterStepperProps {
  currentStep: number;
}

const RegisterStepper = ({ currentStep }: RegisterStepperProps) => (
  <div className="mb-12">
    <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400">
      {[1, 2, 3, 4].map((step) => (
        <li
          key={step}
          className={`flex md:w-full items-center ${
            currentStep >= step ? "text-cyan-500" : ""
          } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-600 after:border after:hidden sm:after:inline-block after:mx-6`}
        >
          <span className="flex items-center">
            {currentStep > step ? (
              <svg
                className="w-5 h-5 me-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
            ) : (
              <span className="me-2 text-lg">{step}</span>
            )}
            <span className="hidden sm:inline">
              {step === 1 && "Account"}
              {step === 2 && "Personal"}
              {step === 3 && "Preview"}
              {step === 4 && "Confirm"}
            </span>
          </span>
        </li>
      ))}
    </ol>
  </div>
);

export default RegisterStepper;
