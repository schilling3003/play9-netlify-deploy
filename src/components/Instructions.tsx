import React from 'react';
import { HelpCircle } from 'lucide-react';

export const Instructions: React.FC = () => {
  return (
    <div className="relative group">
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <HelpCircle className="h-5 w-5 text-gray-500" />
      </button>
      <div className="absolute right-0 w-80 p-4 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <h4 className="font-semibold mb-2">Voice Commands</h4>
        <ul className="text-sm space-y-2 text-gray-600">
          <li>• Say player names and their scores</li>
          <li>• Example: "John scored 15, Mary got 20"</li>
          <li>• Optionally specify a hole: "Hole 3: John 15, Mary 20"</li>
          <li>• You can also say "Round" instead of "Hole"</li>
          <li>• You can list multiple players at once</li>
        </ul>
      </div>
    </div>
  );
};