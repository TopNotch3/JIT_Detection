import re
import random
from typing import Tuple, List, Dict, Any

class CounterfactualPerturber:
    """Implements proposal-aligned counterfactual perturbation recipes for commits."""

    @classmethod
    def apply_recipe(cls, diff_text: str, recipe: str, seed: int = 42) -> Tuple[str, Dict[str, Any]]:
        rng = random.Random(seed)

        if recipe == "polarity_invert":
            return cls.polarity_invert(diff_text)
        elif recipe == "condition_flip":
            return cls.condition_flip(diff_text, rng)
        elif recipe == "hunk_shuffle":
            return cls.hunk_shuffle(diff_text, rng)
        elif recipe == "rename_vars":
            return cls.rename_vars(diff_text, rng)
        else:
            raise ValueError(f"Unknown perturbation recipe: {recipe}")

    @classmethod
    def polarity_invert(cls, diff_text: str) -> Tuple[str, Dict[str, Any]]:
        """Recipe 1: Inverts diff polarity by swapping added (+) and deleted (-) lines.
        Preserves exact token surface statistics while completely reversing change intent.
        """
        lines = diff_text.splitlines()
        new_lines = []
        flipped_count = 0

        for line in lines:
            if line.startswith("+++ ") or line.startswith("--- ") or line.startswith("diff --git "):
                new_lines.append(line)
            elif line.startswith("+"):
                new_lines.append("-" + line[1:])
                flipped_count += 1
            elif line.startswith("-"):
                new_lines.append("+" + line[1:])
                flipped_count += 1
            else:
                new_lines.append(line)

        perturbed_diff = "\n".join(new_lines)
        metadata = {
            "recipe": "polarity_invert",
            "flipped_lines": flipped_count,
            "semantics_breaking": True
        }
        return perturbed_diff, metadata

    @classmethod
    def condition_flip(cls, diff_text: str, rng: random.Random) -> Tuple[str, Dict[str, Any]]:
        """Recipe 2: Inverts logical and relational conditions inside modified lines."""
        replacements = [
            (r"\b==\b", "!="),
            (r"\b!=\b", "=="),
            (r"\b<=\b", ">"),
            (r"\b>=\b", "<"),
            (r"\b<\b", ">="),
            (r"\b>\b", "<="),
            (r"\band\b", "or"),
            (r"\bor\b", "and"),
            (r"\bTrue\b", "False"),
            (r"\bFalse\b", "True"),
            (r"\btrue\b", "false"),
            (r"\bfalse\b", "true"),
        ]

        lines = diff_text.splitlines()
        new_lines = []
        modified_count = 0

        for line in lines:
            if line.startswith("+") and not line.startswith("+++"):
                modified_line = line
                for pat, rep in replacements:
                    if re.search(pat, modified_line):
                        modified_line = re.sub(pat, rep, modified_line, count=1)
                        modified_count += 1
                        break
                new_lines.append(modified_line)
            else:
                new_lines.append(line)

        # Fallback if no condition found: toggle an equality or numeric constant
        if modified_count == 0:
            for idx, line in enumerate(new_lines):
                if line.startswith("+") and not line.startswith("+++"):
                    if "0" in line:
                        new_lines[idx] = line.replace("0", "1", 1)
                        modified_count += 1
                        break
                    elif "None" in line or "null" in line:
                        new_lines[idx] = line.replace("None", "[]").replace("null", "{}")
                        modified_count += 1
                        break

        perturbed_diff = "\n".join(new_lines)
        metadata = {
            "recipe": "condition_flip",
            "condition_mutations": modified_count,
            "semantics_breaking": modified_count > 0
        }
        return perturbed_diff, metadata

    @classmethod
    def hunk_shuffle(cls, diff_text: str, rng: random.Random) -> Tuple[str, Dict[str, Any]]:
        """Recipe 3: Shuffles the order of hunks across the commit to test order sensitivity."""
        lines = diff_text.splitlines()
        header_lines: List[str] = []
        hunk_blocks: List[List[str]] = []
        current_block: List[str] = []

        for line in lines:
            if line.startswith("@@ "):
                if current_block:
                    hunk_blocks.append(current_block)
                current_block = [line]
            elif current_block:
                current_block.append(line)
            else:
                header_lines.append(line)

        if current_block:
            hunk_blocks.append(current_block)

        if len(hunk_blocks) > 1:
            rng.shuffle(hunk_blocks)

        reconstructed: List[str] = header_lines[:]
        for block in hunk_blocks:
            reconstructed.extend(block)

        metadata = {
            "recipe": "hunk_shuffle",
            "hunk_count": len(hunk_blocks),
            "shuffled": len(hunk_blocks) > 1
        }
        return "\n".join(reconstructed), metadata

    @classmethod
    def rename_vars(cls, diff_text: str, rng: random.Random) -> Tuple[str, Dict[str, Any]]:
        """Recipe 4: Identifier renaming (Semantics-preserving control perturbation).
        Ensures model prediction does not shift drastically when variable names change.
        """
        lines = diff_text.splitlines()
        candidate_identifiers = set()

        for line in lines:
            if line.startswith(("+", "-")) and not line.startswith(("+++", "---")):
                tokens = re.findall(r"\b[a-zA-Z_][a-zA-Z0-9_]{3,}\b", line)
                for t in tokens:
                    if t not in ("self", "this", "import", "return", "function", "const", "class", "async"):
                        candidate_identifiers.add(t)

        rename_map = {}
        for ident in candidate_identifiers:
            rename_map[ident] = f"{ident}_renamed_{rng.randint(10, 99)}"

        new_lines = []
        for line in lines:
            if line.startswith(("diff", "---", "+++", "@@")):
                new_lines.append(line)
            else:
                mod_line = line
                for old_name, new_name in rename_map.items():
                    mod_line = re.sub(rf"\b{old_name}\b", new_name, mod_line)
                new_lines.append(mod_line)

        metadata = {
            "recipe": "rename_vars",
            "renamed_symbols": list(rename_map.keys())[:5],
            "semantics_breaking": False
        }
        return "\n".join(new_lines), metadata
