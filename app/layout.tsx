/**
 * @description
 * This is the root layout for the Next.js application.
 * It provides global configuration, including metadata, global providers, and theming.
 * 
 * @notes
 * - If the user is logged in but has no profile, we create one automatically.
 * - Providers wraps the application to handle theming and tooltips.
 * - Toaster handles global notifications.
 */

import { getProfileByUserIdAction } from "@/actions/profiles-actions";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/utilities/providers";
import { createProfile } from "@/db/queries/profiles-queries";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Control Panel",
  description: "An AI-driven, just-in-time project management web app."
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  // Create a profile row if none exists.
  if (userId) {
    const res = await getProfileByUserIdAction(userId);
    if (!res.data) {
      await createProfile({ userId });
    }
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Providers
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
