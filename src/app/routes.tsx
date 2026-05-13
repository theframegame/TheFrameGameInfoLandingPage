import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { AdminLogin } from "./pages/admin-login";
import { AdminDashboard } from "./pages/admin-dashboard";
import { AdminDashboardPreview } from "./pages/admin-dashboard-preview";
import { ContactPage } from "./pages/contact";
import { BetaSignupPage } from "./pages/beta-signup";
import { ExplorePage } from "./pages/explore";

// Debug: Log when routes module loads
console.log('Routes loaded - BetaSignupPage:', BetaSignupPage);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/explore",
    Component: ExplorePage,
  },
  {
    path: "/contact",
    Component: ContactPage,
  },
  {
    path: "/beta",
    Component: BetaSignupPage,
  },
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/admin/preview",
    Component: AdminDashboardPreview,
  },
  {
    path: "*",
    Component: () => (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
          <a href="/" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors">
            Go Home
          </a>
        </div>
      </div>
    ),
  },
]);