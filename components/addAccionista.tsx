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

export function AddAcionistaDialog({
  open,
  setOpen,
  onAdd,
  initialData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (acionista: Acionista) => void;
  initialData?: Acionista | null;
}) {
  const [nomeEmpresa, setNomeEmpresa] = React.useState(
    initialData?.nomeEmpresa || ""
  );
  const [paisIncorporacao, setPaisIncorporacao] = React.useState(
    initialData?.paisIncorporacao || ""
  );
  const [dataIncorporacao, setDataIncorporacao] = React.useState(
    initialData?.dataIncorporacao || ""
  );
  const [percentualAcoes, setPercentualAcoes] = React.useState(
    initialData?.percentualAcoes || ""
  );
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    if (initialData) {
      setNomeEmpresa(initialData.nomeEmpresa);
      setPaisIncorporacao(initialData.paisIncorporacao);
      setDataIncorporacao(initialData.dataIncorporacao);
      setPercentualAcoes(initialData.percentualAcoes);
    } else {
      setNomeEmpresa("");
      setPaisIncorporacao("");
      setDataIncorporacao("");
      setPercentualAcoes("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    const acionistaData = {
      nomeEmpresa,
      paisIncorporacao,
      dataIncorporacao,
      percentualAcoes,
    };
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

    onAdd(result.data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Acionista" : "Adicionar Acionista"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label>Nome da Empresa</Label>
          <Input
            value={nomeEmpresa}
            onChange={(e) => setNomeEmpresa(e.target.value)}
          />
          <Label>País de Incorporação</Label>
          <Input
            value={paisIncorporacao}
            onChange={(e) => setPaisIncorporacao(e.target.value)}
          />
          <Label>Data de Incorporação</Label>
          <Input
            type="date"
            value={dataIncorporacao}
            onChange={(e) => setDataIncorporacao(e.target.value)}
          />
          <Label>Percentual de Ações</Label>
          <Input
            value={percentualAcoes}
            onChange={(e) => setPercentualAcoes(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
