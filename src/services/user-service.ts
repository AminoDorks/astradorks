import { HttpToolKit } from '../core/httptoolkit';
import { Account, EditProfileBuilder, Profile } from '../schemas';
import { GetUserProfile, GetUserProfileSchema } from '../schemas/responses';
import { formatMediaList } from '../util/helpers';

export class UserService {
  private httptoolkit: HttpToolKit;
  private account: Account;

  private endpoint: string = '/g/s';
  private ndcId?: number;

  constructor(httptoolkit: HttpToolKit, account: Account, ndcId?: number) {
    this.httptoolkit = httptoolkit;
    this.account = account;
    this.ndcId = ndcId;
    if (ndcId) this.endpoint = `/x${ndcId}/s`;
  }

  public edit = async (builder: EditProfileBuilder): Promise<Profile> =>
    (
      await this.httptoolkit.post<GetUserProfile>(
        {
          path: `${this.endpoint}/user-profile/${this.account.uid}`,
          body: {
            nickname: builder.nickname,
            icon: builder.icon,
            content: builder.content,
            extensions: {
              style: {
                backgroundMediaList: formatMediaList(
                  builder.backgroundMediaList || [],
                ),
                backgroundColor: builder.backgroundColor,
              },
            },
          },
        },
        GetUserProfileSchema,
      )
    ).userProfile;
}
