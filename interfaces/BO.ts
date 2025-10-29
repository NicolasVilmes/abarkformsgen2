export interface BeneficialOwner {
  nome: string;
  endereco: string;
  ocupacao: string;
  nacionalidade: string;
  dataNascimento: string;
  isPep: boolean;
  pepDescricao?: string;
  percentualAcionaria: string;
  director?: string;
}

export interface ContabilResponsavel {
  nome: string;
  endereco: string;
}
