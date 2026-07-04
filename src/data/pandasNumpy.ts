import type { Deck } from '../types';

export const pandasNumpy: Deck = {
  id: 'pandas-numpy',
  title: 'Pandas & NumPy',
  description: 'The dataframe fluency that data-role interviews quietly test.',
  icon: '🐼',
  color: '#e11d48',
  track: 'ML & Data',
  cards: [
    {
      id: 'pn-loc-iloc',
      type: 'mcq',
      prompt: 'The difference between `df.loc` and `df.iloc`?',
      choices: [
        'loc selects by label, iloc by integer position',
        'loc is for rows, iloc for columns',
        'iloc is the faster alias of loc',
        'loc modifies in place, iloc returns a copy',
      ],
      answer: 0,
      explanation:
        'df.loc[5] is the row labeled 5; df.iloc[5] is the sixth row. After filtering or sorting, labels and positions diverge — that’s when mixing them bites.',
    },
    {
      id: 'pn-groupby',
      type: 'fill',
      prompt: 'Average price per city — the split-apply-combine idiom:',
      code: "df.groupby('city')['price'].____()",
      answers: ['mean'],
      distractors: ['avg', 'average', 'apply'],
      explanation:
        'groupby splits, the aggregation combines. Chain .agg([\'mean\', \'count\']) for several at once. This one line is the pandas interview question.',
    },
    {
      id: 'pn-setting-copy',
      type: 'mcq',
      prompt: 'What usually triggers `SettingWithCopyWarning`?',
      code: "df[df['age'] > 30]['salary'] = 0",
      choices: [
        'Chained indexing — the assignment may hit a temporary copy',
        'Assigning a float into an int column',
        'Using loc instead of iloc',
        'A version mismatch between pandas and NumPy',
      ],
      answer: 0,
      explanation:
        "Two selections = two steps; pandas can't promise the second writes back to df. One-step form: df.loc[df['age'] > 30, 'salary'] = 0.",
    },
    {
      id: 'pn-merge-concat',
      type: 'flash',
      front: '`merge` vs `join` vs `concat` — one sentence each.',
      back: 'merge: SQL-style joins on columns (how="inner/left/outer") — the workhorse. join: convenience wrapper joining on the index. concat: no matching logic at all, just stacks dataframes vertically (axis=0) or side by side (axis=1).',
    },
    {
      id: 'pn-mask',
      type: 'fill',
      prompt: 'Boolean masking — rows where age is strictly greater than 30:',
      code: "adults = df[df['age'] ____ 30]",
      answers: ['>'],
      distractors: ['>=', '==', 'in'],
      explanation:
        'The comparison produces a boolean Series; indexing with it keeps the True rows. Combine masks with & and | — wrapped in parentheses, since Python’s `and` fails on Series.',
    },
    {
      id: 'pn-broadcast',
      type: 'mcq',
      prompt: 'NumPy: the result shape of adding arrays with shapes `(3, 1)` and `(1, 4)`?',
      choices: ['(3, 4)', 'ValueError', '(3, 1)', '(4, 3)'],
      answer: 0,
      explanation:
        'Broadcasting stretches each size-1 dimension to match the other array: the column vector repeats across 4 columns, the row across 3 rows.',
    },
    {
      id: 'pn-vectorize',
      type: 'flash',
      front: 'Why is vectorized NumPy/pandas code so much faster than a Python for-loop?',
      back: 'The loop runs in compiled C over contiguous typed memory instead of the Python interpreter boxing every element — typically 10–100×. Interview phrasing: "I’d express it as array operations rather than iterating rows; .apply() with a lambda is still a Python-level loop in disguise."',
    },
    {
      id: 'pn-colmean',
      type: 'fill',
      prompt: 'Column means of a 2-D array (collapse the rows):',
      code: 'col_means = np.mean(a, ____=0)',
      answers: ['axis'],
      distractors: ['dim', 'rows', 'level'],
      explanation:
        'axis=0 aggregates DOWN the rows giving one value per column; axis=1 goes across. "The axis you specify is the one that disappears."',
    },
    {
      id: 'pn-value-counts',
      type: 'mcq',
      prompt: 'Quickest look at the distribution of a categorical column?',
      choices: [
        "df['status'].value_counts()",
        "df['status'].describe()",
        "df.groupby('status')",
        "df['status'].unique()",
      ],
      answer: 0,
      explanation:
        'Counts per category, sorted, in one call — add normalize=True for proportions. unique() lists values but not how often; groupby alone does nothing until aggregated.',
    },
    {
      id: 'pn-pivot',
      type: 'flash',
      front: 'What does `pivot_table` do? Give a concrete example.',
      back: 'Excel-style reshaping with aggregation: pd.pivot_table(df, values="sales", index="region", columns="quarter", aggfunc="sum") → one row per region, one column per quarter, summed sales in the cells. It’s groupby on two keys with the second unstacked into columns.',
    },
    {
      id: 'pn-nan-dtype',
      type: 'mcq',
      prompt: 'An integer column suddenly became float64 after loading. Most likely cause?',
      choices: [
        'It contains NaN — classic NumPy has no integer NaN, so pandas upcasts',
        'CSV files store all numbers as floats',
        'A pandas bug',
        'The column exceeded int64 range',
      ],
      answer: 0,
      explanation:
        'Missing values force int → float64 (or use the nullable "Int64" dtype). Recognizing this instantly signals real pandas mileage.',
    },
    {
      id: 'pn-shape',
      type: 'fill',
      prompt: 'Rows and columns at a glance:',
      code: 'n_rows, n_cols = df.____',
      answers: ['shape'],
      distractors: ['size', 'dims', 'len()'],
      explanation:
        'A (rows, cols) tuple — note it’s an attribute, no parentheses. df.size is rows×cols as one number; len(df) is rows only.',
    },
  ],
};
