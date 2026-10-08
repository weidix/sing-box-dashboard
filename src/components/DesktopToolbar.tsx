import type { ReactNode } from "react";
import { useState } from "react";

import { formatUptime } from "../api/format";
import { useStream } from "../api/stream";
import { useApi, useNow } from "../app/context";
import type { DesktopHost } from "../app/desktop";
import { useDesktopProfiles } from "../app/desktop";
import { showError } from "../app/errorStore";
import { useUnaryOnce } from "../app/hooks";
import { useI18n } from "../app/i18n";
import { ServiceStatus_Type } from "../gen/daemon/started_service_pb";
import { Icon } from "./Icon";
import { IconButton, Spinner } from "./ui";
import styles from "./DesktopToolbar.module.css";
import { cx } from "../lib/cx";

export function DesktopToolbar(props: {
  title?: ReactNode;
  titleControls?: ReactNode;
  picker?: ReactNode;
  controls?: ReactNode;
  leadRef?: (element: HTMLElement | null) => void;
  endRef?: (element: HTMLElement | null) => void;
  window?: boolean;
}) {
  return (
    <header className={cx(styles.toolbar, props.window && styles.toolbarWindow)}>
      <div className={styles.toolbarSection}>
        {props.picker}
        {props.controls}
        <div className={styles.toolbarLead} ref={props.leadRef} />
        {props.title !== undefined && <div className={styles.toolbarTitle}>{props.title}</div>}
        {props.titleControls}
      </div>
      <div className={cx(styles.toolbarSection, styles.toolbarEnd)} ref={props.endRef} />
    </header>
  );
}

export function DesktopServiceControls(props: { host: DesktopHost }) {
  const host = props.host;
  const api = useApi();
  const { t } = useI18n();
  const serviceStatus = useStream(api.serviceStatus);
  const { profiles } = useDesktopProfiles(host);
  const [busy, setBusy] = useState(false);

  const statusType = serviceStatus.data.status?.status ?? ServiceStatus_Type.IDLE;
  const started = statusType === ServiceStatus_Type.STARTED;
  const transitioning =
    statusType === ServiceStatus_Type.STARTING || statusType === ServiceStatus_Type.STOPPING;

  const run = (action: () => Promise<void>) => {
    setBusy(true);
    action()
      .catch(showError)
      .finally(() => {
        api.serviceStatus.reconnectNow();
        setBusy(false);
      });
  };

  return (
    <div className={styles.toolbarService}>
      {transitioning ? (
        <span className={styles.toolbarSpinner}>
          <Spinner />
        </span>
      ) : started ? (
        <IconButton
          className={styles.toolbarServiceButton}
          title={t("Stop")}
          disabled={busy}
          onClick={() => run(() => host.service.stop())}
        >
          <ToolbarUptime />
          <Icon name="stop" />
        </IconButton>
      ) : (
        <IconButton
          title={t("Start")}
          disabled={busy || profiles.length === 0}
          onClick={() => run(() => host.service.start())}
        >
          <Icon name="play_arrow" />
        </IconButton>
      )}
    </div>
  );
}

function ToolbarUptime() {
  const api = useApi();
  const now = useNow();
  const startedAt = useUnaryOnce(() => api.getStartedAt());

  if (startedAt === null) {
    return null;
  }
  return <span className={styles.toolbarUptime}>{formatUptime(startedAt, now)}</span>;
}
