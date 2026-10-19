import { useCallback, useEffect, useMemo, useState } from "react";
import { adminDb } from "./opsDatabase";
import type { Database } from "./opsDatabase";

type PageView = Database["public"]["Tables"]["website_page_views"]["Row"];
type LoadState = "loading" | "ready" | "unavailable";

const number = new Intl.NumberFormat("en");

export function WebsiteAnalyticsPanel() {
  const [views, setViews] = useState<PageView[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  const load = useCallback(async () => {
    setLoadState("loading");
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await adminDb
      .from("website_page_views")
      .select("id, session_id, page_path, referrer_host, device_type, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      setViews([]);
      setLoadState("unavailable");
      return;
    }

    setViews(data ?? []);
    setLoadState("ready");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const sessions = useMemo(() => new Set(views.map((view) => view.session_id)).size, [views]);
  const todayKey = new Date().toISOString().slice(0, 10);
  const viewsToday = views.filter((view) => view.created_at.slice(0, 10) === todayKey).length;

  const days = useMemo(() => {
    const today = new Date();
    const grouped = new Map<string, number>();
    for (let offset = 6; offset >= 0; offset -= 1) {
      const day = new Date(today.getTime() - offset * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      grouped.set(day, 0);
    }
    for (const view of views) {
      const day = view.created_at.slice(0, 10);
      if (grouped.has(day)) grouped.set(day, (grouped.get(day) ?? 0) + 1);
    }
    return [...grouped.entries()].map(([day, count]) => ({
      day,
      count,
      label: new Date(`${day}T00:00:00Z`).toLocaleDateString("en", { weekday: "short" }),
    }));
  }, [views]);

  const topPages = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const view of views) grouped.set(view.page_path, (grouped.get(view.page_path) ?? 0) + 1);
    return [...grouped.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [views]);

  const topSources = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const view of views) {
      const source = view.referrer_host ?? "Direct / unavailable";
      grouped.set(source, (grouped.get(source) ?? 0) + 1);
    }
    return [...grouped.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [views]);

  const devices = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const view of views) {
      grouped.set(view.device_type, (grouped.get(view.device_type) ?? 0) + 1);
    }
    return [...grouped.entries()].sort((a, b) => b[1] - a[1]);
  }, [views]);

  const maxDayCount = Math.max(1, ...days.map((day) => day.count));

  return (
    <section
      className="space-y-4 rounded-lg border border-[#e6dfd3] bg-white p-4 shadow-sm sm:p-5"
      aria-labelledby="visitor-analytics-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-[#94763c]">Storefront traffic</p>
          <h2 id="visitor-analytics-heading" className="mt-1 font-serif text-xl text-[#1c2b23]">
            Visitor analytics
          </h2>
          <p className="mt-1 text-sm text-[#71695d]">
            Last 30 days · opt-in, first-party page views
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loadState === "loading"}
          className="rounded-full border border-[#d8d0c5] px-3 py-1.5 text-sm text-[#5d554b] hover:border-[#b89a56] disabled:opacity-50"
        >
          {loadState === "loading" ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {loadState === "unavailable" ? (
        <div
          role="status"
          className="rounded border border-[#e6d8b5] bg-[#fff8e6] p-4 text-sm text-[#5d554b]"
        >
          Visitor analytics is not connected yet. Apply the migration
          <code className="mx-1 rounded bg-white px-1 py-0.5">
            202610190001_novalestic_website_analytics.sql
          </code>
          to the intended Supabase project, then refresh this panel.
        </div>
      ) : loadState === "loading" ? (
        <div role="status" aria-busy="true" className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-lg bg-[#f5f1e9]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Page views", number.format(views.length), "Most recent 5,000 events at most"],
              [
                "Tab sessions",
                number.format(sessions),
                "Approximate sessions, not verified people",
              ],
              ["Views today", number.format(viewsToday), "Based on UTC date boundaries"],
            ].map(([label, value, note]) => (
              <div key={label} className="rounded-lg border border-[#eee8de] bg-[#fcfbf8] p-4">
                <p className="text-sm text-[#71695d]">{label}</p>
                <p className="mt-2 font-serif text-2xl text-[#1c2b23]">{value}</p>
                <p className="mt-1 text-xs text-[#8a8174]">{note}</p>
              </div>
            ))}
          </div>

          {views.length === 0 ? (
            <p className="rounded-lg bg-[#fcfbf8] p-5 text-sm text-[#71695d]">
              No opted-in page views have been recorded in the last 30 days yet.
            </p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-lg border border-[#eee8de] p-4">
                <h3 className="mb-4 font-medium text-[#1c2b23]">Page views by day</h3>
                <div
                  className="flex h-36 items-end gap-2"
                  role="img"
                  aria-label="Page views during the last seven days"
                >
                  {days.map((day) => (
                    <div
                      key={day.day}
                      className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-[11px] tabular-nums text-[#71695d]">{day.count}</span>
                      <div className="flex h-24 w-full items-end">
                        <div
                          className="w-full rounded-t bg-[#1d6248]"
                          style={{ height: `${Math.max(4, (day.count / maxDayCount) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#71695d]">{day.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[#eee8de] p-4">
                <h3 className="mb-3 font-medium text-[#1c2b23]">Top pages</h3>
                <div className="space-y-3">
                  {topPages.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="min-w-0 truncate text-[#5d554b]" title={item.label}>
                        {item.label}
                      </span>
                      <span className="shrink-0 tabular-nums text-[#1c2b23]">
                        {number.format(item.count)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[#eee8de] p-4">
                <h3 className="mb-3 font-medium text-[#1c2b23]">Referring sources</h3>
                <div className="space-y-3">
                  {topSources.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="min-w-0 truncate text-[#5d554b]" title={item.label}>
                        {item.label}
                      </span>
                      <span className="shrink-0 tabular-nums text-[#1c2b23]">
                        {number.format(item.count)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[#eee8de] p-4">
                <h3 className="mb-3 font-medium text-[#1c2b23]">Screen-size category</h3>
                <div className="space-y-3">
                  {devices.map(([device, count]) => (
                    <div key={device} className="flex items-center justify-between gap-3 text-sm">
                      <span className="capitalize text-[#5d554b]">{device}</span>
                      <span className="tabular-nums text-[#1c2b23]">{number.format(count)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <p className="text-xs leading-relaxed text-[#8a8174]">
        Analytics is only recorded after a visitor opts in. These figures are best-effort, may be
        limited to the latest 5,000 events, and should be treated as directional rather than billing
        or audit records.
      </p>
    </section>
  );
}
