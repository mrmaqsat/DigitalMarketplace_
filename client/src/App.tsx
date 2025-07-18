import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import BrowsePage from "@/pages/browse-page";
import ProductPage from "@/pages/product-page";
import DashboardPage from "@/pages/dashboard-page";
import SellerDashboard from "@/pages/seller-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";
import HowToBuyPage from "@/pages/how-to-buy-page";
import SupportPage from "@/pages/support-page";
import RefundPolicyPage from "@/pages/refund-policy-page";
import SellerGuidePage from "@/pages/seller-guide-page";
import FeesPricingPage from "@/pages/fees-pricing-page";
import SellerResourcesPage from "@/pages/seller-resources-page";
import AboutUsPage from "@/pages/about-us-page";
import PrivacyPolicyPage from "@/pages/privacy-policy-page";
import TermsOfServicePage from "@/pages/terms-of-service-page";
import ContactPage from "@/pages/contact-page";
import SettingsPage from "@/pages/settings-page";

function Router() {
  return (
    <Switch>
      {/* Core application routes */}
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/browse" component={BrowsePage} />
      <Route path="/product/:id" component={ProductPage} />
      
      {/* Protected user routes */}
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/seller" component={SellerDashboard} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      
      {/* Buyer information routes */}
      <Route path="/how-to-buy" component={HowToBuyPage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/refund-policy" component={RefundPolicyPage} />
      
      {/* Seller information routes */}
      <Route path="/seller-guide" component={SellerGuidePage} />
      <Route path="/fees-pricing" component={FeesPricingPage} />
      <Route path="/seller-resources" component={SellerResourcesPage} />
      
      {/* Company information routes */}
      <Route path="/about-us" component={AboutUsPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route path="/contact" component={ContactPage} />
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
