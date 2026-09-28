import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function PasswordGeneratorSkeleton() {
  return (
    <div className="w-full">
      {/* Mobile Segmented View Switcher Skeleton */}
      <div className="block lg:hidden mb-4">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/50">
          <Skeleton className="h-9 rounded-lg" />
          <Skeleton className="h-9 rounded-lg" />
        </div>
      </div>

      {/* Responsive 2-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Password Section Skeleton (Unified Card)                     */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col h-auto min-h-0">
          <Card className="flex flex-col min-h-0 overflow-hidden">
            {/* Header with Title and Global Actions */}
            <CardHeader className="border-b pb-4 shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
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
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            </CardHeader>

            {/* Password List Section Skeleton */}
            <CardContent className="pt-4 flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 min-h-[320px] space-y-1.5 p-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-border/40"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton className="h-4 w-6 rounded shrink-0" />
                      <Skeleton
                        className="h-4 rounded"
                        style={{ width: `${Math.max(40, 75 - idx * 8)}%` }}
                      />
                    </div>
                    <Skeleton className="h-4 w-4 rounded ml-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Settings Section Skeleton (Open Layout)                     */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Settings Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-36 rounded-md" />
                <Skeleton className="h-3 w-52 rounded" />
              </div>
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>

          <div className="space-y-5">
            {/* Length Control Skeleton */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex items-center justify-between gap-1.5 pt-1">
                <Skeleton className="h-3 w-14 rounded" />
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-6 w-8 rounded-md" />
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Quantity Control Skeleton */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
            </div>

            <Separator />

            {/* Character Types Section Skeleton */}
            <div className="space-y-2.5 pt-1">
              <Skeleton className="h-3 w-28 rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-2 py-0.5">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-28 rounded" />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Rules & Preferences Section Skeleton */}
            <div className="space-y-2.5">
              <Skeleton className="h-3 w-36 rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2 py-0.5">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-28 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
