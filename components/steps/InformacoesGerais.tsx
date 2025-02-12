"use client";

import { useForm } from "@/context/FormContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox"; // Import do Checkbox do shadcn ui
import { jurisdicoesEmpresas } from "@/data/jurisdicoes";

export function InformacoesGerais() {
  const { formData, updateFormData } = useForm();
  const [open, setOpen] = React.useState(false);

  // Procura a jurisdição selecionada para obter o capital social padrão
  const selectedJurisdicao = jurisdicoesEmpresas.find(
    (item) => item.value === formData.jurisdicao
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Informações Gerais</h2>
        <p className="text-gray-500">
          Forneça informações gerais sobre a empresa
        </p>
      </div>

      <div className="space-y-4">
        {/* Campo de nomes da empresa */}
        <div>
          <Label>
            Nome da Empresa (forneça 3 opções em ordem de preferência)
          </Label>
          {[0, 1, 2].map((index) => (
            <Input
              key={index}
              className="mt-2"
              placeholder={`${index + 1}ª opção`}
              value={formData.nomeEmpresa[index]}
              onChange={(e) => {
                const newNames = [...formData.nomeEmpresa];
                newNames[index] = e.target.value;
                updateFormData({ nomeEmpresa: newNames });
              }}
            />
          ))}
        </div>

        {/* Jurisdição e operacionalidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Jurisdição Escolhida</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {formData.jurisdicao
                    ? jurisdicoesEmpresas.find(
                        (item) => item.value === formData.jurisdicao
                      )?.label
                    : "Selecione uma jurisdição"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Buscar jurisdição..." />
                  <CommandList>
                    <CommandEmpty>Nenhuma jurisdição encontrada.</CommandEmpty>
                    <CommandGroup>
                      {jurisdicoesEmpresas.map((juris) => (
                        <CommandItem
                          key={juris.value}
                          value={juris.value}
                          onSelect={(currentValue) => {
                            updateFormData({
                              jurisdicao:
                                currentValue === formData.jurisdicao
                                  ? ""
                                  : currentValue,
                            });
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.jurisdicao === juris.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {juris.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Será uma empresa Operacional?</Label>
            <RadioGroup
              className="flex items-center space-x-4 mt-2"
              value={formData.isOperacional ? "sim" : "nao"}
              onValueChange={(value) =>
                updateFormData({ isOperacional: value === "sim" })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="sim" />
                <Label htmlFor="sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="nao" />
                <Label htmlFor="nao">Não</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Propósito da Incorporação */}
        <div>
          <Label>Propósito da Incorporação</Label>
          <Textarea
            value={formData.propositoIncorporacao}
            onChange={(e) =>
              updateFormData({ propositoIncorporacao: e.target.value })
            }
            className="mt-2"
          />
        </div>

        {/* Checkbox para concordar com o capital social padrão */}
        {selectedJurisdicao && (
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="concordaCapital"
              checked={formData.concordaCapitalSocial}
              onCheckedChange={(checked) =>
                updateFormData({ concordaCapitalSocial: Boolean(checked) })
              }
              className="h-4 w-4"
            />
            <Label htmlFor="concordaCapital" className="cursor-pointer">
              Concordo com o capital social padrão de {selectedJurisdicao.label}{" "}
              (Valor: {selectedJurisdicao.capital})
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}
