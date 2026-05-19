import { HttpToolKit } from '../core/httptoolkit';
import { Community } from '../schemas/astranet/community';
import { GetCommunities, GetCommunitiesSchema } from '../schemas/responses';
import { Segment, Sizing } from '../schemas/usable';

export class NdcService {
  private httptoolkit: HttpToolKit;
  private endpoint: string;
  private ndcId?: number;

  constructor(httptoolkit: HttpToolKit, ndcId?: number) {
    this.httptoolkit = httptoolkit;
    this.endpoint = `/g/s-x${ndcId}`;
    this.ndcId = ndcId;
  }

  private getCommunities = async (path: string): Promise<Community[]> =>
    (
      await this.httptoolkit.get<GetCommunities>(
        {
          path,
        },
        GetCommunitiesSchema,
      )
    ).communityList;

  public many = async (
    sizing: Sizing = { start: 0, size: 25 },
  ): Promise<Community[]> =>
    await this.getCommunities(
      `/g/s/community/joined?start=${sizing.start}&size=${sizing.size}`,
    );

  public featured = async (segment: Segment): Promise<Community[]> =>
    await this.getCommunities(`/g/s/community/featured?segment=${segment}`);
}
