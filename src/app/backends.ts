import { useCallback, useEffect, useState } from "react";

import {
  managerClient,
  selectBackend,
  snapshotFromList,
  type Backend,
} from "../api/manager";
import { showError } from "./errorStore";

export interface BackendsState {
  phase: "loading" | "ready" | "error";
  backends: Backend[];
  selectedId: string | null;
  error?: string;
}

const LOADING: BackendsState = { phase: "loading", backends: [], selectedId: null };

export function useBackends() {
  const [state, setState] = useState<BackendsState>(LOADING);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let stale = false;
    const fail = (message: string) => {
      setState((current) =>
        current.phase === "loading" ? { ...LOADING, phase: "error", error: message } : current,
      );
    };
    const run = async () => {
      try {
        for await (const list of managerClient.subscribeBackends(
          {},
          { signal: controller.signal },
        )) {
          if (stale) {
            return;
          }
          setState(() => ({ phase: "ready", ...snapshotFromList(list) }));
        }
        if (!stale) {
          fail("the backend list stream ended");
        }
      } catch (error) {
        if (!stale) {
          fail(error instanceof Error ? error.message : String(error));
        }
      }
    };
    void run();
    return () => {
      stale = true;
      controller.abort();
    };
  }, [generation]);

  const select = useCallback((id: string) => {
    if (id === "") {
      return;
    }
    void selectBackend(id).catch(showError);
  }, []);

  const retry = useCallback(() => {
    setState(LOADING);
    setGeneration((value) => value + 1);
  }, []);

  return { state, select, retry };
}
