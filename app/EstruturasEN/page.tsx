"use client";
import { FormProviderEn } from "@/context/FormContextEN";
import { StructureType } from "@/components/steps-en/StructureType";
import { GeneralInformation } from "@/components/steps-en/GeneralInformation";
import { DirectorsEn } from "@/components/steps-en/Directors";
import { BeneficialOwners } from "@/components/steps-en/BeneficialOwners";
import { SourceOfFunds } from "@/components/steps-en/SourceOfFunds";
// import { DocumentsEn } from "@/components/steps-en/Documents";
import { AccountingRecords } from "@/components/steps-en/AccountingRecords";
import { useFormEn } from "@/context/FormContextEN";
import { NavigationButtonsEn } from "@/components/NavigationButtonsEn";
import { ProgressBar } from "@/components/ProgressBar";

function FormSteps() {
  const { currentStep } = useFormEn();

  return (
    <div className="min-h-[400px] transition-all duration-300">
      {currentStep === 1 && <StructureType />}
      {currentStep === 2 && <GeneralInformation />}
      {currentStep === 3 && <DirectorsEn />}
      {currentStep === 4 && <BeneficialOwners />}
      {currentStep === 5 && <SourceOfFunds />}
      {/* {currentStep === 6 && <DocumentsEn />} */}
      {currentStep === 6 && <AccountingRecords />}
    </div>
  );
}

function FormContainer({ steps }: { steps: string[] }) {
  const { currentStep } = useFormEn();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProgressBar steps={steps} currentStep={currentStep} />
      <div className="bg-white rounded-lg shadow-sm p-8 border">
        <FormSteps />
        <NavigationButtonsEn totalSteps={steps.length} />
      </div>
    </div>
  );
}

export default function EstruturasEN() {
  const steps = [
    "Structure Type",
    "General Information",
    "Directors",
    "Beneficial Owners",
    "Source of Funds",
    // "Documents",
    "Accounting Records",
  ];

  return (
    <FormProviderEn>
      <FormContainer steps={steps} />
    </FormProviderEn>
  );
}
