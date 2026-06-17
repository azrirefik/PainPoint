import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DA_SLOTS } from "@/lib/painpoint-data";
import { cn } from "@/lib/utils";

export function DABookingModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [slot, setSlot] = useState(DA_SLOTS[0].id);
  const [share, setShare] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-border/60 bg-gradient-to-b from-white to-[oklch(0.99_0.005_240)] p-5 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-pp-teal to-pp-blue text-sm text-white shadow">
              DA
            </span>
            Book GP Teleconsult
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-2xl border border-pp-teal/20 bg-gradient-to-br from-pp-teal/8 to-pp-blue/8 p-3.5 text-sm leading-relaxed">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-pp-teal-deep">
            Pre-filled context
          </p>
          <span className="font-semibold">Patient:</span> Lim Ah Kong, 72. Recurring chest pressing
          (3 episodes in 7 days, moderate severity, constant). Known: T2DM, Hypertension. Meds:
          Metformin, Amlodipine, Aspirin.
        </div>

        <div className="space-y-2">
          {DA_SLOTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSlot(s.id)}
              className={cn(
                "pp-soft-button flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition",
                slot === s.id ? "border-pp-teal bg-pp-teal/5" : "border-border/70",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition",
                  slot === s.id ? "border-pp-teal" : "border-muted-foreground",
                )}
              >
                {slot === s.id && (
                  <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-pp-teal to-pp-blue" />
                )}
              </span>
              <span className="flex-1 font-medium">{s.label}</span>
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3 text-sm">
          <input
            type="checkbox"
            checked={share}
            onChange={(e) => setShare(e.target.checked)}
            className="h-5 w-5 accent-pp-teal"
          />
          Share 7-day symptom report with doctor
        </label>

        <button
          onClick={() => {
            onOpenChange(false);
            toast.success("Booked!", {
              description:
                "DA will send WhatsApp confirmation to Wei Ming. Doctor will receive the symptom report before the call.",
            });
          }}
          className="pp-primary-button h-12 w-full rounded-xl font-bold"
        >
          Confirm Booking
        </button>
      </DialogContent>
    </Dialog>
  );
}
