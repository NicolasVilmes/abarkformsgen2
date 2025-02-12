"use client";
import { FormProvider } from "@/context/FormContext";
import { ProgressBar } from "@/components/ProgressBar";
import { TipoEstrutura } from "@/components/steps/TipoEstrutura";
import { InformacoesGerais } from "@/components/steps/InformacoesGerais";
import { Diretores } from "@/components/steps/Diretores";
import { Acionistas } from "@/components/steps/Acionistas";
import { Beneficiarios } from "@/components/steps/Beneficiarios";
import { SourceOfWealth } from "@/components/steps/sourceOfWealth";
import { RegistroContabil } from "@/components/steps/RegistroContabil";
import { useForm } from "@/context/FormContext";
import { NavigationButtons } from "@/components/NavigationButtons";
import { Docs } from "@/components/steps/documentos";

function FormSteps() {
  const { currentStep } = useForm();

  return (
    <div className="min-h-[400px] transition-all duration-300">
      {currentStep === 1 && <TipoEstrutura />}
      {currentStep === 2 && <InformacoesGerais />}
      {currentStep === 3 && <Diretores />}
      {currentStep === 4 && <Acionistas />}
      {currentStep === 5 && <Beneficiarios />}
      {currentStep === 6 && <SourceOfWealth />}
      {currentStep === 7 && <RegistroContabil />}
      {currentStep === 8 && <Docs />}
    </div>
  );
}

export default function EstruturasPT() {
  const steps = [
    "Tipo de Estrutura",
    "Informações Gerais",
    "Diretores",
    "Acionistas",
    "Beneficiários",
    "Origem dos Fundos",
    "Registro Contabil",
    "Documentos",
  ];

  return (
    <FormProvider>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressBar steps={steps} />
        <div className="bg-white rounded-lg shadow-sm p-8 border">
          <FormSteps />
          <NavigationButtons totalSteps={steps.length} />
        </div>
      </div>
    </FormProvider>
  );
}
