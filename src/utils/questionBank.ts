// ═══════════════════════════════════════════════════
// Regrouping Question Bank — 100 Questions
// 10 worlds × 10 questions each
// ═══════════════════════════════════════════════════

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface Question {
  world: number;
  questionText: string;
  options: (string | number)[];
  correctAnswer: string | number;
  explanation: string;
}

// Generate a single addition-with-carrying question
function makeAdditionQ(difficulty: number): Omit<Question, 'world'> {
  let a: number, b: number;
  if (difficulty <= 2) {
    // 2-digit + 1-digit with carry
    a = randInt(15, 49);
    b = randInt(3, 9);
    while ((a % 10) + b <= 9) b = randInt(5, 9);
  } else if (difficulty <= 5) {
    // 2-digit + 2-digit with carry
    a = randInt(18, 69);
    b = randInt(13, 49);
    while ((a % 10) + (b % 10) <= 9) {
      b = b - (b % 10) + randInt(5, 9);
    }
  } else {
    // 3-digit + 2-digit or 3-digit
    a = randInt(125, 499);
    b = randInt(105, 399);
    while ((a % 10) + (b % 10) <= 9) {
      b = b - (b % 10) + randInt(5, 9);
    }
  }
  const answer = a + b;
  const wrong1 = answer + randInt(1, 10);
  const wrong2 = answer - randInt(1, 10);
  const wrong3 = answer + (Math.random() > 0.5 ? 10 : -10);
  const options = shuffle([answer, wrong1, wrong2, wrong3].map(String));
  return {
    questionText: `What is ${a} + ${b}?`,
    options,
    correctAnswer: String(answer),
    explanation: `${a} + ${b} = ${answer}. Remember to carry when ones add up to more than 9!`,
  };
}

// Generate a single subtraction-with-borrowing question
function makeSubtractionQ(difficulty: number): Omit<Question, 'world'> {
  let a: number, b: number;
  if (difficulty <= 2) {
    a = randInt(21, 50);
    b = randInt(3, 9);
    while ((a % 10) >= b) a = a - (a % 10) + randInt(0, Math.min(b - 1, 4));
  } else if (difficulty <= 5) {
    a = randInt(31, 79);
    b = randInt(13, 39);
    while ((a % 10) >= (b % 10)) {
      a = a - (a % 10) + randInt(0, 4);
      b = b - (b % 10) + randInt(5, 9);
    }
    if (a <= b) a = b + randInt(10, 20);
  } else {
    a = randInt(200, 600);
    b = randInt(105, 299);
    while ((a % 10) >= (b % 10)) {
      a = a - (a % 10) + randInt(0, 4);
      b = b - (b % 10) + randInt(5, 9);
    }
    if (a <= b) a = b + randInt(50, 150);
  }
  const answer = a - b;
  const wrong1 = answer + randInt(1, 10);
  const wrong2 = Math.max(0, answer - randInt(1, 10));
  const wrong3 = answer + (Math.random() > 0.5 ? 10 : -10);
  const options = shuffle([answer, wrong1, wrong2, wrong3].map(String));
  return {
    questionText: `What is ${a} − ${b}?`,
    options,
    correctAnswer: String(answer),
    explanation: `${a} − ${b} = ${answer}. Remember to borrow when you can't subtract the ones!`,
  };
}

// Word problem generators
function makeWordProblem(difficulty: number): Omit<Question, 'world'> {
  const isAdd = Math.random() > 0.4;
  const scenarios = isAdd
    ? [
        (a: number, b: number) => ({ text: `John has ${a} marbles. Mike gives him ${b} more. How many marbles does John have now?`, ans: a + b }),
        (a: number, b: number) => ({ text: `A library has ${a} books on one shelf and ${b} on another. How many books are there in total?`, ans: a + b }),
        (a: number, b: number) => ({ text: `Sarah collected ${a} seashells on Monday and ${b} on Tuesday. How many did she collect altogether?`, ans: a + b }),
        (a: number, b: number) => ({ text: `A farm has ${a} chickens and ${b} ducks. How many birds are there in total?`, ans: a + b }),
        (a: number, b: number) => ({ text: `Priya read ${a} pages yesterday and ${b} pages today. How many pages did she read in total?`, ans: a + b }),
      ]
    : [
        (a: number, b: number) => ({ text: `Priya has ${a} stickers. She gives ${b} to her friend. How many stickers does she have left?`, ans: a - b }),
        (a: number, b: number) => ({ text: `A school had ${a} students. ${b} went home early. How many students are still at school?`, ans: a - b }),
        (a: number, b: number) => ({ text: `There are ${a} apples in a basket. ${b} are eaten. How many apples remain?`, ans: a - b }),
        (a: number, b: number) => ({ text: `Mike had ${a} coins. He spent ${b} at the shop. How many coins does he have left?`, ans: a - b }),
        (a: number, b: number) => ({ text: `A bus has ${a} passengers. ${b} get off at the next stop. How many are still on the bus?`, ans: a - b }),
      ];

  let a: number, b: number;
  if (isAdd) {
    a = difficulty <= 3 ? randInt(18, 59) : randInt(125, 499);
    b = difficulty <= 3 ? randInt(13, 49) : randInt(105, 399);
    while ((a % 10) + (b % 10) <= 9) b = b - (b % 10) + randInt(5, 9);
  } else {
    a = difficulty <= 3 ? randInt(31, 79) : randInt(200, 600);
    b = difficulty <= 3 ? randInt(13, 39) : randInt(105, 299);
    while ((a % 10) >= (b % 10)) {
      a = a - (a % 10) + randInt(0, 4);
      b = b - (b % 10) + randInt(5, 9);
    }
    if (a <= b) a = b + randInt(10, 30);
  }

  const scenario = scenarios[randInt(0, scenarios.length - 1)](a, b);
  const answer = scenario.ans;
  const wrong1 = answer + randInt(1, 10);
  const wrong2 = Math.max(0, answer - randInt(1, 10));
  const wrong3 = answer + (Math.random() > 0.5 ? 10 : -10);
  const options = shuffle([answer, wrong1, wrong2, wrong3].map(String));

  return {
    questionText: scenario.text,
    options,
    correctAnswer: String(answer),
    explanation: `The answer is ${answer}. ${isAdd ? 'Remember to carry!' : 'Remember to borrow!'}`,
  };
}

export function generateSessionQuestions(): Question[] {
  const questions: Question[] = [];

  for (let world = 0; world < 10; world++) {
    const difficulty = world + 1;
    for (let q = 0; q < 10; q++) {
      let question: Omit<Question, 'world'>;
      if (q < 3) {
        question = makeAdditionQ(difficulty);
      } else if (q < 6) {
        question = makeSubtractionQ(difficulty);
      } else {
        question = makeWordProblem(difficulty);
      }
      questions.push({ ...question, world });
    }
  }

  return questions;
}
