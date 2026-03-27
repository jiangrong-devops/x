import type { AnyObject } from "../_util/types";
import type { MessageInfo, SimpleType } from "../x-chat";
import type {
  JSONOutPut,
  SSEOutput,
  XReadableStream,
  XStreamOptions,
} from "../x-stream";
import type { XFetchMiddlewares } from "./x-fetch";

import XStream from "../x-stream";
import xFetch from "./x-fetch";

export interface XRequestCallbacks<
  Output,
  ChatMessage extends SimpleType = any,
> {
  onSuccess: (
    chunks: Output[],
    responseHeaders: Headers,
    chatMessage?: MessageInfo<ChatMessage>,
  ) => void;

  onError: (
    error: Error,
    errorInfo?: any,
    responseHeaders?: Headers,
    fallbackMsg?: MessageInfo<ChatMessage>,
  ) => void;

  onUpdate?: (
    chunk: Output,
    responseHeaders: Headers,
    chatMessage?: MessageInfo<ChatMessage>,
  ) => void;
}

export interface XRequestOptions<
  Input = AnyObject,
  Output = SSEOutput,
  ChatMessage extends SimpleType = any,
> extends RequestInit {
  callbacks?: XRequestCallbacks<Output, ChatMessage>;
  params?: Partial<Input>;
  headers?: Record<string, string>;
  timeout?: number;
  streamTimeout?: number;
  fetch?: (
    baseURL: Parameters<typeof fetch>[0],
    options: XRequestOptions<Input, Output>,
  ) => Promise<Response>;
  middlewares?: XFetchMiddlewares<Input, Output>;
  transformStream?:
    | XStreamOptions<Output>["transformStream"]
    | ((
        baseURL: string,
        responseHeaders: Headers,
      ) => XStreamOptions<Output>["transformStream"]);
  streamSeparator?: string;
  partSeparator?: string;
  kvSeparator?: string;
  manual?: boolean;
  retryInterval?: number;
  retryTimes?: number;
}

export type XRequestGlobalOptions<Input, Output> = Pick<
  XRequestOptions<Input, Output>,
  | "headers"
  | "timeout"
  | "streamTimeout"
  | "middlewares"
  | "fetch"
  | "transformStream"
  | "manual"
>;

export type XRequestFunction<Input = AnyObject, Output = SSEOutput> = (
  baseURL: string,
  options?: XRequestOptions<Input, Output>,
) => XRequestClass<Input, Output>;

const globalOptions: XRequestGlobalOptions<AnyObject, AnyObject> = {
  manual: false,
  headers: {
    "Content-Type": "application/json",
  },
};

export function setXRequestGlobalOptions<Input, Output>(
  options: XRequestGlobalOptions<Input, Output>,
) {
  Object.assign(globalOptions, options);
}

const LastEventId = "Last-Event-ID";

export abstract class AbstractXRequestClass<
  Input,
  Output,
  ChatMessage extends SimpleType = any,
> {
  baseURL!: string;
  options!: XRequestOptions<Input, Output, ChatMessage>;

  constructor(
    baseURL: string,
    options?: XRequestOptions<Input, Output, ChatMessage>,
  ) {
    if (!baseURL || typeof baseURL !== "string")
      throw new Error("The baseURL is not valid!");
    this.baseURL = baseURL;
    this.options = options || {};
  }

  abstract get asyncHandler(): Promise<any>;
  abstract get isTimeout(): boolean;
  abstract get isStreamTimeout(): boolean;
  abstract get isRequesting(): boolean;
  abstract get manual(): boolean;

  abstract run(params?: Input): void;
  abstract abort(): void;
}

export class XRequestClass<
  Input = AnyObject,
  Output = SSEOutput,
  ChatMessage extends SimpleType = any,
