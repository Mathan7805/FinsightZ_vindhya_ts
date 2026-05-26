import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, Sparkles, CheckCircle2, AlertTriangle, X, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Stage = "queued" | "parsing" | "ai" | "validating" | "done" | "error";

type UploadItem = {
  id: string;
  name: string;
  size: number;
  stage: Stage;
  progress: number;
  rows?: number;
  fields?: { k: string; v: string; conf: number }[];
  error?: string;
};

const STAGE_LABEL: Record<Stage, string> = {
  queued: "Queued",
  parsing: "Parsing workbook",
  ai: "AI extracting fields",
  validating: "Validating rules",
  done: "Posted to ledger",
  error: "Validation error",
};

function mockFields(persona: string): { k: string; v: string; conf: number }[] {
  switch (persona) {
    case "finance":
      return [
        { k: "Period", v: "Nov 2025", conf: 0.99 },
        { k: "Entity", v: "FInsightZ India Pvt Ltd", conf: 0.97 },
        { k: "Total Revenue", v: "₹ 5,81,40,000", conf: 0.94 },
        { k: "Process Code", v: "BPO-VOICE-01", conf: 0.78 },
      ];
    case "it":
      return [
        { k: "Vendor", v: "AWS India", conf: 0.98 },
        { k: "Invoice #", v: "AWS-44821", conf: 0.99 },
        { k: "Amount (₹)", v: "12,18,400", conf: 0.96 },
        { k: "Allocation", v: "5 processes", conf: 0.71 },
      ];
    case "operations":
      return [
        { k: "Process", v: "Collections", conf: 0.98 },
        { k: "FTE", v: "412", conf: 0.99 },
        { k: "AHT (s)", v: "318", conf: 0.92 },
        { k: "SLA %", v: "91.4", conf: 0.88 },
      ];
    case "facilities":
      return [
        { k: "Building", v: "Bangalore HQ", conf: 0.99 },
        { k: "Utility", v: "Electricity (BESCOM)", conf: 0.97 },
        { k: "Units (kWh)", v: "1,39,200", conf: 0.93 },
        { k: "Amount (₹)", v: "46,21,000", conf: 0.95 },
      ];
    default:
      return [];
  }
}

export function UploadCenter({
  persona,
  title = "Upload & AI Extraction",
  subtitle = "Drop Excel / CSV / PDF — our AI engine reads, validates and pushes into the allocation model.",
  accept = ".xlsx,.xls,.csv,.pdf,.zip",
}: {
  persona: "finance" | "it" | "operations" | "facilities";
  title?: string;
  subtitle?: string;
  accept?: string;
}) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runPipeline = (id: string) => {
    const steps: { stage: Stage; pct: number; delay: number }[] = [
      { stage: "parsing", pct: 25, delay: 350 },
      { stage: "ai", pct: 60, delay: 700 },
      { stage: "validating", pct: 85, delay: 500 },
      { stage: "done", pct: 100, delay: 400 },
    ];
    let acc = 0;
    steps.forEach((s) => {
      acc += s.delay;
      setTimeout(() => {
        setItems((prev) =>
          prev.map((it) =>
            it.id === id
              ? {
                  ...it,
                  stage: s.stage,
                  progress: s.pct,
                  rows: s.stage === "done" ? Math.floor(120 + Math.random() * 480) : it.rows,
                  fields: s.stage === "ai" || s.stage === "validating" || s.stage === "done"
                    ? mockFields(persona)
                    : it.fields,
                }
              : it,
          ),
        );
      }, acc);
    });
  };

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).slice(0, 8);
    const created: UploadItem[] = arr.map((f) => ({
      id: `${Date.now()}-${f.name}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: f.size,
      stage: "queued",
      progress: 5,
    }));
    setItems((prev) => [...created, ...prev].slice(0, 12));
    created.forEach((c) => {
      setActiveId(c.id);
      runPipeline(c.id);
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const active = items.find((i) => i.id === activeId) ?? items[0];

  return (
    <div className="glass rounded-2xl p-6 shadow-elevated">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <Badge variant="outline" className="border-primary/40 text-primary">
          <Brain className="w-3 h-3 mr-1" /> AI engine: GPT-Finance v3
        </Badge>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              dragging ? "border-primary bg-primary/10" : "border-border bg-card/30 hover:border-primary/40"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={accept}
              className="hidden"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
            <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--gradient-emerald)] grid place-items-center shadow-glow mb-3">
              <Upload className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="font-display font-semibold">Drop files or click to upload</div>
            <div className="text-xs text-muted-foreground mt-1">
              Excel · CSV · PDF · ZIP · up to 8 files · AI auto-extracts headers, line items and totals
            </div>
          </div>

          <div className="space-y-2 max-h-80 overflow-auto pr-1">
            {items.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-4">No uploads yet — drop a file above to test AI extraction.</div>
            )}
            {items.map((it) => (
              <button
                type="button"
                key={it.id}
                onClick={() => setActiveId(it.id)}
                className={`w-full text-left rounded-xl border p-3 transition-colors ${
                  active?.id === it.id ? "border-primary bg-primary/10" : "border-border bg-card/30 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileSpreadsheet className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium truncate">{it.name}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      it.stage === "done"
                        ? "border-success/40 text-success"
                        : it.stage === "error"
                        ? "border-destructive/40 text-destructive"
                        : "border-primary/40 text-primary"
                    }
                  >
                    {it.stage === "done" ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : it.stage === "error" ? (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    ) : null}
                    {STAGE_LABEL[it.stage]}
                  </Badge>
                </div>
                <Progress value={it.progress} className="h-1.5" />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
                  <span>{(it.size / 1024).toFixed(1)} KB</span>
                  {it.rows && <span>{it.rows} rows extracted</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card/30 p-4 min-h-[260px]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">AI extracted fields</div>
            {active && (
              <button
                onClick={() => {
                  setItems((p) => p.filter((i) => i.id !== active.id));
                  setActiveId(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {!active || !active.fields ? (
            <div className="text-sm text-muted-foreground py-10 text-center">
              <Brain className="w-6 h-6 mx-auto mb-2 opacity-40" />
              Upload a file to view structured extraction with confidence scores.
            </div>
          ) : (
            <div className="space-y-3">
              {active.fields.map((f) => (
                <div key={f.k} className="rounded-lg bg-background/40 border border-border/60 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{f.k}</span>
                    <span
                      className={
                        f.conf >= 0.9
                          ? "text-success"
                          : f.conf >= 0.75
                          ? "text-warning"
                          : "text-destructive"
                      }
                    >
                      {Math.round(f.conf * 100)}% conf.
                    </span>
                  </div>
                  <div className="text-sm font-semibold mt-1">{f.v}</div>
                  <Progress value={f.conf * 100} className="h-1 mt-2" />
                </div>
              ))}
              {active.stage === "done" && (
                <Button size="sm" className="w-full bg-[var(--gradient-emerald)] text-primary-foreground shadow-glow">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Post to allocation engine
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
