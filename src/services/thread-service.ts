import { HttpToolKit } from '../core/httptoolkit';
import {
  Message,
  SendMessageBuilder,
  ShortProfile,
  Sizing,
  Thread,
} from '../schemas';
import {
  GetMembers,
  GetMembersSchema,
  GetMessage,
  GetMessages,
  GetMessageSchema,
  GetMessagesSchema,
  GetThread,
  GetThreads,
  GetThreadSchema,
  GetThreadsSchema,
} from '../schemas/responses';

export class ThreadService {
  private httptoolkit: HttpToolKit;
  private endpoint: string = '/g/s';
  private ndcId?: number;

  constructor(httptoolkit: HttpToolKit, ndcId?: number) {
    this.httptoolkit = httptoolkit;
    this.ndcId = ndcId;
    if (ndcId) this.endpoint = `/x${ndcId}/s`;
  }

  private sendMessage = async (
    builder: SendMessageBuilder,
  ): Promise<Message> => {
    const { threadId, ...body } = builder;

    return (
      await this.httptoolkit.post<GetMessage>(
        {
          path: `${this.endpoint}/chat/thread/${threadId}/message`,
          body,
        },
        GetMessageSchema,
      )
    ).message;
  };

  public get = async (threadId: string): Promise<Thread> =>
    (
      await this.httptoolkit.get<GetThread>(
        { path: `${this.endpoint}/chat/thread/${threadId}` },
        GetThreadSchema,
      )
    ).thread;

  public joined = async (
    sizing: Sizing = { start: 0, size: 50 },
  ): Promise<Thread[]> =>
    (
      await this.httptoolkit.get<GetThreads>(
        {
          path: `${this.endpoint}/chat/thread?type=joined-me&start=${sizing.start}&size=${sizing.size}`,
        },
        GetThreadsSchema,
      )
    ).threadList;

  public messages = async (
    threadId: string,
    sizing: Sizing = { start: 0, size: 25 },
  ): Promise<Message[]> =>
    (
      await this.httptoolkit.get<GetMessages>(
        {
          path: `${this.endpoint}/chat/thread/${threadId}/message?v=2&pagingType=t&start=${sizing.start}&size=${sizing.size}`,
        },
        GetMessagesSchema,
      )
    ).messageList;

  public members = async (
    threadId: string,
    sizing: Sizing = { start: 0, size: 200 },
  ): Promise<ShortProfile[]> =>
    (
      await this.httptoolkit.get<GetMembers>(
        {
          path: `${this.endpoint}/chat/thread/${threadId}/member?start=${sizing.start}&size=${sizing.size}`,
        },
        GetMembersSchema,
      )
    ).memberList;

  public text = async (
    threadId: string,
    content: string,
    type: number = 0,
    replyMessageId?: string,
  ): Promise<Message> =>
    await this.sendMessage({ threadId, content, type, replyMessageId });

  public image = async (
    threadId: string,
    mediaValue: string,
    replyMessageId?: string,
  ): Promise<Message> =>
    await this.sendMessage({
      threadId,
      mediaValue,
      type: 0,
      replyMessageId,
      content: '',
    });
}
