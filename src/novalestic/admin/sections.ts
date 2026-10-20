export const ADMIN_SECTIONS = ["overview", "products", "editor"] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number];

export function isAdminSection(value: unknown): value is AdminSection {
  return typeof value === "string" && ADMIN_SECTIONS.some((section) => section === value);
}

export function parseAdminSection(value: unknown): AdminSection | undefined {
  return isAdminSection(value) ? value : undefined;
}
