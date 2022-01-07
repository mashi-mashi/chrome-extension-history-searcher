import React from 'react';

export const Spacer = ({
  size,
  axis,
  style = {},
  ...delegated
}: {
  size: number;
  axis?: 'vertical' | 'horizontal';
  style?: any;
}) => {
  const width = axis === 'vertical' ? 1 : size;
  const height = axis === 'horizontal' ? 1 : size;
  return (
    <span
      style={{
        display: 'block',
        width,
        minWidth: width,
        height,
        minHeight: height,
        ...style,
      }}
      {...delegated}
    />
  );
};
