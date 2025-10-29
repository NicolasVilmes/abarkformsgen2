"use client";
import { useState } from "react";
import { useFormEn } from "@/context/FormContextEN";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SourceOfFunds() {
  const { formData, updateFormData } = useFormEn();

  const options = [
    "Entrepreneur",
    "Salary",
    "Savings",
    "Investments",
    "Inheritance",
    "Sale of Assets",
    "Other",
  ];

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    formData.origemFundos || []
  );
  const [details, setDetails] = useState(formData.detalhesOrigemFundos || "");

  const toggleOption = (option: string) => {
    let newSelected: string[];
    if (selectedOptions.includes(option)) {
      newSelected = selectedOptions.filter((item) => item !== option);
    } else {
      newSelected = [...selectedOptions, option];
    }
    setSelectedOptions(newSelected);
    updateFormData({ origemFundos: newSelected });
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDetails(value);
    updateFormData({ detalhesOrigemFundos: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Source of Funds</h2>
        <p className="text-gray-500">
          Select the options that best describe where the funds originate from.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`funds-${index}`}
              checked={selectedOptions.includes(option)}
              onCheckedChange={() => toggleOption(option)}
              className="h-4 w-4"
            />
            <Label htmlFor={`funds-${index}`} className="cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="fundDetails" className="block mb-2">
          Provide more details about the source of funds
        </Label>
        <Textarea
          id="fundDetails"
          value={details}
          onChange={handleDetailsChange}
          placeholder="Example: Entrepreneur and owner of XPTO Ltd, based in..., offering services in..."
        />
      </div>
    </div>
  );
}
