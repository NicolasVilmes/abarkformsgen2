"use client";
import { useState } from "react";
import { useForm } from "@/context/FormContext";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function SourceOfWealth() {
  const { formData, updateFormData } = useForm();

  const opcoes = [
    "Empresario",
    "Sarlário",
    "Economias",
    "Investimentos",
    "Herdança",
    "Venda de ativos",
    "Outros",
  ];

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    formData.origemFundos || []
  );
  const [detalhes, setDetalhes] = useState(formData.detalhesOrigemFundos || "");

  // Função para alternar a seleção de uma opção
  const toggleOption = (option: string) => {
    let newSelected: string[];
    if (selectedOptions.includes(option)) {
      newSelected = selectedOptions.filter((item) => item !== option);
    } else {
      newSelected = [...selectedOptions, option];
    }
    setSelectedOptions(newSelected);
    updateFormData({ origemFundos: newSelected });
  };

  // Atualiza o estado e o contexto conforme o usuário digita mais detalhes
  const handleDetalhesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDetalhes(value);
    updateFormData({ detalhesOrigemFundos: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Origem dos Fundos</h2>
        <p className="text-gray-500">
          Selecione as opções que melhor explicam a origem dos fundos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {opcoes.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`origem-${index}`}
              checked={selectedOptions.includes(option)}
              onCheckedChange={(checked) => toggleOption(option)}
              className="h-4 w-4"
            />
            <Label htmlFor={`origem-${index}`} className="cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="detalhesOrigem" className="block mb-2">
          Detalhe a origem dos fundos
        </Label>
        <Textarea
          id="detalhesOrigem"
          value={detalhes}
          onChange={handleDetalhesChange}
          placeholder="Forneça mais detalhes sobre a origem dos fundos ex: empresario dono da empresa XPTO, localizada em..., oferece serviços de..., etc."
        />
      </div>
    </div>
  );
}
