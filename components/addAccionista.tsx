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

    setErrors({});
    onAdd(result.data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {initialData ? "Editar Acionista" : "Adicionar Acionista"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nomeEmpresa" className="block mb-1">
              Nome da Empresa
            </Label>
            <Input
              id="nomeEmpresa"
              value={nomeEmpresa}
              onChange={(e) => setNomeEmpresa(e.target.value)}
              className="w-full"
            />
            {errors.nomeEmpresa && (
              <p className="text-red-500 text-sm mt-1">{errors.nomeEmpresa}</p>
            )}
          </div>
          <div>
            <Label htmlFor="paisIncorporacao" className="block mb-1">
              País de Incorporação
            </Label>
            <Input
              id="paisIncorporacao"
              value={paisIncorporacao}
              onChange={(e) => setPaisIncorporacao(e.target.value)}
              className="w-full"
            />
            {errors.paisIncorporacao && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paisIncorporacao}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="dataIncorporacao" className="block mb-1">
              Data de Incorporação
            </Label>
            <Input
              id="dataIncorporacao"
              type="date"
              value={dataIncorporacao}
              onChange={(e) => setDataIncorporacao(e.target.value)}
              className="w-full"
            />
            {errors.dataIncorporacao && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dataIncorporacao}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="percentualAcoes" className="block mb-1">
              Percentual de Ações
            </Label>
            <Input
              id="percentualAcoes"
              value={percentualAcoes}
              onChange={(e) => setPercentualAcoes(e.target.value)}
              className="w-full"
            />
            {errors.percentualAcoes && (
              <p className="text-red-500 text-sm mt-1">
                {errors.percentualAcoes}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit}
            className="w-full bg-abark hover:bg-abark-dark"
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
