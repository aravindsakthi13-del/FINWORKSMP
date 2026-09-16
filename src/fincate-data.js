// FINCATE - Core Data Repository
// Comprehensive educational content, assets, market events, case studies, quizzes & glossary

export const FINCATE_DATA = {
  // 1. Initial User Assessment & Levels
  assessmentQuestions: [
    {
      id: 'q1',
      question: 'What is the primary effect of high inflation on cash held in a standard checking account?',
      options: [
        { text: 'It increases the real purchasing power of your money over time.', score: 0 },
        { text: 'It reduces the purchasing power of your cash over time as prices rise.', score: 10 },
        { text: 'It has no effect because the numerical balance remains unchanged.', score: 0 },
        { text: 'It automatically multiplies through compound interest.', score: 0 }
      ],
      explanation: 'Inflation causes the cost of goods and services to increase, which means each dollar buys fewer items over time.'
    },
    {
      id: 'q2',
      question: 'Which statement best describes the relationship between investment risk and potential returns?',
      options: [
        { text: 'Higher potential returns generally require accepting higher risk and volatility.', score: 10 },
        { text: 'Safe investments with zero risk consistently deliver the highest returns.', score: 0 },
        { text: 'Risk only matters if you sell on a weekend.', score: 0 },
        { text: 'Stock diversification eliminates 100% of all market risk.', score: 0 }
      ],
      explanation: 'In financial markets, higher potential upside is almost always accompanied by higher uncertainty, volatility, and downside risk.'
    },
    {
      id: 'q3',
      question: 'What is "Concentration Risk" in portfolio management?',
      options: [
        { text: 'Focusing too much on reading financial news every morning.', score: 0 },
        { text: 'Holding all or most of your capital in a single stock or sector, exposing you to severe loss if it declines.', score: 10 },
        { text: 'Investing across multiple unrelated global asset classes.', score: 0 },
        { text: 'Keeping 100% of your funds in guaranteed government treasury bills.', score: 0 }
      ],
      explanation: 'Concentration risk happens when a portfolio lacks diversification, meaning poor performance of one asset can devastate the entire portfolio.'
    }
  ],

  progressionLevels: [
    { level: 1, title: 'Finance Beginner', minXP: 0, maxXP: 500, icon: '🌱', description: 'Starting your financial literacy journey.' },
    { level: 2, title: 'Money Explorer', minXP: 501, maxXP: 1200, icon: '🧭', description: 'Mastering personal finance, budgeting and asset basics.' },
    { level: 3, title: 'Market Learner', minXP: 1201, maxXP: 2500, icon: '📈', description: 'Understanding stock dynamics, market orders and valuations.' },
    { level: 4, title: 'Investment Explorer', minXP: 2501, maxXP: 4500, icon: '💼', description: 'Navigating diverse asset classes and risk management.' },
    { level: 5, title: 'Market Analyst', minXP: 4501, maxXP: 7500, icon: '📊', description: 'Analyzing economic indicators, volatility and macro trends.' },
    { level: 6, title: 'Finance Strategist', minXP: 7501, maxXP: 12000, icon: '🛡️', description: 'Crafting resilient multi-asset allocation strategies.' },
    { level: 7, title: 'Finance Master', minXP: 12001, maxXP: 999999, icon: '👑', description: 'Demonstrated deep risk discipline and market mastery.' }
  ],

  // 2. Learning Modules & Lessons
  modules: [
    {
      id: 'mod_1',
      title: 'Personal Finance & Money Mindset',
      icon: '💰',
      category: 'Fundamentals',
      description: 'Master budgeting, cash flow management, emergency reserves, and the crucial distinction between assets and liabilities.',
      lessons: [
        {
          id: 'les_1_1',
          title: 'The Flow of Money: Income, Expenses & Budgeting',
          readTime: '4 min',
          xpReward: 120,
          coinReward: 200,
          simpleContent: `
### Think of Money Like Water in a Reservoir

Imagine your finances as a water reservoir:
- **Income** is the incoming stream filling the reservoir.
- **Fixed Expenses** (rent, utilities, groceries) are the necessary irrigation pipes.
- **Discretionary Spending** (entertainment, dining out, luxury gadgets) are small leaks.

If your outflow is larger than your inflow, the reservoir empties, leading to debt. 

#### The Golden 50/30/20 Rule:
1. **50% Needs**: Essential costs required for living (shelter, basic food, transport).
2. **30% Wants**: Lifestyle choices that make life enjoyable but aren't strictly necessary.
3. **20% Savings & Investing**: Building emergency funds and growing your future wealth.
          `,
          advancedContent: `
### Cash Flow Mechanics & Net Free Cash Flow

In corporate and personal finance, solvency is determined by **Net Free Cash Flow (NFCF)**:
$$\\text{NFCF} = \\text{Gross Operating Inflow} - (\\text{Non-Discretionary Expenses} + \\text{Debt Service})$$

A positive NFCF generates investable capital that can be deployed into compounding yield-bearing assets. Without an active cash flow surplus, an individual is vulnerable to negative compounding through high-interest revolving consumer liabilities (e.g., credit cards at 24%+ APR).

#### Structured Budgeting Frameworks:
- **Zero-Based Budgeting (ZBB)**: Allocates every single currency unit to a specific functional category (expenses, savings, debt paydown, investment) prior to the month starting.
- **Pay-Yourself-First Method**: Automatically directs a target savings/investment rate (e.g., 20-30%) the moment income arrives before paying variable expenses.
          `,
          balancedPerspective: {
            concept: 'Strict Budgeting & Frugality',
            advantages: [
              'Builds financial discipline and guarantees positive monthly cash flow.',
              'Prevents lifestyle inflation from consuming salary increases.',
              'Provides clear visibility into spending leaks and unnecessary recurring costs.'
            ],
            risks: [
              'Hyper-restrictive budgeting can lead to burnout and "revenge spending".',
              'Focusing solely on cutting expenses has a hard mathematical ceiling ($0); focusing on increasing income has infinite upside.',
              'Hoarding cash without an investment strategy guarantees loss of purchasing power to inflation.'
            ]
          },
          quiz: {
            question: 'According to the popular 50/30/20 budgeting guideline, what percentage should ideally be allocated toward savings and investments?',
            options: [
              '50%',
              '30%',
              '20%',
              '5%'
            ],
            correctIndex: 2,
            explanation: 'The 50/30/20 rule suggests 50% for Needs, 30% for Wants, and 20% dedicated to Savings, Debt Paydown, and Investments.'
          }
        },
        {
          id: 'les_1_2',
          title: 'Assets vs. Liabilities & The Emergency Buffer',
          readTime: '5 min',
          xpReward: 150,
          coinReward: 250,
          simpleContent: `
### Assets Put Money In Your Pocket; Liabilities Take It Out

- **Asset**: Anything that generates cash flow or appreciates in value over time (e.g., dividend stocks, rental property, index funds, high-yield savings).
- **Liability**: Anything that costs you money over time or loses value rapidly (e.g., car loans, consumer electronics on credit, luxury subscriptions).

### Why You Need an Emergency Fund First
Before putting money into volatile stocks or crypto, you need an **Emergency Fund**—typically 3 to 6 months of living expenses kept in safe, liquid cash.

Why? If your car breaks down or you lose your job during a market crash, an emergency fund prevents you from having to panic-sell your investments at a 30% loss to pay your rent!
          `,
          advancedContent: `
### Liquidity Profiling & Balance Sheet Optimization

Personal balance sheet resilience is defined by the **Quick Liquidity Ratio**:
$$\\text{Liquidity Ratio} = \\frac{\\text{Liquid Cash Equivalents}}{\\text{Monthly Fixed Liabilities}}$$

A ratio of 3.0 to 6.0 provides downside insulation against systemic macroeconomic shocks (recession, sudden unemployment, medical emergencies).

#### Capital Hierarchy of Deployments:
1. **Tier 1 - Liquid Core**: High-Yield Savings / Money Market Funds (3-6 months runway). Zero capital risk.
2. **Tier 2 - Low Beta Core**: Broad-market index ETFs and sovereign bonds.
3. **Tier 3 - High Beta / Growth**: Individual equities, sector tech, commodities.
4. **Tier 4 - Speculative / Asymmetric**: Early-stage crypto, options, leveraged instruments (capped at <5-10% of total net worth).
          `,
          balancedPerspective: {
            concept: 'Holding High Emergency Cash Reserves',
            advantages: [
              'Provides complete peace of mind and prevents forced liquidations during market drawdowns.',
              'Ensures high liquidity to capitalize on extreme market discounts during panics.',
              'Zero capital loss risk when kept in FDIC/government-guaranteed instruments.'
            ],
            risks: [
              'Cash drag: Holding excessive cash (e.g., 2+ years of expenses) severely lowers long-term portfolio growth.',
              'Real negative return: When inflation is 5% and cash yields 3%, cash loses 2% real purchasing power every year.'
            ]
          },
          quiz: {
            question: 'Why is it critical to build an emergency fund before investing aggressively in volatile assets like individual stocks?',
            options: [
              'Because stock brokers will reject your account without one.',
              'It prevents you from being forced to sell your investments at a heavy loss during an unexpected personal emergency or market downturn.',
              'Emergency funds guarantee a 20% annual return on your money.',
              'To eliminate 100% of income taxes on your investments.'
            ],
            correctIndex: 1,
            explanation: 'An emergency fund acts as a financial shock absorber, allowing your investments to ride through market cycles without forced liquidation.'
          }
        }
      ]
    },
    {
      id: 'mod_2',
      title: 'Stock Market & Company Valuations',
      icon: '📊',
      category: 'Equities',
      description: 'Understand what a share actually is, how auction pricing works, market capitalization, and what drives stock price fluctuations.',
      lessons: [
        {
          id: 'les_2_1',
          title: 'What is a Stock & Why Do Companies Issue Shares?',
          readTime: '4 min',
          xpReward: 140,
          coinReward: 220,
          simpleContent: `
### Owning a Tiny Piece of a Real Business

When you purchase a **share** of a company (like Apple, Microsoft, or our simulated *Apex Neural*), you become a fractional owner (shareholder).

#### Why Companies Sell Shares (IPO):
To expand operations, build factories, hire engineers, and launch new products, companies need large amounts of capital. Instead of borrowing from banks with heavy interest, they sell fractional ownership to the public.

#### How You Can Make (or Lose) Money:
1. **Capital Appreciation**: Buying at $50 and selling later at $80 when the company grows.
2. **Dividends**: Cash payouts distributed directly to shareholders from company profits.
3. **Capital Loss**: If the company loses market share, misses sales targets, or faces scandal, the share price can plunge below what you paid.
          `,
          advancedContent: `
### Equity Structure, Valuation Multiples & Order Books

Equity represents residual claim on assets after all senior debt liabilities are satisfied ($Equity = Assets - Liabilities$).

#### Core Valuation Multiples:
- **Price-to-Earnings (P/E)**: Market Price per Share / Earnings per Share (EPS). Indicates how many dollars investors are willing to pay for $1 of current company profit.
- **Enterprise Value / EBITDA**: Measures full company acquisition cost relative to core cash operating profitability.
- **Market Capitalization**: $\\text{Share Price} \\times \\text{Total Shares Outstanding}$.

#### Price Discovery Mechanism:
Stock exchanges utilize a continuous double auction **Order Book**. Bids (highest price buyers will pay) meet Asks (lowest price sellers will accept). When market sentiment or unexpected fundamental news hits, the balance shifts rapidly, triggering price movements.
          `,
          balancedPerspective: {
            concept: 'Investing in Individual Public Equities',
            advantages: [
              'Historically one of the highest returning asset classes over multi-decade horizons (beating inflation).',
              'High liquidity: Can easily buy and sell shares within milliseconds on regulated exchanges.',
              'Potential for dividend cash flow and voting rights in corporate governance.'
            ],
            risks: [
              'Individual company risk: A company can underperform, lose market share, or even file for bankruptcy (total loss of capital).',
              'High short-term volatility: Stock prices often swing wildly based on emotions, rumors, and macroeconomic noise rather than pure fundamentals.'
            ]
          },
          quiz: {
            question: 'If a company has 10 million shares outstanding and each share trades at $25, what is the company\'s Market Capitalization?',
            options: [
              '$2.5 Million',
              '$250 Million',
              '$25 Million',
              '$1 Billion'
            ],
            correctIndex: 1,
            explanation: 'Market Cap = Shares Outstanding × Share Price. 10,000,000 × $25 = $250,000,000 ($250M).'
          }
        },
        {
          id: 'les_2_2',
          title: 'Why Stock Prices Move: Sentiment vs. Fundamentals',
          readTime: '5 min',
          xpReward: 160,
          coinReward: 250,
          simpleContent: `
### "In the short run, the market is a voting machine; in the long run, it is a weighing machine." — Benjamin Graham

Why does a stock jump +10% on Monday and drop -8% on Tuesday?

1. **Earnings Reports & Guidance**: Companies report revenue and profit every quarter. If results beat analyst forecasts, price tends to rise; if they miss, it often drops.
2. **Interest Rates & Economy**: When central banks raise interest rates, borrowing becomes expensive, making future profits less valuable today.
3. **Market Sentiment & Hype**: Investor optimism (Greed) or fear can drive stock prices far away from their actual business worth in the short term.
4. **Positive News Doesn\'t Always Mean Price Goes Up**: If great news was already expected ("priced in"), the stock might actually fall when the news becomes official ("sell the news").
          `,
          advancedContent: `
### Efficient Market Hypothesis (EMH) & Expectation Arbitrage

Stock prices discount **future expectations**, not past historical achievements:
- **Priced-In Effect**: If the market anticipates a 30% revenue surge, that expectation is already reflected in the current elevated P/E ratio. If actual revenue grows "only" 25%, the stock may suffer a sharp sell-off despite recording record profits.
- **Discounted Cash Flow (DCF) Sensitivity**: In DCF modeling, the present value of future cash flows is inversely proportional to the Risk-Free Discount Rate ($r$). When central banks raise interest rates, growth stocks with long-duration cash flows experience severe multiple contraction.
          `,
          balancedPerspective: {
            concept: 'Trading on Breaking News Headlines',
            advantages: [
              'Potential to capture rapid momentum bursts when an unforeseen catalyst shocks the market.',
              'Understanding macroeconomic events helps avoid blind exposure to vulnerable sectors.'
            ],
            risks: [
              'High frequency and institutional algorithms trade headlines in microseconds, putting retail traders at a severe execution disadvantage.',
              '"Whipsaw risk": Breaking news often causes violent fakeouts where prices spike and reverse instantly.'
            ]
          },
          quiz: {
            question: 'Why might a company\'s stock price drop immediately after announcing record-high quarterly profits?',
            options: [
              'Because the company forgot to pay its stock exchange membership fee.',
              'Because investors expected even higher earnings, or the company issued weak future growth guidance ("priced-in" phenomenon).',
              'Record profits automatically trigger mandatory sell-offs by laws.',
              'Because higher profits always decrease the value of shares.'
            ],
            correctIndex: 1,
            explanation: 'Markets look forward. If profits failed to meet sky-high investor expectations or if management warned of future slowing growth, the price can fall despite positive numbers.'
          }
        }
      ]
    },
    {
      id: 'mod_3',
      title: 'Investing vs Trading vs Speculation',
      icon: '🎯',
      category: 'Strategy',
      description: 'Distinguish between building long-term wealth, active short-term trading, and dangerous speculative gambles.',
      lessons: [
        {
          id: 'les_3_1',
          title: 'The Spectrum: Investor, Trader, or Gambler?',
          readTime: '4 min',
          xpReward: 150,
          coinReward: 240,
          simpleContent: `
### Understanding Where You Stand

Many beginners lose their savings because they confuse **speculation** with **investing**.

| Category | Typical Time Horizon | Primary Focus | Key Risk |
|---|---|---|---|
| **Investor** | Years to Decades | Business fundamentals, compound growth, dividends | Macro downturns, waiting through multi-year bear markets |
| **Trader** | Minutes to Weeks | Price action, technical patterns, momentum, order flow | Emotional tilt, high transaction fees, slippage, rapid losses |
| **Speculator / Gambler** | Hours to Days | Hype, meme trends, lottery-ticket bets without research | Total capital wipeout, chasing pump-and-dumps |

**Key Rule**: There is nothing wrong with trading or holding speculative assets, provided you understand the risks and keep speculative bets to a small percentage of your overall wealth!
          `,
          advancedContent: `
### Capital Preservation, Mathematical Expectancy & The Kelly Criterion

Successful market participants evaluate trades through **Mathematical Expectancy**:
$$E = (P_{win} \\times W_{avg}) - (P_{loss} \\times L_{avg})$$

Where:
- $P_{win}$ is probability of a winning trade.
- $W_{avg}$ is average win size.
- $P_{loss}$ is probability of a loss ($1 - P_{win}$).
- $L_{avg}$ is average loss size.

Speculators often chase low-probability high-payoff events ($P_{win} < 10\\%$) without realizing that consecutive loss streaks inevitably lead to the **Risk of Ruin**. Discipline, stop-losses, and asymmetric risk/reward ratios ($> 2:1$) are mathematical prerequisites for sustainable trading.
          `,
          balancedPerspective: {
            concept: 'Active Short-Term Day Trading',
            advantages: [
              'Ability to profit in both rising (bull) and falling (bear) markets by utilizing both long and short strategies.',
              'No overnight gap risk if all positions are closed before market close.',
              'Fast feedback loop on decision-making and risk execution.'
            ],
            risks: [
              'Studies consistently show that over 85-90% of retail active day traders lose money over a 2-year period after fees and emotional errors.',
              'High psychological stress, screen fatigue, and temptation to revenge-trade after losses.',
              'Substantial friction from trading fees, bid-ask spreads, and short-term capital gains taxes.'
            ]
          },
          quiz: {
            question: 'What is the most critical difference between a long-term investor and a short-term speculator?',
            options: [
              'Investors use smartphones, while speculators only use desktop computers.',
              'Investors focus on underlying business growth and long-term compounding; speculators focus on rapid short-term price swings and hype.',
              'Investors never lose money under any circumstances.',
              'Speculators are guaranteed to beat the market every month.'
            ],
            correctIndex: 1,
            explanation: 'Investing relies on asset fundamentals, dividend yields, and long-term economic growth, whereas speculation bets on volatile short-term sentiment.'
          }
        }
      ]
    },
    {
      id: 'mod_4',
      title: 'Risk Management & Diversification',
      icon: '🛡️',
      category: 'Risk Control',
      description: 'The cornerstone of financial survival: learn how to protect your portfolio from catastrophic wipeouts and concentration traps.',
      lessons: [
        {
          id: 'les_4_1',
          title: 'The Math of Diversification & Concentration Traps',
          readTime: '5 min',
          xpReward: 180,
          coinReward: 280,
          simpleContent: `
### "Don't Put All Your Eggs in One Basket"

If you invest 100% of your money into one hot tech company:
- If that company succeeds: You make huge gains!
- If that company gets hit with a regulatory ban, fraud scandal, or competitor: **Your entire life savings can be erased.**

#### The Free Lunch of Finance:
Diversification is the only "free lunch" in investing. By spreading your money across different sectors (Tech, Energy, Healthcare) and different asset types (Stocks, Bonds, Gold, Cash), you can lower your total risk **without sacrificing expected returns**!

When one sector drops during an economic shift, another often rises or stays stable to protect you.
          `,
          advancedContent: `
### Modern Portfolio Theory (MPT) & Non-Correlated Assets

Harry Markowitz\'s Nobel Prize-winning **Modern Portfolio Theory** demonstrates that the variance (risk) of a multi-asset portfolio is a function of asset covariance:
$$\\sigma_p^2 = \\sum w_i^2 \\sigma_i^2 + 2 \\sum_{i} \\sum_{j \\neq i} w_i w_j \\text{Cov}(i,j)$$

When correlation between assets $\\rho_{i,j} < 0.3$ (such as equities vs. sovereign treasury bonds or gold), the portfolio\'s Sharpe Ratio (risk-adjusted return) improves significantly.

#### Types of Risk:
1. **Unsystematic (Specific) Risk**: Risk unique to a single company or industry (CEO resigning, product recall). Eliminated almost entirely by holding 20-30+ uncorrelated assets or broad index ETFs.
2. **Systematic (Market) Risk**: Macro risk affecting the entire financial system (recession, interest rate shocks, global pandemic). Cannot be diversified away, only mitigated via cash buffers, hedging, and defensive assets.
          `,
          balancedPerspective: {
            concept: 'Broad Portfolio Diversification',
            advantages: [
              'Drastically reduces portfolio volatility and protects against single-company bankruptcies.',
              'Prevents catastrophic drawdowns that can take decades to recover from.',
              'Provides smoother, more predictable compounding over multi-year cycles.'
            ],
            risks: [
              '"Di-worsification": Spreading money into hundreds of assets you don\'t understand can dilute your highest-conviction ideas.',
              'A diversified portfolio will rarely beat the single best-performing stock of the year in bull runs.'
            ]
          },
          quiz: {
            question: 'What is the primary benefit of holding assets that have low or negative correlation with each other (e.g. Stocks and Sovereign Bonds)?',
            options: [
              'It guarantees that you will make at least 50% profit every quarter.',
              'It reduces overall portfolio volatility and protects against severe drawdowns when one specific sector crashes.',
              'It completely eliminates all government taxes.',
              'It allows you to trade 24 hours a day without market closures.'
            ],
            correctIndex: 1,
            explanation: 'Uncorrelated assets don\'t move in lockstep. When equities face severe sell-offs, defensive assets like sovereign bonds or gold often provide stabilization.'
          }
        },
        {
          id: 'les_4_2',
          title: 'The Brutal Math of Loss Recovery',
          readTime: '4 min',
          xpReward: 160,
          coinReward: 260,
          simpleContent: `
### Why Avoiding Big Losses is More Important Than Chasing Big Gains

Look at what it takes to recover from a portfolio loss:
- If you lose **10%**, you need an **11.1% gain** to break even.
- If you lose **20%**, you need a **25% gain** to break even.
- If you lose **50%**, you need a **100% gain (doubling your money!)** just to get back to zero.
- If you lose **80%**, you need a **400% gain (5x your money!)** to break even.

This is why professional risk managers use **position sizing** and never risk more than 1% to 2% of their total portfolio on any single speculative trade!
          `,
          advancedContent: `
### Asymmetric Drawdown Compounding & Position Sizing

The percentage gain required to recover from a drawdown of percentage $D$ is:
$$\\text{Required Recovery Gain } G = \\frac{D}{1 - D}$$

As $D$ exceeds 0.40 (40%), the required recovery curve becomes exponential. 

#### Fixed-Fractional Risk Management:
To protect against ruin, professional traders calculate trade size ($S$) based on portfolio equity ($E$), risk tolerance percentage ($R$), and stop-loss distance ($SL$):
$$S = \\frac{E \\times R}{|P_{entry} - P_{stop}|}$$
This ensures that even a string of 8 consecutive losing trades will not impair capital beyond 10-15% of total portfolio equity.
          `,
          balancedPerspective: {
            concept: 'Strict Stop-Loss & Risk Limits',
            advantages: [
              'Enforces emotional detachment and prevents small manageable losses from snowballing into catastrophic drawdowns.',
              'Preserves dry powder capital to deploy when high-probability opportunities emerge.'
            ],
            risks: [
              'Whipsaw stop-outs: High market volatility can trigger your stop-loss right before the price rebounds vigorously.',
              'Requires constant discipline to accept small realized losses without becoming angry or vengeful.'
            ]
          },
          quiz: {
            question: 'If an investor loses 50% of their total portfolio value, what percentage gain do they need on their remaining capital just to get back to their original starting balance?',
            options: [
              '50%',
              '75%',
              '100%',
              '200%'
            ],
            correctIndex: 2,
            explanation: 'If $10,000 drops 50% to $5,000, you must gain $5,000 on that $5,000 (which is +100%) to return to $10,000.'
          }
        }
      ]
    },
    {
      id: 'mod_5',
      title: 'Financial Instruments Spectrum',
      icon: '🌐',
      category: 'Asset Classes',
      description: 'Compare Equities, Bonds, ETFs, Mutual Funds, Physical Gold, and Digital Assets across risk, return, and liquidity.',
      lessons: [
        {
          id: 'les_5_1',
          title: 'From Safe Yield to Speculative: The Risk Spectrum',
          readTime: '6 min',
          xpReward: 200,
          coinReward: 300,
          simpleContent: `
### Navigating the World of Financial Assets

Every asset class has a specific role in a balanced financial ecosystem:

1. **Treasury Bonds (e.g., BOND)**: Loans you give to the government. They pay fixed interest (yield) and are backed by sovereign guarantee. *Low risk, low-to-medium return.*
2. **Index Funds / ETFs (e.g., OMNI)**: A single basket holding hundreds of top companies (like the S&P 500). *Medium risk, steady long-term compounding.*
3. **Individual Stocks (e.g., APEX, VOLT)**: Shares in single companies. Returns depend on company execution. *Higher risk, high potential upside.*
4. **Physical Gold / Commodities (e.g., GOLD)**: Tangible assets that act as safe-havens during currency debasement and geopolitical crises. *Does not generate dividends, but preserves purchasing power.*
5. **Cryptocurrencies / Digital Assets (e.g., BFRG)**: Highly volatile decentralized tokens. *Extreme risk, extreme volatility, potential for large gains or total loss.*
          `,
          advancedContent: `
### Fixed Income Dynamics, Yield Curves & Synthetic Beta

#### Bond Mechanics:
Bond prices and yields share an **inverse mathematical relationship**:
$$\\Delta P \\approx -D_{mod} \\times \\Delta y$$
Where $D_{mod}$ is Modified Duration. When central banks cut rates, existing high-yielding bond prices surge, generating capital appreciation alongside coupon income.

#### Instrument Matrix:
| Asset Class | Primary Driver | Liquidity Profile | Correlation to Equities | Typical Volatility |
|---|---|---|---|---|
| Sovereign Bonds | Benchmark Rates & Inflation | High (T-Bills) | Low to Negative (-0.2) | 3-8% Ann. |
| Broad Market ETF | Global GDP Growth & Productivity | Very High | 1.0 (Baseline) | 12-18% Ann. |
| Tech Growth Equities | Revenue Expansion & Multiple Expansion | High | High (0.8 - 0.95) | 25-45% Ann. |
| Gold / Precious Metals | Real Rates & Geopolitics | High | Very Low (0.05) | 12-20% Ann. |
| Layer-1 Crypto | Adoption Network Effects & Speculative Liquidity | High / 24-7 | Moderate (0.4 - 0.7) | 60-120% Ann. |
          `,
          balancedPerspective: {
            concept: 'Holding Crypto & High-Beta Speculative Assets',
            advantages: [
              'Asymmetric upside potential: Early-stage technological assets can deliver outsized gains during adoption waves.',
              'Global 24/7 liquidity and permissionless settlement mechanics.'
            ],
            risks: [
              'Extreme drawdowns of 70% to 90% during bear cycles are historically common.',
              'Lack of cash flows or intrinsic book value means pricing is heavily driven by sentiment and liquidity flows.',
              'Regulatory, smart-contract, and custody risks.'
            ]
          },
          quiz: {
            question: 'When interest rates rise across an economy, what generally happens to the market price of existing fixed-rate bonds?',
            options: [
              'Bond prices rise because bonds love high interest rates.',
              'Bond prices fall because newly issued bonds offer higher, more attractive yields.',
              'Bond prices are legally frozen and cannot move.',
              'Bond prices convert directly into company common stock.'
            ],
            correctIndex: 1,
            explanation: 'Bond prices and interest rates move in opposite directions. When new bonds offer 5%, an older existing bond paying 3% drops in market price to match prevailing yields.'
          }
        }
      ]
    },
    {
      id: 'mod_6',
      title: 'Market Psychology & Crash Dynamics',
      icon: '🌪️',
      category: 'Behavioral Finance',
      description: 'Master your emotions: conquer FOMO, panic selling, herd behavior, and understand how to navigate bear markets.',
      lessons: [
        {
          id: 'les_6_1',
          title: 'The Emotional Rollercoaster: FOMO & Panic Selling',
          readTime: '5 min',
          xpReward: 190,
          coinReward: 290,
          simpleContent: `
### Your Biggest Enemy in the Market is in the Mirror

Financial research proves that most individual investors underperform the market not because they picked bad funds, but because of **bad emotional timing**:

1. **FOMO (Fear Of Missing Out)**: An asset has surged +200%. Your friends and social media are bragging about easy money. You jump in at the absolute peak out of greed.
2. **The Dip**: The market starts pulling back. You feel mild anxiety but hold on.
3. **Panic Selling**: The market plunges -35% during scary headlines. You can\'t sleep at night, and you sell everything at the absolute bottom just to stop the pain.
4. **The Recovery**: The market rebounds +50% over the next 18 months, but you missed it because you were sitting in cash.

#### How to Win:
Automate your investing with **Dollar-Cost Averaging (DCA)**: Invest a fixed amount of FinCoins every week/month regardless of whether the market is up or down. You buy more shares when they are cheap and fewer when they are expensive!
          `,
          advancedContent: `
### Behavioral Biases & Heuristics in Market Panics

1. **Loss Aversion (Kahneman & Tversky)**: Psychologically, the emotional pain of losing $1,000 is twice as intense as the pleasure of gaining $1,000. This asymmetry causes panic liquidations near capitulation troughs.
2. **Recency Bias**: Overweighting the most recent market regime. In a bull run, investors believe stocks will rise forever; in a crash, they assume the financial system will collapse.
3. **Disposition Effect**: The tendency to sell winning positions too early to lock in small profits while holding onto massive losing positions in hope of "breaking even".

#### Liquidity Cascades in Market Crashes:
During systemic crashes (e.g. 2008, March 2020), leveraged funds face margin calls, forcing them to sell even their most pristine assets (gold, treasuries) to raise cash. Understanding this dynamic allows disciplined value investors to deploy capital when forced sellers panic.
          `,
          balancedPerspective: {
            concept: 'Dollar-Cost Averaging (DCA) Through Bear Markets',
            advantages: [
              'Removes emotional guesswork and eliminates the impossible task of trying to time the market bottom.',
              'Mathematically lowers your average cost basis during market downturns.',
              'Ensures you never miss the explosive initial days of a new bull market recovery.'
            ],
            risks: [
              'DCA requires mental stamina and steady cash inflow during recessions.',
              'DCA into a failing individual company whose business model is dying will only average down into bankruptcy. (Best used on broad-market index ETFs).'
            ]
          },
          quiz: {
            question: 'What is "Dollar-Cost Averaging" (DCA) and why is it effective against market volatility?',
            options: [
              'Borrowing maximum money from a broker to double down on a falling stock.',
              'Investing a consistent, fixed amount of money at regular intervals, which automatically buys more shares when prices are low and fewer when prices are high.',
              'Selling all assets at 9:30 AM and buying them back at 4:00 PM daily.',
              'Converting all foreign currencies into US Dollars.'
            ],
            correctIndex: 1,
            explanation: 'DCA automates your strategy, lowers average acquisition cost during dips, and removes destructive emotional impulses like FOMO and panic selling.'
          }
        }
      ]
    }
  ],

  // 3. Simulated Assets for Dynamic Market Simulator
  assets: [
    {
      symbol: 'APEX',
      name: 'Apex Neural Inc.',
      category: 'Tech / AI Growth',
      icon: '⚡',
      color: '#3b82f6',
      price: 184.50,
      basePrice: 184.50,
      historicalPrices: [162.0, 165.4, 171.2, 168.0, 175.5, 179.2, 184.5],
      marketCap: '$2.1T',
      peRatio: 38.4,
      beta: 1.65,
      dividendYield: '0.0%',
      riskLevel: 'High Risk',
      riskColor: '#ef4444',
      volatility: 0.035,
      momentum: 0.004,
      description: 'Global pioneer in neural AI accelerators, enterprise cloud intelligence, and quantum microchips.',
      financialStrength: 'Strong (AAA Balance Sheet, $65B Cash, 32% Net Margins)',
      sentiment: 'Bullish (82% Positive)',
      advantages: 'Unmatched AI hardware market share, hyper-growth revenue expansion (+28% YoY).',
      risks: 'Premium valuation multiple vulnerable to interest rate hikes and semiconductor export tariffs.'
    },
    {
      symbol: 'VOLT',
      name: 'VoltGrid Energy Systems',
      category: 'Clean Utility & Infra',
      icon: '🔋',
      color: '#10b981',
      price: 62.80,
      basePrice: 62.80,
      historicalPrices: [59.8, 60.2, 61.0, 60.5, 61.8, 62.1, 62.8],
      marketCap: '$145B',
      peRatio: 16.2,
      beta: 0.78,
      dividendYield: '3.8%',
      riskLevel: 'Medium Risk',
      riskColor: '#f59e0b',
      volatility: 0.016,
      momentum: 0.001,
      description: 'Major utility provider modernizing smart electrical grids, grid-scale battery storage, and nuclear power contracts.',
      financialStrength: 'Stable (Consistent Regulated Cash Flows, High Operating Moat)',
      sentiment: 'Neutral-Positive (64% Positive)',
      advantages: 'High recurring cash flow, resilient demand across economic cycles, healthy 3.8% dividend yield.',
      risks: 'Capital-intensive infrastructure upgrades and sensitive to raw copper/lithium commodity inflation.'
    },
    {
      symbol: 'OMNI',
      name: 'OmniMarket Global 500 ETF',
      category: 'Broad Index ETF',
      icon: '🌐',
      color: '#6366f1',
      price: 412.00,
      basePrice: 412.00,
      historicalPrices: [398.0, 401.5, 405.0, 403.8, 408.2, 410.5, 412.0],
      marketCap: '$8.4T (Fund AUM)',
      peRatio: 22.1,
      beta: 1.00,
      dividendYield: '1.6%',
      riskLevel: 'Low-Medium Risk',
      riskColor: '#3b82f6',
      volatility: 0.012,
      momentum: 0.002,
      description: 'Passively tracks the 500 largest global corporations across 11 distinct economic sectors.',
      financialStrength: 'Exceptional (Maximal Diversification across 500 mega-cap companies)',
      sentiment: 'Stable (70% Positive)',
      advantages: 'Instant broad diversification, eliminates single-company bankruptcy risk, historically compounds ~8-10% annually.',
      risks: 'Still subject to systematic macro recessions and global market drawdowns.'
    },
    {
      symbol: 'BOND',
      name: 'US Sovereign 10-Yr Treasury',
      category: 'Fixed Income / Safe Haven',
      icon: '🏛️',
      color: '#06b6d4',
      price: 98.40,
      basePrice: 98.40,
      historicalPrices: [99.1, 98.9, 98.8, 98.5, 98.2, 98.3, 98.4],
      marketCap: '$24T (Debt Market)',
      peRatio: 'N/A (Yield Driven)',
      beta: -0.15,
      dividendYield: '4.25% Fixed Coupon',
      riskLevel: 'Low Risk',
      riskColor: '#10b981',
      volatility: 0.006,
      momentum: 0.000,
      description: 'Direct sovereign debt issued by the treasury. Pays guaranteed semi-annual interest coupons.',
      financialStrength: 'Highest (Backed by full faith and credit of sovereign treasury)',
      sentiment: 'Defensive Safe Haven',
      advantages: 'Guaranteed principal repayment at maturity, steady fixed income, defensive stabilizer during stock crashes.',
      risks: 'Low capital growth upside, bond market price drops if central bank hikes interest rates further.'
    },
    {
      symbol: 'BFRG',
      name: 'BlockForge Protocol',
      category: 'Layer-1 Crypto / Speculative',
      icon: '💎',
      color: '#a855f7',
      price: 34.20,
      basePrice: 34.20,
      historicalPrices: [26.5, 29.0, 31.4, 28.0, 32.5, 30.1, 34.2],
      marketCap: '$42B',
      peRatio: 'N/A (Network Tokens)',
      beta: 2.85,
      dividendYield: '0.0% (Staking 5.1%)',
      riskLevel: 'Extreme Risk',
      riskColor: '#f43f5e',
      volatility: 0.075,
      momentum: 0.008,
      description: 'High-speed decentralized smart contract blockchain powering Web3 infrastructure, gaming, and DeFi transactions.',
      financialStrength: 'Speculative ($1.2B Foundation Treasury, No Formal Earnings)',
      sentiment: 'Greed (78% Speculative Long)',
      advantages: 'High asymmetric upside during bull adoption cycles; 24/7 global liquidity.',
      risks: 'Extreme 70%+ drawdown potential, severe regulatory risk, smart-contract exploits, highly correlated to speculative hype.'
    },
    {
      symbol: 'GOLD',
      name: 'Aura Physical Gold ETF',
      category: 'Precious Metals / Hedge',
      icon: '🥇',
      color: '#eab308',
      price: 215.80,
      basePrice: 215.80,
      historicalPrices: [208.5, 209.2, 211.0, 212.4, 213.8, 214.5, 215.8],
      marketCap: '$95B (Physical Trust)',
      peRatio: 'N/A (Commodity)',
      beta: 0.08,
      dividendYield: '0.0%',
      riskLevel: 'Low-Medium Risk',
      riskColor: '#3b82f6',
      volatility: 0.011,
      momentum: 0.0015,
      description: '100% physically backed allocated gold bullion stored in secure insured vaults.',
      financialStrength: 'Physical Commodity (5,000+ Year History of Value Preservation)',
      sentiment: 'Steady Hedge (68% Positive)',
      advantages: 'Time-tested hedge against runaway fiat inflation, geopolitical conflict, and currency devaluation.',
      risks: 'Produces zero yield or dividend cash flow; carries small annual vault custody expense ratios.'
    }
  ],

  // 4. Dynamic Market Events Pool
  marketEvents: [
    {
      id: 'evt_fed_hike',
      title: 'Central Bank Unexpected 50bps Interest Rate Hike',
      severity: 'High Impact',
      type: 'Macroeconomic',
      tag: 'SIMULATED EVENT',
      headline: 'Fed Chair announces surprise rate increase to combat sticky inflation! Growth tech slides as bond yields surge.',
      description: 'The Federal Reserve raised the benchmark policy rate by 50 basis points, higher than the 25bps expected. Higher discount rates reduce the present valuation of high-growth tech earnings while boosting yields on sovereign debt.',
      assetImpacts: {
        APEX: -0.092,
        VOLT: -0.018,
        OMNI: -0.038,
        BOND: -0.024,
        BFRG: -0.145,
        GOLD: +0.015
      },
      decisionPrompt: 'How will you respond to this sudden interest rate shock?',
      options: [
        {
          id: 'opt_panic_sell',
          text: 'Panic Sell: Liquidate all APEX and BFRG tech assets to 100% Cash.',
          isPrudent: false,
          riskAdjustment: -15,
          feedback: 'Locking in losses at the immediate bottom of an event reaction often leads to regret when volatility subsides. High cash prevents recovery gains.'
        },
        {
          id: 'opt_rebalance_defensive',
          text: 'Defensive Rebalance: Trim 20% of high-beta tech and allocate into Dividend Utility (VOLT) & Gold (GOLD).',
          isPrudent: true,
          riskAdjustment: +25,
          feedback: 'Smart risk management! Shifting into cash-flow stable utilities and inflation-hedged gold cushions downside volatility while maintaining equity exposure.'
        },
        {
          id: 'opt_hold_dca',
          text: 'Hold & DCA: Stick to your long-term plan and execute a scheduled buy on OMNI index at the discount.',
          isPrudent: true,
          riskAdjustment: +30,
          feedback: 'Masterful investor discipline! Systematic index investors use macro dips to accumulate units at lower valuation multiples without emotional turmoil.'
        },
        {
          id: 'opt_leverage_buy',
          text: 'Speculate: Put 100% of all cash into BFRG crypto hoping for an instant rebound.',
          isPrudent: false,
          riskAdjustment: -30,
          feedback: 'Dangerous gambling! Catching a falling knife in extreme-risk speculative assets during a tightening liquidity cycle risks devastating portfolio wipeouts.'
        }
      ],
      debrief: {
        macroConcept: 'Interest Rate Discounting Effect',
        keyTakeaway: 'When interest rates rise, borrowing becomes more costly and future corporate earnings are discounted at higher hurdle rates. High-growth tech and speculative crypto contract the hardest, whereas cash-generative utilities and inflation hedges demonstrate higher relative resilience.'
      }
    },
    {
      id: 'evt_tech_breakthrough',
      title: 'Apex Neural Unveils Breakthrough 2nm Quantum AI Chip',
      severity: 'Positive Catalyst',
      type: 'Company Catalyst',
      tag: 'SIMULATED EVENT',
      headline: 'Apex Neural shatters industry benchmark with next-gen quantum processor; Q3 revenue outlook raised by 40%!',
      description: 'Apex Neural stunned Wall Street with a live demonstration of a quantum-accelerated chip that slashes AI model training costs by 70%. Enterprise pre-orders have exceeded $18 Billion.',
      assetImpacts: {
        APEX: +0.165,
        VOLT: +0.032,
        OMNI: +0.042,
        BOND: +0.002,
        BFRG: +0.084,
        GOLD: -0.010
      },
      decisionPrompt: 'Apex stock has skyrocketed +16.5% today. What is your strategic move?',
      options: [
        {
          id: 'opt_fomo_buy',
          text: 'FOMO Buy: Sell all your Bonds and Gold to chase APEX at its all-time high.',
          isPrudent: false,
          riskAdjustment: -20,
          feedback: 'Classic FOMO trap! Buying aggressively into parabolic vertical green candles often leaves you exposed when early institutional investors take profit.'
        },
        {
          id: 'opt_trim_rebalance',
          text: 'Take Partial Profits: Trim 15% of your APEX position to rebalance into OMNI and maintain your target asset allocation.',
          isPrudent: true,
          riskAdjustment: +25,
          feedback: 'Institutional grade discipline! Rebalancing after massive runups systematically locks in gains and prevents your portfolio from becoming dangerously concentrated.'
        },
        {
          id: 'opt_let_winner_run',
          text: 'Hold & Set Trailing Stop-Loss: Keep your core APEX position but raise your mental stop-loss to protect realized gains.',
          isPrudent: true,
          riskAdjustment: +20,
          feedback: 'Sound strategy! Allowing winning investments to compound while actively monitoring risk exposure is a hallmark of skilled growth investing.'
        }
      ],
      debrief: {
        macroConcept: 'Concentration Risk & Systematic Profit Taking',
        keyTakeaway: 'When an individual holding surges, its percentage weight in your portfolio balloons. If APEX grows from 15% to 45% of your total net worth, you become hyper-exposed to any future negative company-specific news. Rebalancing systematically forces you to "buy low, sell high".'
      }
    },
    {
      id: 'evt_market_crash',
      title: 'BLACK MONDAY: Global Supply Shock & Liquidity Flash Crash',
      severity: 'CRISIS ALERT',
      type: 'Systemic Crisis',
      tag: 'SIMULATED EVENT',
      headline: 'Circuit breakers triggered! Geopolitical trade embargo halts semiconductor shipping lanes; Global equities plunge.',
      description: 'A sudden escalation in international trade restrictions has halted 60% of international maritime shipping routes. Margin calls across algorithmic hedge funds have triggered an indiscriminate worldwide liquidation event.',
      assetImpacts: {
        APEX: -0.198,
        VOLT: -0.065,
        OMNI: -0.115,
        BOND: +0.048,
        BFRG: -0.275,
        GOLD: +0.052
      },
      decisionPrompt: 'The entire market is in red panic! How do you handle this severe flash crash?',
      options: [
        {
          id: 'opt_panic_bottom',
          text: 'Capitulate: Sell your entire portfolio to cash to avoid losing another single FinCoin.',
          isPrudent: false,
          riskAdjustment: -25,
          feedback: 'Disastrous emotional mistake! Selling during peak capitulation converts paper losses into permanent capital destruction right before liquidity stabilizes.'
        },
        {
          id: 'opt_flight_to_safety',
          text: 'Flight to Quality: Hold your diversified assets; use reserve cash to DCA into OMNI Index and Sovereign Bonds.',
          isPrudent: true,
          riskAdjustment: +35,
          feedback: 'Heroic market survival! Buying diversified index funds when fear is at an extreme historical maximum is how legendary generational wealth is built.'
        },
        {
          id: 'opt_hold_firm',
          text: 'Review & Hold: Do not look at minute-by-minute prices; verify your emergency cash is intact and wait out the panic.',
          isPrudent: true,
          riskAdjustment: +20,
          feedback: 'Resilient psychology. Doing nothing during a panic is far superior to emotional panic-selling.'
        }
      ],
      debrief: {
        macroConcept: 'Flight to Safety & Systemic Drawdown Recovery',
        keyTakeaway: 'During systemic market panics, correlations temporarily converge toward 1 as forced sellers liquidate everything. However, sovereign bonds and gold typically demonstrate negative correlation (rising as stocks fall), proving why a multi-asset all-weather portfolio is essential for long-term survival.'
      }
    }
  ],

  // 5. Interactive Real-World Case Studies
  caseStudies: [
    {
      id: 'case_1',
      title: 'The 10,000 FinCoin Windfall Dilemma',
      difficulty: 'Intermediate',
      category: 'Asset Allocation & Risk',
      bannerImage: 'windfall',
      scenario: `You just received a one-time performance bonus of 10,000 FinCoins! 
You currently have zero debt, but you have only 1 month of emergency living expenses saved up in your bank account.

Two enticing paths lie ahead:
- **Option A (High Stakes Tech)**: Allocate all 10,000 FinCoins into *Apex Neural*—which is trending on social media and rumored to win a massive government AI contract.
- **Option B (The Resilient All-Weather Split)**: Put 3,000 FinCoins into your Emergency Buffer (Cash/Bonds), 4,500 FinCoins into *OmniMarket 500 ETF*, 1,500 into *VoltGrid Utility*, and 1,000 into *Apex Neural*.
- **Option C (Ultra-Conservative)**: Keep all 10,000 FinCoins in cash checking (0% yield).`,
      choices: [
        {
          id: 'c1_choice_a',
          title: 'Option A: 100% All-In on Apex Neural',
          riskLevel: 'Extreme Concentration Risk',
          simulatedOutcome: {
            year1: 'Month 4: Apex Neural faces an unexpected regulatory antitrust investigation. The stock drops -38%. Your 10,000 FinCoins shrink to 6,200 FinCoins.',
            year3: 'Month 14: You have an unexpected medical emergency. Because you had no emergency fund, you are forced to sell your remaining Apex shares at the bottom to pay medical bills. Total realized loss: -3,800 FinCoins.',
            netOutcomeScore: 25,
            lessons: 'Concentration risk combined with a lack of cash reserves creates forced liquidations at market troughs.'
          }
        },
        {
          id: 'c1_choice_b',
          title: 'Option B: The Resilient All-Weather Split (Recommended)',
          riskLevel: 'Optimized Risk-Adjusted Allocation',
          simulatedOutcome: {
            year1: 'Month 4: When Apex dips -38%, your diversified OMNI ETF (+8%) and VoltGrid dividends (+3.8%) absorb the shock. Your emergency cash is safely untouched.',
            year3: 'Month 14: Medical emergency strikes—you pay it effortlessly from your 3,000 FinCoin emergency reserve without selling a single share! By Year 3, your portfolio has grown to 12,850 FinCoins (+28.5%).',
            netOutcomeScore: 100,
            lessons: 'Emergency reserves insulate your compounding assets from forced liquidations, allowing time and diversification to work their magic.'
          }
        },
        {
          id: 'c1_choice_c',
          title: 'Option C: 100% Idle Cash in Checking',
          riskLevel: 'High Inflation Drag Risk',
          simulatedOutcome: {
            year1: 'Your balance stays at exactly 10,000 FinCoins. However, consumer inflation rose +6.5%.',
            year3: 'By Year 3, inflation has compounded to +18%. While your account still says 10,000, your real purchasing power has dropped to the equivalent of ~8,200 FinCoins.',
            netOutcomeScore: 50,
            lessons: 'Cash feels safe in nominal terms, but guarantees a silent, permanent loss of purchasing power in real terms.'
          }
        }
      ]
    },
    {
      id: 'case_2',
      title: 'The Rising Inflation Dilemma: 7% Inflation Shock',
      difficulty: 'Advanced',
      category: 'Macroeconomic Positioning',
      bannerImage: 'inflation',
      scenario: `The central statistical bureau announces that annual consumer price inflation has spiked to **7.2%**, driven by energy shortages and supply chain gridlock.

Your standard savings account yields only **1.5% APY**. Every month you leave your capital idle, you are losing ~5.7% of your real purchasing power.

How will you reposition your 20,000 FinCoin portfolio?`,
      choices: [
        {
          id: 'c2_choice_a',
          title: 'Strategy 1: Move 100% into High-Beta Crypto (BFRG) to "Outrun Inflation Fast"',
          riskLevel: 'Catastrophic Speculation Risk',
          simulatedOutcome: {
            year1: 'Central banks respond to high inflation by aggressively hiking interest rates. Liquidity evaporates. Speculative crypto crashes -62%. Your 20,000 FinCoins drops to 7,600 FinCoins.',
            year3: 'Recovery is slow and volatile. You experience severe anxiety and sleepless nights.',
            netOutcomeScore: 20,
            lessons: 'High inflation triggers central bank rate hikes, which crushes speculative, non-cashflow-generating assets.'
          }
        },
        {
          id: 'c2_choice_b',
          title: 'Strategy 2: Balanced Real-Asset Hedge (Gold + Dividend Energy + Index ETF + Short Treasuries)',
          riskLevel: 'Disciplined Macro Hedge',
          simulatedOutcome: {
            year1: 'Gold surges +12% as a currency hedge. VoltGrid Energy passes higher electricity costs to consumers (+14%). Short Treasuries roll over into 5% yields. Your portfolio gains +10.4%, beating inflation easily!',
            year3: 'Your portfolio maintains its real purchasing power and generates consistent dividend cash flow regardless of macro turbulence.',
            netOutcomeScore: 100,
            lessons: 'Companies with pricing power (utilities) and commodities (gold) provide natural inflation pass-through protection.'
          }
        }
      ]
    }
  ],

  // 6. Searchable Financial Glossary (40+ Key Terms)
  glossary: [
    {
      term: 'Asset',
      category: 'Fundamentals',
      definition: 'A resource with economic value that an individual, corporation, or country owns or controls with the expectation that it will generate future cash flows or capital appreciation.',
      example: 'Owning shares of a profitable company, a rental property, or treasury bonds.',
      importance: 'Assets generate wealth and positive cash flows, unlike liabilities which deplete cash.',
      risks: 'Assets can decrease in market value or become illiquid during economic crises.'
    },
    {
      term: 'Liability',
      category: 'Fundamentals',
      definition: 'Something a person or company owes, usually a sum of money, resulting from past transactions or obligations.',
      example: 'Credit card debt, car loans, mortgages, or unpaid invoices.',
      importance: 'Managing liabilities is essential to prevent insolvency, default, and bankruptcy.',
      risks: 'High-interest liabilities compound negatively, consuming income before it can be saved or invested.'
    },
    {
      term: 'Compound Interest',
      category: 'Fundamentals',
      definition: 'Interest calculated on the initial principal, which also includes all of the accumulated interest from previous periods ("interest on interest").',
      example: 'Investing $10,000 at 8% annual return grows to $21,589 in 10 years and $46,609 in 20 years without adding another penny.',
      importance: 'Albert Einstein famously called compound interest the "eighth wonder of the world"—it is the fundamental engine of long-term wealth creation.',
      risks: 'Compound interest works in reverse against you if you carry high-interest debt!'
    },
    {
      term: 'Diversification',
      category: 'Risk Management',
      definition: 'A risk-management strategy that mixes a wide variety of investments within a portfolio to reduce unsystematic risk.',
      example: 'Holding a basket of tech stocks, energy utilities, government bonds, and gold rather than putting 100% of your money into one single tech startup.',
      importance: 'Provides the "free lunch" of investing: lowers overall portfolio volatility without necessarily sacrificing expected long-term returns.',
      risks: 'Over-diversification ("di-worsification") can dilute returns from your highest-conviction investments.'
    },
    {
      term: 'Concentration Risk',
      category: 'Risk Management',
      definition: 'The probability of loss arising from having a large percentage of your portfolio invested in a single asset, company, industry, or geographic region.',
      example: 'Having 85% of your life savings in one single cryptocurrency or one company\'s stock.',
      importance: 'Recognizing concentration risk prevents single-event catastrophic bankruptcy.',
      risks: 'If that single company suffers fraud, regulatory fines, or technological obsolescence, your entire net worth is decimated.'
    },
    {
      term: 'Market Capitalization (Market Cap)',
      category: 'Equities',
      definition: 'The total dollar market value of a company\'s outstanding shares of stock ($Market Cap = Share Price \\times Total Shares$).',
      example: 'A company with 100 million shares trading at $50 per share has a Market Cap of $5 Billion (Mid-Cap).',
      importance: 'Allows investors to understand the true size of a company rather than judging it simply by its share price.',
      risks: 'Small-cap companies (<$2B) typically experience much higher volatility and bankruptcy risk than mega-cap companies (>$200B).'
    },
    {
      term: 'Price-to-Earnings Ratio (P/E Ratio)',
      category: 'Equities',
      definition: 'A valuation ratio comparing a company\'s current share price to its annual earnings per share (EPS).',
      example: 'If a stock trades at $100 and earns $5 per share per year, its P/E ratio is 20 (meaning investors pay $20 for every $1 of annual profit).',
      importance: 'Helps determine whether a stock is overvalued, fairly valued, or undervalued relative to historical norms and sector peers.',
      risks: 'A low P/E could be a "value trap" indicating a dying business with shrinking future earnings.'
    },
    {
      term: 'Dividend Yield',
      category: 'Equities',
      definition: 'The annual percentage of a company\'s share price that it pays out in cash dividends to shareholders ($Dividend Yield = Annual Dividends / Share Price$).',
      example: 'A stock priced at $50 that pays $2.00 per year in quarterly dividends has a Dividend Yield of 4.0%.',
      importance: 'Provides steady passive cash flow that can be spent or reinvested to accelerate compounding.',
      risks: 'Extremely high yields (>9%) often signal a company in financial distress whose dividend is about to be slashed.'
    },
    {
      term: 'Beta (Volatility Measure)',
      category: 'Equities',
      definition: 'A measure of the volatility or systematic risk of a security in comparison to the broader market (usually S&P 500 = 1.0).',
      example: 'A stock with a Beta of 1.5 is expected to move 15% when the broader market moves 10%. A utility with Beta 0.6 moves only 6%.',
      importance: 'Helps calibrate portfolio volatility according to your personal risk tolerance.',
      risks: 'High-beta stocks experience severe drawdowns during market corrections.'
    },
    {
      term: 'Exchange-Traded Fund (ETF)',
      category: 'Asset Classes',
      definition: 'An investment fund traded on stock exchanges, much like individual stocks, that holds a collection of underlying assets (stocks, bonds, commodities).',
      example: 'Buying 1 share of an S&P 500 ETF (like OMNI) instantly gives you exposure to 500 top companies with a single click.',
      importance: 'Democratizes institutional-grade diversification with ultra-low expense fees and intraday liquidity.',
      risks: 'Sector-specific ETFs (e.g. clean energy or biotech) can still experience extreme industry volatility.'
    },
    {
      term: 'Sovereign Treasury Bond',
      category: 'Fixed Income',
      definition: 'A government debt security issued to fund national expenditures, offering periodic interest payments and guaranteed principal repayment upon maturity.',
      example: 'A 10-year US Treasury bond paying a guaranteed 4.2% annual coupon yield.',
      importance: 'Considered among the safest fixed-income instruments in the world; serves as a defensive anchor during stock panics.',
      risks: 'Existing bond prices fall when interest rates rise; yields may not outpace high inflation.'
    },
    {
      term: 'Inflation',
      category: 'Macroeconomics',
      definition: 'The general, sustained increase in prices of goods and services over time, resulting in a loss of currency purchasing power.',
      example: 'A cup of coffee that cost $1.50 twenty years ago costing $4.50 today.',
      importance: 'Forces savers to invest in assets with returns that exceed the inflation rate to prevent real wealth erosion.',
      risks: 'High inflation reduces consumer discretionary spending and triggers central bank rate hikes.'
    },
    {
      term: 'Liquidity',
      category: 'Fundamentals',
      definition: 'The ease and speed with which an asset can be converted into ready cash without significantly affecting its market price.',
      example: 'Cash and large-cap stocks are highly liquid (convert in seconds); real estate or fine art is illiquid (takes months to sell).',
      importance: 'Ensures you have immediate funds available during emergency crises without accepting massive fire-sale discounts.',
      risks: 'Holding illiquid assets can trap your capital when you need money urgently.'
    },
    {
      term: 'Dollar-Cost Averaging (DCA)',
      category: 'Strategy',
      definition: 'An investment technique of buying a fixed dollar amount of a particular investment on a regular schedule, regardless of share price.',
      example: 'Automatically investing 200 FinCoins into the OMNI Index on the 1st of every month.',
      importance: 'Eliminates emotional market timing and mathematically lowers average cost per share during dips.',
      risks: 'In a sustained uninterrupted multi-year bull market, lump-sum investing can sometimes slightly outperform DCA.'
    },
    {
      term: 'Stop-Loss Order',
      category: 'Trading',
      definition: 'An order placed with a broker to sell a security when it reaches a specific price point to limit an investor\'s loss on a position.',
      example: 'Buying a stock at $100 and placing a stop-loss at $90 to ensure you never lose more than 10%.',
      importance: 'Removes emotional hesitation and enforces strict capital preservation.',
      risks: 'High market volatility can trigger the stop-loss during a temporary dip before the price rebounds.'
    },
    {
      term: 'FOMO (Fear Of Missing Out)',
      category: 'Behavioral Finance',
      definition: 'The psychological anxiety that an investor feels when seeing other people make quick profits in a surging asset, prompting them to buy at inflated peak prices.',
      example: 'Rushing to buy a speculative meme coin after it has already gained 800% in a week.',
      importance: 'Recognizing FOMO is the first step to avoiding buying at euphoric market tops.',
      risks: 'FOMO almost always leads to buying near cyclical peaks right before early smart money dumps their shares.'
    },
    {
      term: 'Panic Selling',
      category: 'Behavioral Finance',
      definition: 'The rapid, emotionally-driven mass liquidation of investments by investors terrified of losing all their capital during a market crash.',
      example: 'Dumping all your index funds after a 20% pullback because scary headlines predict an economic collapse.',
      importance: 'Understanding panic dynamics allows disciplined investors to keep calm and buy discounted assets.',
      risks: 'Converts temporary paper unrealized drawdowns into permanent, irrecoverable capital losses.'
    },
    {
      term: 'Bull Market vs. Bear Market',
      category: 'Fundamentals',
      definition: 'A Bull Market is a sustained period of rising prices (typically +20% from a trough) accompanied by optimism. A Bear Market is a prolonged decline of 20% or more from recent peaks accompanied by pessimism.',
      example: 'The 2009-2020 historic equity expansion was a legendary Bull Market; 2008 was a brutal Bear Market.',
      importance: 'Helps set realistic time horizons and expectations for portfolio returns across multi-year cycles.',
      risks: 'Assuming a bull market will last forever leads to excessive leverage and reckless risk-taking.'
    },
    {
      term: 'Realized vs. Unrealized Profit/Loss',
      category: 'Trading',
      definition: 'An Unrealized (Paper) P&L is the theoretical gain/loss on an open position. It only becomes a Realized P&L once the asset is officially sold.',
      example: 'Buying APEX at $100 and it rises to $150 gives you +$50 unrealized gain. Selling it locks in the +$50 realized profit.',
      importance: 'Paper gains can evaporate overnight if risk is not managed.',
      risks: 'Treating paper unrealized gains as guaranteed spending money before closing the position.'
    },
    {
      term: 'Sharpe Ratio',
      category: 'Risk Management',
      definition: 'A mathematical ratio that measures the performance of an investment compared to a risk-free asset, after adjusting for its risk ($\\text{Sharpe} = (R_p - R_f) / \\sigma_p$).',
      example: 'A portfolio returning 12% with 6% volatility has a Sharpe ratio of 1.5, far superior to one returning 14% with 25% wild volatility.',
      importance: 'Reveals whether high returns are due to smart investment decisions or reckless excess risk-taking.',
      risks: 'Relies on historical standard deviation which can underestimate rare "Black Swan" tail-risk events.'
    }
  ],

  // 7. Gamification Badges
  badges: [
    { id: 'first_trade', title: 'First Trade', icon: '🪙', description: 'Executed your first simulated trade in the market.', unlocked: false },
    { id: 'quiz_master', title: 'Quiz Master', icon: '🎓', description: 'Scored 100% on three educational lesson quizzes.', unlocked: false },
    { id: 'risk_guardian', title: 'Risk Guardian', icon: '🛡️', description: 'Maintained a diversified portfolio with <35% single asset concentration.', unlocked: false },
    { id: 'crash_survivor', title: 'Crash Survivor', icon: '🌪️', description: 'Successfully navigated a simulated flash crash without panic selling.', unlocked: false },
    { id: 'case_study_ace', title: 'Case Study Ace', icon: '🧠', description: 'Solved a real-world case study with the highest risk-adjusted score.', unlocked: false },
    { id: 'portfolio_builder', title: 'Portfolio Builder', icon: '💼', description: 'Constructed an all-weather portfolio with 4+ distinct asset classes.', unlocked: false },
    { id: 'streak_champion', title: 'Streak Champion', icon: '🔥', description: 'Completed learning activities 3 days in a row.', unlocked: false },
    { id: 'finance_master', title: 'Finance Master', icon: '👑', description: 'Reached Level 5+ and achieved a Smart Learning Score above 750.', unlocked: false }
  ],

  // 8. Daily Challenges
  dailyChallenges: [
    {
      id: 'ch_1',
      title: 'Balanced Asset Allocator',
      description: 'Own at least 3 distinct asset classes (e.g. Tech, Utility, Bonds, or Gold) in your simulator portfolio.',
      rewardCoins: 300,
      rewardXP: 150,
      completed: false
    },
    {
      id: 'ch_2',
      title: 'Risk Wisdom Quiz',
      description: 'Complete the Risk Management & Diversification lesson and pass its quiz.',
      rewardCoins: 250,
      rewardXP: 120,
      completed: false
    },
    {
      id: 'ch_3',
      title: 'Financial Detective',
      description: 'Explore at least 3 terms in the Financial Glossary and review their real-world risks.',
      rewardCoins: 150,
      rewardXP: 80,
      completed: false
    }
  ],

  // 9. Curated Financial News & Real vs Sim Distinction
  realNewsFeed: [
    {
      id: 'rn_1',
      source: 'Global Financial Daily',
      category: 'REAL MACRO NEWS',
      time: '2 hours ago',
      title: 'Global Central Banks Signal "Higher for Longer" Benchmark Interest Rate Stance',
      summary: 'Monetary policy committees emphasize persistent service sector inflation, indicating rate cuts may be delayed until fiscal year-end.',
      educationalNote: 'Notice how bond yields react to rate expectations. When rates stay high, cash and short-term treasuries remain attractive alternatives to risky growth stocks.'
    },
    {
      id: 'rn_2',
      source: 'Tech Market Wire',
      category: 'REAL TECH NEWS',
      time: '5 hours ago',
      title: 'Semiconductor Foundry Capacity Reaches 94% Utilization Amid AI Infrastructure Surge',
      summary: 'Major chip manufacturers report overflowing order backlogs for enterprise AI training accelerators and datacenter memory modules.',
      educationalNote: 'High capacity utilization is great for revenue, but leaves zero buffer if unexpected supply chain disruptions occur.'
    },
    {
      id: 'rn_3',
      source: 'Personal Wealth Journal',
      category: 'REAL PERSONAL FINANCE',
      time: '1 day ago',
      title: 'Survey: Over 60% of Young Adults Rely on High-Yield Savings Accounts to Beat Inflation',
      summary: 'Young investors increasingly pair broad-market index ETFs with 4.5%+ HYSA emergency funds to manage lifestyle risks.',
      educationalNote: 'A classic Tier 1 emergency buffer protects your mental well-being and prevents forced liquidations during stock drawdowns.'
    }
  ],

  // 10. Initial Global Leaderboard
  leaderboard: [
    { rank: 1, name: 'Elena Rostova', level: 'Finance Strategist', smartScore: 890, xp: 8450, badges: 7, avatar: '👩‍💼' },
    { rank: 2, name: 'Marcus Sterling', level: 'Market Analyst', smartScore: 845, xp: 7120, badges: 6, avatar: '👨‍🔬' },
    { rank: 3, name: 'Aaliyah Chen', level: 'Market Analyst', smartScore: 810, xp: 6890, badges: 6, avatar: '👩‍💻' },
    { rank: 4, name: 'Devon Vance', level: 'Investment Explorer', smartScore: 760, xp: 4200, badges: 5, avatar: '🧑‍🚀' },
    { rank: 5, name: 'You (Player)', level: 'Finance Beginner', smartScore: 500, xp: 200, badges: 1, avatar: '🎓', isUser: true }
  ]
};
