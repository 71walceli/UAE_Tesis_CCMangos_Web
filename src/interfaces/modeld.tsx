export interface AuthInterface {
  username: string;
  password: string;
}
export interface TokenResponse {
  usuario: IProfile;
  rol:string;
  access_token: string;
  refresh_token: string;
}

export interface IProfile {
  cedula: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  id: number;
  user: number; // User ID
}


//ApirError
export interface ApiErrorResponse {
  Message: string;
  error_description: string;
}
export interface IPlantas {
  id: number;
  Disabled: boolean;
  Codigo_Planta: string;
  Nombre: string;
  Activo: boolean;
  Id_Lote: number;
}
export interface ILote {
  id?: number;
  Id_Proyecto: number;
  Codigo_Lote: string;
  Nombre: string;
  Variedad: string;
  Hectareas?: number;
  Activo?: boolean;
  Usuario: number;
  Areas?: number[];
  Poligonos?: number[];
}
export interface IUser {
  id:               number;
  is_superuser:     boolean;
  username:         string;
  first_name:       string;
  last_name:        string;
  email:            string;
  is_staff:         boolean;
  is_active:        boolean;
  groups:           number[];
  user_permissions: any[];
  cedula:           string;
  user:             number;
}
export interface IRol{
  id?: number;
  name: string,
  permissions?: number[]
}

export interface IPermissions {
  id:           number;
  name:         string;
  codename:     string;
  content_type: number;
}

export interface ILectura {
  id: number | null;
  E1: number | null;
  E2: number | null;
  E3: number | null;
  E4: number | null;
  E5: number | null;
  GR1: number | null;
  GR2: number | null;
  GR3: number | null;
  GR4: number | null;
  GR5: number | null;
  Cherelles: null | number;
  Observacion: string;
  FechaVisita: Date;
  Activo: boolean;
  Id_Planta: number;
}
