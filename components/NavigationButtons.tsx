"use client";
import { useForm } from "@/context/FormContext";
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

interface NavigationButtonsProps {
  totalSteps: number;
}

export function NavigationButtons({ totalSteps }: NavigationButtonsProps) {
  const { currentStep, setCurrentStep, nextStep, formData } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async () => {
    setIsLoading(true); // Ativa o spinner de carregamento

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(formData));

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        body: formDataToSend,
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      console.log("Formulário enviado! Dados:", data);
      setIsSuccess(true); // Exibe o modal de sucesso
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setIsLoading(false); // Desativa o spinner após o envio
    }
  };

  return (
    <div className="flex justify-between mt-8">
      {/* Botão Anterior */}
      <Button
        variant="outline"
        onClick={() => setCurrentStep(currentStep - 1)}
        disabled={currentStep === 1}
        className="transition-all duration-200 hover:bg-gray-100"
      >
        Anterior
      </Button>

      {/* Botão Próximo ou Enviar */}
      <Button
        onClick={currentStep === totalSteps ? handleSubmit : nextStep}
        className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
      >
        {currentStep === totalSteps ? "Enviar" : "Próximo"}
      </Button>

      {/* Spinner de Carregamento - Tela cheia */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
            <p className="text-white mt-2">Enviando...</p>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Formulário Enviado!</DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-600">
            Seu formulário foi enviado com sucesso.
          </p>
          <DialogFooter>
            <Button
              onClick={() => setIsSuccess(false)}
              className="w-full bg-blue-500 text-white"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
