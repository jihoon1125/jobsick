import { http, HttpResponse } from "msw";

const handlers = [
  http.post("/api/analyze", () => {
    return HttpResponse.json({
      message: "mock analysis result",
    });
  }),

  http.post("/api/crawl", () => {
    return HttpResponse.json({
      message: "mock crawl result",
    });
  }),
];

export { handlers };
