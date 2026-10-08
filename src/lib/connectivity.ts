export function isOpaqueNetworkError(message: string): boolean {
  return (
    message.includes("Failed to fetch") || // Chromium
    message.includes("Load failed") || // WebKit
    message.includes("NetworkError when attempting to fetch resource") // Firefox
  );
}

export function isUnknownServiceError(message: string): boolean {
  return message.includes("unimplemented") && message.includes("StartedService");
}
