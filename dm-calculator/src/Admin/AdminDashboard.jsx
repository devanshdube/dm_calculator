import {
  Users,
  History,
  Settings,
  BarChart3,
  Target,
  Archive,
} from "lucide-react";

const features = [
  {
    title: "Add BD",
    description: "Create a new BD user",
    path: "/admin/add-bd",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    bgPattern:
      "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
  },
  {
    title: "BD User History",
    description: "View and manage BD user records",
    path: "/admin/bd-history",
    icon: History,
    color: "from-blue-500 to-cyan-500",
    bgPattern:
      "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)",
  },
  {
    title: "Add Services",
    description: "Add services, categories, and editing types",
    path: "/admin/services",
    icon: Settings,
    color: "from-emerald-500 to-teal-500",
    bgPattern:
      "radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)",
  },
  {
    title: "Service History",
    description: "Track all added services",
    path: "/admin/service-history",
    icon: BarChart3,
    color: "from-orange-500 to-red-500",
    bgPattern:
      "radial-gradient(circle at 25% 75%, rgba(249, 115, 22, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)",
  },
  {
    title: "Add Ads Settings",
    description: "Configure ads category, amount & percentage",
    path: "/admin/ads",
    icon: Target,
    color: "from-violet-500 to-purple-500",
    bgPattern:
      "radial-gradient(circle at 35% 65%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 65% 35%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
  },
  {
    title: "Ads Setting History",
    description: "History of ads settings applied",
    path: "/admin/ads-history",
    icon: Archive,
    color: "from-indigo-500 to-blue-500",
    bgPattern:
      "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-6">
              <div className="bg-slate-900 rounded-full px-8 py-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-sm font-semibold tracking-wider uppercase">
                  Control Center
                </span>
              </div>
            </div>
            <h1 className="text-6xl font-black text-white mb-4">
              DOAGuru
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                {" "}
                Dashboard
              </span>
            </h1>
          </div>

          {/* Feature Grid */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden cursor-pointer"
                  onClick={() => {
                    // Replace with your navigation logic
                    console.log(`Navigate to: ${feature.path}`);
                  }}
                >
                  {/* Card */}
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full transition-all duration-500 hover:scale-105 hover:border-white/20 hover:bg-white/10">
                    {/* Background pattern */}
                    <div
                      className="absolute inset-0 opacity-50 rounded-3xl"
                      style={{ background: feature.bgPattern }}
                    ></div>

                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div
                        className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                        {feature.title}
                      </h2>

                      {/* Description */}
                      <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                        {feature.description}
                      </p>

                      {/* Arrow indicator */}
                      <div className="mt-6 flex items-center text-slate-400 group-hover:text-white transition-colors duration-300">
                        <span className="text-sm font-medium">Access now</span>
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer stats */}
          {/* <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-400">System Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-slate-400">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">∞</div>
              <div className="text-slate-400">Scalability</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
