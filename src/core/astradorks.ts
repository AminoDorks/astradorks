import { AstraOptions } from '../schemas/options';
import { HttpToolKit } from './httptoolkit';
import { NdcService } from '../services/ndc-service';
import { SecurityService } from '../services/security-service';
import { MediaUpload, MediaUploadSchema } from '../schemas/responses';
import { BuffersUnion } from '../schemas/http';
import { UserService } from '../services/user-service';
import { Account } from '../schemas';
import { ThreadService } from '../services/thread-service';
import { PostService } from '../services/post-service';
import initLogger from '../util/logger';
import { SITE_URL } from '../constants';

export class AstraDorks {
  private options: AstraOptions;
  private httptoolkit: HttpToolKit;

  private ndcService?: NdcService;
  private securityService?: SecurityService;
  private userService?: UserService;
  private threadService?: ThreadService;
  private postService?: PostService;

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
        this.account,
        this.options.ndcId,
      );
    return this.threadService;
  }

  get post(): PostService {
    if (!this.postService)
      this.postService = new PostService(this.httptoolkit, this.options.ndcId);
    return this.postService;
  }

  set proxy(proxy: string) {
    this.httptoolkit.proxy = proxy;
  }

  public unsetProxy = (): void => {
    this.httptoolkit.unsetProxy();
  };

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

  public diagnostic = async (): Promise<boolean> => {
    try {
      await this.httptoolkit.raw(SITE_URL);
      return true;
    } catch {
      return false;
    }
  };
}
