"use client";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProgressBarProps {
  steps: string[];
}

export function ProgressBar({ steps }: ProgressBarProps) {
  const { currentStep } = useForm();
  const isMobile = useIsMobile();

  // Define os tamanhos dos círculos para manter consistência
  const circleSize = isMobile ? 24 : 32; // em pixels

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 px-4">
      <div className="relative flex justify-between items-center">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-1/8 min-w-[80px]"
          >
            {/* Círculo com numeração */}
            <div
              style={{ width: `${circleSize}px`, height: `${circleSize}px` }}
              className={cn(
                "rounded-full flex items-center justify-center text-xs md:text-sm transition-all duration-200",
                index + 1 <= currentStep
                  ? "bg-abark text-white"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {index + 1}
            </div>
            {/* Nome da etapa */}
            <span
              className={cn(
                "text-[10px] md:text-sm mt-2 text-center transition-all duration-200 w-full",
                index + 1 <= currentStep
                  ? "text-abark font-medium"
                  : "text-gray-500"
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
