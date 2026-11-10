import { Skeleton } from "@/components/ui/skeleton";

/**
 * Render loading skeleton layout for password generator workspace.
 *
 * @returns Skeleton placeholder element.
 */
export function PasswordGeneratorSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <Skeleton className="h-12 w-3/4 rounded-xl" />
      <Skeleton className="mt-3 mb-8 h-4 w-2/3 rounded" />
      <div className="space-y-6 rounded-3xl bg-card p-5 sm:p-7">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}
