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
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      <div className="relative">
        {/* Contêiner dos círculos e rótulos */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                style={{ width: `${circleSize}px`, height: `${circleSize}px` }}
                className={cn(
                  "rounded-full flex items-center justify-center text-xs md:text-sm transition-all duration-200",
                  index + 1 <= currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {!isMobile && index + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] md:text-sm mt-2 transition-all duration-200 text-center",
                  index + 1 <= currentStep ? "text-blue-500" : "text-gray-500",
                  isMobile && "hidden md:block"
                )}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
