import { GeneratePasswordForm } from "@/components/generate-password-form";

/**
 * Render home page hosting the password generator application.
 *
 * @returns Home page element.
 */
export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col w-full p-4 sm:p-6">
      <div className="w-full">
        <GeneratePasswordForm />
      </div>
    </div>
  );
}
