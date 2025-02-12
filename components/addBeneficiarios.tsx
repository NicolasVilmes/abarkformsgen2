"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "@/context/FormContext";
import { z } from "zod";

export interface Beneficiario {
  nome: string;
  endereco: string;
  ocupacao: string;
  nacionalidade: string;
  dataNascimento: string;
  isPep: boolean;
  percentualAcionaria: string;
  director?: string;
}

// Schema de validação com Zod para Beneficiário
const BeneficiarioSchema = z.object({
  nome: z.string().nonempty("Nome é obrigatório"),
  endereco: z.string().nonempty("Endereço é obrigatório"),
  ocupacao: z.string().nonempty("Ocupação é obrigatória"),
  nacionalidade: z.string().nonempty("Nacionalidade é obrigatória"),
  dataNascimento: z.string().nonempty("Data de nascimento é obrigatória"),
  isPep: z.boolean(),
  percentualAcionaria: z
    .string()
    .nonempty("Percentual acionário é obrigatório"),
  director: z.string().optional(),
});

export interface AddBeneficiarioDialogProps {
  onAdd: (beneficiario: Beneficiario) => void;
}

export function AddBeneficiarioDialog({ onAdd }: AddBeneficiarioDialogProps) {
  const { formData } = useForm();
  const [open, setOpen] = React.useState(false);

  // Estados dos campos do beneficiário
  const [nome, setNome] = React.useState("");
  const [endereco, setEndereco] = React.useState("");
  const [ocupacao, setOcupacao] = React.useState("");
  const [nacionalidade, setNacionalidade] = React.useState("");
  const [dataNascimento, setDataNascimento] = React.useState("");
  const [isPep, setIsPep] = React.useState(false);
  const [percentualAcionaria, setPercentualAcionaria] = React.useState("");

  // Estado para opção de puxar informações de um diretor
  const [useDirector, setUseDirector] = React.useState(false);
  const [selectedDirector, setSelectedDirector] = React.useState("");

  // Estado para armazenar erros de validação
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  // Quando a opção de puxar de diretor estiver ativa e um diretor for selecionado,
  // preenche automaticamente os campos do beneficiário
  React.useEffect(() => {
    if (useDirector && selectedDirector && formData.diretores.length > 0) {
      const director = formData.diretores.find(
        (d: any) => d.nome === selectedDirector
      );
      if (director) {
        setNome(director.nome || "");
        setOcupacao(director.occupation || "");
        setEndereco(director.address || "");
        setDataNascimento(director.nascimento || "");
        setNacionalidade(director.origem || "");
      }
    }
  }, [useDirector, selectedDirector, formData.diretores]);

  const handleSubmit = () => {
    // Primeiro, valide os campos individuais usando Zod
    const beneficiarioData = {
      nome,
      endereco,
      ocupacao,
      nacionalidade,
      dataNascimento,
      isPep,
      percentualAcionaria,
      director: selectedDirector || undefined,
    };

    const result = BeneficiarioSchema.safeParse(beneficiarioData);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    // Se os dados individuais estão ok, proceda para calcular a soma dos percentuais

    // Converte o novo percentual para número (removendo eventuais %)
    const newPercent = parseFloat(percentualAcionaria.replace("%", ""));
    if (isNaN(newPercent)) {
      setErrors((prev) => ({
        ...prev,
        percentualAcionaria: "Valor inválido para percentual de ações",
      }));
      return;
    }
    // Soma os percentuais já cadastrados no contexto de beneficiários
    const totalExisting = (formData.beneficiarios || []).reduce(
      (sum, ben: any) => {
        const perc = parseFloat(ben.percentualAcionaria.replace("%", ""));
        return sum + (isNaN(perc) ? 0 : perc);
      },
      0
    );
    if (totalExisting + newPercent > 100) {
      setErrors((prev) => ({
        ...prev,
        percentualAcionaria: "A soma dos percentuais não pode exceder 100%",
      }));
      return;
    }

    // Se tudo estiver ok, limpe os erros, chame onAdd e resete os campos
    setErrors({});
    onAdd(result.data);
    setNome("");
    setEndereco("");
    setOcupacao("");
    setNacionalidade("");
    setDataNascimento("");
    setIsPep(false);
    setPercentualAcionaria("");
    setUseDirector(false);
    setSelectedDirector("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar Beneficiário</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full overflow-auto sm:max-w-none sm:max-h-none sm:w-auto sm:h-auto ">
        <DialogHeader>
          <DialogTitle>Adicionar Beneficiário Final</DialogTitle>
        </DialogHeader>
        {/* Opção para puxar dados de um diretor, se diretoria personalizada estiver ativa */}
        {formData.diretoriaPersonalizada && formData.diretores.length > 0 && (
          <div className="mb-4">
            <Label className="block text-sm font-medium">
              O beneficiário também é um diretor? Se sim, selecione um:
            </Label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              value={selectedDirector}
              onChange={(e) => setSelectedDirector(e.target.value)}
            >
              <option value="">Selecione um diretor</option>
              {formData.diretores.map((director: any, index: number) => (
                <option key={index} value={director.nome}>
                  {director.nome}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do beneficiário"
            />
            {errors.nome && (
              <p className="text-red-500 text-sm">{errors.nome}</p>
            )}
          </div>
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Endereço"
            />
            {errors.endereco && (
              <p className="text-red-500 text-sm">{errors.endereco}</p>
            )}
          </div>
          <div>
            <Label htmlFor="ocupacao">Ocupação</Label>
            <Input
              id="ocupacao"
              value={ocupacao}
              onChange={(e) => setOcupacao(e.target.value)}
              placeholder="Ocupação"
            />
            {errors.ocupacao && (
              <p className="text-red-500 text-sm">{errors.ocupacao}</p>
            )}
          </div>
          <div>
            <Label htmlFor="nacionalidade">Nacionalidade</Label>
            <Input
              id="nacionalidade"
              value={nacionalidade}
              onChange={(e) => setNacionalidade(e.target.value)}
              placeholder="Nacionalidade"
            />
            {errors.nacionalidade && (
              <p className="text-red-500 text-sm">{errors.nacionalidade}</p>
            )}
          </div>
          <div>
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />
            {errors.dataNascimento && (
              <p className="text-red-500 text-sm">{errors.dataNascimento}</p>
            )}
          </div>
          <div>
            <Label htmlFor="percentualAcionaria">Percentual Acionária</Label>
            <Input
              id="percentualAcionaria"
              type="number"
              value={percentualAcionaria}
              onChange={(e) => setPercentualAcionaria(e.target.value)}
              placeholder="% de participação"
            />
            {errors.percentualAcionaria && (
              <p className="text-red-500 text-sm">
                {errors.percentualAcionaria}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="isPep"
              type="checkbox"
              checked={isPep}
              onChange={(e) => setIsPep(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="isPep">É PEP?</Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
