import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PasswordGeneratorSkeleton() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column Skeleton: Passwords Card */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <Card className="flex flex-col h-full">
            <CardContent className="space-y-4 flex flex-col flex-1 p-5 sm:p-6 min-h-0">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-5 w-36" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>

              {/* Strength & Includes Placeholder */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                  <Skeleton className="h-1.5 rounded-full" />
                  <Skeleton className="h-1.5 rounded-full" />
                  <Skeleton className="h-1.5 rounded-full" />
                  <Skeleton className="h-1.5 rounded-full" />
                </div>
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-6 w-24 rounded" />
                  <Skeleton className="h-6 w-24 rounded" />
                  <Skeleton className="h-6 w-20 rounded" />
                  <Skeleton className="h-6 w-20 rounded" />
                </div>
              </div>

              {/* Password List Placeholder */}
              <div className="flex-1 flex flex-col gap-2 pt-2 min-h-[360px]">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column Skeleton: Settings Card */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <Card className="flex flex-col h-full">
            <CardContent className="space-y-4 flex flex-col flex-1 p-5 sm:p-6">
              {/* Settings Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-44" />
              </div>

              {/* Length Control Placeholder */}
              <div className="space-y-2 p-3.5 rounded-lg border border-border/50">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-16 rounded" />
                </div>
                <Skeleton className="h-2 w-full rounded-lg" />
              </div>

              {/* Quantity Control Placeholder */}
              <div className="space-y-2 p-3.5 rounded-lg border border-border/50">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-20 rounded" />
                </div>
                <Skeleton className="h-2 w-full rounded-lg" />
                <Skeleton className="h-3 w-32" />
              </div>

              {/* Character Types Grid Placeholder */}
              <div className="space-y-2.5">
                <Skeleton className="h-4 w-28" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                </div>
              </div>

              {/* Rules Grid Placeholder */}
              <div className="space-y-2.5">
                <Skeleton className="h-4 w-28" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
