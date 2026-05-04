import { HttpToolKit } from '../core/httptoolkit';
import { Community } from '../schemas/astranet/community';
import { GetCommunities, GetCommunitiesSchema } from '../schemas/responses';
import { Sizing } from '../schemas/usable';

export class NdcService {
  private httptoolkit: HttpToolKit;
  private endpoint: string;
  private ndcId?: number;

  constructor(httptoolkit: HttpToolKit, ndcId?: number) {
    this.httptoolkit = httptoolkit;
    this.endpoint = `/g/s-x${ndcId}`;
    this.ndcId = ndcId;
  }

  public many = async (
    sizing: Sizing = { start: 0, size: 25 },
  ): Promise<Community[]> =>
    (
      await this.httptoolkit.get<GetCommunities>(
        {
          path: `/g/s/community/joined?start=${sizing.start}&size=${sizing.size}`,
        },
        GetCommunitiesSchema,
      )
    ).communityList;
}
