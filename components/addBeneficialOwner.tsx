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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useFormEn } from "@/context/FormContextEN";
import { z } from "zod";
import { BeneficialOwner } from "@/interfaces/BO";
import { Director } from "@/interfaces/Director";

export type BeneficialOwnerForm = BeneficialOwner;

const BeneficialOwnerSchema = z
  .object({
    nome: z.string().nonempty("Name is required."),
    endereco: z.string().nonempty("Address is required."),
    ocupacao: z.string().nonempty("Occupation is required."),
    nacionalidade: z.string().nonempty("Nationality is required."),
    dataNascimento: z.string().nonempty("Date of birth is required."),
    isPep: z.boolean(),
    percentualAcionaria: z.string().nonempty("Ownership percentage is required."),
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
      message: "Provide details about the PEP relationship.",
      path: ["pepDescricao"],
    }
  );

interface Props {
  onAdd: (owner: BeneficialOwnerForm) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: BeneficialOwnerForm;
}

export function AddBeneficialOwnerDialog({
  onAdd,
  open,
  setOpen,
  initialData,
}: Props) {
  const { formData } = useFormEn();

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

  React.useEffect(() => {
    if (selectedDirector && formData.diretores.length > 0) {
      const director = formData.diretores.find(
        (d: Director) => d.nome === selectedDirector
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
    const ownerData = {
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

    const result = BeneficialOwnerSchema.safeParse(ownerData);
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

    setErrors({});
    onAdd(result.data);
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
      <DialogContent className="w-full h-full max-w-[90vw] max-h-[90vh] md:max-w-[30vw] md:max-h-[70vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Beneficial Owner" : "Add Beneficial Owner"}
          </DialogTitle>
          <DialogDescription>
            Provide the information for the beneficial owner.
          </DialogDescription>
        </DialogHeader>

        {formData.diretores.length > 0 && (
          <div className="mb-4">
            <Label className="block text-sm font-medium">
              Use director information as a starting point:
            </Label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              value={selectedDirector}
              onChange={(e) => setSelectedDirector(e.target.value)}
            >
              <option value="">Select a director</option>
              {formData.diretores.map((director: Director, index: number) => (
                <option key={index} value={director.nome}>
                  {director.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Name</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Full name"
            />
            {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
          </div>
          <div>
            <Label htmlFor="endereco">Address</Label>
            <Input
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Full address"
            />
            {errors.endereco && (
              <p className="text-red-500 text-sm">{errors.endereco}</p>
            )}
          </div>
          <div>
            <Label htmlFor="ocupacao">Occupation</Label>
            <Input
              id="ocupacao"
              value={ocupacao}
              onChange={(e) => setOcupacao(e.target.value)}
              placeholder="Occupation"
            />
            {errors.ocupacao && (
              <p className="text-red-500 text-sm">{errors.ocupacao}</p>
            )}
          </div>
          <div>
            <Label htmlFor="nacionalidade">Nationality</Label>
            <Input
              id="nacionalidade"
              value={nacionalidade}
              onChange={(e) => setNacionalidade(e.target.value)}
              placeholder="Nationality"
            />
            {errors.nacionalidade && (
              <p className="text-red-500 text-sm">{errors.nacionalidade}</p>
            )}
          </div>
          <div>
            <Label htmlFor="dataNascimento">Date of birth</Label>
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
            <Label htmlFor="percentualAcionaria">Ownership percentage</Label>
            <Input
              id="percentualAcionaria"
              type="number"
              value={percentualAcionaria}
              onChange={(e) => setPercentualAcionaria(e.target.value)}
              placeholder="%"
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
            <Label htmlFor="isPep">Is the person a PEP?</Label>
          </div>
          {isPep && (
            <div>
              <Label htmlFor="pepDescricao">
                Describe the politically exposed person relationship
              </Label>
              <textarea
                id="pepDescricao"
                value={pepDescricao}
                onChange={(e) => setPepDescricao(e.target.value)}
                placeholder="Provide details about the PEP relationship..."
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
            {initialData ? "Save changes" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
