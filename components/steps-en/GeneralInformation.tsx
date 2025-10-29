"use client";

import { useFormEn } from "@/context/FormContextEN";
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
import { Checkbox } from "@/components/ui/checkbox";
import { jurisdicoesEmpresas } from "@/data/jurisdicoes";

export function GeneralInformation() {
  const { formData, updateFormData } = useFormEn();
  const [open, setOpen] = React.useState(false);

  const selectedJurisdiction = jurisdicoesEmpresas.find(
    (item) => item.value === formData.jurisdicao
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">General Information</h2>
        <p className="text-gray-500">
          Share the key details about the entity you wish to incorporate.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Company Name (provide three options in order of preference)</Label>
          {[0, 1, 2].map((index) => (
            <Input
              key={index}
              className="mt-2"
              placeholder={`${index + 1}${["st", "nd", "rd"][index] ?? "th"} option`}
              value={formData.nomeEmpresa[index]}
              onChange={(e) => {
                const newNames = [...formData.nomeEmpresa];
                newNames[index] = e.target.value;
                updateFormData({ nomeEmpresa: newNames });
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Jurisdiction</Label>
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
                      )?.labelEn ?? "Select a jurisdiction"
                    : "Select a jurisdiction"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search jurisdiction..." />
                  <CommandList>
                    <CommandEmpty>No jurisdiction found.</CommandEmpty>
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
                          {juris.labelEn ?? juris.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Will this be an operating company?</Label>
            <RadioGroup
              className="flex items-center space-x-4 mt-2"
              value={formData.isOperacional ? "yes" : "no"}
              onValueChange={(value) =>
                updateFormData({ isOperacional: value === "yes" })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div>
          <Label>Purpose of Incorporation</Label>
          <Textarea
            value={formData.propositoIncorporacao}
            onChange={(e) =>
              updateFormData({ propositoIncorporacao: e.target.value })
            }
            className="mt-2"
            placeholder="Explain why you are incorporating this entity..."
          />
        </div>

        {selectedJurisdiction && (
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="capitalAgreement"
              checked={formData.capitalSocial}
              onCheckedChange={(checked) =>
                updateFormData({ capitalSocial: Boolean(checked) })
              }
              className="h-4 w-4"
            />
            <Label htmlFor="capitalAgreement" className="cursor-pointer">
              I accept the default share capital for{" "}
              {selectedJurisdiction.labelEn ?? selectedJurisdiction.label}{" "}
              (Amount: {selectedJurisdiction.capital})
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}
