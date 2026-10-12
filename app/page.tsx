import { GeneratePasswordForm } from "@/components/generate-password-form";

/**
 * Render home page hosting the password generator application.
 *
 * @returns Home page element.
 */
export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
      <div className="w-full">
        <GeneratePasswordForm />
      </div>
    </div>
  );
}
