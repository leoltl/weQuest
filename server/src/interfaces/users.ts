export interface User {
  id: number;
  name: string;
  password: string;
  email: string;
  postal_code: string;
  latitude: number;
  longtitude: number;
}

export interface Users {
  user_list: User[];
}
