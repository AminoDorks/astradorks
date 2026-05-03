import { HttpToolKit } from '../core/httptoolkit';
import { IService } from '../interfaces/service';

export class NdcService implements IService {
  httptoolkit: HttpToolKit;
  endpoint: string;
  ndcId?: number;

  constructor(httptoolkit: HttpToolKit, ndcId?: number) {
    this.httptoolkit = httptoolkit;
    this.endpoint = `/g/s-x${ndcId}`;
    this.ndcId = ndcId;
  }
}
