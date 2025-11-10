import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import { BlockchainProvider } from "./context/BlockchainContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Connect from "./pages/Connect";
import Mint from "./pages/Mint";
import Strategy from "./pages/Strategy";
import TBA from "./pages/TBA";
import CrossChainYield from "./pages/CrossChainYield";
import AIOptimization from "./pages/AIOptimization";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BlockchainProvider>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/connect" element={<Connect />} />
              <Route path="/mint" element={<Mint />} />
              <Route path="/strategy" element={<Strategy />} />
              <Route path="/tba" element={<TBA />} />
              <Route path="/cross-chain-yield" element={<CrossChainYield />} />
              <Route path="/ai-optimization" element={<AIOptimization />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </BlockchainProvider>
  </QueryClientProvider>
);

export default App;
