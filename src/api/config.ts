export interface Server {
  id: string;
  name: string;
}

export interface ServersState {
  servers: Server[];
  activeId: string | null;
}

export function serverDisplayName(server: Server): string {
  return server.name.trim() !== "" ? server.name : server.id;
}
