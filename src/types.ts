export interface Player {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  name: string;
  playerId: string | null; // ID of the player assigned to this position
}

export interface TeamState {
  availablePlayers: Player[];
  positions: Position[];
}
