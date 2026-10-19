import { adminDb } from "../admin/opsDatabase";

export const ANALYTICS_CONSENT_STORAGE_KEY = "novalestic_analytics_consent_v1";
const ANALYTICS_SESSION_STORAGE_KEY = "novalestic_analytics_session_v1";

export type AnalyticsConsentChoice = "unset" | "accepted" | "declined";

export function readAnalyticsConsent(): AnalyticsConsentChoice {
  if (typeof window === "undefined") return "unset";
  try {
    const saved = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return saved === "accepted" || saved === "declined" ? saved : "unset";
  } catch {
    return "unset";
  }
}

/**
 * Records a minimal storefront page view after the visitor has opted in.
 * Analytics failures must never interrupt shopping or cart behaviour.
 */
export function recordStorefrontPageView(pagePath: string): void {
  if (typeof window === "undefined" || !pagePath.startsWith("/") || /^\/admin(?:\/|$)/i.test(pagePath)) {
    return;
  }

  try {
    let sessionId = window.sessionStorage.getItem(ANALYTICS_SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = window.crypto.randomUUID();
      window.sessionStorage.setItem(ANALYTICS_SESSION_STORAGE_KEY, sessionId);
    }

    let referrerHost: string | null = null;
    if (document.referrer) {
      try {
        const parsedReferrer = new URL(document.referrer);
        if (parsedReferrer.hostname && parsedReferrer.hostname !== window.location.hostname) {
          referrerHost = parsedReferrer.hostname.slice(0, 253);
        }
      } catch {
        referrerHost = null;
      }
    }

    const deviceType = window.matchMedia
      ? window.matchMedia("(max-width: 767px)").matches
        ? "mobile"
        : "desktop"
      : "unknown";

    void adminDb
      .from("website_page_views")
      .insert({
        session_id: sessionId,
        page_path: pagePath.slice(0, 160),
        referrer_host: referrerHost,
        device_type: deviceType,
      })
      .then(() => undefined)
      .catch(() => undefined);
  } catch {
    // Tracking is optional: blocked browser storage or missing browser APIs are ignored.
  }
}
