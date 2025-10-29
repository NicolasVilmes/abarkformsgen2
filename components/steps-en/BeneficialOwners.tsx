"use client";
import * as React from "react";
import { useFormEn } from "@/context/FormContextEN";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Edit } from "lucide-react";
import { AddBeneficialOwnerDialog } from "@/components/addBeneficialOwner";
import { toast } from "@/hooks/use-toast";
import { BeneficialOwner } from "@/interfaces/BO";

export function BeneficialOwners() {
  const { formData, updateFormData } = useFormEn();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function calculateTotalPercentage(owners: BeneficialOwner[]) {
    return owners.reduce((total, owner) => {
      const val = parseFloat(owner.percentualAcionaria.replace("%", "")) || 0;
      return total + val;
    }, 0);
  }

  const percentageTotal = React.useMemo(
    () => calculateTotalPercentage(formData.beneficiarios),
    [formData.beneficiarios]
  );

  const formatPercentage = (value: number) =>
    Number.isInteger(value) ? value.toString() : value.toFixed(2);

  React.useEffect(() => {
    if (formData.beneficiarios.length === 0) {
      setError(null);
      return;
    }
    if (percentageTotal < 100) {
      setError(
        `Ownership percentages must total 100%. Current total: ${formatPercentage(
          percentageTotal
        )}%`
      );
    } else if (percentageTotal === 100) {
      setError(null);
    }
  }, [percentageTotal, formData.beneficiarios.length]);

  const handleAddOrUpdateOwner = (owner: BeneficialOwner) => {
    let updatedOwners: BeneficialOwner[];

    if (editingIndex !== null) {
      updatedOwners = formData.beneficiarios.map((item, index: number) =>
        index === editingIndex ? owner : item
      );
    } else {
      updatedOwners = [...formData.beneficiarios, owner];
    }

    const totalPercentage = calculateTotalPercentage(updatedOwners);

    if (totalPercentage > 100) {
      setError("Ownership percentages cannot exceed 100%.");
      toast({
        title: "Validation error",
        description: "Ownership percentages cannot exceed 100%.",
        variant: "destructive",
      });
      return;
    }

    if (totalPercentage < 100) {
      setError(
        `Ownership percentages must total 100%. Current total: ${formatPercentage(
          totalPercentage
        )}%`
      );
    } else {
      setError(null);
    }

    updateFormData({ beneficiarios: updatedOwners });
    setEditingIndex(null);
    setDialogOpen(false);
  };

  const handleRemoveOwner = (index: number) => {
    const updatedOwners = formData.beneficiarios.filter((_, i: number) => i !== index);
    const totalPercentage = calculateTotalPercentage(updatedOwners);

    if (totalPercentage > 100) {
      setError("Ownership percentages cannot exceed 100%.");
      toast({
        title: "Validation error",
        description: "Ownership percentages cannot exceed 100%.",
        variant: "destructive",
      });
    } else if (totalPercentage < 100 && updatedOwners.length > 0) {
      setError(
        `Ownership percentages must total 100%. Current total: ${formatPercentage(
          totalPercentage
        )}%`
      );
    } else {
      setError(null);
    }

    updateFormData({ beneficiarios: updatedOwners });
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Beneficial Owners</h2>
        <p className="text-gray-500">
          Add or edit the individuals who ultimately own or control the entity.
        </p>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {!error && formData.beneficiarios.length > 0 && (
        <p className="text-center text-sm text-gray-600">
          Current total: {formatPercentage(percentageTotal)}%
        </p>
      )}

      {formData.beneficiarios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.beneficiarios.map((owner: BeneficialOwner, index: number) => (
            <Card key={index} className="p-4 border rounded-lg relative">
              <div className="flex items-center">
                <Label className="block text-sm font-medium">
                  {owner.nome} – {owner.isPep ? "PEP" : "Non-PEP"} –{" "}
                  {owner.percentualAcionaria}
                </Label>
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditClick(index)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveOwner(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => {
            setEditingIndex(null);
            setDialogOpen(true);
          }}
        >
          Add Beneficial Owner
        </Button>
      </div>

      <AddBeneficialOwnerDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onAdd={handleAddOrUpdateOwner}
        initialData={
          editingIndex !== null
            ? formData.beneficiarios[editingIndex]
            : undefined
        }
      />
    </div>
  );
}
