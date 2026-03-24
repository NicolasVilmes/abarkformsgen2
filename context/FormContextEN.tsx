/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { jurisdicoesEmpresas } from "@/data/jurisdicoes";
import { Director } from "@/interfaces/Director";
import { Shareholder } from "@/interfaces/Shareholdes";
import { BeneficialOwner, ContabilResponsavel } from "@/interfaces/BO";
import { CheckedState } from "@radix-ui/react-checkbox";

export interface Document {
  title: string;
  url: string;
  entityName?: string;
  entityType?: "Diretor" | "Acionista" | "Beneficiário";
}

export interface FormDataEn {
  tipoEstrutura: string;
  nomeEmpresa: string[];
  jurisdicao: string;
  isOperacional: boolean;
  propositoIncorporacao: string;
  diretores: Director[];
  diretoriaPersonalizada: boolean;
  acionistas: Shareholder[];
  beneficiarios: BeneficialOwner[];
  capitalSocial: CheckedState;
  origemFundos: string[];
  detalhesOrigemFundos: string;
  responsavelContabilidade?: ContabilResponsavel;
  documentos?: Document[];
}

interface FormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: FormDataEn;
  updateFormData: (data: Partial<FormDataEn>) => void;
  nextStep: () => void;
  previousStep: () => void;
}

const step1Schema = z.object({
  tipoEstrutura: z.string().nonempty("Select a structure type."),
});

const step2Schema = z.object({
  nomeEmpresa: z
    .array(z.string().nonempty("Provide an option for the company name."))
    .length(3, "Please provide three name options, in order of preference."),
  jurisdicao: z.string().nonempty("Jurisdiction is required."),
  isOperacional: z.boolean(),
  propositoIncorporacao: z
    .string()
    .nonempty("Describe the purpose of incorporation."),
});

const stepDiretoresSchema = z
  .object({
    diretores: z.array(
      z.object({
        nome: z.string().nonempty("Director name is required."),
        passport: z.string().nonempty("Passport number is required."),
        origem: z.string().optional(),
        nascimento: z.string().optional(),
        address: z.string().optional(),
        telefone: z.string().optional(),
        email: z.string().optional(),
        occupation: z.string().optional(),
      }),
    ),
    diretoriaPersonalizada: z.boolean(),
    jurisdicao: z.string().nonempty(),
  })
  .refine(
    (data) => {
      if (data.diretoriaPersonalizada) return true;
      const selected = jurisdicoesEmpresas.find(
        (j) => j.value === data.jurisdicao,
      );
      const min = selected ? selected.diretor : 0;
      return data.diretores.length >= min;
    },
    {
      message:
        "The selected jurisdiction requires at least the minimum number of directors.",
      path: ["diretores"],
    },
  );

const stepBeneficiariosSchema = z
  .object({
    beneficiarios: z
      .array(
        z.object({
          nome: z.string().nonempty("Name is required."),
          endereco: z.string().nonempty("Address is required."),
          ocupacao: z.string().nonempty("Occupation is required."),
          nacionalidade: z.string().nonempty("Nationality is required."),
          dataNascimento: z.string().nonempty("Date of birth is required."),
          isPep: z.boolean(),
          percentualAcionaria: z
            .string()
            .nonempty("Ownership percentage is required."),
        }),
      )
      .min(1, "Add at least one beneficial owner."),
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
      message: "The ownership percentages must add up to 100%.",
      path: ["beneficiarios"],
    },
  );

const stepOrigemFundosSchema = z.object({
  origemFundos: z
    .array(z.string())
    .min(1, "Select at least one source of funds."),
  detalhesOrigemFundos: z
    .string()
    .nonempty("Provide additional details about the funds' origin."),
});

// const stepDocumentosSchema = z.object({
//   documentos: z
//     .array(
//       z.object({
//         title: z.string().nonempty("Document title is required."),
//         url: z.string().nonempty("Document URL is required."),
//       })
//     )
//     .optional(),
// });

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProviderEn({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataEn>({
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
    documentos: [],
  });

  const updateFormData = (newData: Partial<FormDataEn>) => {
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
      case 4:
        validationResult = stepBeneficiariosSchema.safeParse(formData);
        break;
      case 5:
        validationResult = stepOrigemFundosSchema.safeParse(formData);
        break;
      // case 6:
      //   validationResult = stepDocumentosSchema.safeParse({
      //     documentos: formData.documentos?.length ? formData.documentos : [],
      //   });
      //   break;
      default:
        validationResult = { success: true };
    }

    if (!validationResult.success) {
      const messages = validationResult.error.errors
        .map((err: any) => err.message)
        .join(", ");
      toast({
        title: "Validation error",
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

export function useFormEn() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormEn must be used within a FormProviderEn");
  }
  return context;
}
