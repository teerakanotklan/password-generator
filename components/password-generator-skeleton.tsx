import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

/**
 * Render loading skeleton layout for password generator workspace.
 *
 * @returns Skeleton placeholder element.
 */
export function PasswordGeneratorSkeleton() {
  return (
    <div className="w-full text-left">
      {/* Mobile Segmented View Switcher Skeleton */}
      <div className="block lg:hidden mb-4">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/50">
          <Skeleton className="h-9 rounded-lg" />
          <Skeleton className="h-9 rounded-lg" />
        </div>
      </div>

      {/* Responsive 2-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
        {/* LEFT COLUMN: Settings Section Skeleton */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-5 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-44 rounded" />
              </div>
            </div>
            <Skeleton className="h-5 w-12 rounded" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-14 w-full rounded-md" />
            <Separator className="bg-border/60" />
            <Skeleton className="h-14 w-full rounded-md" />
            <Separator className="bg-border/60" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
            </div>
            <Separator className="bg-border/60" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Password Section Skeleton */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-4 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-40 rounded-md" />
                  <Skeleton className="h-5 w-8 rounded-full" />
                </div>
                <Skeleton className="h-3 w-48 rounded" />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>

          {/* Telemetry Strip Skeleton */}
          <Skeleton className="h-8 w-full rounded-lg" />

          {/* Password List Skeleton */}
          <div className="space-y-1.5 p-1">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-border/40"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-4 w-6 rounded shrink-0" />
                  <Skeleton
                    className="h-4 rounded"
                    style={{ width: `${Math.max(40, 75 - idx * 5)}%` }}
                  />
                </div>
                <Skeleton className="h-4 w-4 rounded ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
