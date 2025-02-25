/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { jurisdicoesEmpresas } from "@/data/jurisdicoes";
import { Director } from "@/interfaces/Director";
import { Shareholder } from "@/interfaces/Shareholdes";
import { BeneficioalOwner, ContabilResponsabel } from "@/interfaces/BO";
import { CheckedState } from "@radix-ui/react-checkbox";

// Interface para documentos
export interface Document {
  title: string;
  url: string;
}

// Interface principal do formulário
export interface FormData {
  tipoEstrutura: string;
  nomeEmpresa: string[];
  jurisdicao: string;
  isOperacional: boolean;
  propositoIncorporacao: string;
  diretores: Director[];
  diretoriaPersonalizada: boolean;
  acionistas: Shareholder[];
  beneficiarios: BeneficioalOwner[];
  capitalSocial: CheckedState;
  origemFundos: string[];
  detalhesOrigemFundos: string;
  responsavelContabilidade?: ContabilResponsabel;
  documentos?: Document[]; // 🚀 Agora OPCIONAL
}

interface FormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  previousStep: () => void;
}

// Schemas de validação com Zod
const step1Schema = z.object({
  tipoEstrutura: z.string().nonempty("Selecione o tipo de estrutura"),
});

const step2Schema = z.object({
  nomeEmpresa: z
    .array(
      z.string().nonempty("Cada opção de nome da empresa deve ser preenchida")
    )
    .length(3, "Forneça 3 opções para o nome da empresa"),
  jurisdicao: z.string().nonempty("Jurisdicao é obrigatória"),
  isOperacional: z.boolean(),
  propositoIncorporacao: z
    .string()
    .nonempty("Propósito de incorporação é obrigatório"),
});

const stepDiretoresSchema = z
  .object({
    diretores: z.array(
      z.object({
        nome: z.string().nonempty("Nome do diretor é obrigatório"),
        passport: z.string().nonempty("Número do passaporte é obrigatório"),
        origem: z.string().optional(),
        nascimento: z.string().optional(),
        address: z.string().optional(),
        telefone: z.string().optional(),
        email: z.string().optional(),
        occupation: z.string().optional(),
      })
    ),
    diretoriaPersonalizada: z.boolean(),
    jurisdicao: z.string().nonempty(),
  })
  .refine(
    (data) => {
      if (data.diretoriaPersonalizada) return true;
      const selected = jurisdicoesEmpresas.find(
        (j) => j.value === data.jurisdicao
      );
      const min = selected ? selected.diretor : 0;
      return data.diretores.length >= min;
    },
    {
      message:
        "Número mínimo de diretores não atingido para a jurisdição selecionada",
      path: ["diretores"],
    }
  );

const stepBeneficiariosSchema = z
  .object({
    beneficiarios: z
      .array(
        z.object({
          nome: z.string().nonempty("Nome é obrigatório"),
          endereco: z.string().nonempty("Endereço é obrigatório"),
          ocupacao: z.string().nonempty("Ocupação é obrigatória"),
          nacionalidade: z.string().nonempty("Nacionalidade é obrigatória"),
          dataNascimento: z
            .string()
            .nonempty("Data de nascimento é obrigatória"),
          isPep: z.boolean(),
          percentualAcionaria: z
            .string()
            .nonempty("Percentual acionário é obrigatório"),
        })
      )
      .min(1, "Adicione pelo menos um beneficiário"),
  })
  .refine(
    (data) => {
      const total = data.beneficiarios.reduce((acc, ben) => {
        const val = parseFloat(ben.percentualAcionaria.replace("%", ""));
        return acc + (isNaN(val) ? 0 : val);
      }, 0);

      return total === 100;
    },
    {
      message: "A soma dos percentuais deve ser igual a 100%",
      path: ["beneficiarios"],
    }
  );

const stepOrigemFundosSchema = z.object({
  origemFundos: z
    .array(z.string())
    .min(1, "Selecione ao menos uma opção para a origem dos fundos"),
  detalhesOrigemFundos: z
    .string()
    .nonempty("Forneça mais detalhes sobre a origem dos fundos"),
});

// 🚀 Agora os documentos são OPCIONAIS
const stepDocumentosSchema = z.object({
  documentos: z
    .array(
      z.object({
        title: z.string().nonempty("Título do documento é obrigatório"),
        url: z.string().nonempty("URL do documento é obrigatória"),
      })
    )
    .optional(), // Agora o array pode ser vazio ou omitido
});

// 🚀 Estado inicial do formulário
const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    tipoEstrutura: "",
    nomeEmpresa: ["", "", ""],
    jurisdicao: "",
    isOperacional: false,
    propositoIncorporacao: "",
    diretores: [],
    diretoriaPersonalizada: false,
    acionistas: [],
    beneficiarios: [],
    capitalSocial: false,
    origemFundos: [],
    detalhesOrigemFundos: "",
    responsavelContabilidade: undefined,
    documentos: [], // Documentos agora iniciam vazios, mas são opcionais
  });

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const nextStep = () => {
    let validationResult: { success: boolean; error?: any };

    switch (currentStep) {
      case 1:
        validationResult = step1Schema.safeParse(formData);
        break;
      case 2:
        validationResult = step2Schema.safeParse(formData);
        break;
      case 3:
        validationResult = stepDiretoresSchema.safeParse(formData);
        break;
      case 5:
        validationResult = stepBeneficiariosSchema.safeParse(formData);
        break;
      case 6:
        validationResult = stepOrigemFundosSchema.safeParse(formData);
        break;
      case 8:
        validationResult = stepDocumentosSchema.safeParse({
          documentos: formData.documentos?.length ? formData.documentos : [],
        });
        break;
      default:
        validationResult = { success: true };
    }

    if (!validationResult.success) {
      const messages = validationResult.error.errors
        .map((err: any) => err.message)
        .join(", ");
      toast({
        title: "Erro de validação",
        description: messages,
        variant: "destructive",
      });
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <FormContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        formData,
        updateFormData,
        nextStep,
        previousStep,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}
