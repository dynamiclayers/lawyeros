"use client";

import {
  CheckCircle2,
  Download,
  FileText,
  FolderUp,
  Lock,
  Search,
  ShieldCheck,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { EmptyState, TBody, TD, TH, THead, TR, TableShell } from "@/components/ui/table";
import {
  DesktopTableOnly,
  MobileCard,
  MobileCardList,
} from "@/components/ui/mobile-card-list";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeading } from "@/components/dashboard/page-heading";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { formatFileSize } from "@/lib/utils";
import type { DocumentCategory, DocumentFile } from "@/types";

const CATEGORIES: DocumentCategory[] = ["Petitions", "Evidence", "NID/ID", "Court Orders"];
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".xlsx", ".csv"];

interface UploadState {
  name: string;
  progress: number;
  status: "uploading" | "done" | "error";
  message?: string;
}

function extensionOf(name: string) {
  const index = name.lastIndexOf(".");
  return index >= 0 ? name.slice(index).toLowerCase() : "";
}

export function DocumentVault() {
  const { documents, addDocument, deleteDocument, cases } = useWorkspace();
  const [dragActive, setDragActive] = useState(false);
  const [category, setCategory] = useState<DocumentCategory>("Petitions");
  const [caseNo, setCaseNo] = useState<string>("");
  const [visibility, setVisibility] = useState<"chamber" | "client">("chamber");
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [permitted, setPermitted] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | DocumentCategory>("all");
  const [deleting, setDeleting] = useState<DocumentFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.location.search.includes("upload=1")) {
      inputRef.current?.focus();
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      if (!permitted) {
        toast.error("Upload permission required");
        return;
      }
      Array.from(files).forEach((file) => {
        const extension = extensionOf(file.name);
        if (!ACCEPTED.includes(extension)) {
          setUploads((current) => [
            {
              name: file.name,
              progress: 0,
              status: "error",
              message: `Unsupported type (${extension || "unknown"})`,
            },
            ...current,
          ]);
          return;
        }
        if (file.size > MAX_BYTES) {
          setUploads((current) => [
            {
              name: file.name,
              progress: 0,
              status: "error",
              message: "Exceeds the 10 MB limit",
            },
            ...current,
          ]);
          return;
        }

        const entry: UploadState = { name: file.name, progress: 0, status: "uploading" };
        setUploads((current) => [entry, ...current]);

        let progress = 0;
        const timer = setInterval(() => {
          progress = Math.min(progress + 18 + Math.random() * 14, 100);
          setUploads((current) =>
            current.map((upload) =>
              upload.name === file.name ? { ...upload, progress } : upload,
            ),
          );
          if (progress >= 100) {
            clearInterval(timer);
            const document: DocumentFile = {
              id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              name: file.name,
              category,
              caseNo: caseNo || null,
              uploadedAt: new Date().toISOString().slice(0, 10),
              size: file.size,
              type: (extension.replace(".", "") || "FILE").toUpperCase(),
              visibility,
            };
            addDocument(document);
            setUploads((current) =>
              current.map((upload) =>
                upload.name === file.name
                  ? { ...upload, status: "done", progress: 100 }
                  : upload,
              ),
            );
            toast.success(`${file.name} uploaded`);
          }
        }, 220);
      });
    },
    [addDocument, caseNo, category, permitted, visibility],
  );

  const filtered = documents.filter((document) => {
    if (filter !== "all" && document.category !== filter) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      document.name.toLowerCase().includes(needle) ||
      (document.caseNo ?? "").toLowerCase().includes(needle)
    );
  });

  return (
    <div className="space-y-4">
      <PageHeading
        title="Document Vault"
        description="Petitions, evidence, identification, and court orders — kept with the matter they belong to."
        actions={
          <Button size="sm" variant="outline" onClick={() => setPermitted((value) => !value)}>
            <ShieldCheck className="size-3.5" />
            {permitted ? "Simulate no permission" : "Restore permission"}
          </Button>
        }
      />

      {!permitted ? (
        <div className="flex items-start gap-2.5 rounded-[10px] border border-destructive/25 bg-destructive/5 px-4 py-3">
          <Lock className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div>
            <p className="text-[12.5px] font-semibold text-foreground">
              Upload permission required
            </p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
              Your role can view existing files but cannot add new ones. Ask the
              chamber administrator for upload access.
            </p>
          </div>
        </div>
      ) : null}

      <section className="rounded-[12px] border border-border bg-card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[150px] flex-1">
            <label htmlFor="upload-category" className="block text-[11px] font-semibold text-foreground">
              Category
            </label>
            <Select
              id="upload-category"
              className="mt-1.5 h-9 text-[12px]"
              value={category}
              onChange={(event) => setCategory(event.target.value as DocumentCategory)}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-[160px] flex-1">
            <label htmlFor="upload-case" className="block text-[11px] font-semibold text-foreground">
              Linked case (optional)
            </label>
            <Select
              id="upload-case"
              className="mt-1.5 h-9 text-[12px]"
              value={caseNo}
              onChange={(event) => setCaseNo(event.target.value)}
            >
              <option value="">Not linked</option>
              {cases.map((legalCase) => (
                <option key={legalCase.id} value={legalCase.caseNo}>
                  {legalCase.caseNo} · {legalCase.title}
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-[150px] flex-1">
            <label htmlFor="upload-visibility" className="block text-[11px] font-semibold text-foreground">
              Visibility
            </label>
            <Select
              id="upload-visibility"
              className="mt-1.5 h-9 text-[12px]"
              value={visibility}
              onChange={(event) =>
                setVisibility(event.target.value as "chamber" | "client")
              }
            >
              <option value="chamber">Chamber only (private)</option>
              <option value="client">Shareable with client</option>
            </Select>
          </div>
        </div>

        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            if (event.dataTransfer.files.length) handleFiles(event.dataTransfer.files);
          }}
          className={
            dragActive
              ? "mt-3 flex flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-accent bg-accent/5 px-4 py-8 text-center transition-colors"
              : permitted
                ? "mt-3 flex flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-border bg-background px-4 py-8 text-center transition-colors hover:border-primary/40"
                : "mt-3 flex flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-border bg-muted/40 px-4 py-8 text-center opacity-70"
          }
        >
          <UploadCloud
            className={dragActive ? "size-7 text-accent" : "size-7 text-muted-foreground"}
            strokeWidth={1.6}
          />
          <p className="mt-2 text-[12.5px] font-medium text-foreground">
            {dragActive ? "Drop files to upload" : "Drag and drop files here"}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            PDF, DOC, JPG, PNG, XLSX, CSV · max 10 MB per file
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-3"
            disabled={!permitted}
            onClick={() => inputRef.current?.click()}
          >
            <FolderUp className="size-3.5" />
            Choose files
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED.join(",")}
            className="sr-only"
            aria-label="Choose files to upload"
            onChange={(event) => {
              if (event.target.files) handleFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        {uploads.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {uploads.map((upload, index) => (
              <li
                key={`${upload.name}-${index}`}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2"
              >
                {upload.status === "done" ? (
                  <CheckCircle2 className="size-4 shrink-0 text-success" />
                ) : upload.status === "error" ? (
                  <X className="size-4 shrink-0 text-destructive" />
                ) : (
                  <FileText className="size-4 shrink-0 text-accent" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-medium text-foreground">
                    {upload.name}
                  </p>
                  {upload.status === "uploading" ? (
                    <div
                      role="progressbar"
                      aria-valuenow={Math.round(upload.progress)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Uploading ${upload.name}`}
                      className="mt-1 h-1 overflow-hidden rounded-full bg-muted"
                    >
                      <div
                        className="h-full rounded-full bg-accent transition-[width] duration-200"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  ) : (
                    <p
                      className={
                        upload.status === "error"
                          ? "text-[10.5px] text-destructive"
                          : "text-[10.5px] text-success"
                      }
                    >
                      {upload.status === "error"
                        ? upload.message
                        : "Uploaded and recorded"}
                    </p>
                  )}
                </div>
                {upload.status !== "uploading" ? (
                  <button
                    type="button"
                    aria-label={`Dismiss ${upload.name}`}
                    onClick={() =>
                      setUploads((current) => current.filter((_, i) => i !== index))
                    }
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <div className="rounded-[12px] border border-border bg-card">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <div className="relative w-full max-w-[280px]">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search file or case number"
              aria-label="Search documents"
              className="h-9 pl-8 text-[12px]"
            />
          </div>
          <Select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as "all" | DocumentCategory)
            }
            aria-label="Filter by category"
            className="h-9 w-[150px] text-[12px]"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <p className="ml-auto text-[11px] text-muted-foreground">
            {filtered.length} files ·{" "}
            {formatFileSize(filtered.reduce((sum, item) => sum + item.size, 0))}
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText className="size-4" />}
            title="No documents"
            description="Upload a petition or court order, or clear the filters."
          />
        ) : (
          <>
            <MobileCardList>
              {filtered.map((document) => (
                <MobileCard
                  key={document.id}
                  trailing={
                    document.visibility === "client" ? (
                      <Badge variant="success">Shared</Badge>
                    ) : (
                      <Badge variant="warning">
                        <Lock className="size-2.5" />
                        Private
                      </Badge>
                    )
                  }
                  header={
                    <>
                      <p className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
                        <FileText className="size-3.5 shrink-0 text-accent" />
                        <span className="truncate">{document.name}</span>
                      </p>
                      <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                        {document.category} · {document.caseNo ?? "Not linked"} ·{" "}
                        {formatFileSize(document.size)}
                      </p>
                    </>
                  }
                >
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-[10.5px] text-muted-foreground">
                      {new Date(`${document.uploadedAt}T00:00:00`).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </p>
                    <Button
                      size="xs"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/8 hover:text-destructive"
                      onClick={() => setDeleting(document)}
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </Button>
                  </div>
                </MobileCard>
              ))}
            </MobileCardList>

            <DesktopTableOnly>
              <TableShell>
                <THead>
                  <TH>File Name</TH>
                  <TH>Category</TH>
                  <TH>Linked Case</TH>
                  <TH>Uploaded</TH>
                  <TH>Size</TH>
                  <TH>Visibility</TH>
                  <TH className="text-right">Actions</TH>
                </THead>
                <TBody>
                  {filtered.map((document) => (
                    <TR key={document.id}>
                      <TD>
                        <span className="flex items-center gap-2">
                          <FileText className="size-3.5 shrink-0 text-accent" />
                          <span className="max-w-[220px] truncate text-[12px] font-medium text-foreground">
                            {document.name}
                          </span>
                        </span>
                      </TD>
                      <TD>
                        <Badge variant="outline">{document.category}</Badge>
                      </TD>
                      <TD className="font-mono text-[11px] text-muted-foreground">
                        {document.caseNo ?? "—"}
                      </TD>
                      <TD className="text-[11.5px] text-foreground">
                        {new Date(`${document.uploadedAt}T00:00:00`).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </TD>
                      <TD className="text-[11.5px] text-muted-foreground">
                        {formatFileSize(document.size)}
                      </TD>
                      <TD>
                        {document.visibility === "client" ? (
                          <Badge variant="success">Shared</Badge>
                        ) : (
                          <Badge variant="warning">
                            <Lock className="size-2.5" />
                            Private
                          </Badge>
                        )}
                      </TD>
                      <TD className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            disabled
                            aria-label={`Download ${document.name} (demo file)`}
                            title="Demo file — no download"
                          >
                            <Download className="size-3.5" />
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/8 hover:text-destructive"
                            onClick={() => setDeleting(document)}
                            aria-label={`Delete ${document.name}`}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </TableShell>
            </DesktopTableOnly>
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete document?"
        description={
          deleting
            ? `${deleting.name} will be removed from the vault. This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete file"
        destructive
        onConfirm={() => {
          if (!deleting) return;
          deleteDocument(deleting.id);
          toast.success(`${deleting.name} deleted`);
        }}
      />
    </div>
  );
}
