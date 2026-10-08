import { useDiagnosedConnectError } from "../app/connectError";
import { useI18n } from "../app/i18n";
import { Icon } from "../components/Icon";
import { Brand, Button, Spinner } from "../components/ui";
import styles from "./ConnectionErrorView.module.css";

export function ConnectionErrorView(props: {
  error: string;
  reconnecting: boolean;
  onRetry: () => void;
}) {
  const { t } = useI18n();
  const errorDetail = useDiagnosedConnectError(props.error);

  return (
    <div className="setup">
      <div className="setup-panel">
        <Brand />
        <div className={styles.connectionErrorHeader}>
          <span className={styles.connectionErrorIcon}>
            <Icon name="cloud_off" size={22} />
          </span>
          <div>
            <h1>{t("Connection failed")}</h1>
            <div className={styles.connectionErrorServer}>{location.host}</div>
          </div>
        </div>
        <div className="banner error">
          <Icon name="warning_amber" />
          <div>{errorDetail}</div>
        </div>
        <div className="row-actions" style={{ marginTop: 14 }}>
          <Button variant="primary" disabled={props.reconnecting} onClick={props.onRetry}>
            {props.reconnecting && <Spinner />}
            {props.reconnecting ? t("Reconnecting...") : t("Retry")}
          </Button>
        </div>
      </div>
    </div>
  );
}
