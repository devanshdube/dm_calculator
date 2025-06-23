// import React, { useState } from "react";
import React from "react";
import {
  Palette,
  Megaphone,
  Search,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Eye,
  ArrowLeft,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function ServicesLanding() {
  const navigate = useNavigate();
  const { id, proposalId } = useParams();

  console.log(id, proposalId);

  //   const [hoveredCard, setHoveredCard] = useState(null);

  // Sample data
  const totalAmount = 15750.0;
  const clientOrders = [
    {
      id: 1,
      service: "Logo Design",
      client: "TechCorp",
      amount: 2500,
      status: "completed",
    },
    {
      id: 2,
      service: "SEO Campaign",
      client: "StartupXYZ",
      amount: 4200,
      status: "in-progress",
    },
    {
      id: 3,
      service: "Google Ads",
      client: "RetailCo",
      amount: 3800,
      status: "pending",
    },
    {
      id: 4,
      service: "Brand Identity",
      client: "FoodieApp",
      amount: 5250,
      status: "completed",
    },
  ];

  const services = [
    {
      id: 1,
      title: "Graphic Services",
      subtitle: "Visual Storytelling",
      description:
        "Transform your brand with stunning visuals that captivate and convert. From logos to complete brand identities.",
      icon: Palette,
      gradient: "from-slate-600 to-gray-700",
      bgPattern: "bg-gradient-to-br from-slate-50 to-gray-50",
      navigation: "/admin/calculator",
      features: [
        "Logo Design",
        "Brand Identity",
        "Print Materials",
        "Digital Graphics",
      ],
    },
    {
      id: 2,
      title: "Ads Campaigns",
      subtitle: "Strategic Growth",
      description:
        "Amplify your reach with data-driven advertising campaigns that deliver measurable results across all platforms.",
      icon: Megaphone,
      gradient: "from-blue-600 to-slate-700",
      bgPattern: "bg-gradient-to-br from-blue-50 to-slate-50",
      navigation: "/admin/Adscalculator",
      features: [
        "Social Media Ads",
        "Google Ads",
        "Campaign Strategy",
        "Analytics & ROI",
      ],
    },
    {
      id: 3,
      title: "SEO Services",
      subtitle: "Organic Visibility",
      description:
        "Dominate search results with comprehensive SEO strategies that boost your online presence and drive organic traffic.",
      icon: Search,
      gradient: "from-gray-600 to-slate-700",
      bgPattern: "bg-gradient-to-br from-gray-50 to-slate-50",
      navigation: "#",
      features: [
        "Keyword Research",
        "On-Page SEO",
        "Link Building",
        "Technical SEO",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-4">
        {/* Header */}
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-white/90 text-lg font-medium">
              Digital Services
            </span>
          </div>
        </div>
        {/* Top Section - Back Button, Total Amount, Client Orders */}
        <div className="mb-12">
          {/* Back Button */}
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 transform transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          {/* Top Stats Row */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Total Amount Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm font-medium">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-white">
                    ${totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-slate-700 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm font-medium">
                    Active Orders
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {clientOrders.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="group relative">
                {/* Card */}
                <div
                  className={`
                  relative h-full bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20
                  transform transition-all duration-300 hover:scale-102 hover:bg-white/15 hover:border-white/30
                `}
                >
                  {/* Icon with gradient background */}
                  <div
                    className={`
                    inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
                    bg-gradient-to-r ${service.gradient} shadow-lg
                    transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                  `}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {service.title}
                      </h3>
                      <p
                        className={`text-sm font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}
                      >
                        {service.subtitle}
                      </p>
                    </div>

                    <p className="text-white/70 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {service.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-white/60"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`}
                          ></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => {
                        navigate(`${service.navigation}/${id}/${proposalId}`);
                      }}
                      className={`
                      w-full mt-6 py-4 px-6 rounded-2xl font-semibold text-white
                      bg-gradient-to-r ${service.gradient} shadow-lg
                      transform transition-all duration-300 hover:shadow-xl hover:scale-105
                      flex items-center justify-center gap-2 group/btn
                    `}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>

                  {/* Hover effect overlay */}
                  {/* <div
                    className={`
                    absolute inset-0 rounded-3xl opacity-0 
                  `}
                  ></div> */}
                </div>

                {/* Floating elements */}
                <div
                  className={`
                  absolute -top-2 -right-2 w-6 h-6 rounded-full 
                  bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100
                  transform transition-all duration-500 group-hover:scale-100 scale-0
                `}
                >
                  <div className="w-full h-full rounded-full animate-ping bg-gradient-to-r from-white/30 to-transparent"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Client Orders */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Recent Client Orders
          </h3>
          <div className="space-y-3">
            {clientOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      order.status === "completed"
                        ? "bg-green-500"
                        : order.status === "in-progress"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div>
                    <p className="font-semibold text-white">{order.service}</p>
                    <p className="text-sm text-white/60">{order.client}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="font-bold text-white">
                    ${order.amount.toLocaleString()}
                  </span>
                  {order.status === "completed" && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {order.status === "in-progress" && (
                    <Clock className="w-4 h-4 text-yellow-500" />
                  )}
                  {order.status === "pending" && (
                    <Clock className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
