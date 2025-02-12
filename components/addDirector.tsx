"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// Definição da interface do Diretor
export interface Diretor {
  nome: string;
  origem: string;
  nascimento: string;
  address: string;
  telefone: string;
  email: string;
  occupation: string;
  passport: string;
}

// Schema de validação com Zod para o formulário do diretor
const DiretorSchema = z.object({
  nome: z.string().nonempty("Nome é obrigatório"),
  origem: z.string().nonempty("País de origem é obrigatório"),
  nascimento: z.string().nonempty("Data de nascimento é obrigatória"),
  address: z.string().nonempty("Endereço é obrigatório"),
  telefone: z.string().nonempty("Número de contato é obrigatório"),
  email: z.string().nonempty("Email é obrigatório").email("Email inválido"),
  occupation: z.string().nonempty("Ocupação é obrigatória"),
  passport: z.string().nonempty("Número de passaporte é obrigatório"),
});

interface AddDiretorDialogProps {
  onAdd: (diretor: Diretor) => void;
}

export function AddDiretorDialog({ onAdd }: AddDiretorDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [nome, setNome] = React.useState("");
  const [origem, setOrigem] = React.useState("");
  const [nascimento, setNascimento] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [occupation, setOccupation] = React.useState("");
  const [passport, setPassport] = React.useState("");
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const diretorData = {
      nome,
      origem,
      nascimento,
      address,
      telefone,
      email,
      occupation,
      passport,
    };
    const result = DiretorSchema.safeParse(diretorData);
    if (!result.success) {
      // Extrai os erros para cada campo e atualiza o estado
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
    setOrigem("");
    setNascimento("");
    setAddress("");
    setTelefone("");
    setEmail("");
    setOccupation("");
    setPassport("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Adicionar Diretor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full overflow-auto sm:max-w-none sm:max-h-none sm:w-auto sm:h-auto ">
        <DialogHeader>
          <DialogTitle>Adicionar Diretor</DialogTitle>
          <DialogDescription>Preencha os dados do diretor.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do diretor"
            />
            {errors.nome && (
              <p className="text-red-500 text-sm">{errors.nome}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="origem">País de Origem</Label>
              <Input
                id="origem"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                placeholder="País de Origem"
              />
              {errors.origem && (
                <p className="text-red-500 text-sm">{errors.origem}</p>
              )}
            </div>
            <div>
              <Label htmlFor="nascimento">Data de Nascimento</Label>
              <Input
                id="nascimento"
                type="date"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
                placeholder="MM/DD/AAAA"
              />
              {errors.nascimento && (
                <p className="text-red-500 text-sm">{errors.nascimento}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rua, número, bairro, cidade, ..."
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="telefone">Número de Contato</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="+55 11 99999-9999"
              />
              {errors.telefone && (
                <p className="text-red-500 text-sm">{errors.telefone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email de Contato</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@exemplo.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="occupation">Ocupação ou Atividade</Label>
            <Input
              id="occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="ex: Engenheiro civil"
            />
            {errors.occupation && (
              <p className="text-red-500 text-sm">{errors.occupation}</p>
            )}
          </div>
          <div>
            <Label htmlFor="passport">Número de Passaporte</Label>
            <Input
              id="passport"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
              placeholder="Número do passaporte"
            />
            {errors.passport && (
              <p className="text-red-500 text-sm">{errors.passport}</p>
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
