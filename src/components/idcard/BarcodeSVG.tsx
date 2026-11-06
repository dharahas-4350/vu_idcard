import React from 'react';

// Code 128B patterns (each character encoded as 6 alternating bars/spaces, summing to 11 units)
const CODE128_PATTERNS = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112' // 106 = Stop
];

// Start Code B pattern index is 104
const START_B_INDEX = 104;
const STOP_INDEX = 106;

export const BarcodeSVG: React.FC<{ value: string; height?: number; className?: string }> = ({
  value,
  height = 42,
  className = '',
}) => {
  const cleanValue = (value || '0000000000').toUpperCase().trim();

  // Encode using Code 128 Subset B
  const patternIndices: number[] = [START_B_INDEX];
  let checksum = START_B_INDEX;

  for (let i = 0; i < cleanValue.length; i++) {
    const code = cleanValue.charCodeAt(i) - 32;
    const validCode = code >= 0 && code <= 95 ? code : 0;
    patternIndices.push(validCode);
    checksum += validCode * (i + 1);
  }

  const checksumIndex = checksum % 103;
  patternIndices.push(checksumIndex);
  patternIndices.push(STOP_INDEX);

  // Convert pattern strings into bar rectangles
  let totalWidth = 0;
  const bars: { x: number; width: number }[] = [];

  for (const idx of patternIndices) {
    const pattern = CODE128_PATTERNS[idx] || CODE128_PATTERNS[0];
    let isBar = true;
    for (let j = 0; j < pattern.length; j++) {
      const w = parseInt(pattern[j], 10);
      if (isBar) {
        bars.push({ x: totalWidth, width: w });
      }
      totalWidth += w;
      isBar = !isBar;
    }
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="w-full h-auto max-w-[260px]"
        style={{ height: `${height}px` }}
        preserveAspectRatio="none"
      >
        {bars.map((bar, i) => (
          <rect key={i} x={bar.x} y={0} width={bar.width} height={height} fill="#111827" />
        ))}
      </svg>
      <span className="text-[12px] font-mono font-bold tracking-widest text-slate-900 mt-0.5">
        {cleanValue}
      </span>
    </div>
  );
};
