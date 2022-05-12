import Fuse from 'fuse.js';
import * as React from 'react';

export const useFuse = <T>(
  origin: T[],
  options: Fuse.IFuseOptions<T> = { includeScore: true },
): {
  search: (text: string, searchOptions?: Fuse.FuseSearchOptions) => Fuse.FuseResult<T>[];
} => {
  const fuse = React.useMemo(() => new Fuse(origin, options), [options, origin]);

  const search = React.useCallback(
    (text: string, searchOptions: Fuse.FuseSearchOptions = { limit: 10 }) => {
      return fuse.search<T>(text, searchOptions);
    },
    [fuse],
  );

  return { search };
};
