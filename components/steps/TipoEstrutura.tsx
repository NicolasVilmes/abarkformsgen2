"use client";
import { useForm } from "@/context/FormContext";
import { Card } from "@/components/ui/card";
import { Building2, Landmark, Users } from "lucide-react";

export function TipoEstrutura() {
  const { formData, updateFormData, errorMessage } = useForm();

  const estruturas = [
    {
      id: "empresa",
      label: "Empresa",
      icon: <Building2 className="w-6 h-6 mx-auto mb-2" />,
    },
    {
      id: "fundacao",
      label: "Fundação",
      icon: <Landmark className="w-6 h-6 mx-auto mb-2" />,
    },
    {
      id: "associacao",
      label: "Associação",
      icon: <Users className="w-6 h-6 mx-auto mb-2" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Tipo de Estrutura</h2>
        <p className="text-gray-500">Selecione o tipo de estrutura</p>
      </div>
      <div className="space-y-4 flex items-center min-h-[300px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-[100%]">
          {estruturas.map((estrutura) => (
            <Card
              key={estrutura.id}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                formData.tipoEstrutura === estrutura.id
                  ? "border-blue-500 shadow-md"
                  : "border-gray-200"
              }`}
              onClick={() => updateFormData({ tipoEstrutura: estrutura.id })}
            >
              {estrutura.icon}
              <h3 className="text-center text-lg font-medium">
                {estrutura.label}
              </h3>
            </Card>
          ))}
        </div>
      </div>

      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}
    </div>
  );
}
