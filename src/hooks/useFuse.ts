import Fuse from 'fuse.js';
import * as React from 'react';

export const useFuse = <T>(options: Fuse.IFuseOptions<T> = { includeScore: true }) => {
  const [list, setList] = React.useState<T[]>([]);

  const search = React.useCallback(
    (text: string) => {
      return new Fuse(list, options).search(text);
    },
    [list, options],
  );

  return { search, setList };
};
