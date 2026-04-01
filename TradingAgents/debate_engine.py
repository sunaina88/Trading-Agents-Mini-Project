import ollama
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from market_state import ResearchInput
from .agents.bullish import BullishResearcher
from .agents.bearish import BearishResearcher
from .agents.facilitator import Facilitator


class DebateEngine:
    def __init__(self, model_name: str = "llama3.2", rounds: int = 2):
        self.model_name = model_name
        self.rounds = rounds
        self.bull = BullishResearcher(model_name)
        self.bear = BearishResearcher(model_name)
        self.facilitator = Facilitator(model_name)

    def run(self, research_input: ResearchInput, verbose: bool = True):
        """
        Run the debate for n rounds.
        Returns a dict with debate history and facilitator's decision.
        """

        quant_score = research_input.compute_score()
        print(f"\nQUANT SCORE: {quant_score} (positive=bullish, negative=bearish)\n")

        history = []
        last_bull_arg = None
        last_bear_arg = None

        print(f"\nDEBATE: {research_input.company_name} ({research_input.ticker})\n")

        for round_num in range(1, self.rounds + 1):
            print(f"\nROUND {round_num}\n")

            # Bull's turn
            print("\nBULLISH RESEARCHER:")
            bull_arg = self.bull.generate_argument(research_input, last_bear_arg, quant_score)
            history.append(("Bull", bull_arg))
            last_bull_arg = bull_arg
            if verbose:
                print(bull_arg)
                print()

            # Bear's turn
            print("\nBEARISH RESEARCHER:")
            bear_arg = self.bear.generate_argument(research_input, last_bull_arg, quant_score)
            history.append(("Bear", bear_arg))
            last_bear_arg = bear_arg
            if verbose:
                print(bear_arg)
                print()

        # Facilitator
        print("\nFACILITATOR DECISION\n")
        decision = self.facilitator.evaluate(research_input, history)
        if verbose:
            print(f"\nWinner: {decision.get('winner')}")
            print(f"Action: {decision.get('recommended_action')}")
            print(f"Confidence: {decision.get('confidence')}/10")
            print(f"Deciding Factor: {decision.get('deciding_factor')}")

        return {
            "debate_history": history,
            "decision": decision
        }