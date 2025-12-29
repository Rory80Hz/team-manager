export interface Player {
  id: string;
  name: string;
  positionId?: string | null;
}

export interface Position {
  id: string;
  name: string;
  playerId: string | null; // ID of the player assigned to this position
  disabled?: boolean;
}

export interface TeamState {
  availablePlayers: Player[];
  positions: Position[];
}
