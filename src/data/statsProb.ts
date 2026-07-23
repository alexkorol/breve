import type { Deck } from '../types';

export const statsProb: Deck = {
  id: 'stats-prob',
  title: 'Statistics & Probability',
  description: 'The stats round: distributions, tests, and Bayes without flinching.',
  icon: '🎲',
  color: '#a78bfa',
  track: 'ML & Data',
  cards: [
    {
      id: 'sp-mean-median',
      type: 'mcq',
      prompt: 'Income data with a few billionaires, which center to report?',
      choices: [
        'Median: robust to the skew; the mean gets dragged upward',
        'Mean: it uses every data point, so it is strictly more informative than the median for any distribution',
        'Mode',
        'Midrange (max+min)/2',
      ],
      answer: 0,
      explanation:
        'Mean ≫ median is itself a skew diagnostic. Same reasoning as median imputation: one idea, two applications.',
    },
    {
      id: 'sp-std',
      type: 'flash',
      front: 'Variance and standard deviation: define, and why divide by n−1?',
      back: 'Variance = average squared distance from the mean; std = its square root, back in original units. Sample variance divides by n−1 (Bessel’s correction) because the sample mean was estimated from the same data, eating one degree of freedom: dividing by n would systematically underestimate spread.',
    },
    {
      id: 'sp-normal-68',
      type: 'fill',
      prompt: 'The empirical rule for a normal distribution:',
      code: 'within 1 std: ~68%\nwithin 2 std: ~____%\nwithin 3 std: ~99.7%',
      answers: ['95'],
      distractors: ['90', '97', '99'],
      explanation:
        '68–95–99.7. The 2-std ≈ 95% line is why z ≈ 1.96 shows up in every confidence interval.',
    },
    {
      id: 'sp-clt',
      type: 'flash',
      front: 'The Central Limit Theorem: what it says and why ML people care.',
      back: 'Means of large-enough samples are approximately normal regardless of the underlying distribution, with spread shrinking as σ/√n. It’s why confidence intervals and t-tests work on non-normal data, and why averaging noisy estimates (batches, bootstraps, ensemble members) produces stable numbers. Rough threshold people quote: n ≥ 30.',
    },
    {
      id: 'sp-bayes',
      type: 'flash',
      front: 'A disease affects 1% of people. The test is 99% sensitive, 95% specific. You test positive: actual probability you’re sick?',
      back: 'Bayes: P(sick|+) = (0.99 × 0.01) / (0.99×0.01 + 0.05×0.99) ≈ 0.0099/0.0594 ≈ 17%. The false positives from the healthy 99% swamp the true positives from the sick 1%. Base-rate neglect is THE probability interview question, and it is precision under a different name.',
    },
    {
      id: 'sp-bayes-formula',
      type: 'fill',
      prompt: 'Bayes’ theorem:',
      code: 'P(A|B) = P(B|A) * P(A) / P(____)',
      answers: ['B'],
      distractors: ['A', 'A|B', 'not A'],
      explanation:
        'Posterior = likelihood × prior / evidence. Being able to LABEL the four pieces matters more than reciting the formula.',
    },
    {
      id: 'sp-independence',
      type: 'mcq',
      prompt: 'Two fair coin flips. P(both heads)? And what assumption did you just use?',
      choices: [
        '0.25: multiplied because the flips are independent',
        '0.5: probabilities add',
        '0.25: probabilities of two events always multiply, whether or not the events are independent',
        '0.75',
      ],
      answer: 0,
      explanation:
        'Multiplication REQUIRES independence: the assumption most real-world probability errors violate (correlated defaults, correlated features, correlated model errors).',
    },
    {
      id: 'sp-pvalue',
      type: 'mcq',
      prompt: 'What a p-value of 0.03 actually means?',
      choices: [
        'If the null hypothesis were true, data this extreme would occur 3% of the time',
        'There is a 3% probability that the null hypothesis is true, given the data you observed',
        'The effect size is 3%',
        'A replication of the experiment would find a significant effect 97% of the time',
      ],
      answer: 0,
      explanation:
        'P(data | null), NOT P(null | data): confusing them is the most common stats error in interviews and in published science alike.',
    },
    {
      id: 'sp-ab-test',
      type: 'flash',
      front: 'Design an A/B test for a new recommendation model: the checklist.',
      back: 'Randomize assignment (users, not sessions, to avoid contamination), define the primary metric and minimum detectable effect UP FRONT, power analysis for sample size, run the pre-committed duration (no peeking-and-stopping: that inflates false positives), then a significance test plus a look at the effect size and guardrail metrics. Bonus terms that land: novelty effects, multiple-comparison correction.',
    },
    {
      id: 'sp-corr-cause',
      type: 'mcq',
      prompt: 'Ice cream sales correlate with drownings. The best explanation?',
      choices: [
        'A confounder: summer drives both; correlation ≠ causation',
        'Ice cream causes drowning: swimming on a full stomach leads to cramps',
        'Coincidence, always',
        'Reverse causality: news coverage of drownings drives people to buy comfort ice cream',
      ],
      answer: 0,
      explanation:
        'Name the mechanism, not the slogan: confounding, reverse causation, selection bias, or chance. Causal claims need randomization or careful causal inference.',
    },
    {
      id: 'sp-correlation-r',
      type: 'mcq',
      prompt: 'Pearson r = 0 between X and Y. Can they still be strongly related?',
      choices: [
        'Yes. Pearson only measures LINEAR association; Y = X² gives r ≈ 0',
        'No: r = 0 implies X and Y are statistically independent, so no relationship of any kind exists',
        'Only if n is small',
        'Only for categorical data',
      ],
      answer: 0,
      explanation:
        'Always plot before trusting r (Anscombe’s quartet is the classic demo). Spearman catches monotonic non-linear relationships.',
    },
    {
      id: 'sp-expected-value',
      type: 'mcq',
      prompt: 'A lottery ticket costs $2, pays $500 with probability 0.001. Expected value of buying?',
      choices: [
        '−$1.50. EV = 0.001 × 500 − 2 = −1.5',
        '+$0.50: EV = 0.001 × 500; the ticket price is a sunk cost and stays out of the calculation',
        '$498: the $500 prize minus the $2 ticket price',
        'Cannot be computed without knowing how many tickets are sold',
      ],
      answer: 0,
      explanation:
        'EV = Σ(outcome × probability) minus cost. Quick EV arithmetic under pressure is a favorite screen for data roles.',
    },
    {
      id: 'sp-sampling-bias',
      type: 'mcq',
      prompt: 'Surveying app-store reviewers to estimate user satisfaction: the flaw?',
      choices: [
        'Selection bias: reviewers are self-selected extremes, not representative users',
        'Sample size: review counts are too small for significance, so collect more reviews before inferring anything',
        'Reviews are text, so unusable',
        'No flaw: reviewers are real users, so the sample is drawn from the population of interest',
      ],
      answer: 0,
      explanation:
        'Survivorship and self-selection distort any inference. Fix: sample from the actual user population, weight by usage.',
    },
    {
      id: 'sp-bootstrap',
      type: 'flash',
      front: 'The bootstrap: how do you get a confidence interval with no formula?',
      back: 'Resample your dataset WITH replacement thousands of times, compute the statistic on each resample, and read the interval off the percentiles (2.5th–97.5th for 95%). Works for medians, ratios, model metrics: anything. It’s the practical answer to "how confident are you in that eval score?"',
    },
    {
      id: 'sp-distributions',
      type: 'mcq',
      prompt: 'Number of support tickets arriving per hour is best modeled by…',
      choices: [
        'Poisson: counts of independent events in a fixed window',
        'Normal: the CLT guarantees hourly counts are normally distributed',
        'Uniform',
        'Binomial with n = 60: one Bernoulli trial per minute, success meaning a ticket arrived',
      ],
      answer: 0,
      explanation:
        'The distribution matching game: counts in time → Poisson, successes in n trials → binomial, waiting time → exponential, sums/averages → normal (CLT).',
    },
    {
      id: 'sp-variance-tradeoff',
      type: 'mcq',
      prompt: 'You average the predictions of 10 diverse models. What happens statistically?',
      choices: [
        'Variance drops (errors partially cancel) while bias stays: the statistical soul of ensembling',
        'Bias drops: combining models lets them correct each other\'s systematic errors, at the cost of some extra variance',
        'Both rise',
        'Nothing changes',
      ],
      answer: 0,
      explanation:
        'Averaging independent-ish errors shrinks them by ~1/√n. Random forests, ensembles, and self-consistency judging are all this one theorem wearing different hats.',
    },
  ],
};
