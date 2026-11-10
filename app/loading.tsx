import { PasswordGeneratorSkeleton } from "@/components/password-generator-skeleton";

/**
 * Render loading screen with password generator skeleton.
 *
 * @returns Loading layout element.
 */
export default function Loading() {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6">
      <div className="w-full">
        <PasswordGeneratorSkeleton />
      </div>
    </div>
  );
}
