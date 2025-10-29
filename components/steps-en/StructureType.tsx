"use client";
import { useFormEn } from "@/context/FormContextEN";
import { Card } from "@/components/ui/card";
import { Building2, Landmark, Users } from "lucide-react";

export function StructureType() {
  const { formData, updateFormData } = useFormEn();

  const structures = [
    {
      id: "empresa",
      label: "Company",
      icon: <Building2 className="w-6 h-6 mx-auto mb-2" />,
    },
    {
      id: "fundacao",
      label: "Foundation",
      icon: <Landmark className="w-6 h-6 mx-auto mb-2" />,
    },
    {
      id: "Trust",
      label: "Trust",
      icon: <Users className="w-6 h-6 mx-auto mb-2" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Structure Type</h2>
        <p className="text-gray-500">Choose the entity structure.</p>
      </div>
      <div className="space-y-4 flex items-center min-h-[300px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {structures.map((structure) => (
            <Card
              key={structure.id}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                formData.tipoEstrutura === structure.id
                  ? "border-abark-lighter shadow-md"
                  : "border-gray-200"
              }`}
              onClick={() => updateFormData({ tipoEstrutura: structure.id })}
            >
              {structure.icon}
              <h3 className="text-center text-lg font-medium">
                {structure.label}
              </h3>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
