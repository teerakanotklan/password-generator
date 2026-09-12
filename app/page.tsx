import { GeneratePasswordForm } from "@/components/generate-password-form";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center px-4 py-6 sm:py-8">
      <div className="w-full max-w-6xl">
        <GeneratePasswordForm />
      </div>
    </div>
  );
}
