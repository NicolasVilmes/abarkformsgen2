"use client";
import { useFormEn } from "@/context/FormContextEN";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, UserPen } from "lucide-react";
import { AddDirectorDialogEn } from "@/components/addDirectorEn";
import { jurisdicoesEmpresas } from "@/data/jurisdicoes";
import { Director } from "@/interfaces/Director";

export function DirectorsEn() {
  const { formData, updateFormData } = useFormEn();

  const selectedJurisdiction = jurisdicoesEmpresas.find(
    (item) => item.value === formData.jurisdicao
  );

  const minDirectors = selectedJurisdiction?.diretor ?? 0;

  const handleAddDirector = (director: Director) => {
    const newDirectors = [...(formData.diretores || []), director];
    updateFormData({
      diretores: newDirectors,
      diretoriaPersonalizada: false,
    });
  };

  const handleRemoveDirector = (index: number) => {
    const newDirectors = formData.diretores.filter((_, i) => i !== index);
    updateFormData({ diretores: newDirectors });
  };

  const handleChooseCustomBoard = () => {
    updateFormData({ diretores: [], diretoriaPersonalizada: true });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Directors</h2>
        <p className="text-sm text-gray-600">
          Add the directors who will represent the company or opt for a third-party
          board.
        </p>
      </div>
      <p className="text-sm text-justify">
        Directors are the individuals or entities appointed to act on behalf of the
        company. Depending on the jurisdiction, a minimum number of directors may be
        required.
      </p>
      {selectedJurisdiction && (
        <p className="text-sm">
          The jurisdiction{" "}
          <strong>
            {selectedJurisdiction.labelEn ?? selectedJurisdiction.label}
          </strong>{" "}
          requires at least <strong>{minDirectors}</strong> director(s).
        </p>
      )}

      {formData.diretoriaPersonalizada && (
        <div className="text-center text-sm text-gray-600">
          Third-party board selected.
        </div>
      )}

      {!formData.diretoriaPersonalizada && formData.diretores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.diretores.map((director: Director, index: number) => (
            <Card key={index} className="p-4 border rounded-lg relative">
              <div className="flex items-center">
                <UserPen className="h-6 w-6 inline-block mr-2" />
                <Label className="block text-sm font-medium">
                  {director.nome} - {director.passport}
                </Label>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveDirector(index)}
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No directors added yet.</p>
      )}

      <div className="flex justify-center items-center gap-4 mt-4">
        {!formData.diretoriaPersonalizada && (
          <AddDirectorDialogEn onAdd={handleAddDirector} />
        )}
        {!formData.diretoriaPersonalizada && formData.diretores.length === 0 && (
          <Button variant="outline" onClick={handleChooseCustomBoard}>
            Select third-party board
          </Button>
        )}
      </div>
    </div>
  );
}
