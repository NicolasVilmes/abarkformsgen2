"use client";
import { useEffect, useMemo, useState } from "react";
import { useFormEn } from "@/context/FormContextEN";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

type Method = "beneficiary" | "manual" | null;

export function AccountingRecords() {
  const { formData, updateFormData } = useFormEn();

  const [selectedBeneficiaryIndex, setSelectedBeneficiaryIndex] = useState<
    number | null
  >(null);
  const [method, setMethod] = useState<Method>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  const [name, setName] = useState(
    formData.responsavelContabilidade?.nome || ""
  );
  const [address, setAddress] = useState(
    formData.responsavelContabilidade?.endereco || ""
  );

  const beneficiaries = useMemo(
    () => formData.beneficiarios || [],
    [formData.beneficiarios]
  );

  useEffect(() => {
    if (
      selectedBeneficiaryIndex !== null &&
      beneficiaries[selectedBeneficiaryIndex]
    ) {
      const ben = beneficiaries[selectedBeneficiaryIndex];
      setName(ben.nome);
      setAddress(ben.endereco);
      setMethod("beneficiary");
      setShowManualForm(false);
    } else {
      setName("");
      setAddress("");
    }
  }, [selectedBeneficiaryIndex, beneficiaries]);

  useEffect(() => {
    if (method === "beneficiary") {
      const current = formData.responsavelContabilidade || {
        nome: "",
        endereco: "",
      };
      if (current.nome !== name || current.endereco !== address) {
        updateFormData({
          responsavelContabilidade: { nome: name, endereco: address },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, name, address]);

  const toggleManualForm = () => {
    setSelectedBeneficiaryIndex(null);
    setMethod("manual");
    setShowManualForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData({
      responsavelContabilidade: { nome: name, endereco: address },
    });
    setShowManualForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Accounting Records</h2>
        <p className="text-gray-500">
          Select a beneficial owner to populate the accounting representative or
          enter the information manually.
        </p>
      </div>

      {beneficiaries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Beneficial Owners</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {beneficiaries.map((beneficiary, index) => (
              <Card
                key={index}
                className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                  selectedBeneficiaryIndex === index && method === "beneficiary"
                    ? "border-abark-lighter shadow-md"
                    : "border-gray-200"
                }`}
                onClick={() => {
                  setSelectedBeneficiaryIndex(index);
                  setMethod("beneficiary");
                }}
              >
                <User className="w-6 h-6 inline-block mr-2" />
                <div>
                  <Label className="block text-sm font-medium">
                    {beneficiary.nome}
                  </Label>
                  <p className="text-xs text-gray-600">{beneficiary.endereco}</p>
                </div>
              </Card>
            ))}
            <div className="flex flex-col items-center gap-4 my-auto">
              {method === "manual" && formData.responsavelContabilidade ? (
                <div className="w-full">
                  <Card
                    onClick={() => setShowManualForm(true)}
                    className="p-4 border rounded-lg cursor-pointer flex items-center mx-auto max-w-md border-blue-500"
                  >
                    <User className="w-6 h-6 inline-block mr-2" />
                    <div>
                      <Label className="block text-sm font-medium">
                        {name || "Name not provided"}
                      </Label>
                      <p className="text-xs text-gray-600">
                        {address || "Address not provided"}
                      </p>
                    </div>
                  </Card>
                </div>
              ) : (
                <Button variant="outline" onClick={toggleManualForm}>
                  Enter manually
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showManualForm && (
        <div className="border p-4 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold mb-2">
            Accounting Representative (Manual)
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="accountingName" className="block text-sm font-medium mb-1">
                Name
              </Label>
              <Input
                id="accountingName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Representative name"
              />
            </div>
            <div>
              <Label
                htmlFor="accountingAddress"
                className="block text-sm font-medium mb-1"
              >
                Address
              </Label>
              <Input
                id="accountingAddress"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
            </div>
            <Button type="submit" className="w-full">
              Save representative
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
