// import {
//   Users,
//   History,
//   Settings,
//   BarChart3,
//   Target,
//   Archive,
//   Zap,
//   Shield,
// } from "lucide-react";

// const features = [
//   {
//     title: "Add BD",
//     description: "Create a new BD user",
//     path: "/admin/add-bd",
//     icon: Users,
//     color: "cyan",
//     glowColor: "rgba(6, 182, 212, 0.5)",
//   },
//   {
//     title: "BD User History",
//     description: "View and manage BD user records",
//     path: "/admin/bd-history",
//     icon: History,
//     color: "purple",
//     glowColor: "rgba(147, 51, 234, 0.5)",
//   },
//   {
//     title: "Add Services",
//     description: "Add services, categories, and editing types",
//     path: "/admin/services",
//     icon: Settings,
//     color: "green",
//     glowColor: "rgba(34, 197, 94, 0.5)",
//   },
//   {
//     title: "Service History",
//     description: "Track all added services",
//     path: "/admin/service-history",
//     icon: BarChart3,
//     color: "orange",
//     glowColor: "rgba(249, 115, 22, 0.5)",
//   },
//   {
//     title: "Add Ads Settings",
//     description: "Configure ads category, amount & percentage",
//     path: "/admin/ads",
//     icon: Target,
//     color: "pink",
//     glowColor: "rgba(236, 72, 153, 0.5)",
//   },
//   {
//     title: "Ads Setting History",
//     description: "History of ads settings applied",
//     path: "/admin/ads-history",
//     icon: Archive,
//     color: "blue",
//     glowColor: "rgba(59, 130, 246, 0.5)",
//   },
// ];

// export default function AdminDashboard2() {
//   return (
//     <div className="min-h-screen bg-black relative overflow-hidden">
//       {/* Grid background */}
//       <div className="absolute inset-0 opacity-20">
//         <div
//           className="w-full h-full"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
//             `,
//             backgroundSize: "50px 50px",
//           }}
//         ></div>
//       </div>

//       {/* Animated scanlines */}
//       <div className="absolute inset-0">
//         <div
//           className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-30"
//           style={{ top: "20%", animation: "scanline 3s linear infinite" }}
//         ></div>
//         <div
//           className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse opacity-30"
//           style={{
//             top: "60%",
//             animation: "scanline 4s linear infinite reverse",
//           }}
//         ></div>
//       </div>

//       <div className="relative z-10 p-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-16">
//             <div className="flex justify-center items-center mb-8">
//               <div className="flex items-center space-x-4">
//                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
//                 <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping delay-150"></div>
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-ping delay-300"></div>
//               </div>
//             </div>

//             <h1 className="text-7xl font-black mb-4 relative">
//               <span className="text-white font-mono tracking-wider">ADMIN</span>
//               <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-mono tracking-wider animate-pulse">
//                 MATRIX
//               </span>
//               <div className="absolute -top-2 -right-2">
//                 <Zap className="w-8 h-8 text-yellow-400 animate-bounce" />
//               </div>
//             </h1>

//             <div className="flex justify-center items-center space-x-2 mb-6">
//               <Shield className="w-5 h-5 text-green-400" />
//               <span className="text-green-400 font-mono text-sm tracking-widest">
//                 SYSTEM ONLINE
//               </span>
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//             </div>
//           </div>

//           {/* Feature Grid */}
//           <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
//             {features.map((feature, index) => {
//               const IconComponent = feature.icon;
//               return (
//                 <div
//                   key={index}
//                   className="group relative cursor-pointer"
//                   onClick={() => console.log(`Navigate to: ${feature.path}`)}
//                 >
//                   {/* Outer glow */}
//                   <div
//                     className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
//                     style={{ backgroundColor: feature.glowColor }}
//                   ></div>

//                   {/* Card */}
//                   <div className="relative bg-gray-900/80 border border-gray-700 rounded-xl p-6 h-full backdrop-blur-sm group-hover:border-gray-500 transition-all duration-300">
//                     {/* Corner indicators */}
//                     <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

//                     {/* Icon */}
//                     <div className="mb-6">
//                       <div
//                         className={`inline-flex p-4 rounded-lg bg-${feature.color}-500/20 border border-${feature.color}-500/50 group-hover:bg-${feature.color}-500/30 transition-all duration-300`}
//                         style={{ boxShadow: `0 0 20px ${feature.glowColor}` }}
//                       >
//                         <IconComponent
//                           className={`w-8 h-8 text-${feature.color}-400 group-hover:text-${feature.color}-300 transition-colors duration-300`}
//                         />
//                       </div>
//                     </div>

