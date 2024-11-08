import React, { useState } from 'react';
import { Save, Settings, Trash2 } from 'lucide-react';
import { useGamePersistence } from '../hooks/useGamePersistence';
import { PlayerFact } from '../types';

export const PlayerFacts: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [fact, setFact] = useState('');
  const { playerFacts, addPlayerFact, removePlayerFact } = useGamePersistence();
  const [editingFact, setEditingFact] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !fact.trim()) return;

    try {
      await addPlayerFact(playerName, fact);
      setPlayerName('');
      setFact('');
      setEditingFact(null);
    } catch (error) {
      console.error('Error saving player fact:', error);
    }
  };

  const handleEdit = (fact: PlayerFact) => {
    setEditingFact(fact.playerName);
    setPlayerName(fact.playerName);
    setFact(fact.fact);
  };

  const handleDelete = async (playerName: string) => {
    try {
      await removePlayerFact(playerName);
    } catch (error) {
      console.error('Error deleting player fact:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Player Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="input-golf"
            placeholder="Enter player name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Player Fact
          </label>
          <textarea
            value={fact}
            onChange={(e) => setFact(e.target.value)}
            className="input-golf min-h-[100px]"
            placeholder="Enter a funny or embarrassing fact about the player"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          <Save className="h-5 w-5" />
          {editingFact ? 'Update Fact' : 'Save Fact'}
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text">Saved Facts</h3>
        {playerFacts.map((fact) => (
          <div
            key={fact.playerName}
            className="p-4 bg-gray-50 rounded-lg space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-text">{fact.playerName}</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(fact)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <Settings className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(fact.playerName)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
            <p className="text-text-secondary">{fact.fact}</p>
            {fact.createdAt && (
              <p className="text-xs text-gray-400">
                Added: {fact.createdAt.toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
