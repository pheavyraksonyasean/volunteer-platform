import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="bg-pink-800 px-6 py-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20  rounded-full flex items-center justify-center backdrop-blur-sm">
              <img
                src="/logo.png"
                alt="Sabay Volunteer Logo"
                className="h-12 w-12"
              />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">Sabay Volunteer</h1>
            </div>
          </div>
        </div>

        {/* Mobile Form */}
        <div className="px-4 py-6 -mt-4">
          <div className="bg-white rounded-t-3xl shadow-xl p-6 min-h-[calc(100vh-200px)]">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left side - Register Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl">
            <LoginForm />
          </div>
        </div>

        {/* Right side - Branding */}
        <div className="flex-1 bg-pink-800 relative overflow-hidden flex items-center justify-center">
          {/* Content */}
          <div className="flex flex-col items-center justify-center text-white z-10 text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl scale-110"></div>
              <img
                src="/logo.png"
                alt="Sabay Volunteer Logo"
                className="h-32 w-32 xl:h-48 xl:w-48  "
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl xl:text-6xl font-bold tracking-tight">
                Sabay Volunteer
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
