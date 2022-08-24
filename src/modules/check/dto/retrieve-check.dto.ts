import { Check } from 'src/modules/mikroorm/entities/Check';
import { Locale, User } from 'src/modules/mikroorm/entities/User';

export class RetrieveCheckDto {
  constructor(check: Check) {
    this.id = check.id.toString();
    this.fancyId = check.fancyId;
    this.credentials = check.user?.credentials || '';
    this.phone = check.user.phone;
    this.checkPath = check.path;
    this.locale = check.user?.locale || '';
    this.createdAt = check.createdAt?.toLocaleString() || '';
    this.status = check.status?.id.toString() || '';
  }
  id: string;
  fancyId: string;
  credentials: string;
  phone: string;
  status: string;
  locale: string;
  createdAt: string;
  checkPath: string;
}
