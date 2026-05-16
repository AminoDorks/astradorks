import { AstraOptions } from '../schemas/options';
import { HttpToolKit } from './httptoolkit';
import { transformProxy } from '../util/helpers';
import { NdcService } from '../services/ndc-service';
import initLogger from '../util/logger';
import { SecurityService } from '../services/security-service';

export class AstraDorks {
  private options: AstraOptions;
  private httptoolkit: HttpToolKit;

  private ndcService?: NdcService;
  private securityService?: SecurityService;

  constructor(options: AstraOptions = {}) {
    this.httptoolkit = new HttpToolKit();
    this.options = {
      ...options,
      httptoolkit: this.httptoolkit,
    };

    initLogger(!!options.enableLogging);

    if (this.options.credentials)
      this.httptoolkit.credentials = this.options.credentials;
  }

  get ndc(): NdcService {
    if (!this.ndcService)
      this.ndcService = new NdcService(this.httptoolkit, this.options.ndcId);
    return this.ndcService;
  }

  get security(): SecurityService {
    if (!this.securityService)
      this.securityService = new SecurityService(this.httptoolkit);
    return this.securityService;
  }

  set proxy(proxy: string) {
    this.httptoolkit.proxy = transformProxy(proxy);
  }

  public as = (ndcId: number): AstraDorks => {
    return new AstraDorks({ ...this.options, ndcId });
  };
}
