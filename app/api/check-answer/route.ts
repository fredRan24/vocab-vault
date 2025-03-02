import { NextResponse } from 'next/server';

let incorrectBuffer: { languageA: string; languageB: string }[] = [];
let correctCount = 0;

export async function POST(req: Request) {
  try {
    const { word, answer, correctWord } = await req.json();

    if (!word || !answer || !correctWord) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const isCorrect = answer.trim().toLowerCase() === correctWord.trim().toLowerCase();

    if (isCorrect) {
      correctCount += 1;

      incorrectBuffer = incorrectBuffer.filter((entry) => entry.languageA !== word);

      return NextResponse.json({
        result: 'correct',
        message: '✅ Correct!',
        nextWord: getNextWord(word),
      });
    } else {
      correctCount = 0;
      incorrectBuffer.push({ languageA: word, languageB: correctWord });

      return NextResponse.json({
        result: 'incorrect',
        message: `❌ Wrong! Correct answer: ${correctWord}`,
        nextWord: getNextWord(word),
      });
    }
  } catch (error) {
    console.error('Error processing answer:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

function getNextWord(currentWord: string) {
  if (incorrectBuffer.length > 0 && correctCount >= 2) {
    return incorrectBuffer[0].languageA;
  }
  return null;
}
