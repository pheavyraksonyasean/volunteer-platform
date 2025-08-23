import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="flex-1 bg-pink-800 relative overflow-hidden flex items-center justify-center">
        {/* Content */}
        <div className="flex flex-col items-center justify-center text-white z-10">
          <img
            src="/logo.png"
            alt="Sabay Volunteer Logo"
            className="h-40 w-40 md:h-64 md:w-64 mb-6" // Bigger logo
          />
          <h1 className="text-4xl md:text-6xl font-bold">Sabay Volunteer</h1>
        </div>
      </div>
    </div>
  );
}
