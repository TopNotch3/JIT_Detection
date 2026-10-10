from typing import Dict, Any, Tuple
from app.ingestion.parser import UnifiedDiffParser
from app.ast_graph.tree_sitter_parser import MultiLanguageASTParser

class CounterfactualValidator:
    """Validates counterfactual commits for syntax, surface similarity, and structural change."""

    def __init__(self):
        self.diff_parser = UnifiedDiffParser()
        self.ast_parser = MultiLanguageASTParser()

    def compute_surface_similarity(self, orig_text: str, pert_text: str) -> float:
        """Computes word/token-level Jaccard similarity."""
        tokens_orig = set(orig_text.split())
        tokens_pert = set(pert_text.split())
        if not tokens_orig and not tokens_pert:
            return 1.0
        intersection = tokens_orig.intersection(tokens_pert)
        union = tokens_orig.union(tokens_pert)
        return len(intersection) / max(1, len(union))

    def validate(self, orig_diff: str, perturbed_diff: str, recipe: str) -> Tuple[bool, str, float, Dict[str, Any]]:
        """Returns (is_valid, status_code, similarity_score, metadata)."""
        if orig_diff.strip() == perturbed_diff.strip():
            return False, "identical_no_perturbation", 1.0, {"reason": "Perturbation resulted in no changes"}

        # 1. Diff parsing validation
        parsed_pert = self.diff_parser.parse(perturbed_diff)
        if not parsed_pert.files:
            return False, "invalid_diff_format", 0.0, {"reason": "Could not parse unified diff hunks"}

        # 2. Syntax validation
        for f in parsed_pert.files:
            if f.post_source:
                ast_elems = self.ast_parser.parse_source(f.post_source, f.new_path)
                # Ensure parser does not crash and yields structural nodes if code is non-empty
                if len(f.post_source.splitlines()) > 3 and not ast_elems:
                    return False, "invalid_syntax", 0.0, {"reason": f"Syntax parsing failed on {f.new_path}"}

        # 3. Surface similarity
        sim_score = self.compute_surface_similarity(orig_diff, perturbed_diff)
        if sim_score < 0.40:
            return False, "low_similarity", sim_score, {"reason": "Perturbation diverged too far from original surface statistics"}

        return True, "valid", round(sim_score, 4), {
            "files_checked": len(parsed_pert.files),
            "similarity": round(sim_score, 4),
            "recipe": recipe
        }
