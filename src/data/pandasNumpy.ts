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
        'df.loc[5] is the row labeled 5; df.iloc[5] is the sixth row. After filtering or sorting, labels and positions diverge: that’s when mixing them bites.',
    },
    {
      id: 'pn-groupby',
      type: 'fill',
      prompt: 'Average price per city: the split-apply-combine idiom:',
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
        'Chained indexing: the assignment may hit a temporary copy',
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
      front: '`merge` vs `join` vs `concat`: one sentence each.',
      back: 'merge: SQL-style joins on columns (how="inner/left/outer"); the workhorse. join: convenience wrapper joining on the index. concat: no matching logic at all, just stacks dataframes vertically (axis=0) or side by side (axis=1).',
    },
    {
      id: 'pn-mask',
      type: 'fill',
      prompt: 'Boolean masking: rows where age is strictly greater than 30:',
      code: "adults = df[df['age'] ____ 30]",
      answers: ['>'],
      distractors: ['>=', '==', 'in'],
      explanation:
        'The comparison produces a boolean Series; indexing with it keeps the True rows. Combine masks with & and |: wrapped in parentheses, since Python’s `and` fails on Series.',
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
      back: 'The loop runs in compiled C over contiguous typed memory instead of the Python interpreter boxing every element, typically 10 to 100x. Interview phrasing: "I’d express it as array operations rather than iterating rows; .apply() with a lambda is still a Python-level loop in disguise."',
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
        'Counts per category, sorted, in one call: add normalize=True for proportions. unique() lists values but not how often; groupby alone does nothing until aggregated.',
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
        'It contains NaN: classic NumPy has no integer NaN, so pandas upcasts',
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
        'A (rows, cols) tuple: note it’s an attribute, no parentheses. df.size is rows×cols as one number; len(df) is rows only.',
    },
    {
      id: 'pn-named-agg',
      type: 'mcq',
      prompt: 'Named aggregation: which call yields exactly the columns `avg_price` and `n` per city?',
      choices: [
        "df.groupby('city').agg(avg_price=('price', 'mean'), n=('price', 'count'))",
        "df.groupby('city').agg({'price': ['mean', 'count']})",
        "df.groupby('city')['price'].mean().rename('avg_price')",
        "df.agg(avg_price='mean', n='count')",
      ],
      answer: 0,
      explanation:
        'The keyword=(column, func) form names output columns directly. The dict form also computes both but returns MultiIndex columns you then have to flatten; the rename version only produces one aggregate.',
    },
    {
      id: 'pn-np-view',
      type: 'mcq',
      prompt: 'NumPy: after this runs, what happened to `a`?',
      code: 'b = a[2:5]\nb[0] = 99',
      choices: [
        'a[2] is now 99: basic slicing returns a view sharing memory with a',
        'a is unchanged: slicing always copies',
        'ValueError: slices of an array are read-only',
        'It depends on the dtype of a',
      ],
      answer: 0,
      explanation:
        'Basic slices are views into the same buffer; fancy indexing and boolean masks return copies. Use a[2:5].copy() when you need isolation. Pandas inherits this ambiguity, which is why SettingWithCopyWarning exists.',
    },
    {
      id: 'pn-loc-slice',
      type: 'tf',
      prompt: '`df.loc["a":"c"]` includes the row labeled "c", but `df.iloc[0:3]` excludes position 3.',
      answer: true,
      explanation:
        'Label slicing with loc is inclusive at both ends (there is no natural "one before label c"); iloc keeps Python\'s half-open convention. Mixing up the two conventions is a classic off-by-one.',
    },
    {
      id: 'pn-broadcast-rules',
      type: 'flash',
      front: 'State NumPy\'s broadcasting rules precisely.',
      back: '1. Align shapes from the trailing (rightmost) dimension.\n2. Two dimensions are compatible if they are equal, or if one of them is 1.\n3. A missing leading dimension counts as size 1.\n4. Every size-1 dimension is stretched (no data copied) to match the other array.\nAny incompatible pair raises ValueError: (3, 4) + (4,) works, (3, 4) + (3,) does not.',
    },
    {
      id: 'pn-fillna',
      type: 'flash',
      front: 'Walk me through your options for missing values in a dataframe and when you would pick each.',
      back: '1. dropna(): fine when losses are small; check the row count before and after.\n2. fillna(constant): a domain-meaningful default (0 for "no purchases", "unknown" for a category).\n3. ffill / bfill: ordered or time-series data where the last observation should carry forward.\n4. Statistical fill (mean or median, ideally per group): keeps rows for modeling; median resists outliers.\n5. Nullable dtypes ("Int64", "boolean"): hold pd.NA without the silent int to float upcast.',
    },
    {
      id: 'pn-resample',
      type: 'flash',
      front: 'You have daily sales and need monthly totals. What does the pandas code look like, and what does it require?',
      back: 'df.resample("MS", on="date")["sales"].sum(): resample is groupby over time buckets. It requires real datetimes, either a DatetimeIndex or an on= column parsed with pd.to_datetime. Downsample with sum/mean; upsampling to a finer grid instead creates empty buckets you fill with ffill or interpolate.',
    },
    {
      id: 'pn-to-datetime',
      type: 'fill',
      prompt: 'Parse a string column into real timestamps:',
      code: "df['date'] = pd.____(df['date'])",
      answers: ['to_datetime'],
      distractors: ['datetime', 'parse_dates', 'Timestamp'],
      explanation:
        'Until parsed, dates are just strings: range filters and sorting misbehave. Parsing unlocks the .dt accessor (.dt.year, .dt.day_name()) and resample. In read_csv, parse_dates=["date"] does the same at load time.',
    },
  ],
};
