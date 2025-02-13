"use client";

import React, { createContext, useContext, useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { jurisdicoesEmpresas } from "@/data/jurisdicoes";
import { Director } from "@/interfaces/Director";
import { Shareholder } from "@/interfaces/Shareholdes";
import { BeneficioalOwner, ContabilResponsabel } from "@/interfaces/BO";

// Nova interface para Documentos
export interface Document {
  title: string;
  url: string;
}

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
  capitalSocial: string;
  origemFundos: string[];
  detalhesOrigemFundos: string;
  responsavelContabilidade?: ContabilResponsabel;
  documentos: Document[];
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

// Step 1: Tipo de Estrutura
const step1Schema = z.object({
  tipoEstrutura: z.string().nonempty("Selecione o tipo de estrutura"),
});

// Step 2: Informações Gerais
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

// Step 3: Diretores
const stepDiretoresSchema = z
  .object({
    diretores: z.array(
      z.object({
        nome: z.string().nonempty("Nome do diretor é obrigatório"),
        // Outras propriedades podem ser adicionadas conforme necessário.
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

// Step 4: Acionistas – opcional
const stepAcionistasSchema = z.object({
  acionistas: z
    .array(
      z.object({
        nomeEmpresa: z.string().nonempty("Nome da empresa é obrigatório"),
        paisIncorporacao: z
          .string()
          .nonempty("País de incorporação é obrigatório"),
        dataIncorporacao: z
          .string()
          .nonempty("Data de incorporação é obrigatória"),
        percentualAcoes: z
          .string()
          .nonempty("Percentual de ações é obrigatório"),
      })
    )
    .optional(),
});

// Step 5: Beneficiários – obrigatório que haja pelo menos um
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
      // Soma todos os percentuais, convertendo a string para número
      const total = data.beneficiarios.reduce((acc, ben) => {
        // remove "%" e converte para número
        const val = parseFloat(ben.percentualAcionaria.replace("%", ""));
        return acc + (isNaN(val) ? 0 : val);
      }, 0);

      return total === 100; // retorna true se for igual a 100
    },
    {
      message: "A soma dos percentuais deve ser igual a 100%",
      path: ["beneficiarios"],
    }
  );

// Step 6: Origem dos Fundos
const stepOrigemFundosSchema = z.object({
  origemFundos: z
    .array(z.string())
    .min(1, "Selecione ao menos uma opção para a origem dos fundos"),
  detalhesOrigemFundos: z
    .string()
    .nonempty("Forneça mais detalhes sobre a origem dos fundos"),
});

// Step 7: Registro Contábil – sem validação específica (pode ser ajustado se necessário)
const stepRegistroContabilSchema = z.object({});

// Step 8: Documentos
const stepDocumentosSchema = z.object({
  documentos: z
    .array(
      z.object({
        title: z.string().nonempty("Título do documento é obrigatório"),
        url: z.string().nonempty("URL do documento é obrigatória"),
      })
    )
    .min(1, "Adicione pelo menos um documento"),
});

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
    capitalSocial: "",
    origemFundos: [],
    detalhesOrigemFundos: "",
    responsavelContabilidade: undefined,
    documentos: [],
  });

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    let validationResult: { success: boolean; error?: any };

    switch (currentStep) {
      case 1:
        validationResult = step1Schema.safeParse({
          tipoEstrutura: formData.tipoEstrutura,
        });
        break;
      case 2:
        validationResult = step2Schema.safeParse({
          nomeEmpresa: formData.nomeEmpresa,
          jurisdicao: formData.jurisdicao,
          isOperacional: formData.isOperacional,
          propositoIncorporacao: formData.propositoIncorporacao,
        });
        break;
      case 3:
        validationResult = stepDiretoresSchema.safeParse({
          diretores: formData.diretores,
          diretoriaPersonalizada: formData.diretoriaPersonalizada,
          jurisdicao: formData.jurisdicao,
        });
        break;
      case 4:
        validationResult = { success: true }; // Acionistas são opcionais
        break;
      case 5:
        validationResult = stepBeneficiariosSchema.safeParse({
          beneficiarios: formData.beneficiarios,
        });
        break;
      case 6:
        validationResult = stepOrigemFundosSchema.safeParse({
          origemFundos: formData.origemFundos,
          detalhesOrigemFundos: formData.detalhesOrigemFundos,
        });
        break;
      case 7:
        // Registro Contábil: sem validação específica
        validationResult = stepRegistroContabilSchema.safeParse({});
        break;
      case 8:
        validationResult = stepDocumentosSchema.safeParse({
          documentos: formData.documentos,
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

    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
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
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}
