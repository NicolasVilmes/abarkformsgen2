"use client";
import { useForm } from "@/context/FormContext";
import { Button } from "./ui/button";

interface NavigationButtonsProps {
  totalSteps: number;
}

export function NavigationButtons({ totalSteps }: NavigationButtonsProps) {
  const { currentStep, setCurrentStep, nextStep, formData } = useForm();

  const handleSubmit = async () => {
    // Cria o objeto FormData
    const formDataToSend = new FormData();

    // Adiciona os dados do formulário (por exemplo, em um campo "data")
    formDataToSend.append("data", JSON.stringify(formData));

    // Se você tiver arquivos para anexar, substitua a variável 'someFile' pela variável correspondente.
    // Exemplo (comente se não for usar):
    // if (meuArquivo) {
    //   formDataToSend.append("arquivo", meuArquivo, meuArquivo.name);
    // }

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        // Não defina o header "Content-Type" manualmente!
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
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
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
        Anterior
      </Button>
      <Button
        onClick={currentStep === totalSteps ? handleSubmit : nextStep}
        className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
      >
        {currentStep === totalSteps ? "Enviar" : "Próximo"}
      </Button>
    </div>
  );
}
