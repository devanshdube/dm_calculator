import React, { useEffect, useState, useMemo } from "react";

export default function NavTabs({
  tabs = [],
  activeTab,
  onChange,
  fixedUnderHeader = true,
  persistKey,
  className = "",
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!persistKey) return;
    const saved = localStorage.getItem(persistKey);
    if (saved && tabs.some((t) => t.id === saved) && saved !== activeTab) {
      onChange(saved);
    }
  }, [persistKey]);

  useEffect(() => {
    if (!persistKey) return;
    if (activeTab) localStorage.setItem(persistKey, activeTab);
  }, [activeTab, persistKey]);

  const handleTabClick = (id) => {
    onChange?.(id);
    setMobileMenuOpen(false);
  };

  const containerStyles = useMemo(
    () =>
      fixedUnderHeader ? "fixed top-16 left-0 right-0 z-20" : "relative z-20",
    [fixedUnderHeader]
  );

  return (
    <>
      {/* Desktop Tabs (under header) */}
      <nav
        className={[
          "hidden lg:block",
          containerStyles,
          "h-12 bg-gray-900/40 backdrop-blur-xl border-b border-gray-800/50",
          className,
        ].join(" ")}
      >
        <div className="h-full w-full px-3 lg:px-4">
          <div className="h-full overflow-x-auto no-scrollbar">
            <div className="h-full flex items-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={[
                      "flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium",
                      "whitespace-nowrap min-w-max transition-all duration-200",
                      isActive
                        ? "bg-purple-500/20 text-purple-100 ring-1 ring-purple-400/40"
                        : "text-gray-200 hover:text-white hover:bg-white/10",
                    ].join(" ")}
                    title={tab.label}
                  >
                    {Icon ? <Icon className="w-4 h-4 shrink-0" /> : null}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <div className={[fixedUnderHeader ? "mt-16" : "", "lg:hidden"].join(" ")}>
        <div className="flex items-center justify-end px-4 py-2">
          <button
            onClick={() => setMobileMenuOpen((s) => !s)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5">{mobileMenuOpen ? "✖" : "☰"}</div>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="bg-gray-800/95 backdrop-blur-xl border-y border-gray-700/50">
            <div className="px-4 py-3 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={[
                      "w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300",
                      isActive
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50",
                    ].join(" ")}
                  >
                    {Icon ? <Icon className="w-5 h-5" /> : null}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-gray-800/95 backdrop-blur-xl border-t border-gray-700/50 h-14">
        <div className="h-full flex justify-around items-center">
          {tabs.slice(0, 4).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={[
                  "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-300",
                  isActive
                    ? "text-purple-400 bg-purple-500/20"
                    : "text-gray-400 hover:text-white",
                ].join(" ")}
              >
                {Icon ? <Icon className="w-5 h-5" /> : null}
                <span className="text-xs font-medium">
                  {tab.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