//                     {/* Title */}
//                     <h2 className="text-2xl font-bold text-white mb-3 font-mono tracking-wide group-hover:text-cyan-300 transition-colors duration-300">
//                       {feature.title}
//                     </h2>

//                     {/* Description */}
//                     <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 font-mono text-sm">
//                       {feature.description}
//                     </p>

//                     {/* Status line */}
//                     <div className="mt-6 pt-4 border-t border-gray-700 group-hover:border-gray-600 transition-colors duration-300">
//                       <div className="flex items-center justify-between">
//                         <span className="text-xs font-mono text-gray-500 tracking-widest">
//                           STATUS
//                         </span>
//                         <div className="flex items-center space-x-2">
//                           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                           <span className="text-xs font-mono text-green-400 tracking-widest">
//                             READY
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* System Stats */}
//           <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
//             {[
//               { label: "CPU", value: "12.4%", color: "cyan" },
//               { label: "MEMORY", value: "67.8%", color: "purple" },
//               { label: "NETWORK", value: "234MB/s", color: "green" },
//               { label: "UPTIME", value: "99.99%", color: "orange" },
//             ].map((stat, index) => (
//               <div
//                 key={index}
//                 className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 text-center backdrop-blur-sm"
//               >
//                 <div
//                   className={`text-sm font-mono text-${stat.color}-400 mb-2 tracking-widest`}
//                 >
//                   {stat.label}
//                 </div>
//                 <div
//                   className={`text-2xl font-bold text-${stat.color}-300 font-mono`}
//                 >
//                   {stat.value}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes scanline {
//           0% {
//             transform: translateY(-100vh);
//           }
//           100% {
//             transform: translateY(100vh);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

