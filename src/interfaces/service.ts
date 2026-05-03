import { HttpToolKit } from '../core/httptoolkit';

export interface IService {
  httptoolkit: HttpToolKit;
  endpoint: string;
  ndcId?: number;
}
