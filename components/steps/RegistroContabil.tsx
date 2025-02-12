"use client";
import { useEffect, useState } from "react";
import { useForm } from "@/context/FormContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { User } from "lucide-react";

type RCMethod = "beneficiary" | "manual" | null;

export function RegistroContabil() {
  const { formData, updateFormData } = useForm();

  // Guarda o índice do Beneficiário Final selecionado (se houver)
  const [selectedBeneficiaryIndex, setSelectedBeneficiaryIndex] = useState<
    number | null
  >(null);
  // Indica qual método está sendo utilizado para preencher o RC
  const [rcMethod, setRcMethod] = useState<RCMethod>(null);
  // Controla a exibição do formulário manual
  const [showRCForm, setShowRCForm] = useState(false);

  // Estados locais para os campos do formulário manual
  const [rcNome, setRcNome] = useState(
    formData.responsavelContabilidade?.nome || ""
  );
  const [rcEndereco, setRcEndereco] = useState(
    formData.responsavelContabilidade?.endereco || ""
  );

  // Cria uma constante para os beneficiários (garante um array mesmo que indefinido)
  const beneficiaries = formData.beneficiarios || [];

  // Sempre que um beneficiário for selecionado, atualiza os campos e define o método como "beneficiary"
  useEffect(() => {
    if (
      selectedBeneficiaryIndex !== null &&
      beneficiaries[selectedBeneficiaryIndex]
    ) {
      const ben = beneficiaries[selectedBeneficiaryIndex];
      setRcNome(ben.nome);
      setRcEndereco(ben.endereco);
      setRcMethod("beneficiary");
      setShowRCForm(false); // Fecha o formulário manual, se estiver aberto
    } else {
      setRcNome("");
      setRcEndereco("");
    }
  }, [selectedBeneficiaryIndex, beneficiaries]);

  // Se o método for "beneficiary" e os dados de RC mudarem, atualiza o contexto.
  // Aqui, removemos updateFormData do dependency array, assumindo que sua identidade é estável.
  useEffect(() => {
    if (rcMethod === "beneficiary") {
      // Só atualiza se os dados forem diferentes (para evitar loops)
      const currentRC = formData.responsavelContabilidade || {
        nome: "",
        endereco: "",
      };
      if (currentRC.nome !== rcNome || currentRC.endereco !== rcEndereco) {
        updateFormData({
          responsavelContabilidade: { nome: rcNome, endereco: rcEndereco },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rcMethod, rcNome, rcEndereco]);

  // Alterna para o método manual: limpa a seleção de beneficiário e abre o formulário
  const toggleManualForm = () => {
    setSelectedBeneficiaryIndex(null);
    setRcMethod("manual");
    setShowRCForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData({
      responsavelContabilidade: { nome: rcNome, endereco: rcEndereco },
    });
    console.log("Responsável Contábil salvo:", {
      nome: rcNome,
      endereco: rcEndereco,
    });
    setShowRCForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Título e instrução */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Registros Contábeis</h2>
        <p className="text-gray-500">
          Selecione um Beneficiário Final para puxar as informações ou escolha a
          opção manual para inserir os dados do Responsável Contábil.
        </p>
      </div>

      {/* Grid de Beneficiários Finais para seleção */}
      {beneficiaries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Beneficiários Finais</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {beneficiaries.map((benef, index) => (
              <Card
                key={index}
                className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                  selectedBeneficiaryIndex === index &&
                  rcMethod === "beneficiary"
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
                onClick={() => {
                  setSelectedBeneficiaryIndex(index);
                  setRcMethod("beneficiary");
                }}
              >
                <User className="w-6 h-6 inline-block mr-2" />
                <div>
                  <Label className="block text-sm font-medium">
                    {benef.nome}
                  </Label>
                  <p className="text-xs text-gray-600">{benef.endereco}</p>
                </div>
              </Card>
            ))}
            <div className="flex flex-col items-center gap-4 my-auto">
              {rcMethod === "manual" && formData.responsavelContabilidade ? (
                // Card com dados do RC inserido manualmente
                <div className="w-full">
                  <Card
                    onClick={() => setShowRCForm(true)}
                    className="p-4 border rounded-lg cursor-pointer flex items-center mx-auto max-w-md border-blue-500"
                  >
                    <User className="w-6 h-6 inline-block mr-2" />
                    <div>
                      <Label className="block text-sm font-medium">
                        {rcNome || "Nome não informado"}
                      </Label>
                      <p className="text-xs text-gray-600">
                        {rcEndereco || "Endereço não informado"}
                      </p>
                    </div>
                  </Card>
                </div>
              ) : (
                // Botão para inserir manualmente
                <Button variant="outline" onClick={toggleManualForm}>
                  Inserir Responsável Manualmente
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Área de RC manual */}

      {/* Formulário manual para Responsável Contábil */}
      {showRCForm && (
        <div className="border p-4 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold mb-2">
            Responsável Contábil (Manual)
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="rcNome"
                className="block text-sm font-medium mb-1"
              >
                Nome
              </Label>
              <Input
                id="rcNome"
                value={rcNome}
                onChange={(e) => setRcNome(e.target.value)}
                placeholder="Nome do Responsável Contábil"
              />
            </div>
            <div>
              <Label
                htmlFor="rcEndereco"
                className="block text-sm font-medium mb-1"
              >
                Endereço
              </Label>
              <Input
                id="rcEndereco"
                value={rcEndereco}
                onChange={(e) => setRcEndereco(e.target.value)}
                placeholder="Endereço"
              />
            </div>
            <Button type="submit" className="w-full">
              Salvar Responsável Contábil
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
