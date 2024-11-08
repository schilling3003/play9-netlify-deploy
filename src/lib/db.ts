import Dexie, { Table } from 'dexie';

interface PlayerFact {
  id?: number;
  playerName: string;
  fact: string;
  createdAt: Date;
}

class GolfGameDatabase extends Dexie {
  playerFacts!: Table<PlayerFact>;

  constructor() {
    super('GolfGameDatabase');
    this.version(1).stores({
      playerFacts: '++id, playerName, createdAt'
    });
  }
}

const db = new GolfGameDatabase();

export const savePlayerFact = async (fact: { playerName: string; fact: string }): Promise<PlayerFact> => {
  try {
    const newFact = {
      playerName: fact.playerName.trim(),
      fact: fact.fact.trim(),
      createdAt: new Date()
    };
    const id = await db.playerFacts.add(newFact) as number;
    return { ...newFact, id };
  } catch (error) {
    console.error('Error saving player fact:', error);
    throw error;
  }
};

export const getPlayerFacts = async (): Promise<PlayerFact[]> => {
  try {
    return await db.playerFacts.orderBy('createdAt').reverse().toArray();
  } catch (error) {
    console.error('Error loading player facts:', error);
    return [];
  }
};

export const deletePlayerFact = async (playerName: string): Promise<void> => {
  try {
    await db.playerFacts.where('playerName').equals(playerName).delete();
  } catch (error) {
    console.error('Error deleting player fact:', error);
    throw error;
  }
};

export const updatePlayerFact = async (id: number, playerName: string, fact: string): Promise<void> => {
  try {
    await db.playerFacts.update(id, {
      playerName: playerName.trim(),
      fact: fact.trim()
    });
  } catch (error) {
    console.error('Error updating player fact:', error);
    throw error;
  }
};

export type { PlayerFact };
