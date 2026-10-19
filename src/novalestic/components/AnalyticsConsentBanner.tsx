import React from "react";
import type { AnalyticsConsentChoice } from "../data/websiteAnalytics";

interface AnalyticsConsentBannerProps {
  visible: boolean;
  choice: AnalyticsConsentChoice;
  onChoose: (choice: "accepted" | "declined") => void;
}

export const AnalyticsConsentBanner: React.FC<AnalyticsConsentBannerProps> = ({
  visible,
  choice,
  onChoose,
}) => {
  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="analytics-consent-title"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-2xl sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <h2 id="analytics-consent-title" className="font-serif-luxury text-xl text-foreground">
            Help us improve the store
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            With your permission, we record anonymous page views, a temporary tab session ID, a
            screen-size category and the referring website's hostname. We do not put your name,
            contact details or message content into this analytics record. Your cart works whether
            you allow or decline analytics.
          </p>
          {choice !== "unset" && (
            <p className="mt-2 text-xs text-muted-foreground">
              Current preference: {choice === "accepted" ? "analytics allowed" : "analytics declined"}.
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => onChoose("accepted")}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Allow analytics
          </button>
          <button
            type="button"
            onClick={() => onChoose("declined")}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Decline
          </button>
        </div>
      </div>
    </aside>
  );
};
