import { PUBLIC_ROUTES } from "@/constants/routes";

export function isPublicPath(pathname: string) {
  return (PUBLIC_ROUTES as readonly string[]).some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
