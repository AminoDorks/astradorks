import { HttpToolKit } from '../core/httptoolkit';
import {
  Account,
  Blog,
  Comment,
  EditProfileBuilder,
  Profile,
  Sizing,
  Sort,
} from '../schemas';
import {
  BasicResponse,
  BasicResponseSchema,
  GetBlogs,
  GetBlogsSchema,
  GetComment,
  GetComments,
  GetCommentSchema,
  GetCommentsSchema,
  GetUserProfile,
  GetUserProfileSchema,
} from '../schemas/responses';
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

  public comments = async (
    userId: string,
    sizing: Sizing = { start: 0, size: 25 },
    sort: Sort = 'newest',
  ): Promise<Comment[]> =>
    (
      await this.httptoolkit.get<GetComments>(
        {
          path: `${this.endpoint}/user-profile/${userId}/g-comment?sort=${sort}&start=${sizing.start}&size=${sizing.size}`,
        },
        GetCommentsSchema,
      )
    ).commentList;

  public blogs = async (
    userId: string,
    sizing: Sizing = { start: 0, size: 25 },
  ): Promise<Blog[]> =>
    (
      await this.httptoolkit.get<GetBlogs>(
        {
          path: `${this.endpoint}/blog?start=${sizing.start}&size=${sizing.size}&type=user&q=${userId}`,
        },
        GetBlogsSchema,
      )
    ).blogList;

  public comment = async (
    userId: string,
    content: string,
    mediaList: string[] = [],
  ): Promise<Comment> =>
    (
      await this.httptoolkit.post<GetComment>(
        {
          path: `${this.endpoint}/user-profile/${userId}/comment`,
          body: {
            content,
            eventSource: 'UserProfileView',
            mediaList: formatMediaList(mediaList),
            type: mediaList.length ? 2 : 0,
          },
        },
        GetCommentSchema,
      )
    ).comment;

  public follow = async (userId: string): Promise<BasicResponse> =>
    await this.httptoolkit.post<BasicResponse>(
      {
        path: `${this.endpoint}/user-profile/${userId}/member`,
        body: {},
      },
      BasicResponseSchema,
    );

  public unfollow = async (userId: string): Promise<BasicResponse> =>
    await this.httptoolkit.delete<BasicResponse>(
      {
        path: `${this.endpoint}/user-profile/${userId}/member`,
      },
      BasicResponseSchema,
    );
}
