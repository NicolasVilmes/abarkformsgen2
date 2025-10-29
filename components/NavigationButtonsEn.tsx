"use client";
import { useFormEn } from "@/context/FormContextEN";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";

interface NavigationButtonsProps {
  totalSteps: number;
}

export function NavigationButtonsEn({ totalSteps }: NavigationButtonsProps) {
  const { currentStep, setCurrentStep, nextStep, formData } = useFormEn();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(formData));

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        body: formDataToSend,
      });

      const contentType = res.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        const description =
          typeof payload === "string"
            ? payload || "Unexpected error while sending the form."
            : payload?.message || "Unexpected error while sending the form.";
        throw new Error(description);
      }
      setIsSuccess(true);
    } catch (error) {
      const description =
        error instanceof Error
          ? error.message
          : "Unexpected error while sending the form.";
      toast({
        title: "Submission failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={() => setCurrentStep(currentStep - 1)}
        disabled={currentStep === 1}
        className="transition-all duration-200 hover:bg-gray-100"
      >
        Back
      </Button>

      <Button
        onClick={currentStep === totalSteps ? handleSubmit : nextStep}
        className="bg-abark hover:bg-abark-dark text-white transition-all duration-200"
      >
        {currentStep === totalSteps ? "Submit" : "Next"}
      </Button>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
            <p className="text-white mt-2">Sending...</p>
          </div>
        </div>
      )}

      <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Form Submitted!</DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-600">
            Your form has been successfully submitted.
          </p>
          <DialogFooter>
            <Button
              onClick={() => setIsSuccess(false)}
              className="w-full bg-abark-light text-white"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
