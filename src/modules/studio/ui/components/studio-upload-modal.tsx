"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface StudioUploadModalProps {
  isOpen?: boolean;
}
export const StudioUploadModal = ({}: StudioUploadModalProps) => {
  return (
    <Button variant="secondary">
      <PlusIcon /> Create
    </Button>
  );
};
