export interface IProfile {
  id: string;
  username: string;
  email: string;
  photo: string;
  created_at: string;
  updated_at?: string;
}

export interface IMessage {
  id?: string;
  text: string;
  from: string;
  to: string;
  createdAt: string;
  room_id?: string;
}

export interface IRoom {
  id: string;
  participants: string[];
  messages: IMessage[];
  created_at?: string;
  updated_at?: string;
}

/** MongoDB-compatible user shape for API responses */
export interface IUserResponse {
  _id: string;
  username: string;
  email: string;
  photo: string;
  createdAt?: string;
  password?: undefined;
}
