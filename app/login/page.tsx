import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <LoginForm />
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
