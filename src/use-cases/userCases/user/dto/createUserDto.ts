export interface CreateUserDto {
    id: string;
    name: string;
    surname: string;
    email: string;
    cpf: string;
    rg: string;
    birthday: Date;
    password_hash: string;
    streeth: string;
    number: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
  
    // Relacionamentos
    address?: Address; // Relacionamento com Address
    privilege?: Privilege; // Relacionamento com Privilege
  }
  
  interface Address {
    streeth: string;
    number: string;
    neighboor: string;
    complement: string;
    reference: string;
    created_at: Date;
    updated_at: Date;
  
    // Relacionamentos
    user?: User[]; // Relacionamento com User
  }
  
  interface Privilege {
    id: string;
  }
  