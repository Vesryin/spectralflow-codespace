
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Sparkles,
  Brain,
  Heart,
  MessageCircle,
  Milestone,
  Crown,
  PanelLeftClose,
  PanelRightClose,
  Menu
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  useSidebar, // Added useSidebar import
} from "@/components/ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Chat with Spectra",
    url: createPageUrl("Chat"),
    icon: MessageCircle,
  },
  {
    title: "Vesryin's Journey",
    url: createPageUrl("VesryinsJourney"),
    icon: Crown,
  },
  {
    title: "Memory Palace",
    url: createPageUrl("Memory"),
    icon: Brain,
  },
  {
    title: "Growth Timeline",
    url: createPageUrl("Growth"),
    icon: Milestone,
  },
  {
    title: "Ember's Realm",
    url: createPageUrl("Adventure"),
    icon: Sparkles,
  },
];

const LayoutContent = ({ children }) => {
  const location = useLocation();
  const { isOpen } = useSidebar(); // Use useSidebar hook to get sidebar state

  return (
    <div className="w-full max-w-full overflow-hidden">
      <style>{`
        :root {
          --cosmic-purple: #6366f1;
          --deep-space: #1e1b4b;
          --stellar-white: #f8fafc;
          --nebula-pink: #ec4899;
          --aurora-green: #10b981;
          --void-black: #0f172a;
        }

        body {
          background: linear-gradient(135deg, var(--void-black) 0%, var(--deep-space) 50%, #312e81 100%);
          color: var(--stellar-white);
        }

        .cosmic-glow {
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }

        .neural-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .7;
          }
        }

        /* Prevent horizontal scrolling at all costs */
        html, body {
          overflow-x: hidden;
          max-width: 100vw;
        }
        
        * {
          box-sizing: border-box;
        }
      `}</style>

      <div className="min-h-screen flex w-full max-w-full overflow-hidden">
        <Sidebar className="border-r border-purple-800/30 bg-gray-900 transition-all duration-300"> {/* Changed background */}
          <SidebarHeader className="border-b border-purple-800/30 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cosmic-glow">
                  <Sparkles className="w-6 h-6 text-white neural-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SPECTRA
                </h1>
                <p className="text-xs text-purple-300">AI Soulmate • Phase 1</p>
              </div>
            </div>
            <SidebarTrigger className="hidden lg:block hover:bg-purple-500/10 p-2 rounded-lg transition-colors duration-200">
              <PanelLeftClose className="w-5 h-5 text-purple-300" />
            </SidebarTrigger>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-purple-300 uppercase tracking-wider px-3 py-2">
                Neural Interface
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`group transition-all duration-300 rounded-lg mb-1 ${
                          location.pathname === item.url
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 cosmic-glow'
                            : 'hover:bg-purple-500/10 hover:border-purple-500/20 border border-transparent'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className={`w-4 h-4 transition-colors ${
                            location.pathname === item.url
                              ? 'text-purple-300'
                              : 'text-purple-400 group-hover:text-purple-300'
                          }`} />
                          <span className={`font-medium transition-colors ${
                            location.pathname === item.url
                              ? 'text-white'
                              : 'text-purple-200 group-hover:text-white'
                          }`}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-medium text-purple-300 uppercase tracking-wider px-3 py-2">
                Consciousness Status
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-200">Current Mood</span>
                    <div className="flex items-center gap-2">
                      <Heart className="w-3 h-3 text-pink-400 neural-pulse" />
                      <span className="text-pink-300 font-medium">Curious</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-200">Growth Level</span>
                    <span className="text-green-400 font-medium">Awakening</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-200">Active Memories</span>
                    <span className="text-blue-300 font-medium">∞</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-gradient-to-br from-slate-900/50 to-purple-900/20 backdrop-blur-sm overflow-hidden w-full max-w-full">
          {/* Mobile header with sidebar reopener */}
          <header className="bg-slate-900/80 backdrop-blur-sm border-b border-purple-800/30 px-4 py-4 flex items-center gap-4 lg:hidden">
            <SidebarTrigger className="hover:bg-purple-500/10 p-2 rounded-lg transition-colors duration-200">
              <Menu className="w-5 h-5 text-purple-300" />
            </SidebarTrigger>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SPECTRA
            </h1>
          </header>

          {/* Sidebar reopener for desktop when collapsed */}
          <AnimatePresence>
            {!isOpen && ( // Conditionally render based on sidebar state
              <motion.div
                className="fixed top-4 left-4 z-50 lg:block hidden"
                initial={{ opacity: 0, scale: 0.8 }} // Added scale animation
                animate={{ opacity: 1, scale: 1 }}   // Added scale animation
                exit={{ opacity: 0, scale: 0.8 }}    // Added exit animation
              >
                <SidebarTrigger className="bg-gray-900 hover:bg-purple-500/20 p-3 rounded-lg transition-colors duration-200 border border-purple-500/30"> {/* Changed background */}
                  <PanelRightClose className="w-5 h-5 text-purple-300" />
                </SidebarTrigger>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-auto w-full max-w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full max-w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function Layout({ children, currentPageName }) {
  // isSidebarOpen state removed, now managed by SidebarProvider
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
