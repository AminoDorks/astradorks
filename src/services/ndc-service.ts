import { HttpToolKit } from '../core/httptoolkit';
import { Blog, ShortProfile, Thread } from '../schemas';
import { Community } from '../schemas/astranet/community';
import {
  BasicResponse,
  BasicResponseSchema,
  GetActivity,
  GetActivitySchema,
  GetCommunities,
  GetCommunitiesSchema,
  GetCommunity,
  GetCommunitySchema,
  GetFeed,
  GetFeedSchema,
  GetThreads,
  GetThreadsSchema,
  GetUserProfiles,
  GetUserProfilesSchema,
} from '../schemas/responses';
import { MembersType, Segment, Sizing, ThreadType } from '../schemas/usable';

export class NdcService {
  private httptoolkit: HttpToolKit;
  private endpoint: string = '/g/s';
  private ndcId?: number;

  constructor(httptoolkit: HttpToolKit, ndcId?: number) {
    this.httptoolkit = httptoolkit;
    this.ndcId = ndcId;
    if (ndcId) this.endpoint = `/x${ndcId}/s`;
  }

  private joinLeaveCommunity = async (
    ndcId: number,
    action: string,
  ): Promise<BasicResponse> =>
    await this.httptoolkit.post<BasicResponse>(
      {
        path: `/x${ndcId}/s/community/${action}`,
        body: {},
      },
      BasicResponseSchema,
    );

  private getCommunities = async (path: string): Promise<Community[]> =>
    (
      await this.httptoolkit.get<GetCommunities>(
        {
          path,
        },
        GetCommunitiesSchema,
      )
    ).communityList;

  public get = async (ndcId: number): Promise<Community> =>
    (
      await this.httptoolkit.get<GetCommunity>(
        { path: `/g/s-x${ndcId}/community` },
        GetCommunitySchema,
      )
    ).community;

  public many = async (
    sizing: Sizing = { start: 0, size: 25 },
  ): Promise<Community[]> =>
    await this.getCommunities(
      `/g/s/community/joined?start=${sizing.start}&size=${sizing.size}`,
    );

  public featured = async (segment: Segment = 'en'): Promise<Community[]> =>
    await this.getCommunities(`/g/s/community/featured?segment=${segment}`);

  public join = async (ndcId: number): Promise<BasicResponse> =>
    await this.joinLeaveCommunity(ndcId, 'join');

  public leave = async (ndcId: number): Promise<BasicResponse> =>
    await this.joinLeaveCommunity(ndcId, 'leave');

  public feed = async (
    sizing: Sizing = { start: 0, size: 20 },
  ): Promise<Blog[]> =>
    (
      await this.httptoolkit.get<GetFeed>(
        {
          path: `${this.endpoint}/feed/blog-all?start=${sizing.start}&size=${sizing.size}`,
        },
        GetFeedSchema,
      )
    ).feedList.map((feed) => feed.blog);

  public threads = async (
    sizing: Sizing = { start: 0, size: 100 },
    type: ThreadType = 'public-all',
  ): Promise<Thread[]> =>
    (
      await this.httptoolkit.get<GetThreads>(
        {
          path: `${this.endpoint}/chat/thread?type=${type}&start=${sizing.start}&size=${sizing.size}`,
        },
        GetThreadsSchema,
      )
    ).threadList;

  public activity = async (limit: number = 20): Promise<GetActivity> =>
    await this.httptoolkit.get<GetActivity>(
      {
        path: `${this.endpoint}/community/online-activity?limit=${limit}`,
      },
      GetActivitySchema,
    );

  public users = async (
    sizing: Sizing = { start: 0, size: 100 },
    type: MembersType = 'members',
  ): Promise<ShortProfile[]> =>
    (
      await this.httptoolkit.get<GetUserProfiles>(
        {
          path: `${this.endpoint}/community/member?start=${sizing.start}&size=${sizing.size}&type=${type}`,
        },
        GetUserProfilesSchema,
      )
    ).userProfileList;
}