import {
  Users,
  History,
  Settings,
  BarChart3,
  Target,
  Archive,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";

const features = [
  {
    id: 1,
    title: "Add BD",
    description: "Create new BD users with advanced permissions",
    path: "/admin/add-bd",
    icon: Users,
    size: "normal",
    color: "bg-gradient-to-br from-blue-500 to-cyan-500",
    stats: "12 Active Users",
  },
  {
    id: 2,
    title: "BD User History",
    description: "Complete user management and activity tracking",
    path: "/admin/bd-history",
    icon: History,
    size: "wide",
    color: "bg-gradient-to-br from-purple-500 to-pink-500",
    stats: "1,247 Records",
  },
  {
    id: 3,
    title: "Services",
    description: "Manage all services",
    path: "/admin/services",
    icon: Settings,
    size: "normal",
    color: "bg-gradient-to-br from-emerald-500 to-teal-500",
    stats: "34 Services",
  },
  {
    id: 4,
    title: "Analytics",
    description: "Service performance metrics and insights dashboard",
    path: "/admin/service-history",
    icon: BarChart3,
    size: "tall",
    color: "bg-gradient-to-br from-orange-500 to-red-500",
    stats: "↗ +23% This Week",
  },
  {
    id: 5,
    title: "Ads Config",
    description: "Configure advertising parameters",
    path: "/admin/ads",
    icon: Target,
    size: "normal",
    color: "bg-gradient-to-br from-violet-500 to-purple-500",
    stats: "8 Campaigns",
  },
  {
    id: 6,
    title: "Ad History",
    description: "Track advertising performance",
    path: "/admin/ads-history",
    icon: Archive,
    size: "normal",
    color: "bg-gradient-to-br from-indigo-500 to-blue-500",
    stats: "67% CTR",
  },
];

export default function AdminDashboard2() {
  const getSizeClass = (size) => {
    switch (size) {
      case "wide":
        return "md:col-span-2";
      case "tall":
        return "md:row-span-2";
      case "large":
        return "md:col-span-2 md:row-span-2";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-black text-slate-800 mb-2">
                Admin Control
              </h1>
              <p className="text-xl text-slate-600">
                Modern dashboard with bento-style layout
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Live
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">
                    +12%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className={`group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:scale-[1.02] ${getSizeClass(
                  feature.size
                )}`}
                onClick={() => console.log(`Navigate to: ${feature.path}`)}
              >
                {/* Background card */}
                <div className={`h-full ${feature.color} p-8 relative`}>
                  {/* Noise texture overlay */}
                  <div
                    className="absolute inset-0 opacity-10 mix-blend-overlay"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                  ></div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Title and description */}
                    <div className="mb-auto">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm font-medium">
                          {feature.stats}
                        </span>
                        <div className="flex items-center text-white/70">
                          <Zap className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">ACTIVE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-3xl">
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/30 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Quick Add",
              icon: Users,
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Export Data",
              icon: Archive,
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "View Reports",
              icon: BarChart3,
              color: "from-purple-500 to-pink-500",
            },
            {
              label: "Settings",
              icon: Settings,
              color: "from-orange-500 to-red-500",
            },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 group-hover:border-slate-300 group-hover:shadow-lg transition-all duration-300">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.color} mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                    {action.label}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------- PART 1 Dashboard ----------------
// import {
//   Users,
//   History,
//   Settings,
//   BarChart3,
//   Target,
//   Archive,
// } from "lucide-react";

// const features = [
//   {
//     title: "Add BD",
//     description: "Create a new BD user",
//     path: "/admin/add-bd",
//     icon: Users,
//     color: "from-purple-500 to-pink-500",
//     bgPattern:
//       "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
//   },
//   {
//     title: "BD User History",
//     description: "View and manage BD user records",
//     path: "/admin/bd-history",
//     icon: History,
//     color: "from-blue-500 to-cyan-500",
//     bgPattern:
//       "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)",
//   },
//   {
//     title: "Add Services",
//     description: "Add services, categories, and editing types",
//     path: "/admin/services",
//     icon: Settings,
//     color: "from-emerald-500 to-teal-500",
//     bgPattern:
//       "radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)",
//   },
//   {
//     title: "Service History",
//     description: "Track all added services",
//     path: "/admin/service-history",
//     icon: BarChart3,
//     color: "from-orange-500 to-red-500",
//     bgPattern:
//       "radial-gradient(circle at 25% 75%, rgba(249, 115, 22, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)",
//   },
//   {
//     title: "Add Ads Settings",
//     description: "Configure ads category, amount & percentage",
//     path: "/admin/ads",
//     icon: Target,
//     color: "from-violet-500 to-purple-500",
//     bgPattern:
//       "radial-gradient(circle at 35% 65%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 65% 35%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
//   },
//   {
//     title: "Ads Setting History",
//     description: "History of ads settings applied",
//     path: "/admin/ads-history",
//     icon: Archive,
//     color: "from-indigo-500 to-blue-500",
//     bgPattern:
//       "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
//   },
// ];

// export default function AdminDashboard() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">

//       <div className="absolute inset-0">
//         <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
//       </div>

//       <div className="relative z-10 p-8">
//         <div className="max-w-7xl mx-auto">

//           <div className="text-center mb-16">
//             <div className="inline-block p-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-6">
//               <div className="bg-slate-900 rounded-full px-8 py-2">
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-sm font-semibold tracking-wider uppercase">
//                   Control Center
//                 </span>
//               </div>
//             </div>
//             <h1 className="text-6xl font-black text-white mb-4">
//               DOAGuru
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
//                 {" "}
//                 Dashboard
//               </span>
//             </h1>
//           </div>

//           <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
//             {features.map((feature, index) => {
//               const IconComponent = feature.icon;
//               return (
//                 <div
//                   key={index}
//                   className="group relative overflow-hidden cursor-pointer"
//                   onClick={() => {
//                     // Replace with your navigation logic
//                     console.log(`Navigate to: ${feature.path}`);
//                   }}
//                 >

//                   <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full transition-all duration-500 hover:scale-105 hover:border-white/20 hover:bg-white/10">

//                     <div
//                       className="absolute inset-0 opacity-50 rounded-3xl"
//                       style={{ background: feature.bgPattern }}
//                     ></div>

//                     <div
//                       className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
//                     ></div>

//                     <div className="relative z-10">

//                       <div
//                         className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
//                       >
//                         <IconComponent className="w-8 h-8 text-white" />
//                       </div>

//                       <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
//                         {feature.title}
//                       </h2>

//                       <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
//                         {feature.description}
//                       </p>

//                       <div className="mt-6 flex items-center text-slate-400 group-hover:text-white transition-colors duration-300">
//                         <span className="text-sm font-medium">Access now</span>
//                         <svg
//                           className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 5l7 7-7 7"
//                           />
//                         </svg>
//                       </div>
//                     </div>

//                     <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
//                       <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
