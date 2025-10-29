"use client";
import { FormProvider } from "@/context/FormContext";
import { TipoEstrutura } from "@/components/steps/TipoEstrutura";
import { InformacoesGerais } from "@/components/steps/InformacoesGerais";
import { Diretores } from "@/components/steps/Diretores";
import { Beneficiarios } from "@/components/steps/Beneficiarios";
import { SourceOfWealth } from "@/components/steps/sourceOfWealth";
import { Docs } from "@/components/steps/documentos";
import { RegistroContabil } from "@/components/steps/RegistroContabil";
import { useForm } from "@/context/FormContext";
import { NavigationButtons } from "@/components/NavigationButtons";
import { ProgressBar } from "@/components/ProgressBar";

function FormSteps() {
  const { currentStep } = useForm();

  return (
    <div className="min-h-[400px] transition-all duration-300">
      {currentStep === 1 && <TipoEstrutura />}
      {currentStep === 2 && <InformacoesGerais />}
      {currentStep === 3 && <Diretores />}
      {currentStep === 4 && <Beneficiarios />}
      {currentStep === 5 && <SourceOfWealth />}
      {currentStep === 6 && <Docs />}
      {currentStep === 7 && <RegistroContabil />}
    </div>
  );
}

function FormContainer({ steps }: { steps: string[] }) {
  const { currentStep } = useForm();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProgressBar steps={steps} currentStep={currentStep} />
      <div className="bg-white rounded-lg shadow-sm p-8 border">
        <FormSteps />
        <NavigationButtons totalSteps={steps.length} />
      </div>
    </div>
  );
}

export default function EstruturasPT() {
  const steps = [
    "Tipo de Estrutura",
    "Informações Gerais",
    "Diretores",
    "Beneficiários",
    "Origem dos Fundos",
    "Documentos",
    "Registro Contabil",
  ];

  return (
    <FormProvider>
      <FormContainer steps={steps} />
    </FormProvider>
  );
}
