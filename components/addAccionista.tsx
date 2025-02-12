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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "@/context/FormContext";

export interface Acionista {
  nomeEmpresa: string;
  paisIncorporacao: string;
  dataIncorporacao: string;
  percentualAcoes: string;
}

const ShareholderSchema = z.object({
  nomeEmpresa: z.string().nonempty("Nome da Empresa é obrigatório"),
  paisIncorporacao: z.string().nonempty("País de Incorporação é obrigatório"),
  dataIncorporacao: z.string().nonempty("Data de Incorporação é obrigatória"),
  percentualAcoes: z.string().nonempty("Percentual de Ações é obrigatório"),
});

interface AddAcionistaDialogProps {
  onAdd: (acionista: Acionista) => void;
}

export function AddAcionistaDialog({ onAdd }: AddAcionistaDialogProps) {
  const { formData } = useForm();
  const [open, setOpen] = React.useState(false);
  const [nomeEmpresa, setNomeEmpresa] = React.useState("");
  const [paisIncorporacao, setPaisIncorporacao] = React.useState("");
  const [dataIncorporacao, setDataIncorporacao] = React.useState("");
  const [percentualAcoes, setPercentualAcoes] = React.useState("");
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    // Cria o objeto com os dados do acionista
    const acionistaData = {
      nomeEmpresa,
      paisIncorporacao,
      dataIncorporacao,
      percentualAcoes,
    };

    // Valida os dados individuais usando Zod
    const result = ShareholderSchema.safeParse(acionistaData);
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

    // Se os dados individuais estão ok, verifica a soma dos percentuais.
    // Converte percentualAcoes para número; se tiver % no final, remove-o.
    const newPercent = parseFloat(
      acionistaData.percentualAcoes.replace("%", "")
    );
    if (isNaN(newPercent)) {
      setErrors((prev) => ({
        ...prev,
        percentualAcoes: "Valor inválido para percentual de ações",
      }));
      return;
    }

    // Soma os percentuais já adicionados no contexto
    const existingShareholders = formData.acionistas || [];
    const totalExisting = existingShareholders.reduce((sum, acionista) => {
      const perc = parseFloat(acionista.percentualAcoes.replace("%", ""));
      return sum + (isNaN(perc) ? 0 : perc);
    }, 0);

    if (totalExisting + newPercent > 100) {
      setErrors((prev) => ({
        ...prev,
        percentualAcoes: "A soma dos percentuais não pode exceder 100%",
      }));
      return;
    }

    // Se tudo estiver ok, limpa os erros, chama onAdd e reseta os campos
    setErrors({});
    onAdd(result.data);
    setNomeEmpresa("");
    setPaisIncorporacao("");
    setDataIncorporacao("");
    setPercentualAcoes("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar Acionista</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full overflow-auto sm:max-w-[40vw] sm:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Adicionar Acionista</DialogTitle>
          <DialogDescription>Preencha os dados do acionista.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
            <Input
              id="nomeEmpresa"
              value={nomeEmpresa}
              onChange={(e) => setNomeEmpresa(e.target.value)}
              placeholder="Nome da Empresa"
            />
            {errors.nomeEmpresa && (
              <p className="text-red-500 text-sm">{errors.nomeEmpresa}</p>
            )}
          </div>
          <div>
            <Label htmlFor="paisIncorporacao">País de Incorporação</Label>
            <Input
              id="paisIncorporacao"
              value={paisIncorporacao}
              onChange={(e) => setPaisIncorporacao(e.target.value)}
              placeholder="País de Incorporação"
            />
            {errors.paisIncorporacao && (
              <p className="text-red-500 text-sm">{errors.paisIncorporacao}</p>
            )}
          </div>
          <div>
            <Label htmlFor="dataIncorporacao">Data de Incorporação</Label>
            <Input
              id="dataIncorporacao"
              type="date"
              value={dataIncorporacao}
              onChange={(e) => setDataIncorporacao(e.target.value)}
            />
            {errors.dataIncorporacao && (
              <p className="text-red-500 text-sm">{errors.dataIncorporacao}</p>
            )}
          </div>
          <div>
            <Label htmlFor="percentualAcoes">Percentual de Ações</Label>
            <Input
              id="percentualAcoes"
              value={percentualAcoes}
              onChange={(e) => setPercentualAcoes(e.target.value)}
              placeholder="Ex: 25%"
            />
            {errors.percentualAcoes && (
              <p className="text-red-500 text-sm">{errors.percentualAcoes}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
