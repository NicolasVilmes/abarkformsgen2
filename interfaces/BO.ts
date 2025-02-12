export interface BeneficioalOwner {
  nome: string;
  endereco: string;
  ocupacao: string;
  nacionalidade: string;
  dataNascimento: string;
  isPep: boolean;
  pepDescricao?: string;
  percentualAcionaria: string;
}

export interface ContabilResponsabel {
  nome: string;
  endereco: string;
}