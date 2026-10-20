"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { formatKes } from "@/lib/site";
import type { Artist } from "@/lib/types";

const amounts = [50, 100, 250, 500];

export function SupportModal({
  artist,
  open,
  onClose,
}: {
  artist: Pick<Artist, "id" | "name" | "username">;
  open: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<number | "custom">(100);
  const [custom, setCustom] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setReference("");
      setMessage("");
    }
  }, [open]);

  if (!open) return null;

  const amount = selected === "custom" ? Number(custom) : selected;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(amount) || amount < 10) {
      setStatus("error");
      setMessage("Enter a tip amount of at least KES 10.");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/support/artist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistId: artist.id, amount, phone }),
      });
      const data = (await response.json()) as { reference?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not start the tip");
      setReference(data.reference ?? "");
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <div
      className="levi-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="levi-modal">
        <button type="button" className="levi-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <h3 id="support-title">Support {artist.name}</h3>
        <p className="levi-modal-sub">
          Send a direct tip through M-Pesa. Every shilling goes to the artist.
        </p>

        {status === "done" ? (
          <div>
            <div className="levi-mpesa-ref">
              Tip started for {formatKes(amount)}. Reference {reference}. Check your phone for the
              M-Pesa prompt and enter your PIN to complete the payment.
            </div>
            <button
              type="button"
              className="btn oneMusic-btn mt-30"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="levi-amount-grid" role="group" aria-label="Tip amount">
              {amounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`levi-amount ${selected === value ? "is-active" : ""}`}
                  onClick={() => setSelected(value)}
                  aria-pressed={selected === value}
                >
                  {formatKes(value)}
                </button>
              ))}
              <button
                type="button"
                className={`levi-amount ${selected === "custom" ? "is-active" : ""}`}
                onClick={() => setSelected("custom")}
                aria-pressed={selected === "custom"}
              >
                Custom
              </button>
            </div>

            {selected === "custom" && (
              <div className="levi-input-group mb-30">
                <label htmlFor="tip-custom">Custom amount in KES</label>
                <input
                  id="tip-custom"
                  className="form-control"
                  type="number"
                  min={10}
                  step={10}
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="e.g. 1000"
                />
              </div>
            )}

            <div className="levi-input-group mb-30">
              <label htmlFor="tip-phone">M-Pesa number</label>
              <input
                id="tip-phone"
                className="form-control"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XX XXX XXX"
                required
              />
              <span className="levi-hint">
                Safaricom number registered on M-Pesa. This is a demo flow, no live STK push is
                sent.
              </span>
            </div>

            {status === "error" && (
              <div className="levi-form-status error" role="alert">
                {message}
              </div>
            )}

            <button type="submit" className="btn oneMusic-btn" disabled={status === "sending"}>
              {status === "sending" ? "Starting tip" : `Tip ${formatKes(amount || 0)}`}
            </button>
            <p className="levi-modal-note">
              Tips are simulated for this preview. In production the request is confirmed by the
              M-Pesa callback before it is added to the artist earnings ledger.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
