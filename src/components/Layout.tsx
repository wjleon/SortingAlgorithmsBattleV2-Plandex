
import React from "react";

interface LayoutProps {
  children?: React.ReactNode;
  configPanel: React.ReactNode;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  configPanel,
  leftPanel,
  rightPanel,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Section - Global Configuration Controls */}
      <section className="w-full p-4 bg-white shadow-md mb-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Global Configuration Controls
        </h2>
        <div className="max-w-5xl mx-auto">{configPanel}</div>
      </section>

      {/* Bottom Section - Visualization Panels */}
      <section className="flex-grow w-full p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Left Panel */}
          <div className="bg-white p-4 rounded-lg shadow-md h-full min-h-[400px] flex flex-col">
            {leftPanel}
          </div>

          {/* Right Panel */}
          <div className="bg-white p-4 rounded-lg shadow-md h-full min-h-[400px] flex flex-col">
            {rightPanel}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Layout;

