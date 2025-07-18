// Route configuration for the application
export const ROUTES = {
  // Core routes
  HOME: '/',
  AUTH: '/auth',
  MARKETPLACE: '/marketplace',
  PRODUCT: '/product/:id',
  DASHBOARD: '/dashboard',
  
  // Buyer routes
  BUYER: {
    GUIDE: '/buyer/guide',
    SUPPORT: '/buyer/support',
    REFUND_POLICY: '/buyer/refund-policy',
  },
  
  // Seller routes
  SELLER: {
    DASHBOARD: '/seller/dashboard',
    GUIDE: '/seller/guide',
    FEES: '/seller/fees',
    RESOURCES: '/seller/resources',
  },
  
  // Company routes
  COMPANY: {
    ABOUT: '/company/about',
    PRIVACY: '/company/privacy',
    TERMS: '/company/terms',
    CONTACT: '/company/contact',
  },
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
  },
} as const;

// Helper function to get route by path
export const getRouteByPath = (path: string) => {
  const flatRoutes = flattenRoutes(ROUTES);
  return Object.entries(flatRoutes).find(([, routePath]) => routePath === path);
};

// Helper function to flatten nested route object
function flattenRoutes(routes: any, prefix = ''): Record<string, string> {
  const flat: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(routes)) {
    if (typeof value === 'string') {
      flat[`${prefix}${key}`] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(flat, flattenRoutes(value, `${prefix}${key}_`));
    }
  }
  
  return flat;
}
