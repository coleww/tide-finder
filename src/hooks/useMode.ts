import { useState, useCallback } from 'react';
import { getQueryParam, MODE_QP, updateQueryParam } from '../utils/query';

export const modes: Record<string, string> = {
  dtlt: 'dtlt',
  fmlt: 'fmlt',
};

export type Mode = (typeof modes)[keyof typeof modes];

const modeStrings: Record<Mode, string> = {
  dtlt: 'Day Time Low Tide Finder',
  fmlt: 'Full Moon Low Tide Finder',
};

export function useMode() {
  const [mode, setMode] = useState<Mode>(
    modes[getQueryParam(MODE_QP)] || modes.dtlt
  );

  const toggleMode = useCallback(() => {
    const newMode = mode === modes.dtlt ? modes.fmlt : modes.dtlt;
    setMode(newMode);
    updateQueryParam(MODE_QP, newMode)
  }, [mode]);

  const title = modeStrings[mode];

  return {
    mode,
    title,
    toggleMode,
  };
}
