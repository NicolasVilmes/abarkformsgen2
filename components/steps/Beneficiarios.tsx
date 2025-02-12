"use client";
import { useForm } from "@/context/FormContext";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Trash2 } from "lucide-react";
import { AddBeneficiarioDialog } from "@/components/addBeneficiarios";
import { User } from "lucide-react";

export function Beneficiarios() {
  const { formData, updateFormData } = useForm();

  const handleAddBeneficiario = (beneficiario: {
    nome: string;
    endereco: string;
    ocupacao: string;
    nacionalidade: string;
    dataNascimento: string;
    isPep: boolean;
    percentualAcionaria: string;
  }) => {
    const novosBeneficiarios = [...formData.beneficiarios, beneficiario];
    updateFormData({ beneficiarios: novosBeneficiarios });
  };

  const handleRemoveBeneficiario = (index: number) => {
    const novosBeneficiarios = formData.beneficiarios.filter(
      (_, i) => i !== index
    );
    updateFormData({ beneficiarios: novosBeneficiarios });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Beneficiários Finais</h2>
        <p className="text-gray-500">
          Adicione os beneficiários finais da empresa
        </p>
      </div>

      {formData.beneficiarios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.beneficiarios.map((beneficiario, index) => (
            <Card key={index} className="p-4 border rounded-lg relative">
              <div className="flex items-center">
                <User className="w-6 h-6 inline-block mr-2" />
                <Label className="block text-sm font-medium">
                  {beneficiario.nome} –{beneficiario.isPep ? "PEP" : "Não PEP"}{" "}
                  – {beneficiario.percentualAcionaria}
                </Label>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveBeneficiario(index)}
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <AddBeneficiarioDialog onAdd={handleAddBeneficiario} />
      </div>
    </div>
  );
}
