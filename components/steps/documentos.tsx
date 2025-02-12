"use client";
import * as React from "react";
import { useState } from "react";
import { useForm } from "@/context/FormContext";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

// Interface para a entidade (para exibição)
interface Entity {
  nome: string;
  endereco?: string;
  type: "Diretor" | "Acionista" | "Beneficiário";
}

// Função auxiliar para converter um File para Base64
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export function Docs() {
  const { formData, updateFormData } = useForm();

  // Cria a lista combinada de entidades
  const allEntities: Entity[] = [
    ...formData.diretores.map((d) => ({
      nome: d.nome,
      endereco: d.address, // ajuste conforme o campo correto
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

  // Gera uma lista única de entidades (usando o nome em lowercase para comparação)
  const uniqueEntities: Entity[] = Array.from(
    new Map(
      allEntities.map((entity) => [entity.nome.trim().toLowerCase(), entity])
    ).values()
  );

  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [open, setOpen] = useState(false);

  // Estados para os arquivos
  const [passaporteFile, setPassaporteFile] = useState<File | null>(null);
  const [comprovanteResidenciaFile, setComprovanteResidenciaFile] =
    useState<File | null>(null);
  const [cartaReferenciaFile, setCartaReferenciaFile] = useState<File | null>(
    null
  );

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntity) return;

    try {
      const docs: { title: string; url: string; entityName: string }[] = [];

      if (passaporteFile) {
        const base64 = await fileToBase64(passaporteFile);
        docs.push({
          title: `Passaporte - ${selectedEntity.nome}`,
          url: base64,
          entityName: selectedEntity.nome,
        });
      }
      if (comprovanteResidenciaFile) {
        const base64 = await fileToBase64(comprovanteResidenciaFile);
        docs.push({
          title: `Comprovante de Residência - ${selectedEntity.nome}`,
          url: base64,
          entityName: selectedEntity.nome,
        });
      }
      if (selectedEntity.type === "Beneficiário" && cartaReferenciaFile) {
        const base64 = await fileToBase64(cartaReferenciaFile);
        docs.push({
          title: `Carta de Referência Bancária - ${selectedEntity.nome}`,
          url: base64,
          entityName: selectedEntity.nome,
        });
      }

      // Se desejar mesclar com documentos já existentes (excluindo os da mesma entidade)
      const filteredDocs = (formData.documentos || []).filter(
        (doc: any) =>
          doc.entityName?.toLowerCase() !==
          selectedEntity.nome.trim().toLowerCase()
      );
      const newDocs = [...filteredDocs, ...docs];

      updateFormData({ documentos: newDocs });
      console.log("Documentos atualizados no contexto:", newDocs);
      setOpen(false);
    } catch (error) {
      console.error("Erro ao converter arquivo:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Documentos</h2>
        <p className="text-gray-500">
          Selecione uma pessoa ou organização para fazer upload dos documentos.
        </p>
      </div>

      {/* Renderiza os cards para as entidades únicas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {uniqueEntities.map((entity, index) => (
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
              <p className="text-xs text-gray-500 italic">{entity.type}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Diálogo para upload de documentos */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload de Documentos</DialogTitle>
            <DialogDescription>
              Faça upload dos documentos para{" "}
              <strong>{selectedEntity?.nome}</strong>.
              {selectedEntity?.type === "Beneficiário" && (
                <span>
                  {" "}
                  Como pessoa física, inclua passaporte, comprovante de
                  residência e carta de referência bancária.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <Label htmlFor="passaporte" className="block text-sm font-medium">
                Passaporte
              </Label>
              <Input
                id="passaporte"
                type="file"
                onChange={(e) =>
                  e.target.files && setPassaporteFile(e.target.files[0])
                }
              />
            </div>
            <div>
              <Label
                htmlFor="comprovanteResidencia"
                className="block text-sm font-medium"
              >
                Comprovante de Residência
              </Label>
              <Input
                id="comprovanteResidencia"
                type="file"
                onChange={(e) =>
                  e.target.files &&
                  setComprovanteResidenciaFile(e.target.files[0])
                }
              />
            </div>
            {selectedEntity?.type === "Beneficiário" && (
              <div>
                <Label
                  htmlFor="cartaReferencia"
                  className="block text-sm font-medium"
                >
                  Carta de Referência Bancária
                </Label>
                <Input
                  id="cartaReferencia"
                  type="file"
                  onChange={(e) =>
                    e.target.files && setCartaReferenciaFile(e.target.files[0])
                  }
                />
              </div>
            )}
            <DialogFooter>
              <Button type="submit">Inserir Documentos</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
