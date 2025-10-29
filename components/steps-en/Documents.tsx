"use client";
import * as React from "react";
import { useState } from "react";
import { useFormEn } from "@/context/FormContextEN";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

interface Entity {
  nome: string;
  endereco?: string;
  type: "Diretor" | "Acionista" | "Beneficiário";
}

const DocumentSchema = z.object({
  passaporteFile: z.instanceof(File, { message: "Passport copy is required." }),
  comprovanteResidenciaFile: z.instanceof(File, {
    message: "Proof of address is required.",
  }),
  cartaReferenciaFile: z
    .instanceof(File, {
      message: "Bank reference letter is required.",
    })
    .optional(),
});

export function DocumentsEn() {
  const { formData, updateFormData } = useFormEn();
  const { toast } = useToast();

  const allEntities: Entity[] = [
    ...formData.diretores.map((d) => ({
      nome: d.nome,
      endereco: d.address,
      type: "Diretor" as const,
    })),
    ...formData.acionistas.map((a) => ({
      nome: a.nomeEmpresa,
      endereco: a.paisIncorporacao,
      type: "Acionista" as const,
    })),
    ...formData.beneficiarios.map((b) => ({
      nome: b.nome,
      endereco: b.endereco,
      type: "Beneficiário" as const,
    })),
  ];

  const uniqueEntities: Entity[] = Array.from(
    new Map(
      allEntities.map((entity) => [entity.nome.trim().toLowerCase(), entity])
    ).values()
  );

  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [open, setOpen] = useState(false);
  const [passaporteFile, setPassaporteFile] = useState<File | null>(null);
  const [comprovanteResidenciaFile, setComprovanteResidenciaFile] =
    useState<File | null>(null);
  const [cartaReferenciaFile, setCartaReferenciaFile] = useState<File | null>(
    null
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntity) return;

    const documentData = {
      passaporteFile,
      comprovanteResidenciaFile,
      cartaReferenciaFile:
        selectedEntity.type === "Beneficiário"
          ? cartaReferenciaFile
          : undefined,
    };

    const result = DocumentSchema.safeParse(documentData);
    if (!result.success) {
      const validationErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          validationErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(validationErrors);
      return;
    }

    try {
      const docs: {
        title: string;
        url: string;
        entityName: string;
        entityType: Entity["type"];
      }[] = [];

      if (passaporteFile) {
        const base64 = await fileToBase64(passaporteFile);
        docs.push({
          title: `Passport - ${selectedEntity.nome}`,
          url: base64,
          entityName: selectedEntity.nome,
          entityType: selectedEntity.type,
        });
      }
      if (comprovanteResidenciaFile) {
        const base64 = await fileToBase64(comprovanteResidenciaFile);
        docs.push({
          title: `Proof of Address - ${selectedEntity.nome}`,
          url: base64,
          entityName: selectedEntity.nome,
          entityType: selectedEntity.type,
        });
      }
      if (selectedEntity.type === "Beneficiário" && cartaReferenciaFile) {
        const base64 = await fileToBase64(cartaReferenciaFile);
        docs.push({
          title: `Bank Reference Letter - ${selectedEntity.nome}`,
          url: base64,
          entityName: selectedEntity.nome,
          entityType: selectedEntity.type,
        });
      }

      const filteredDocs = (formData.documentos || []).filter(
        (doc) =>
          doc.entityName?.toLowerCase() !==
          selectedEntity.nome.trim().toLowerCase()
      );
      const newDocs = [...filteredDocs, ...docs];

      updateFormData({ documentos: newDocs });
      setOpen(false);
      setErrors({});
      setPassaporteFile(null);
      setComprovanteResidenciaFile(null);
      setCartaReferenciaFile(null);
    } catch (error) {
      void error;
      toast({
        title: "Upload failed",
        description: "We couldn't process the files. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Documents</h2>
        <p className="text-gray-500">
          Select an individual or organization to upload the required documents.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {uniqueEntities.map((entity, index) => {
          const typeLabels: Record<Entity["type"], string> = {
            Diretor: "Director",
            Acionista: "Shareholder",
            Beneficiário: "Beneficial Owner",
          };
          return (
            <Card
              key={index}
              className="p-4 border rounded-lg cursor-pointer flex items-center"
              onClick={() => {
                setSelectedEntity(entity);
                setOpen(true);
              }}
            >
              <User className="w-6 h-6 mr-2" />
              <div>
                <Label className="text-sm font-medium">{entity.nome}</Label>
                {entity.endereco && (
                  <p className="text-xs text-gray-600">{entity.endereco}</p>
                )}
                <p className="text-xs text-gray-500 italic">
                  {typeLabels[entity.type] ?? entity.type}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Upload files for <strong>{selectedEntity?.nome}</strong>.
              {selectedEntity?.type === "Beneficiário" && (
                <span>
                  {" "}
                  For individuals, please upload a passport, proof of address, and a
                  bank reference letter.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <Label>Passport</Label>
              <Input
                type="file"
                onChange={(e) => setPassaporteFile(e.target.files?.[0] || null)}
              />
              {errors.passaporteFile && (
                <p className="text-red-500 text-sm">{errors.passaporteFile}</p>
              )}
            </div>
            <div>
              <Label>Proof of Address</Label>
              <Input
                type="file"
                onChange={(e) =>
                  setComprovanteResidenciaFile(e.target.files?.[0] || null)
                }
              />
              {errors.comprovanteResidenciaFile && (
                <p className="text-red-500 text-sm">
                  {errors.comprovanteResidenciaFile}
                </p>
              )}
            </div>
            {selectedEntity?.type === "Beneficiário" && (
              <div>
                <Label>Bank Reference Letter</Label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setCartaReferenciaFile(e.target.files?.[0] || null)
                  }
                />
                {errors.cartaReferenciaFile && (
                  <p className="text-red-500 text-sm">
                    {errors.cartaReferenciaFile}
                  </p>
                )}
              </div>
            )}
            <DialogFooter>
              <Button type="submit">Attach documents</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
