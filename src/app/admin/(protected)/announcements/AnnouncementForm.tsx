"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Markdown from "react-markdown";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  announcementFormSchema,
  announcementToFormValues,
  type AdminAnnouncement,
  type AnnouncementFormValues,
} from "@/lib/announcement-schema";
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const emptyValues: AnnouncementFormValues = {
  title: "",
  body: "",
  linkUrl: "",
  linkLabel: "",
  isActive: false,
};
const BODY_SOFT_CAP = 200;

export function AnnouncementForm({
  announcement,
  activeOther,
}: {
  announcement: AdminAnnouncement | null;
  activeOther: { id: string; title: string } | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pendingSwap, setPendingSwap] = useState<AnnouncementFormValues | null>(null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: announcement ? announcementToFormValues(announcement) : emptyValues,
  });
  const body = watch("body") ?? "";

  const save = (values: AnnouncementFormValues) => {
    startTransition(async () => {
      const res = announcement
        ? await updateAnnouncement(announcement.id, values)
        : await createAnnouncement(values);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(announcement ? "Announcement updated." : "Announcement created.");
      router.push("/admin/announcements");
      router.refresh();
    });
  };

  const onSubmit = handleSubmit((values: AnnouncementFormValues) => {
    // Active-swap: activating while another row is active → confirm first.
    if (values.isActive && activeOther && activeOther.id !== announcement?.id) {
      setPendingSwap(values);
      return;
    }
    save(values);
  });

  const onConfirmDelete = () => {
    if (!announcement) return;
    startTransition(async () => {
      const res = await deleteAnnouncement(announcement.id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Announcement deleted.");
      router.push("/admin/announcements");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-2xl space-y-5">
      <Field id="title" label="Title" error={errors.title?.message}>
        <Input id="title" maxLength={80} aria-invalid={!!errors.title} {...register("title")} />
      </Field>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="body">Body (Markdown)</Label>
          <span
            className={
              body.length > BODY_SOFT_CAP ? "text-xs text-destructive" : "text-xs text-muted-foreground"
            }
          >
            {body.length}/{BODY_SOFT_CAP}
          </span>
        </div>
        <Textarea
          id="body"
          rows={3}
          placeholder="Keep it short — **bold**, emoji, a link."
          {...register("body")}
        />
        {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
        {body.trim() !== "" && (
          <div className="mt-2 border border-border bg-card p-3">
            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
              Preview
            </p>
            <div className="text-sm text-muted-foreground [&_a]:text-sixtel-copper [&_a]:underline [&_strong]:font-semibold [&_strong]:text-sixtel-ink">
              <Markdown>{body}</Markdown>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="linkUrl" label="Link URL (optional)" error={errors.linkUrl?.message}>
          <Input
            id="linkUrl"
            placeholder="https://…"
            aria-invalid={!!errors.linkUrl}
            {...register("linkUrl")}
          />
        </Field>
        <Field id="linkLabel" label="Link label" error={errors.linkLabel?.message}>
          <Input
            id="linkLabel"
            placeholder="RSVP, Learn more…"
            aria-invalid={!!errors.linkLabel}
            {...register("linkLabel")}
          />
        </Field>
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-4">
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="isActive"
              checked={field.value}
              onCheckedChange={(c) => field.onChange(c === true)}
            />
          )}
        />
        <Label htmlFor="isActive">Active — show this as the home-page banner</Label>
      </div>

      {pendingSwap && (
        <div className="space-y-2 border border-sixtel-copper/40 bg-sixtel-copper/10 p-3 text-sm">
          <p className="text-sixtel-ink">
            This will replace the currently-active banner:{" "}
            <strong>{activeOther?.title}</strong>. Continue?
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const v = pendingSwap;
                setPendingSwap(null);
                save(v);
              }}
              disabled={pending}
            >
              Replace &amp; save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setPendingSwap(null)}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        {announcement ? (
          confirmDelete ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Delete?</span>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={onConfirmDelete}
                disabled={pending}
              >
                Yes, delete
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setConfirmDelete(false)}
                disabled={pending}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="text-destructive"
              onClick={() => setConfirmDelete(true)}
              disabled={pending}
            >
              <Trash2Icon className="size-4" /> Delete
            </Button>
          )
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" type="button">
            <Link href="/admin/announcements">Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending || pendingSwap !== null}>
            {pending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" /> Saving…
              </>
            ) : announcement ? (
              "Save changes"
            ) : (
              "Create announcement"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
