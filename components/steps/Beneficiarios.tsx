/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { useForm } from "@/context/FormContext";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Trash2, Edit } from "lucide-react";
import { AddBeneficiarioDialog } from "@/components/addBeneficiarios";
import { toast } from "@/hooks/use-toast";

export function Beneficiarios() {
  const { formData, updateFormData } = useForm();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Função para calcular o total de participação acionária
  const calcularPercentualTotal = (beneficiarios: any[]) => {
    return beneficiarios.reduce((total, b) => {
      const val = parseFloat(b.percentualAcionaria.replace("%", "")) || 0;
      return total + val;
    }, 0);
  };

  // Adiciona ou atualiza um beneficiário
  const handleAddOrUpdateBeneficiario = (beneficiario: any) => {
    let novosBeneficiarios;

    if (editingIndex !== null) {
      // Edição
      novosBeneficiarios = formData.beneficiarios.map((b: any, index: number) =>
        index === editingIndex ? beneficiario : b
      );
    } else {
      // Adição
      novosBeneficiarios = [...formData.beneficiarios, beneficiario];
    }

    // Calcula o total após a alteração
    const totalPercentual = calcularPercentualTotal(novosBeneficiarios);

    // Se for maior que 100%, exibe erro e não adiciona
    if (totalPercentual > 100) {
      setError("A soma dos percentuais acionários não pode ultrapassar 100%");
      toast({
        title: "Erro de validação",
        description:
          "A soma dos percentuais acionários não pode ultrapassar 100%",
        variant: "destructive",
      });
      return;
    }

    setError(null); // Remove erro caso seja válido
    updateFormData({ beneficiarios: novosBeneficiarios });

    setEditingIndex(null);
    setDialogOpen(false);
  };

  // Remove um beneficiário
  const handleRemoveBeneficiario = (index: number) => {
    const novosBeneficiarios = formData.beneficiarios.filter(
      (_: any, i: number) => i !== index
    );

    // Verifica se a remoção deixou o total correto
    const totalPercentual = calcularPercentualTotal(novosBeneficiarios);
    if (totalPercentual > 100) {
      setError("A soma dos percentuais acionários não pode ultrapassar 100%");
      toast({
        title: "Erro de validação",
        description:
          "A soma dos percentuais acionários não pode ultrapassar 100%",
        variant: "destructive",
      });
    } else {
      setError(null);
    }

    updateFormData({ beneficiarios: novosBeneficiarios });
  };

  // Edita um beneficiário
  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Beneficiários Finais</h2>
        <p className="text-gray-500">
          Adicione ou edite os beneficiários finais da empresa.
        </p>
      </div>

      {/* Exibe mensagem de erro caso ultrapasse 100% */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {formData.beneficiarios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.beneficiarios.map((beneficiario: any, index: number) => (
            <Card key={index} className="p-4 border rounded-lg relative">
              <div className="flex items-center">
                <Label className="block text-sm font-medium">
                  {beneficiario.nome} – {beneficiario.isPep ? "PEP" : "Não PEP"}{" "}
                  – {beneficiario.percentualAcionaria}
                </Label>
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditClick(index)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveBeneficiario(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Botão para adicionar um novo beneficiário */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => {
            setEditingIndex(null);
            setDialogOpen(true);
          }}
        >
          Adicionar Beneficiário
        </Button>
      </div>

      {/* Modal para adicionar/editar beneficiários */}
      <AddBeneficiarioDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onAdd={handleAddOrUpdateBeneficiario}
        initialData={
          editingIndex !== null
            ? formData.beneficiarios[editingIndex]
            : undefined
        }
      />
    </div>
  );
}
