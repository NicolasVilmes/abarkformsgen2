"use client";
import { useForm } from "@/context/FormContext";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Trash2, UserPen } from "lucide-react";
import { AddDiretorDialog } from "../addDirector";
import { jurisdicoesEmpresas } from "@/data/jurisdicoes";

export function Diretores() {
  const { formData, updateFormData } = useForm();

  const selectedJurisdicao = jurisdicoesEmpresas.find(
    (item) => item.value === formData.jurisdicao
  );

  // Número mínimo de diretores exigido para a jurisdição selecionada (padrão 0 se não houver)
  const minDiretores = selectedJurisdicao?.diretor ?? 0;

  // Ao adicionar um diretor, garante que diretoriaPersonalizada seja false
  const handleAddDiretor = (diretor: { nome: string; passport: string }) => {
    const novosDiretores = [...formData.diretores, diretor];
    updateFormData({
      diretores: novosDiretores,
      diretoriaPersonalizada: false,
    });
  };

  // Remove um diretor do array
  const handleRemoveDiretor = (index: number) => {
    const novosDiretores = formData.diretores.filter((_, i) => i !== index);
    updateFormData({ diretores: novosDiretores });
  };

  // Seleciona diretoria personalizada e limpa os diretores
  const handleEscolherDiretoriaPersonalizada = () => {
    updateFormData({ diretores: [], diretoriaPersonalizada: true });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Diretores</h2>
        <p className="text-sm text-gray-600">
          Adicione os diretores da empresa ou escolha uma diretoria
          personalizada.
        </p>
      </div>
      <p className="text-sm text-justify">
        Pessoas ou organizações designadas para atuar em nome da empresa em
        questões legais, sem necessariamente terem poder de decisão sobre ela.
        Dependendo da jurisdição, a quantidade mínima de diretores pode variar.
        A diretoria de uma empresa é uma informação pública; caso deseje
        anonimato, é possível optar por uma diretoria terceirizada.
      </p>
      {selectedJurisdicao && (
        <p className="text-sm">
          A jurisdição <strong>{selectedJurisdicao.label}</strong> exige no
          mínimo <strong>{minDiretores}</strong> diretores.
        </p>
      )}
      {/* Se diretoria personalizada estiver selecionada, exibe a mensagem */}
      {formData.diretoriaPersonalizada && (
        <div className="text-center text-sm text-gray-600">
          Diretoria personalizada selecionada.
        </div>
      )}

      {/* Se houver diretores adicionados (e não for diretoria personalizada), exibe a lista */}
      {!formData.diretoriaPersonalizada && formData.diretores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.diretores.map((diretor: any, index: number) => (
            <Card key={index} className="p-4 border rounded-lg relative">
              <div className="flex items-center">
                <UserPen className="h-6 w-6 inline-block mr-2" />
                <Label className="block text-sm font-medium">
                  {diretor.nome} - {diretor.passport}
                </Label>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveDiretor(index)}
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Área dos botões: */}
      <div className="flex justify-center items-center gap-4 mt-4">
        {/* Exibe o botão de adicionar diretor se diretoria personalizada não estiver selecionada */}
        {!formData.diretoriaPersonalizada && (
          <AddDiretorDialog onAdd={handleAddDiretor} />
        )}
        {/* Exibe o botão "Escolher Diretoria Personalizada" apenas se não houver diretores adicionados e diretoria personalizada ainda não estiver ativa */}
        {!formData.diretoriaPersonalizada &&
          formData.diretores.length === 0 && (
            <Button
              variant="outline"
              onClick={handleEscolherDiretoriaPersonalizada}
            >
              Diretoria Tercerizada
            </Button>
          )}
      </div>
    </div>
  );
}
