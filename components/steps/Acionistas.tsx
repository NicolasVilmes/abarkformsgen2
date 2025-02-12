"use client";
import { useForm } from "@/context/FormContext";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Trash2 } from "lucide-react";
import { AddAcionistaDialog } from "@/components/addAccionista";
import { Building2 } from "lucide-react";

export function Acionistas() {
  const { formData, updateFormData } = useForm();

  const handleAddAcionista = (acionista: {
    nomeEmpresa: string;
    paisIncorporacao: string;
    dataIncorporacao: string;
    percentualAcoes: string;
  }) => {
    const novosAcionistas = [...formData.acionistas, acionista];
    updateFormData({ acionistas: novosAcionistas });
  };

  const handleRemoveAcionista = (index: number) => {
    const novosAcionistas = formData.acionistas.filter((_, i) => i !== index);
    updateFormData({ acionistas: novosAcionistas });
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
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveAcionista(index)}
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <AddAcionistaDialog onAdd={handleAddAcionista} />
      </div>
    </div>
  );
}
