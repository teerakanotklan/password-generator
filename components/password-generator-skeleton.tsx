import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

      {/* Responsive 2-Column Grid with Equal Height Partition on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Password Section (Borderless, contains carded password list) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col h-auto lg:h-full lg:max-h-[690px] lg:overflow-hidden space-y-4 min-h-0">
          {/* Header with Title and Global Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 min-h-8 shrink-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-5 w-44 rounded-md" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>

          {/* Strength Meter Section Placeholder */}
          <div className="shrink-0 space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>

            {/* 4 Segment Progress Bar */}
            <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
              <Skeleton className="h-1.5 rounded-full" />
              <Skeleton className="h-1.5 rounded-full" />
              <Skeleton className="h-1.5 rounded-full" />
              <Skeleton className="h-1.5 rounded-full" />
            </div>
          </div>

          {/* Password List Section (ScrollArea border container) */}
          <div className="flex-1 min-h-0 h-[260px] sm:h-[320px] lg:h-[420px] border rounded-xl p-2 space-y-1 overflow-hidden">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-lg"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 flex-1">
                  <Skeleton className="h-4 w-6 rounded shrink-0" />
                  <Skeleton
                    className="h-4 rounded"
                    style={{ width: `${Math.max(40, 75 - idx * 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Settings Section */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col h-auto lg:h-full lg:max-h-[690px]">
          <div className="space-y-4">
            {/* Settings Header */}
            <div className="flex items-center justify-between min-h-8">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-44 rounded-md" />
              </div>
              <Skeleton className="h-4 w-16 rounded" />
            </div>

            {/* Length Control Card */}
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-3 w-12 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-16 rounded-md" />
                    <Skeleton className="h-3 w-8 rounded" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <Skeleton className="h-3 w-14 rounded" />
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-6 w-8 rounded-md" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity Control Card */}
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-3 w-14 rounded" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-3 w-36 rounded" />
              </CardContent>
            </Card>

            {/* Character Types & Rules Preferences Card */}
            <Card>
              <CardContent className="space-y-3">
                {/* Character Types Section */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-28 rounded" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center space-x-2 py-0.5">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-32 rounded" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rules & Preferences Section */}
                <div className="space-y-2.5">
                  <Skeleton className="h-3 w-36 rounded" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-2 py-0.5">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-32 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
