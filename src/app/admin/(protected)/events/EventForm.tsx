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
  eventFormSchema,
  eventToFormValues,
  type AdminEvent,
  type EventFormValues,
} from "@/lib/event-schema";
import { createEvent, updateEvent, deleteEvent } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MediaPicker } from "@/components/admin/MediaPicker";

const emptyValues: EventFormValues = {
  title: "",
  description: "",
  startsAt: "",
  endsAt: "",
  coverImagePath: "",
  isMembersOnly: false,
  externalRsvpUrl: "",
  published: false,
};

export function EventForm({ event }: { event: AdminEvent | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event ? eventToFormValues(event) : emptyValues,
  });
  const description = watch("description");

  const onSubmit = handleSubmit((values: EventFormValues) => {
    startTransition(async () => {
      const res = event
        ? await updateEvent(event.id, values)
        : await createEvent(values);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(event ? "Event updated." : "Event created.");
      router.push("/admin/events");
      router.refresh();
    });
  });

  const onConfirmDelete = () => {
    if (!event) return;
    startTransition(async () => {
      const res = await deleteEvent(event.id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Event deleted.");
      router.push("/admin/events");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-2xl space-y-5">
      <Field id="title" label="Title" error={errors.title?.message}>
        <Input id="title" aria-invalid={!!errors.title} {...register("title")} />
      </Field>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description (Markdown)</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Use **bold**, emoji, and [links](https://…)."
          {...register("description")}
        />
        {description && description.trim() !== "" && (
          <div className="mt-2 border border-border bg-card p-3">
            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
              Preview
            </p>
            <div className="space-y-1 text-sm text-muted-foreground [&_a]:text-sixtel-copper [&_a]:underline [&_strong]:font-semibold [&_strong]:text-sixtel-ink">
              <Markdown>{description}</Markdown>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="startsAt" label="Starts at" error={errors.startsAt?.message}>
          <Input
            id="startsAt"
            type="datetime-local"
            aria-invalid={!!errors.startsAt}
            {...register("startsAt")}
          />
        </Field>
        <Field id="endsAt" label="Ends at (optional)" error={errors.endsAt?.message}>
          <Input id="endsAt" type="datetime-local" {...register("endsAt")} />
        </Field>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coverImagePath">Cover image</Label>
        <Controller
          name="coverImagePath"
          control={control}
          render={({ field }) => (
            <MediaPicker
              bucket="event-covers"
              value={field.value || null}
              onChange={(url) => field.onChange(url ?? "")}
            />
          )}
        />
        {errors.coverImagePath && (
          <p className="text-xs text-destructive">{errors.coverImagePath.message}</p>
        )}
      </div>

      <Field
        id="externalRsvpUrl"
        label="External RSVP URL (optional)"
        error={errors.externalRsvpUrl?.message}
      >
        <Input
          id="externalRsvpUrl"
          placeholder="https://…"
          aria-invalid={!!errors.externalRsvpUrl}
          {...register("externalRsvpUrl")}
        />
      </Field>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Controller
            name="isMembersOnly"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="isMembersOnly"
                checked={field.value}
                onCheckedChange={(c) => field.onChange(c === true)}
              />
            )}
          />
          <Label htmlFor="isMembersOnly">
            Members only — shows a badge on the public list
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Controller
            name="published"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="published"
                checked={field.value}
                onCheckedChange={(c) => field.onChange(c === true)}
              />
            )}
          />
          <Label htmlFor="published">Published — visible on the public site</Label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        {event ? (
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
            <Link href="/admin/events">Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" /> Saving…
              </>
            ) : event ? (
              "Save changes"
            ) : (
              "Create event"
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
