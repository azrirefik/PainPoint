import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * PainPoint Toaster — frosted-glass, design-system-aware Sonner skin.
 *
 * - Inter for body, Fraunces for the title (`pp-toast-title`).
 * - Per-type accent strip on the left edge (success teal, error rose,
 *   warning amber, info blue) — defined in styles.css under [data-type=...].
 * - We disable `richColors` and provide our own typography/colors so the
 *   toast inherits the app's tone instead of Sonner's vivid defaults.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="pp-toaster"
      offset={20}
      gap={10}
      visibleToasts={4}
      duration={3200}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: "pp-toast group",
          title: "pp-toast-title",
          description: "pp-toast-description",
          icon: "pp-toast-icon",
          closeButton: "pp-toast-close",
          actionButton: "pp-toast-action",
          cancelButton: "pp-toast-cancel",
          success: "pp-toast-success",
          error: "pp-toast-error",
          warning: "pp-toast-warning",
          info: "pp-toast-info",
        },
      }}
      icons={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        warning: <WarningIcon />,
        info: <InfoIcon />,
      }}
      {...props}
    />
  );
};

/* ── Icons ── compact inline SVG with gradient fills.
 * Sized 18px to align with Sonner's icon slot.
 */
function SuccessIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pp-toast-success-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.85 0.16 160)" />
          <stop offset="100%" stopColor="oklch(0.62 0.16 160)" />
        </linearGradient>
      </defs>
      <circle cx="9" cy="9" r="9" fill="url(#pp-toast-success-grad)" />
      <path
        d="M5.5 9.4 L7.8 11.5 L12.5 6.6"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pp-toast-error-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.2 25)" />
          <stop offset="100%" stopColor="oklch(0.6 0.2 25)" />
        </linearGradient>
      </defs>
      <circle cx="9" cy="9" r="9" fill="url(#pp-toast-error-grad)" />
      <path
        d="M9 4.5 V9.6 M9 12 V12.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pp-toast-warning-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.86 0.16 80)" />
          <stop offset="100%" stopColor="oklch(0.7 0.18 80)" />
        </linearGradient>
      </defs>
      <path
        d="M9 1.6 L17 16 H1 Z"
        fill="url(#pp-toast-warning-grad)"
        stroke="oklch(0.55 0.16 80)"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 6.6 V10.4 M9 12.6 V13"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pp-toast-info-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.1 192)" />
          <stop offset="100%" stopColor="oklch(0.62 0.13 240)" />
        </linearGradient>
      </defs>
      <circle cx="9" cy="9" r="9" fill="url(#pp-toast-info-grad)" />
      <path d="M9 7.5 V12.4" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="9" cy="5.4" r="1" fill="white" />
    </svg>
  );
}

export { Toaster };
