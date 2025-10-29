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
import { Director } from "@/interfaces/Director";

const DirectorSchema = z.object({
  nome: z.string().nonempty("Name is required."),
  origem: z.string().nonempty("Country of origin is required."),
  nascimento: z.string().nonempty("Date of birth is required."),
  address: z.string().nonempty("Address is required."),
  telefone: z.string().nonempty("Contact number is required."),
  email: z.string().nonempty("Email is required.").email("Enter a valid email."),
  occupation: z.string().nonempty("Occupation is required."),
  passport: z.string().nonempty("Passport number is required."),
});

export function AddDirectorDialogEn({ onAdd }: { onAdd: (director: Director) => void }) {
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
    const directorData = {
      nome,
      origem,
      nascimento,
      address,
      telefone,
      email,
      occupation,
      passport,
    };
    const result = DirectorSchema.safeParse(directorData);
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
          Add Director
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full overflow-auto sm:max-w-none sm:max-h-none sm:w-auto sm:h-auto">
        <DialogHeader>
          <DialogTitle>Add Director</DialogTitle>
          <DialogDescription>Fill in the director details.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="nome">Name</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Director name"
            />
            {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="origem">Country of origin</Label>
              <Input
                id="origem"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                placeholder="Country of origin"
              />
              {errors.origem && (
                <p className="text-red-500 text-sm">{errors.origem}</p>
              )}
            </div>
            <div>
              <Label htmlFor="nascimento">Date of birth</Label>
              <Input
                id="nascimento"
                type="date"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
              />
              {errors.nascimento && (
                <p className="text-red-500 text-sm">{errors.nascimento}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, number, city..."
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="telefone">Contact number</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="+1 555 123 4567"
              />
              {errors.telefone && (
                <p className="text-red-500 text-sm">{errors.telefone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g., Civil Engineer"
            />
            {errors.occupation && (
              <p className="text-red-500 text-sm">{errors.occupation}</p>
            )}
          </div>
          <div>
            <Label htmlFor="passport">Passport number</Label>
            <Input
              id="passport"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
              placeholder="Passport number"
            />
            {errors.passport && (
              <p className="text-red-500 text-sm">{errors.passport}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
