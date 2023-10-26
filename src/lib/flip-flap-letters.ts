export const numbers = Array.from({ length: 10 }, (_, i) => i.toString());
// create alphabet using unicode
export const alphabet = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i),
);
export const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

export const space = [' '];
interface CreateLettersProps {
  includeNumbers?: boolean;
  includeAlphabet?: boolean;
  includeAlphabetLower?: boolean;
  includeSymbols?: boolean;
  includeSpace?: boolean;
}
export const createLetters = (
  {
    includeNumbers,
    includeAlphabet,
    includeSymbols,
    includeSpace,
  }: CreateLettersProps = {
    includeNumbers: true,
    includeAlphabet: true,
    includeAlphabetLower: true,
    includeSymbols: true,
    includeSpace: true,
  },
) => {
  const letters: string[] = [];
  if (includeNumbers) {
    letters.push(...numbers);
  }
  if (includeAlphabet) {
    letters.push(...alphabet);
  }
  if (includeSymbols) {
    letters.push(...symbols);
  }
  if (includeSpace) {
    letters.push(...space);
  }
  if (includeAlphabet) {
    letters.push(...alphabet.map((letter) => letter.toLowerCase()));
  }

  return letters;
};
