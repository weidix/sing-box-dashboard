import { createClient, type Client } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";

import { ManagerService, type BackendList } from "../gen/manager/v1/manager_pb";

export interface Backend {
  id: string;
  name: string;
}

export interface BackendsSnapshot {
  backends: Backend[];
  selectedId: string;
}

export const managerClient: Client<typeof ManagerService> = createClient(
  ManagerService,
  createGrpcWebTransport({ baseUrl: "" }),
);

export function snapshotFromList(list: BackendList): BackendsSnapshot {
  return {
    backends: list.backends.map((backend) => ({ id: backend.id, name: backend.name })),
    selectedId: list.selectedBackendId,
  };
}

export async function listBackends(signal?: AbortSignal): Promise<BackendsSnapshot> {
  return snapshotFromList(await managerClient.listBackends({}, { signal }));
}

export async function selectBackend(id: string): Promise<void> {
  await managerClient.selectBackend({ backendId: id });
}
