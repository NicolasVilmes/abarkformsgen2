export interface JurisdicaoEmpresa {
  value: string;
  label: string;
  labelEn: string;
  capital: string;
  diretor: number;
}

export const jurisdicoesEmpresas: JurisdicaoEmpresa[] = [
  {
    value: "Panama",
    label: "Panama",
    labelEn: "Panama",
    capital: "$10.000",
    diretor: 3,
  },
  {
    value: "Nevis",
    label: "Nevis",
    labelEn: "Nevis",
    capital: "$10.000",
    diretor: 1,
  },
  {
    value: "Ilhas Virgens Britanicas (BVI)",
    label: "Ilhas Virgens Britanicas (BVI)",
    labelEn: "British Virgin Islands (BVI)",
    capital: "$10.000",
    diretor: 1,
  },
  {
    value: "Bahamas",
    label: "Bahamas",
    labelEn: "Bahamas",
    capital: "$10.000",
    diretor: 1,
  },
  {
    value: "Estados Unidos (LLC)",
    label: "Estados Unidos (LLC)",
    labelEn: "United States (LLC)",
    capital: "$10.000",
    diretor: 1,
  },
];
