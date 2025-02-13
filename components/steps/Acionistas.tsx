/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "@/context/FormContext";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Trash2, Edit } from "lucide-react";
import { AddAcionistaDialog } from "@/components/addAccionista";
import { Building2 } from "lucide-react";
import * as React from "react";

export function Acionistas() {
  const { formData, updateFormData } = useForm();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editingData, setEditingData] = React.useState<any | null>(null);

  // Adiciona ou edita um acionista
  const handleAddOrUpdateAcionista = (acionista: any) => {
    if (editingIndex !== null) {
      // Edita um acionista existente
      const updatedAcionistas = formData.acionistas.map((a, i) =>
        i === editingIndex ? acionista : a
      );
      updateFormData({ acionistas: updatedAcionistas });
    } else {
      // Adiciona um novo acionista
      const novosAcionistas = [...formData.acionistas, acionista];
      updateFormData({ acionistas: novosAcionistas });
    }
    setEditingIndex(null);
    setEditingData(null);
    setDialogOpen(false);
  };

  // Remove um acionista
  const handleRemoveAcionista = (index: number) => {
    const novosAcionistas = formData.acionistas.filter((_, i) => i !== index);
    updateFormData({ acionistas: novosAcionistas });
  };

  // Abre o modal para edição e carrega os dados
  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditingData(formData.acionistas[index]);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Acionistas</h2>
        <p className="text-gray-500">
          Caso o acionista seja uma pessoa física e não uma empresa, siga
          diretamente para a próxima seção.
        </p>
      </div>

      {formData.acionistas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.acionistas.map((acionista, index) => (
            <Card key={index} className="p-4 border rounded-lg relative">
              <div>
                <Label className="block text-sm font-medium">
                  <Building2 className="w-6 h-6 inline-block mr-2" />
                  {acionista.nomeEmpresa} - {acionista.paisIncorporacao} -{" "}
                  {acionista.dataIncorporacao} - {acionista.percentualAcoes}
                </Label>
              </div>
              {/* Botões de Editar e Excluir */}
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
                  onClick={() => handleRemoveAcionista(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => {
            setEditingIndex(null);
            setEditingData(null);
            setDialogOpen(true);
          }}
        >
          Adicionar Acionista
        </Button>
      </div>

      {/* Modal de Adicionar/Editar Acionista */}
      <AddAcionistaDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onAdd={handleAddOrUpdateAcionista}
        initialData={editingData}
      />
    </div>
  );
}
