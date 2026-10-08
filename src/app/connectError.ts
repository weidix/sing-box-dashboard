import { isOpaqueNetworkError, isUnknownServiceError } from "../lib/connectivity";
import { useI18n } from "./i18n";

export function useDiagnosedConnectError(message: string | null): string | null {
  const { t } = useI18n();
  if (message === null) {
    return null;
  }
  if (isUnknownServiceError(message)) {
    return `${message} — ${t("This is not a sing-box API service, or the path is incorrect.")}`;
  }
  if (isOpaqueNetworkError(message)) {
    return `${message} — ${t("The sing-box manager is unreachable; check that it is running and that this page is served by it.")}`;
  }
  return message;
}
