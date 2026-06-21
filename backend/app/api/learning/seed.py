from sqlalchemy.orm import Session
from app.models.learning import LearningModule, Quiz, QuizQuestion

def seed_initial_modules(db: Session):
    if db.query(LearningModule).first():
        return # Already seeded

    modules_data = [
        {
            "title": "Investing Basics",
            "description": "A comprehensive introduction to why we invest and the core principles of growing wealth.",
            "category": "Investing Basics",
            "difficulty": "Beginner",
            "estimated_minutes": 10,
            "order_index": 1,
            "is_featured": True,
            "content": """# The Core Philosophy of Investing

Investing is often misunderstood as a get-rich-quick scheme or a domain reserved solely for financial experts. At its core, investing is the practice of allocating resources—usually capital—with the expectation of generating an income or profit over time. By putting your money to work, you harness the power of compound growth, allowing your initial capital to generate its own earnings, which in turn generate even more earnings.

## Why Invest?
The fundamental reason to invest is to outpace inflation. Inflation is the gradual loss of purchasing power over time. If you leave your money in a traditional checking account yielding near 0% interest, and inflation averages 2-3% annually, your real wealth is actively shrinking. Investing aims to yield returns that significantly surpass inflation, preserving and expanding your purchasing power.

## Time Horizon and Compounding
The most powerful tool an investor possesses is not capital, but time. Compound interest is often referred to as the "eighth wonder of the world." The earlier you begin investing, the less principal you need to contribute to achieve your financial goals. A dollar invested in your 20s has decades to compound, potentially multiplying many times over before retirement.

## Asset Classes Overview
Investors typically allocate their capital across various asset classes:
1. **Equities (Stocks)**: Represent ownership in a corporation. Historically, equities have provided the highest long-term returns but come with higher short-term volatility.
2. **Fixed Income (Bonds)**: Essentially loans made by an investor to a borrower (corporate or government). They pay a fixed interest rate over a specified period and are generally less volatile than stocks.
3. **Cash Equivalents**: Highly liquid, low-risk assets like money market funds. They offer minimal returns but provide extreme safety and liquidity.
4. **Alternative Investments**: Includes real estate, commodities, and increasingly, cryptocurrencies. These provide diversification away from traditional stock and bond markets.

## The Rule of 72
A quick heuristic used in investing is the Rule of 72. By dividing 72 by the expected annual rate of return, you can estimate how many years it will take for your investment to double. For example, at an 8% annual return, your money will double approximately every 9 years (72 / 8 = 9).

Understanding these fundamental concepts is the first step toward building a robust, resilient portfolio capable of weathering economic cycles and achieving long-term financial independence.""",
            "quiz": {
                "title": "Investing Basics Mastery",
                "questions": [
                    {
                        "question": "What is the primary reason individuals should invest their money?",
                        "option_a": "To guarantee short-term profits within a year.",
                        "option_b": "To outpace inflation and preserve purchasing power.",
                        "option_c": "To avoid paying any income taxes.",
                        "option_d": "To fund day-to-day living expenses.",
                        "correct_answer": "B",
                        "explanation": "Investing allows your capital to grow at a rate faster than inflation, preserving its purchasing power over time."
                    },
                    {
                        "question": "According to the Rule of 72, if an investment yields a 6% annual return, how long will it take to double?",
                        "option_a": "6 years",
                        "option_b": "10 years",
                        "option_c": "12 years",
                        "option_d": "72 years",
                        "correct_answer": "C",
                        "explanation": "72 divided by the expected return (6) equals 12 years."
                    }
                ]
            }
        },
        {
            "title": "Understanding Stocks",
            "description": "Deep dive into equities, market capitalization, and how companies raise capital.",
            "category": "Stocks",
            "difficulty": "Beginner",
            "estimated_minutes": 15,
            "order_index": 2,
            "is_featured": False,
            "content": """# Demystifying the Stock Market

When you buy a stock, you are not merely purchasing a ticker symbol on a screen; you are buying a fractional ownership stake in a real, functioning business. This ownership stake is known as equity. As an equity holder, you possess a claim on a portion of the corporation's assets and future earnings.

## How Companies Raise Capital
Businesses need capital to grow, fund research and development, build new factories, or hire more employees. They generally have two main avenues to raise this capital:
1. **Debt Financing**: Borrowing money by issuing bonds or taking out bank loans. This debt must be repaid with interest, regardless of how well the business performs.
2. **Equity Financing**: Selling a portion of the company to the public. The company issues shares of stock through an Initial Public Offering (IPO). Unlike debt, this money does not need to be repaid, but the original owners dilute their ownership and share future profits with the new shareholders.

## What Drives Stock Prices?
In the short term, stock prices are driven heavily by supply, demand, market sentiment, macroeconomic news, and psychological factors. However, over the long term, a stock's price is inextricably tied to the fundamental performance of the underlying business—specifically, its ability to generate and grow its earnings (profits) and cash flow. 

If a company consistently grows its earnings, the value of the business increases, and the stock price will eventually follow. Conversely, if earnings decline, the stock price will typically drop.

## Market Capitalization
Market Capitalization (or Market Cap) is the total market value of a company's outstanding shares of stock. It is calculated by multiplying the current share price by the total number of outstanding shares. Market cap is used to categorize companies into different tiers:
- **Large-Cap**: Typically over $10 billion. These are usually mature, well-established companies (e.g., Apple, Microsoft).
- **Mid-Cap**: Between $2 billion and $10 billion. Often companies in a growth phase.
- **Small-Cap**: Between $300 million and $2 billion. These companies offer higher growth potential but come with significantly higher risk and volatility.

## Dividends vs. Capital Gains
Investors generate returns from stocks in two primary ways:
1. **Capital Gains**: Selling the stock for a higher price than what was paid.
2. **Dividends**: A distribution of a portion of a company's earnings paid directly to shareholders. Mature companies with steady cash flows often pay dividends, whereas rapidly growing companies typically reinvest all earnings back into the business to fuel further expansion.""",
            "quiz": {
                "title": "Stock Market Fundamentals",
                "questions": [
                    {
                        "question": "What does a share of stock represent?",
                        "option_a": "A loan made to the company.",
                        "option_b": "Fractional ownership in the company.",
                        "option_c": "A guarantee of future dividend payments.",
                        "option_d": "A fixed-interest security.",
                        "correct_answer": "B",
                        "explanation": "Buying a stock means you are buying equity, which is fractional ownership in the business."
                    },
                    {
                        "question": "How is a company's Market Capitalization calculated?",
                        "option_a": "Annual Revenue multiplied by Net Profit Margin.",
                        "option_b": "Total Assets minus Total Liabilities.",
                        "option_c": "Current Share Price multiplied by Total Outstanding Shares.",
                        "option_d": "Initial Public Offering price multiplied by volume.",
                        "correct_answer": "C",
                        "explanation": "Market Cap represents the total value of all outstanding shares based on the current market price."
                    }
                ]
            }
        },
        {
            "title": "ETFs Explained",
            "description": "Learn how Exchange Traded Funds offer instant diversification and lower costs.",
            "category": "ETFs",
            "difficulty": "Beginner",
            "estimated_minutes": 12,
            "order_index": 3,
            "is_featured": True,
            "content": """# Exchange Traded Funds (ETFs)

Exchange Traded Funds (ETFs) have revolutionized the investing landscape, democratizing access to diversified portfolios that were once reserved for institutional investors. An ETF is a type of investment fund and exchange-traded product that holds assets such as stocks, commodities, or bonds. 

## The Core Concept
Imagine wanting to own a tiny piece of every single one of the 500 largest companies in the United States. Buying individual shares of all 500 companies would require enormous capital and result in exorbitant transaction fees. An ETF solves this problem. 

An ETF provider (like Vanguard or BlackRock) creates a fund that buys all 500 of those stocks. The provider then slices that fund into millions of shares and sells those shares to individual investors on the stock exchange. By buying a single share of an S&P 500 ETF, you gain instant, fractional exposure to 500 different companies.

## ETFs vs. Mutual Funds
While both pool investor money to buy a basket of assets, they differ mechanically:
- **Trading**: ETFs trade on exchanges throughout the day like individual stocks, meaning their price fluctuates continuously. Mutual funds are priced only once per day at the end of the trading session.
- **Costs**: ETFs are overwhelmingly "passively managed," meaning their goal is simply to track an existing index (like the Nasdaq 100). Because they don't require expensive teams of analysts trying to "beat the market," their expense ratios (management fees) are incredibly low—often less than 0.10% annually.
- **Tax Efficiency**: Due to the unique way ETFs create and redeem shares behind the scenes, they generally trigger fewer capital gains taxes for long-term holders compared to mutual funds.

## The Power of Diversification
The most significant advantage of an ETF is diversification. Diversification is the practice of spreading your investments around so that your exposure to any one type of asset is limited. 

If you invest all your money in a single technology company, your entire portfolio's fate is tied to that one company's success or failure. If you invest in a technology ETF, the failure of one company is buffered by the success of dozens of others within the same fund. This dramatically lowers the unsystematic risk (company-specific risk) in your portfolio.

## Types of ETFs
- **Broad Market ETFs**: Track entire stock markets (e.g., Total Stock Market ETFs).
- **Sector ETFs**: Focus on specific industries like healthcare, technology, or energy.
- **Bond ETFs**: Provide exposure to corporate or government debt.
- **Thematic ETFs**: Focus on specific trends like clean energy, artificial intelligence, or robotics.

For most retail investors, a portfolio anchored by low-cost, broad-market index ETFs is considered the most reliable strategy for long-term wealth accumulation.""",
            "quiz": {
                "title": "ETF Knowledge Check",
                "questions": [
                    {
                        "question": "What is the primary advantage of investing in an ETF?",
                        "option_a": "They guarantee higher returns than individual stocks.",
                        "option_b": "They provide instant diversification across many assets.",
                        "option_c": "They are completely immune to market crashes.",
                        "option_d": "They prevent you from paying any taxes.",
                        "correct_answer": "B",
                        "explanation": "ETFs hold a basket of assets, allowing you to diversify your portfolio instantly by buying a single share."
                    },
                    {
                        "question": "How do ETFs generally differ from traditional Mutual Funds?",
                        "option_a": "ETFs trade continuously throughout the day like stocks.",
                        "option_b": "ETFs are only priced once at the end of the trading day.",
                        "option_c": "ETFs typically have much higher management fees.",
                        "option_d": "ETFs are exclusively actively managed by hedge funds.",
                        "correct_answer": "A",
                        "explanation": "Unlike mutual funds which settle once a day, ETFs trade on exchanges continuously throughout normal market hours."
                    }
                ]
            }
        },
        {
            "title": "Risk vs Reward",
            "description": "Understanding the fundamental tradeoff between risk tolerance and potential returns.",
            "category": "Risk Management",
            "difficulty": "Intermediate",
            "estimated_minutes": 15,
            "order_index": 4,
            "is_featured": False,
            "content": """# The Risk/Return Tradeoff

The risk/return tradeoff is arguably the most fundamental principle in all of finance. It states that the potential return on an investment rises with an increase in risk. To achieve higher potential returns, an investor must be willing to accept higher volatility and a greater probability of losing some or all of their principal.

## Defining Financial Risk
In everyday language, risk simply means the possibility of a bad outcome. In finance, risk is quantified as **volatility**—the degree of variation of a trading price over time. A highly volatile asset (like a small-cap tech stock or cryptocurrency) might jump 5% one day and crash 8% the next. A low-volatility asset (like a US Treasury bond) might only fluctuate by fractions of a percent.

Risk isn't inherently "bad"; it is the price of admission for superior returns. If there were no risk, there would be no premium paid to investors to incentivize them to part with their capital.

## The Spectrum of Risk
Investments exist on a spectrum:
- **Cash / Treasury Bills**: Near-zero risk. The US government guarantees the return. Consequently, the return is usually very low, often struggling to beat inflation.
- **Corporate Bonds**: Moderate risk. You are lending money to companies. If the company goes bankrupt, you could lose money. Therefore, corporate bonds pay higher interest rates than government bonds.
- **Large-Cap Stocks**: High risk. The stock market is volatile, and companies can face massive downturns. Over decades, however, they compensate investors with much higher average returns.
- **Small-Cap / Emerging Markets / Crypto**: Very high risk. Massive volatility, high failure rates, but the potential for exponential multibagger returns.

## Assessing Your Risk Tolerance
Risk tolerance is highly personal and generally depends on two factors:
1. **Time Horizon**: When do you need the money? If you are 25 investing for retirement at 65, you have 40 years to ride out market crashes. You can afford maximum risk. If you are 60 and retiring in two years, a 30% market crash would be catastrophic. Your risk tolerance is much lower.
2. **Psychological Tolerance**: Can you stomach seeing your portfolio drop by 40% in a single year (as it did in 2008) without panicking and selling at the bottom? An investor's psychological fortitude is often their weakest link.

## Drawdowns and Recovery
A "drawdown" is the peak-to-trough decline during a specific period. It is critical to understand the math of drawdowns:
- If a $10,000 portfolio drops by 50%, it is now worth $5,000.
- To get back to $10,000, the portfolio does not need a 50% return; it needs a **100% return**.
This asymmetrical math emphasizes why catastrophic losses destroy long-term wealth, and why risk management (usually through diversification) is absolutely essential.""",
            "quiz": {
                "title": "Risk Management Quiz",
                "questions": [
                    {
                        "question": "According to the risk/return tradeoff, how are risk and potential return related?",
                        "option_a": "Higher risk usually implies lower potential returns.",
                        "option_b": "Risk and return have no mathematical correlation.",
                        "option_c": "Higher potential returns require accepting higher levels of risk.",
                        "option_d": "High returns can be consistently achieved with zero risk.",
                        "correct_answer": "C",
                        "explanation": "Investors demand a 'risk premium' (higher expected returns) as compensation for taking on greater uncertainty and volatility."
                    },
                    {
                        "question": "If your portfolio experiences a 50% drawdown, what percentage return is required to break even?",
                        "option_a": "25%",
                        "option_b": "50%",
                        "option_c": "75%",
                        "option_d": "100%",
                        "correct_answer": "D",
                        "explanation": "If $100 drops 50% to $50, you need to double that $50 (a 100% gain) to get back to the original $100."
                    }
                ]
            }
        },
        {
            "title": "Building Wealth",
            "description": "Synthesizing budgeting, saving, and investing into a lifelong wealth-building strategy.",
            "category": "Retirement Planning",
            "difficulty": "Advanced",
            "estimated_minutes": 20,
            "order_index": 5,
            "is_featured": True,
            "content": """# The Architecture of Wealth

Building lasting wealth is rarely the result of a single brilliant stock pick or an overnight windfall. True wealth generation is a systemic process—a machine engineered from disciplined budgeting, systematic saving, and automated investing over a span of decades. 

## Step 1: The Gap (Cash Flow Management)
Wealth is not determined by your income; it is determined by the gap between your income and your expenses. A doctor earning $300,000 a year who spends $310,000 is growing poorer. A teacher earning $60,000 who spends $45,000 is growing richer.

The foundational step to wealth building is optimizing cash flow to maximize this gap. This involves:
- **Tracking Expenses**: You cannot manage what you do not measure.
- **Avoiding Lifestyle Creep**: As income rises through promotions, the instinct is to upgrade your car, house, and lifestyle proportionally. The wealth builder channels the majority of income increases directly into investments instead.

## Step 2: The Emergency Shield
Before deploying capital into volatile markets, you must establish an emergency fund. This is typically 3 to 6 months of living expenses stored in a highly liquid, safe account (like a High-Yield Savings Account). 

Why? Because life is unpredictable. If you lose your job or face a massive medical bill, and you lack an emergency fund, you will be forced to sell your investments. If this happens during a market crash, you lock in catastrophic losses. The emergency fund acts as a protective moat around your investment portfolio.

## Step 3: Automated and Systemic Investing
Human psychology is inherently flawed when it comes to money. We experience FOMO (Fear Of Missing Out) at market tops and panic at market bottoms. The solution is automation.

**Dollar-Cost Averaging (DCA)** is the practice of investing a fixed amount of money at regular intervals, regardless of what the market is doing. 
- If the market is up, your fixed amount buys fewer shares.
- If the market is crashing, your fixed amount buys more shares "on sale."
By automating this process, you completely remove emotion, market timing, and decision fatigue from your wealth-building system.

## Step 4: Asset Allocation & Rebalancing
As your portfolio grows, your asset allocation—the percentage split between stocks, bonds, cash, etc.—will drift. If stocks have a massive bull run, a portfolio that was originally 80% stocks / 20% bonds might drift to 90% stocks / 10% bonds. This makes the portfolio riskier than originally intended.

**Rebalancing** is the act of periodically (usually annually) selling off a portion of the assets that have grown the most and buying more of the assets that have lagged, bringing your portfolio back to its target allocation. Counter-intuitively, rebalancing forces you to "buy low and sell high" automatically.

## Summary
The blueprint is remarkably simple, though executing it requires profound discipline: 
Spend less than you earn, protect yourself with cash reserves, automate your investments into diversified index funds, and let compound interest do the heavy lifting over the next 30 years.""",
            "quiz": {
                "title": "Wealth Architecture",
                "questions": [
                    {
                        "question": "What is the primary purpose of an Emergency Fund?",
                        "option_a": "To generate the highest possible returns on cash.",
                        "option_b": "To act as a protective buffer so you aren't forced to sell investments during personal crises.",
                        "option_c": "To provide funds for luxury vacations.",
                        "option_d": "To actively day-trade the stock market.",
                        "correct_answer": "B",
                        "explanation": "An emergency fund protects your investment portfolio from being prematurely liquidated during a crisis or market downturn."
                    },
                    {
                        "question": "How does Dollar-Cost Averaging (DCA) help investors?",
                        "option_a": "It guarantees that investments will never lose value.",
                        "option_b": "It allows investors to accurately predict the bottom of a market crash.",
                        "option_c": "It removes emotional decision-making by automating investments regardless of market conditions.",
                        "option_d": "It ensures you only buy stocks when they are at their absolute peak.",
                        "correct_answer": "C",
                        "explanation": "DCA automates the buying process, forcing you to buy more shares when prices are low and fewer when prices are high, eliminating emotional timing."
                    }
                ]
            }
        }
    ]

    for m_data in modules_data:
        quiz_data = m_data.pop("quiz")
        module = LearningModule(**m_data)
        db.add(module)
        db.flush()

        quiz = Quiz(module_id=module.id, title=quiz_data["title"])
        db.add(quiz)
        db.flush()

        for q_data in quiz_data["questions"]:
            question = QuizQuestion(quiz_id=quiz.id, **q_data)
            db.add(question)
        
    db.commit()
