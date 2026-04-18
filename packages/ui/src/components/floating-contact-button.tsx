"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@branda/ui/components/button";
import { cn } from "@branda/ui/lib/utils";
import { SupportEmail } from "@branda/ui/lib/constants";

export interface FloatingContactButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The email address to send to. */
  email?: string;
  /** The subject of the email. */
  subject?: string;
  /** The body of the email. */
  body?: string;
}

export const FloatingContactButton = React.forwardRef<HTMLButtonElement, FloatingContactButtonProps>(
  (
    {
      className,
      email = SupportEmail,
      subject = "Sample Mail Subject",
      body = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      const mailtoLink = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
    };

    return (
      <Button
        ref={ref}
        type="button"
        variant="default"
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 rounded-full shadow-lg bg-teal-600 text-white transition-all hover:scale-105 hover:shadow-xl shadow-bg-teal-900 w-fit hover:bg-teal-700 cursor-pointer",
          className
        )}
        onClick={handleClick}
        aria-label="Contact Us"
        {...props}
      >
        Chat
        <MessageCircle className="!size-7 shrink-0" />
      </Button>
    );
  }
);
FloatingContactButton.displayName = "FloatingContactButton";
