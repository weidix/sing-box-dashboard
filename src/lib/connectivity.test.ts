import { describe, expect, it } from "vitest";

import { isOpaqueNetworkError, isUnknownServiceError } from "./connectivity";

describe("isOpaqueNetworkError", () => {
  it("matches the per-engine wordings", () => {
    expect(isOpaqueNetworkError("Failed to fetch")).toBe(true);
    expect(isOpaqueNetworkError("Load failed")).toBe(true);
    expect(isOpaqueNetworkError("NetworkError when attempting to fetch resource.")).toBe(true);
  });

  it("passes daemon errors through", () => {
    expect(isOpaqueNetworkError("bad secret")).toBe(false);
    expect(isOpaqueNetworkError("Stream ended without a status message")).toBe(false);
  });
});

describe("isUnknownServiceError", () => {
  it("matches a gRPC unimplemented for the daemon service", () => {
    expect(isUnknownServiceError("[unimplemented] unknown service daemon.StartedService")).toBe(
      true,
    );
    expect(
      isUnknownServiceError("[unimplemented] unknown service some/prefix/daemon.StartedService"),
    ).toBe(true);
  });

  it("ignores other errors", () => {
    expect(isUnknownServiceError("[unauthenticated] bad secret")).toBe(false);
    expect(isUnknownServiceError("Failed to fetch")).toBe(false);
    expect(isUnknownServiceError("[unimplemented] unknown method GetVersion")).toBe(false);
  });
});
