import { Locale, User } from 'src/modules/mikroorm/entities/User';

export class RetrieveUserDto {
  constructor(user: User) {
    this.id = user.id.toString();
    this.chatId = user.chatId;
    this.username = user.username;
    this.credentials = user.credentials;
    this.locale = user.locale;
    this.role = user.role;
    this.phone = user.phone;
    this.createdAt = user.createdAt;
    this.promo = user.promo?.id.toString() || '';
    this.registered = user.registered;
    this.city = user.city?.id.toString() || '';
  }
  id: string;
  chatId: string;
  username: string;
  credentials: string;
  locale: string;
  role: string;
  phone: string;
  city: string;
  registered: boolean;
  promo: string;
  createdAt: Date;
}
