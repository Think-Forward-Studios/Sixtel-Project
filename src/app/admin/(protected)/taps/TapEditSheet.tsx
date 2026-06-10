"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  tapFormSchema,
  tapToFormValues,
  type AdminTap,
  type TapFormValues,
} from "@/lib/tap-schema";
import { createTap, updateTap, deleteTap } from "./actions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MediaPicker } from "@/components/admin/MediaPicker";

const emptyValues: TapFormValues = {
  name: "",
  brewery: "",
  style: "",
  abvPercent: "",
  ibu: "",
  labelImageUrl: "",
  isVisible: true,
};

export function TapEditSheet({
  tap,
  open,
  onOpenChange,
  onSaved,
}: {
  tap: AdminTap | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(tapFormSchema), defaultValues: emptyValues });

  // Re-seed the form each time the sheet opens for a tap (or for "new").
  useEffect(() => {
    if (open) reset(tap ? tapToFormValues(tap) : emptyValues);
  }, [open, tap, reset]);

  const onSubmit = handleSubmit((values: TapFormValues) => {
    startTransition(async () => {
      const res = tap ? await updateTap(tap.id, values) : await createTap(values);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(tap ? "Tap updated." : "Tap added.");
      onSaved();
      onOpenChange(false);
    });
  });

  const onConfirmDelete = () => {
    if (!tap) return;
    startTransition(async () => {
      const res = await deleteTap(tap.id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Tap deleted.");
      onSaved();
      onOpenChange(false);
    });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) setConfirmDelete(false);
        onOpenChange(o);
      }}
    >
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{tap ? "Edit tap" : "Add tap"}</SheetTitle>
          <SheetDescription>
            {tap ? "Update this tap's details." : "Add a new tap to the list."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4 px-4 pb-6">
          <Field id="name" label="Name" error={errors.name?.message}>
            <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
          </Field>
          <Field id="brewery" label="Brewery">
            <Input id="brewery" {...register("brewery")} />
          </Field>
          <Field id="style" label="Style">
            <Input id="style" {...register("style")} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field id="abvPercent" label="ABV %" error={errors.abvPercent?.message}>
              <Input
                id="abvPercent"
                inputMode="decimal"
                placeholder="5.2"
                aria-invalid={!!errors.abvPercent}
                {...register("abvPercent")}
              />
            </Field>
            <Field id="ibu" label="IBU" error={errors.ibu?.message}>
              <Input
                id="ibu"
                inputMode="numeric"
                placeholder="40"
                aria-invalid={!!errors.ibu}
                {...register("ibu")}
              />
            </Field>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="labelImageUrl">Label image</Label>
            <Controller
              name="labelImageUrl"
              control={control}
              render={({ field }) => (
                <MediaPicker
                  bucket="tap-list-images"
                  value={field.value || null}
                  onChange={(url) => field.onChange(url ?? "")}
                />
              )}
            />
            {errors.labelImageUrl && (
              <p className="text-xs text-destructive">{errors.labelImageUrl.message}</p>
            )}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Controller
              name="isVisible"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isVisible"
                  checked={field.value}
                  onCheckedChange={(c) => field.onChange(c === true)}
                />
              )}
            />
            <Label htmlFor="isVisible">Visible on the public site</Label>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            {tap ? (
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
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
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
