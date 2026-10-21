import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, RotateCcw, Upload, X } from "lucide-react";

interface NecklaceTryOnProps {
  productName: string;
  open: boolean;
  onClose: () => void;
  /** A merchant-supplied transparent PNG/WebP showing this exact necklace. */
  tryOnImageUrl?: string;
}

type CameraState = "idle" | "starting" | "ready" | "error";

export const NecklaceTryOn: React.FC<NecklaceTryOnProps> = ({
  productName,
  open,
  onClose,
  tryOnImageUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [cameraError, setCameraError] = useState("");
  const [overlayUrl, setOverlayUrl] = useState(tryOnImageUrl ?? "");
  const [localOverlayUrl, setLocalOverlayUrl] = useState("");
  const [overlayWidth, setOverlayWidth] = useState(46);
  const [overlayTop, setOverlayTop] = useState(43);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  useEffect(() => {
    setOverlayUrl(tryOnImageUrl ?? "");
  }, [tryOnImageUrl]);

  useEffect(() => {
    if (!open) stopCamera();
    return () => stopCamera();
    // stopCamera intentionally reads the current stream ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      if (localOverlayUrl) URL.revokeObjectURL(localOverlayUrl);
    };
  }, [localOverlayUrl]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState("idle");
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("This browser cannot access a camera. Use a recent browser over HTTPS and try again.");
      setCameraState("error");
      return;
    }

    stopCamera();
    setCameraError("");
    setCameraState("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 30 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState("ready");
    } catch (error) {
      const name = error instanceof Error ? error.name : "";
      const message =
        name === "NotAllowedError"
          ? "Camera access was blocked. Allow camera access in your browser settings, then try again."
          : name === "NotFoundError"
            ? "No camera was found on this device."
            : "The camera could not start. Close other apps using the camera and try again.";
      setCameraError(message);
      setCameraState("error");
    }
  };

  const handleOverlayUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCameraError("Choose an image file with a transparent background, ideally a PNG or WebP.");
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setLocalOverlayUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return nextUrl;
    });
    setOverlayUrl(nextUrl);
    setCameraError("");
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="necklace-try-on-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-background shadow-2xl md:flex-row">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close virtual try-on"
          className="absolute right-3 top-3 z-10 rounded-full border border-border bg-background/95 p-2 text-foreground shadow-sm"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1 bg-[#161616] p-3 sm:p-5">
          <div className="mb-3 pr-12 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Novalestic Studio</p>
            <h2 id="necklace-try-on-title" className="mt-1 font-serif-luxury text-2xl">
              Try it on
            </h2>
            <p className="mt-1 text-sm text-white/65">{productName}</p>
          </div>

          <div className="relative mx-auto aspect-[3/4] max-h-[62dvh] overflow-hidden rounded-2xl bg-neutral-900 sm:aspect-[4/5]">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              aria-label="Live camera preview"
              className={`h-full w-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
            />
            {cameraState !== "ready" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white">
                <Camera className="h-10 w-10 text-white/65" />
                <p className="max-w-xs text-sm text-white/75">
                  Start your camera to preview the necklace placement.
                </p>
                {cameraState === "starting" ? (
                  <span className="text-sm text-white/70" role="status">Starting camera…</span>
                ) : (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-white/90"
                  >
                    Start camera
                  </button>
                )}
              </div>
            )}

            {cameraState === "ready" && overlayUrl && (
              <img
                src={overlayUrl}
                alt={`${productName} virtual preview overlay`}
                draggable={false}
                className="pointer-events-none absolute left-1/2 select-none object-contain"
                style={{
                  top: `${overlayTop}%`,
                  width: `${overlayWidth}%`,
                  height: "auto",
                  transform: "translateX(-50%)",
                  maxHeight: "50%",
                }}
              />
            )}
            {cameraState === "ready" && !overlayUrl && (
              <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/65 p-3 text-center text-xs text-white backdrop-blur">
                Add the product's transparent necklace image in the panel to preview it.
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => (cameraState === "ready" ? stopCamera() : startCamera())}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              <Camera className="h-4 w-4" />
              {cameraState === "ready" ? "Stop camera" : "Restart camera"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFacingMode((current) => current === "user" ? "environment" : "user");
                if (cameraState === "ready") window.setTimeout(startCamera, 0);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" /> Flip camera
            </button>
          </div>
        </div>

        <aside className="w-full overflow-y-auto border-t border-border p-5 md:w-80 md:border-l md:border-t-0 sm:p-6">
          <p className="eyebrow">Preview controls</p>
          <h3 className="mt-2 font-serif-luxury text-xl">Fine-tune the fit</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This first prototype uses manual placement. Automatic neck tracking comes after we
            connect real product-specific transparent images and validate tracking quality.
          </p>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium" htmlFor="try-on-overlay">
              Necklace overlay image
            </label>
            <input
              ref={fileInputRef}
              id="try-on-overlay"
              type="file"
              accept="image/png,image/webp,image/*"
              onChange={handleOverlayUpload}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm font-medium hover:bg-secondary"
            >
              <Upload className="h-4 w-4" />
              {overlayUrl ? "Choose another image" : "Choose transparent image"}
            </button>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              For this prototype, use a front-facing necklace cutout with a transparent background.
            </p>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="try-on-width" className="text-sm font-medium">Necklace width</label>
              <span className="text-xs tabular-nums text-muted-foreground">{overlayWidth}%</span>
            </div>
            <input
              id="try-on-width"
              type="range"
              min="18"
              max="78"
              value={overlayWidth}
              onChange={(event) => setOverlayWidth(Number(event.target.value))}
              className="w-full accent-[var(--champagne)]"
            />
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="try-on-top" className="text-sm font-medium">Vertical position</label>
              <span className="text-xs tabular-nums text-muted-foreground">{overlayTop}%</span>
            </div>
            <input
              id="try-on-top"
              type="range"
              min="25"
              max="62"
              value={overlayTop}
              onChange={(event) => setOverlayTop(Number(event.target.value))}
              className="w-full accent-[var(--champagne)]"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setOverlayWidth(46);
              setOverlayTop(43);
            }}
            className="mt-5 w-full rounded-full border border-border px-4 py-2.5 text-sm hover:bg-secondary"
          >
            Reset placement
          </button>

          {cameraError && (
            <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{cameraError}</span>
            </p>
          )}

          <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            Camera video stays in this browser session; this feature does not upload or save camera footage.
            Preview proportions are approximate and are not a guarantee of real-world fit.
          </p>
        </aside>
      </section>
    </div>
  );
};
