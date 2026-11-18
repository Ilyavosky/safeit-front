export const ROUTES = {
  login: "/login",
  register: "/register",
  mfa: "/mfa",
  mfaSetup: "/mfa/setup",
  mfaBackup: "/mfa/backup",
  dashboard: "/dashboard",
  domains: "/domains",
  newDomain: "/domains/new",
  domain: (domainId: string) => `/domains/${domainId}`,
  asset: (assetId: string) => `/assets/${assetId}`,
  findings: "/findings",
  finding: (findingId: string) => `/findings/${findingId}`,
  report: (scanId: string) => `/reports/${scanId}`,
  audit: "/audit",
  settings: "/settings",
} as const;

export const PUBLIC_ROUTES = [ROUTES.login, ROUTES.register, ROUTES.mfa, ROUTES.mfaSetup, ROUTES.mfaBackup];