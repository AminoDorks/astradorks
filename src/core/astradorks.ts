import { AstraOptions } from '../schemas/options';
import { HttpToolKit } from './httptoolkit';
import { transformProxy } from '../util/helpers';
import { NdcService } from '../services/ndc-service';
import initLogger from '../util/logger';
import { SecurityService } from '../services/security-service';
import { MediaUpload, MediaUploadSchema } from '../schemas/responses';
import { BuffersUnion } from '../schemas/http';
import { UserService } from '../services/user-service';
import { Account } from '../schemas';
import { ThreadService } from '../services/thread-service';

export class AstraDorks {
  private options: AstraOptions;
  private httptoolkit: HttpToolKit;

  private ndcService?: NdcService;
  private securityService?: SecurityService;
  private userService?: UserService;
  private threadService?: ThreadService;

  constructor(options: AstraOptions = {}) {
    this.httptoolkit = options.httptoolkit || new HttpToolKit();
    this.options = {
      ...options,
      httptoolkit: this.httptoolkit,
    };

    initLogger(!!options.enableLogging);

    if (this.options.credentials)
      this.httptoolkit.credentials = this.options.credentials;
  }

  get account(): Account {
    return this.options.account || this.security.account;
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

  get user(): UserService {
    if (!this.userService)
      this.userService = new UserService(
        this.httptoolkit,
        this.account,
        this.options.ndcId,
      );
    return this.userService;
  }

  get thread(): ThreadService {
    if (!this.threadService)
      this.threadService = new ThreadService(
        this.httptoolkit,
        this.options.ndcId,
      );
    return this.threadService;
  }

  set proxy(proxy: string) {
    this.httptoolkit.proxy = transformProxy(proxy);
  }

  public as = (ndcId: number): AstraDorks => {
    return new AstraDorks({ ...this.options, ndcId, account: this.account });
  };

  public upload = async (buffer: BuffersUnion): Promise<string> =>
    (
      await this.httptoolkit.media<MediaUpload>(
        { path: '/g/s/media/upload', body: buffer },
        MediaUploadSchema,
      )
    ).mediaValue;
}