> extends AbstractXRequestClass<Input, Output, ChatMessage> {
  private _asyncHandler!: Promise<any>;

  private timeoutHandler!: number;
  private _isTimeout = false;
  private streamTimeoutHandler!: number;
  private _isStreamTimeout = false;
  private abortController!: AbortController;
  private _isRequesting = false;
  private _manual = false;
  private lastManualParams?: Partial<Input>;
  private retryTimes = 0;
  private retryTimer!: ReturnType<typeof setTimeout>;
  private lastEventId = undefined;

  public get asyncHandler() {
    return this._asyncHandler;
  }

  public get isTimeout() {
    return this._isTimeout;
  }

  private set isTimeout(value: boolean) {
    this._isTimeout = value;
  }

  public get isStreamTimeout() {
    return this._isStreamTimeout;
  }

  private set isStreamTimeout(value: boolean) {
    this._isStreamTimeout = value;
  }

  public get isRequesting() {
    return this._isRequesting;
  }

  public get manual() {
    return this._manual;
  }

  constructor(
    baseURL: string,
    options?: XRequestOptions<Input, Output, ChatMessage>,
  ) {
    super(baseURL, options);
    this._manual = options?.manual || false;
    if (!this.manual) {
      this.init();
    }
  }

  public run(params?: Input) {
    if (this.manual) {
      this.resetRetry();
      this.lastManualParams = params;
      this.init(params);
      return true;
    }
    console.warn("The request is not manual, so it cannot be run!");
    return false;
  }

  public abort() {
    clearTimeout(this.timeoutHandler);
    clearTimeout(this.streamTimeoutHandler);
    this.abortController.abort();
  }

  private init(
    extraParams?: Partial<Input>,
    extraHeaders?: Record<string, string>,
  ) {
    this.abortController = new AbortController();
    const {
      callbacks,
      params,
      headers = {},
      transformStream,
      fetch,
      timeout,
      streamTimeout,
      middlewares,
      streamSeparator,
      partSeparator,
      kvSeparator,
      ...otherOptions
    } = this.options;
    const margeHeaders = Object.assign(
      {},
      globalOptions.headers || {},
      headers,
      extraHeaders || {},
    );
    const requestInit: XRequestOptions<Input, Output> = {
      ...otherOptions,
      method: "POST",
      body: JSON.stringify({
        ...params,
        ...extraParams,
      }),
      params: {
        ...params,
        ...extraParams,
      } as Input,
      headers: margeHeaders,
      signal: this.abortController.signal,
      middlewares,
    };
    if (timeout && timeout > 0) {
      this.timeoutHandler = window.setTimeout(() => {
        this.isTimeout = true;
        this.finishRequest();
        callbacks?.onError?.(new Error("TimeoutError"));
      }, timeout);
    }
    this.startRequest();
    this._asyncHandler = xFetch<Input, Output>(this.baseURL, {
      fetch,
      ...requestInit,
    })
      .then(async response => {
        clearTimeout(this.timeoutHandler);

        if (this.isTimeout) return;

        if (transformStream) {
          let transformer =
            transformStream as XStreamOptions<Output>["transformStream"];
          if (typeof transformStream === "function") {
            transformer = transformStream(this.baseURL, response.headers);
          }
          await this.customResponseHandler<Output, ChatMessage>(
            response,
            callbacks,
            transformer,
            streamTimeout,
            streamSeparator,
            partSeparator,
            kvSeparator,
          );
          return;
        }
        const contentType = response.headers.get("content-type") || "";
        const mimeType = contentType.split(";")[0].trim();
        switch (mimeType) {
          case "text/event-stream":
            await this.sseResponseHandler<Output, ChatMessage>(
              response,
              callbacks,
              streamTimeout,
              streamSeparator,
              partSeparator,
              kvSeparator,
            );
            break;
          case "application/json":
            await this.jsonResponseHandler<Output, ChatMessage>(
              response,
              callbacks,
            );
            break;
          default:
            throw new Error(
              `The response content-type: ${contentType} is not support!`,
            );
        }
      })
      .catch(error => {
        clearTimeout(this.timeoutHandler);
        this.finishRequest();
        const err =
          error instanceof Error || error instanceof DOMException
            ? error
            : new Error("Unknown error!");
        const returnOfOnError = callbacks?.onError?.(err);
        if (err.name !== "AbortError") {
          const retryInterval =
            typeof returnOfOnError === "number"
              ? returnOfOnError
              : this.options.retryInterval;
          if (retryInterval && retryInterval > 0) {
            if (
              typeof this.options.retryTimes === "number" &&
              this.retryTimes >= this.options.retryTimes
            ) {
              return;
            }
            clearTimeout(this.retryTimer);
            this.retryTimer = setTimeout(() => {
              const extraHeaders: Record<string, string> = {};
              if (typeof this.lastEventId !== "undefined") {
                extraHeaders[LastEventId] = this.lastEventId;
              }
              this.init(this.lastManualParams, extraHeaders);
            }, retryInterval);
            this.retryTimes = this.retryTimes + 1;
          }
        }
      });
  }

  private startRequest() {
    this._isRequesting = true;
  }

  private finishRequest() {
    this._isRequesting = false;
  }

  private customResponseHandler = async <
    Output = SSEOutput,
    ChatMessage extends SimpleType = any,
  >(
    response: Response,
    callbacks?: XRequestCallbacks<Output, ChatMessage>,
    transformStream?: XStreamOptions<Output>["transformStream"],
    streamTimeout?: number,
    streamSeparator?: string,
    partSeparator?: string,
    kvSeparator?: string,
  ) => {
    const stream = XStream<Output>({
      readableStream: response.body!,
      transformStream,
      streamSeparator,
      partSeparator,
      kvSeparator,
    });
    await this.processStream<Output, ChatMessage>(
      stream,
      response,
      callbacks,
      streamTimeout,
    );
  };

  private sseResponseHandler = async <
    Output = SSEOutput,
    ChatMessage extends SimpleType = string,
  >(
    response: Response,
    callbacks?: XRequestCallbacks<Output, ChatMessage>,
    streamTimeout?: number,
    streamSeparator?: string,
    partSeparator?: string,
    kvSeparator?: string,
  ) => {
    const stream = XStream<Output>({
      readableStream: response.body!,
      streamSeparator,
      partSeparator,
      kvSeparator,
    });
    await this.processStream<Output, ChatMessage>(
      stream,
      response,
      callbacks,
      streamTimeout,
    );
  };

  private async processStream<Output, ChatMessage extends SimpleType = string>(
    stream: XReadableStream<Output>,
    response: Response,
    callbacks?: XRequestCallbacks<Output, ChatMessage>,
    streamTimeout?: number,
  ) {
    const chunks: Output[] = [];
    const iterator = stream[Symbol.asyncIterator]();
    let result: IteratorResult<Output, any>;
    do {
      if (streamTimeout) {
        this.streamTimeoutHandler = window.setTimeout(() => {
          this.isStreamTimeout = true;
          this.finishRequest();
          callbacks?.onError?.(
            new Error("StreamTimeoutError"),
            undefined,
            response.headers,
          );
        }, streamTimeout);
      }

      result = await iterator.next();
      clearTimeout(this.streamTimeoutHandler);
      if (this.isStreamTimeout) {
        break;
      }

      if (result.value) {
        chunks.push(result.value);
        callbacks?.onUpdate?.(result.value, response.headers);
        if (typeof result?.value?.id !== "undefined") {
          this.lastEventId = result.value.id;
        }
      }
    } while (!result.done);
    if (streamTimeout) {
      clearTimeout(this.streamTimeoutHandler);
      if (this.isStreamTimeout) {
        this.finishRequest();
        return;
      }
    }
    this.finishRequest();
    callbacks?.onSuccess?.(chunks, response.headers);
  }

  private jsonResponseHandler = async <
    Output = JSONOutPut,
    ChatMessage extends SimpleType = string,
  >(
    response: Response,
    callbacks?: XRequestCallbacks<Output, ChatMessage>,
  ) => {
    const chunk: Output = await response.json();

    if ((chunk as JSONOutPut)?.success === false) {
      const error = new Error((chunk as JSONOutPut).message || "System error");
      error.name = (chunk as JSONOutPut).name || "SystemError";
      callbacks?.onError?.(error, chunk, response.headers);
    } else {
      callbacks?.onUpdate?.(chunk, response.headers);
      this.finishRequest();
      callbacks?.onSuccess?.([chunk], response.headers);
    }
  };

  private resetRetry() {
    clearTimeout(this.retryTimer);
    this.retryTimes = 0;
    this.lastEventId = undefined;
  }
}

function XRequest<
  Input = AnyObject,
  Output = SSEOutput,
  ChatMessage extends SimpleType = any,
>(
  baseURL: string,
  options?: XRequestOptions<Input, Output, ChatMessage>,
): AbstractXRequestClass<Input, Output, ChatMessage> {
  return new XRequestClass<Input, Output, ChatMessage>(baseURL, options);
}

export default XRequest;
