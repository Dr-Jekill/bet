import React, { useState } from 'react';
import type { PeriodOdds, BasketballOdds, BaseballOdds, FootballOdds } from '../types';

interface OddsFormProps {
  sport: 'basketball' | 'baseball' | 'football';
  onSubmit: (odds: BasketballOdds | BaseballOdds | FootballOdds) => void;
}

const defaultPeriodOdds: PeriodOdds = {
  team: 'home',
  odds: 1.9,
  overUnderValue: 0
};

const OddsForm: React.FC<OddsFormProps> = ({ sport, onSubmit }) => {
  const [odds, setOdds] = useState<BasketballOdds | BaseballOdds | FootballOdds>(() => {
    if (sport === 'basketball') {
      return {
        fullGame: { ...defaultPeriodOdds },
        firstHalf: { ...defaultPeriodOdds },
        firstQuarter: { ...defaultPeriodOdds }
      } as BasketballOdds;
    } else if (sport === 'baseball') {
      return {
        fullGame: { ...defaultPeriodOdds },
        fifthInning: { ...defaultPeriodOdds }
      } as BaseballOdds;
    } else {
      return {
        fullGame: { ...defaultPeriodOdds },
        firstHalf: { ...defaultPeriodOdds }
      } as FootballOdds;
    }
  });

  const handlePeriodOddsChange = (
    period: string,
    field: keyof PeriodOdds,
    value: any
  ) => {
    setOdds(prevOdds => {
      const newOdds = { ...prevOdds };
      (newOdds as any)[period][field] = value;
      return newOdds;
    });
  };

  const renderPeriodOddsInputs = (period: string, periodLabel: string) => {
    const periodOdds = (odds as any)[period];

    return (
      <div key={period} className="border rounded-lg p-4 mb-4">
        <h3 className="font-medium mb-3">{periodLabel}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipo con Odd</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="home"
                  checked={periodOdds.team === 'home'}
                  onChange={(e) => handlePeriodOddsChange(period, 'team', e.target.value)}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Local</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="away"
                  checked={periodOdds.team === 'away'}
                  onChange={(e) => handlePeriodOddsChange(period, 'team', e.target.value)}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Visitante</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Odd</label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={periodOdds.odds}
              onChange={(e) => handlePeriodOddsChange(period, 'odds', parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valor Over/Under</label>
            <input
              type="number"
              step="0.5"
              value={periodOdds.overUnderValue}
              onChange={(e) => handlePeriodOddsChange(period, 'overUnderValue', parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(odds);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {renderPeriodOddsInputs('fullGame', 'Juego Completo')}
        
        {sport === 'basketball' && (
          <>
            {renderPeriodOddsInputs('firstHalf', 'Medio Tiempo')}
            {renderPeriodOddsInputs('firstQuarter', 'Primer Cuarto')}
          </>
        )}

        {sport === 'baseball' && (
          <>
            {renderPeriodOddsInputs('fifthInning', '5to Inning')}
          </>
        )}

        {sport === 'football' && (
          <>
            {renderPeriodOddsInputs('firstHalf', 'Primer Tiempo (45 min)')}
          </>
        )}
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Establecer Odds
        </button>
      </div>
    </form>
  );
};

export default OddsForm;