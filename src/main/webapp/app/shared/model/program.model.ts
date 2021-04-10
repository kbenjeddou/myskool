import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface IProgram {
  id?: number;
  coverContentType?: string;
  cover?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  tags?: string | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IProgram> = {};
