import React, { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraOff, RotateCcw, X } from "lucide-react";

interface NecklaceVirtualTryOnProps {
  productName: string;
}

export const NecklaceVirtualTryOn: React.FC<NecklaceVirtualTryOnProps> = ({
  productName,
}) => {
  const [open, setOpen] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [scale, setScale] = useState(100);
  const [drop, setDrop] = useState(56);
  const [tone, setTone] = useState<"gold" | "silver" | "rose">("gold");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraRequestRef = useRef(0);

  const stopCamera = useCallback(() => {
    // Invalidate any permission request that has not resolved yet.
    cameraRequestRef.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStreaming(false);
  }, []);

  const startCamera = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "Camera access needs a supported browser and a secure HTTPS connection.",
      );
      return;
    }

    const requestId = ++cameraRequestRef.current;
    let stream: MediaStream | null = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user" },
      });

      // The user may have closed the dialog while the browser asked permission.
      if (requestId !== cameraRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      if (!videoRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      if (requestId !== cameraRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      setStreaming(true);
    } catch (cause) {
      stream?.getTracks().forEach((track) => track.stop());
      if (streamRef.current === stream) streamRef.current = null;
      if (requestId !== cameraRequestRef.current) return;

      const name = cause instanceof DOMException ? cause.name : "";
      setError(
        name === "NotAllowedError"
          ? "Camera permission was denied. Allow camera access in your browser settings and try again."
          : name === "NotFoundError"
            ? "No camera was found on this device."
            : "The camera could not start. Check browser permissions and try again.",
      );
    }
  };

  useEffect(
    () => () => {
      cameraRequestRef.current += 1;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );

  useEffect(() => {
    if (!open) stopCamera();
  }, [open, stopCamera]);

  const gold =
    tone === "gold" ? "#d9b45f" : tone === "silver" ? "#d5d9dc" : "#c98279";
  const shadow =
    tone === "gold" ? "#8c6828" : tone === "silver" ? "#7b858d" : "#884c4a";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground/20 px-5 py-3.5 text-sm font-medium transition-colors hover:bg-secondary"
      >
        <Camera className="h-4 w-4" aria-hidden="true" />
        Try on with your camera
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="virtual-try-on-title"
        >
          <section className="flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-7">
              <div>
                <p className="eyebrow">Experimental preview</p>
                <h2
                  id="virtual-try-on-title"
                  className="mt-1 font-serif-luxury text-2xl sm:text-3xl"
                >
                  Necklace virtual try-on
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {productName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close virtual try-on"
                className="rounded-full p-2 hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="grid min-h-0 gap-5 overflow-y-auto p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_260px]">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[540px] overflow-hidden rounded-xl bg-neutral-900">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 h-full w-full object-cover ${streaming ? "scale-x-[-1]" : "opacity-0"}`}
                />

                {!streaming && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center text-white">
                    <CameraOff className="h-10 w-10 opacity-70" />
                    <p className="text-sm">
                      Start your camera to preview a necklace overlay.
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
                    >
                      Enable camera
                    </button>
                  </div>
                )}

                {streaming && (
                  <svg
                    viewBox="0 0 300 400"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    aria-label="Adjustable illustrative necklace overlay"
                  >
                    <defs>
                      <linearGradient
                        id="chain-metal"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#fff4c8" />
                        <stop offset="30%" stopColor={gold} />
                        <stop offset="65%" stopColor={shadow} />
                        <stop offset="100%" stopColor={gold} />
                      </linearGradient>
                    </defs>
                    <g
                      transform={`translate(150 ${drop * 2.3}) scale(${scale / 100}) translate(-150 -130)`}
                    >
                      <path
                        d="M 78 38 C 82 105, 112 145, 150 170 C 188 145, 218 105, 222 38"
                        fill="none"
                        stroke="#000"
                        strokeOpacity=".22"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 78 38 C 82 105, 112 145, 150 170 C 188 145, 218 105, 222 38"
                        fill="none"
                        stroke="url(#chain-metal)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 150 158 L 160 174 L 150 192 L 140 174 Z"
                        fill={gold}
                        stroke={shadow}
                        strokeWidth="2"
                      />
                      <circle
                        cx="150"
                        cy="176"
                        r="5"
                        fill="#fff4c8"
                        stroke={shadow}
                        strokeWidth="1.5"
                      />
                    </g>
                  </svg>
                )}

                {streaming && (
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] text-white">
                    Illustrative overlay · not exact product rendering
                  </span>
                )}
              </div>

              <aside className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold">Metal tone</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["gold", "silver", "rose"] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTone(value)}
                        aria-pressed={tone === value}
                        className={`rounded-full border px-3 py-2 text-xs capitalize ${tone === value ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}
                      >
                        {value} gold
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block text-sm font-medium">
                  Necklace size{" "}
                  <span className="float-right text-muted-foreground">
                    {scale}%
                  </span>
                  <input
                    className="mt-3 w-full accent-[var(--champagne)]"
                    type="range"
                    min="70"
                    max="140"
                    value={scale}
                    onChange={(event) => setScale(Number(event.target.value))}
                  />
                </label>

                <label className="block text-sm font-medium">
                  Pendant position{" "}
                  <span className="float-right text-muted-foreground">
                    {drop}%
                  </span>
                  <input
                    className="mt-3 w-full accent-[var(--champagne)]"
                    type="range"
                    min="35"
                    max="75"
                    value={drop}
                    onChange={(event) => setDrop(Number(event.target.value))}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setScale(100);
                    setDrop(56);
                    setTone("gold");
                  }}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset adjustments
                </button>

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    {error}
                  </p>
                )}

                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-sm font-semibold">
                    What this preview does
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    It places an adjustable illustration over your live camera.
                    It does not track your neck or reproduce the exact product
                    yet; this first prototype helps test the camera flow before
                    adding tracking and product-specific assets.
                  </p>
                </div>

                {streaming && (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="w-full rounded-full border border-border px-4 py-3 text-sm hover:bg-secondary"
                  >
                    Turn camera off
                  </button>
                )}
              </aside>
            </div>

            <footer className="border-t border-border px-5 py-3 text-xs text-muted-foreground sm:px-7">
              Camera runs only after you enable it. The video is not uploaded or
              saved by this feature.
            </footer>
          </section>
        </div>
      )}
    </>
  );
};
