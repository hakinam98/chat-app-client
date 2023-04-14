export interface Message {
  fromSelf: boolean;
  message: string;
  image?: string;
  type: string;
}

export interface User {
  username: string;
  email: string;
  isAvatarImageSet?: boolean;
  id: string;
  password?: string;
  __v?: number;
  avatarImage?: string;
}
