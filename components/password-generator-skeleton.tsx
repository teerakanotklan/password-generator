import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

/**
 * Render loading skeleton layout for password generator workspace.
 *
 * @returns Skeleton placeholder element.
 */
export function PasswordGeneratorSkeleton() {
  return (
    <div className="grid w-full gap-4 sm:gap-6 lg:h-[calc(100dvh-3rem)] lg:grid-cols-[minmax(24rem,30rem)_minmax(0,1fr)]">
      {/* Left Column: Form & Configuration */}
      <div className="min-w-0 lg:overflow-y-auto">
        <div className="mb-5">
          <Skeleton className="h-9 w-52 rounded-lg sm:h-10 sm:w-64" />
          <Skeleton className="mt-2.5 h-4 w-72 rounded sm:w-80" />
        </div>

        <div className="space-y-4 rounded-3xl bg-card p-5">
          {/* Password Length Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              <Skeleton className="h-3 w-12 rounded" />
              <div className="flex gap-1.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-7 rounded-md" />
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Password Quantity Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              <Skeleton className="h-3 w-12 rounded" />
              <div className="flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-7 rounded-md" />
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Character Sets */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <div className="grid grid-cols-2 gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-lg" />
              ))}
            </div>
          </div>

          <Separator />

          {/* Rules */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 rounded" />
            <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded" />
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>

      {/* Right Column: Password Display List */}
      <section className="flex flex-col overflow-hidden rounded-3xl bg-card lg:h-full lg:min-h-0">
        {/* Header */}
        <div className="px-5 pt-5 sm:px-7 sm:pt-7">
          <Skeleton className="h-8 w-44 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-64 rounded sm:w-80" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 px-5 pt-4 sm:px-7">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>

        {/* Passwords Stream */}
        <div className="mt-4 min-h-0 flex-1 divide-y divide-border overflow-hidden border-y border-border">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-5 py-3.5 sm:px-7"
            >
              <Skeleton
                className="h-5 rounded font-mono"
                style={{ width: `${Math.max(45, 75 - (idx % 4) * 8)}%` }}
              />
              <Skeleton className="size-4 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
