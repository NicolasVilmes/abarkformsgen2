/* eslint-disable @typescript-eslint/no-explicit-any */
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
  pepDescricao?: string;
}

// Schema de validação local (pode ser mais simples,
// pois a validação final do Step 5 é no formContext)
const BeneficiarioSchema = z
  .object({
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
    pepDescricao: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isPep) {
        return data.pepDescricao && data.pepDescricao.trim().length > 0;
      }
      return true;
    },
    {
      message: "Descrição da relação PEP é obrigatória",
      path: ["pepDescricao"],
    }
  );

export interface AddBeneficiarioDialogProps {
  onAdd: (beneficiario: Beneficiario) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: Beneficiario;
}

export function AddBeneficiarioDialog({
  onAdd,
  open,
  setOpen,
  initialData,
}: AddBeneficiarioDialogProps) {
  const { formData } = useForm();

  const [nome, setNome] = React.useState(initialData?.nome || "");
  const [endereco, setEndereco] = React.useState(initialData?.endereco || "");
  const [ocupacao, setOcupacao] = React.useState(initialData?.ocupacao || "");
  const [nacionalidade, setNacionalidade] = React.useState(
    initialData?.nacionalidade || ""
  );
  const [dataNascimento, setDataNascimento] = React.useState(
    initialData?.dataNascimento || ""
  );
  const [isPep, setIsPep] = React.useState(initialData?.isPep || false);
  const [percentualAcionaria, setPercentualAcionaria] = React.useState(
    initialData?.percentualAcionaria || ""
  );
  const [pepDescricao, setPepDescricao] = React.useState(
    initialData?.pepDescricao || ""
  );
  const [selectedDirector, setSelectedDirector] = React.useState(
    initialData?.director || ""
  );

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  // Atualiza os estados quando "initialData" ou "open" mudam
  React.useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || "");
      setEndereco(initialData.endereco || "");
      setOcupacao(initialData.ocupacao || "");
      setNacionalidade(initialData.nacionalidade || "");
      setDataNascimento(initialData.dataNascimento || "");
      setIsPep(initialData.isPep || false);
      setPercentualAcionaria(initialData.percentualAcionaria || "");
      setPepDescricao(initialData.pepDescricao || "");
      setSelectedDirector(initialData.director || "");
    } else {
      setNome("");
      setEndereco("");
      setOcupacao("");
      setNacionalidade("");
      setDataNascimento("");
      setIsPep(false);
      setPercentualAcionaria("");
      setPepDescricao("");
      setSelectedDirector("");
    }
  }, [initialData, open]);

  // Preenche automaticamente os campos se um diretor for selecionado
  React.useEffect(() => {
    if (selectedDirector && formData.diretores.length > 0) {
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
  }, [selectedDirector, formData.diretores]);

  const handleSubmit = () => {
    const beneficiarioData = {
      nome,
      endereco,
      ocupacao,
      nacionalidade,
      dataNascimento,
      isPep,
      percentualAcionaria,
      director: selectedDirector || undefined,
      pepDescricao: isPep ? pepDescricao : undefined,
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

    // Chama a função de callback (onAdd) para adicionar/atualizar no array
    onAdd(result.data);
    // Limpa os campos e fecha o diálogo
    setNome("");
    setEndereco("");
    setOcupacao("");
    setNacionalidade("");
    setDataNascimento("");
    setIsPep(false);
    setPercentualAcionaria("");
    setPepDescricao("");
    setSelectedDirector("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Conteúdo do modal */}
      <DialogContent className="w-full h-full max-w-[90vw] max-h-[90vh] md:max-w-[30vw] md:max-h-[70vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? "Editar Beneficiário Final"
              : "Adicionar Beneficiário Final"}
          </DialogTitle>
        </DialogHeader>

        {/* Dropdown de diretores */}
        {formData.diretores.length > 0 && (
          <div className="mb-4">
            <Label className="block text-sm font-medium">
              Selecione um diretor para preencher os dados:
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
          {isPep && (
            <div>
              <Label htmlFor="pepDescricao">
                Descreva em detalhes a relação com PEP
              </Label>
              <textarea
                id="pepDescricao"
                value={pepDescricao}
                onChange={(e) => setPepDescricao(e.target.value)}
                placeholder="Explique detalhadamente a relação com PEP, incluindo informações relevantes..."
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                rows={5}
              />
              {errors.pepDescricao && (
                <p className="text-red-500 text-sm">{errors.pepDescricao}</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>
            {initialData ? "Salvar Alterações" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
