class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

class CrawlError extends AppError {
  constructor(message: string) {
    super(message, "CRAWL_ERROR", 502);
    this.name = "CrawlError";
  }
}

class AnalyzeError extends AppError {
  constructor(message: string) {
    super(message, "ANALYZE_ERROR", 500);
    this.name = "AnalyzeError";
  }
}

class AuthError extends AppError {
  constructor(message: string) {
    super(message, "AUTH_ERROR", 401);
    this.name = "AuthError";
  }
}

export { AppError, CrawlError, AnalyzeError, AuthError };
