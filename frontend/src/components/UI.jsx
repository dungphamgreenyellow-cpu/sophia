import React from "react";

export function Card({ title, subtitle, children, right }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      {(title || subtitle || right) && (
        <div className="flex items-start justify-between gap-3">
          <div>
            {title && <div className="text-sm text-gray-500">{title}</div>}
            {subtitle && <div className="mt-1 text-lg font-semibold">{subtitle}</div>}
          </div>
          {right ? <div>{right}</div> : null}
        </div>
      )}
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

export function Pill({ children, tone = "neutral" }) {
  const cls =
    tone === "pos"
      ? "bg-green-50 text-green-700 border-green-200"
      : tone === "neg"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${cls}`}>
      {children}
    </span>
  );
}

export function Button({ children, variant = "solid", className = "", ...props }) {
  const base = "px-4 py-2 rounded-xl text-sm font-medium transition";
  const solid = "bg-black text-white hover:opacity-90";
  const ghost = "bg-white border text-gray-800 hover:bg-gray-50";
  return (
    <button
      className={[base, variant === "solid" ? solid : ghost, className].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className = "", ...props }) {
  return <input className={["w-full rounded-xl border px-3 py-2", className].join(" ")} {...props} />;
}

export function Select({ className = "", ...props }) {
  return <select className={["w-full rounded-xl border px-3 py-2 bg-white", className].join(" ")} {...props} />;
}
