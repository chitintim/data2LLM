/**
 * Test helper to visualize what the parser receives
 */
export function debugTSVInput(input: string): void {
  console.group('TSV Debug Info');
  console.log('Raw input length:', input.length);
  console.log('Has quotes:', input.includes('"'));
  console.log('Has tabs:', input.includes('\t'));
  console.log('First 200 chars:', input.substring(0, 200));
  console.log('Char codes (first 100):',
    input.substring(0, 100).split('').map((c, i) =>
      `${i}:${c}(${c.charCodeAt(0)})`
    ).join(' ')
  );
  console.groupEnd();
}

// Quick test of the parser with a known multi-line example
export function testMultiLineCell() {
  // This is what Excel SHOULD produce for a multi-line cell
  const testInput = 'Header1\tHeader2\nValue1\t"Line1\nLine2\nLine3"\nValue3\tValue4';

  console.log('Testing multi-line cell parsing:');
  console.log('Input:', testInput);

  import('./parseTSV').then(({ parseTSV }) => {
    const result = parseTSV(testInput);
    console.log('Parsed result:', result);
    console.log('Expected 3 rows, got:', result.length);
    console.log('Row 2, Col 2 should have line breaks:', result[1]?.[1]);
  });
}
