"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SignOutButton() {
  return (
    <DropdownMenuItem
      className="text-destructive focus:text-destructive"
      onClick={() => signOut({ callbackUrl: "/sign-in" })}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </DropdownMenuItem>
  );
}
