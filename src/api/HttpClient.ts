type Options = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: string | FormData;
  isFormData?: boolean;
  signal?: AbortSignal;
  skipToast?: boolean;
};

class HttpClient {
  domain: string;
  constructor(domain: string) {
    this.domain = domain;
  }
  private query = async (url: string, options?: Options) => {
    const { headers: _headers, ...restOptions } = options ?? {};
    const headers: Record<string, string> = {
      ..._headers,
    };

    if (!options?.isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    let res: Response;

    try {
      res = await fetch(`${this.domain}${url}`, {
        method: options?.method ?? "GET",
        headers,
        ...restOptions,
      });
    } catch (err) {
      throw new Error(`Network error: ${(err as Error).message}`);
    }

    // Handle empty body responses correctly
    if (res.status === 204 || res.status === 205) {
      if (!res.ok) throw new Error("Request failed");
      return null;
    }

    const contentType = res.headers.get("content-type") ?? "";
    const text = await res.text();

    if (!text) {
      if (!res.ok) throw new Error("Request failed");
      return null;
    }

    let data: any;
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response");
      }
    } else {
      data = text; // fallback for plain text/html
    }

    if (!res.ok) {
      throw new Error(data?.message || data?.error?.issues?.[0]?.message || `HTTP ${res.status} ${res.statusText}`);
    }

    return data;
  };
  get = async <T>(path: string, options?: Options) => {
    const response = await this.query(path, options);
    return response as T;
  };
  post = async <T>(path: string, body?: unknown, config?: Options) => {
    const options: Options = {
      method: "POST",
      ...config,
    };
    if (body) {
      if (config?.isFormData && body instanceof FormData) {
        options.body = body;
      } else {
        options.body = JSON.stringify(body);
      }
    }
    const response = await this.query(path, options);
    return response as T;
  };
}
export default HttpClient;
