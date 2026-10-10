import re
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field

@dataclass
class DiffHunk:
    file_path: str
    old_start: int
    old_length: int
    new_start: int
    new_length: int
    header: str
    added_lines: List[str] = field(default_factory=list)
    deleted_lines: List[str] = field(default_factory=list)
    context_lines: List[str] = field(default_factory=list)
    raw_lines: List[str] = field(default_factory=list)

@dataclass
class ParsedFileDiff:
    old_path: str
    new_path: str
    is_new: bool = False
    is_deleted: bool = False
    hunks: List[DiffHunk] = field(default_factory=list)
    pre_source: str = ""
    post_source: str = ""

@dataclass
class ParsedCommitDiff:
    files: List[ParsedFileDiff] = field(default_factory=list)
    total_additions: int = 0
    total_deletions: int = 0

class UnifiedDiffParser:
    """Parses standard git unified diffs into structured file and hunk objects."""

    HUNK_HEADER_PATTERN = re.compile(r"^@@\s+-(\d+)(?:,(\d+))?\s+\+(\d+)(?:,(\d+))?\s+@@(.*)")

    @classmethod
    def parse(cls, diff_text: str) -> ParsedCommitDiff:
        if not diff_text or not diff_text.strip():
            return ParsedCommitDiff()

        lines = diff_text.splitlines()
        files: List[ParsedFileDiff] = []
        current_file: Optional[ParsedFileDiff] = None
        current_hunk: Optional[DiffHunk] = None

        total_add = 0
        total_del = 0

        pre_lines_map: Dict[str, List[str]] = {}
        post_lines_map: Dict[str, List[str]] = {}

        for line in lines:
            if line.startswith("diff --git "):
                if current_file and current_hunk:
                    current_file.hunks.append(current_hunk)
                    current_hunk = None
                parts = line.split(" ")
                old_p = parts[2].removeprefix("a/").removeprefix("b/") if len(parts) > 2 else "unknown"
                new_p = parts[3].removeprefix("b/").removeprefix("a/") if len(parts) > 3 else old_p
                current_file = ParsedFileDiff(old_path=old_p, new_path=new_p)
                files.append(current_file)
                pre_lines_map[new_p] = []
                post_lines_map[new_p] = []
                continue

            if not current_file:
                # If diff doesn't start with diff --git, synthesize a file diff
                current_file = ParsedFileDiff(old_path="unknown.py", new_path="unknown.py")
                files.append(current_file)
                pre_lines_map["unknown.py"] = []
                post_lines_map["unknown.py"] = []

            if line.startswith("--- "):
                if "/dev/null" in line:
                    current_file.is_new = True
                continue
            if line.startswith("+++ "):
                if "/dev/null" in line:
                    current_file.is_deleted = True
                continue

            match = cls.HUNK_HEADER_PATTERN.match(line)
            if match:
                if current_hunk:
                    current_file.hunks.append(current_hunk)
                old_s = int(match.group(1))
                old_l = int(match.group(2)) if match.group(2) else 1
                new_s = int(match.group(3))
                new_l = int(match.group(4)) if match.group(4) else 1
                header_tail = match.group(5) or ""

                current_hunk = DiffHunk(
                    file_path=current_file.new_path,
                    old_start=old_s,
                    old_length=old_l,
                    new_start=new_s,
                    new_length=new_l,
                    header=line
                )
                continue

            if current_hunk:
                current_hunk.raw_lines.append(line)
                target_path = current_file.new_path
                if line.startswith("+"):
                    total_add += 1
                    content = line[1:]
                    current_hunk.added_lines.append(content)
                    post_lines_map[target_path].append(content)
                elif line.startswith("-"):
                    total_del += 1
                    content = line[1:]
                    current_hunk.deleted_lines.append(content)
                    pre_lines_map[target_path].append(content)
                elif line.startswith(" ") or line == "":
                    content = line[1:] if line.startswith(" ") else ""
                    current_hunk.context_lines.append(content)
                    pre_lines_map[target_path].append(content)
                    post_lines_map[target_path].append(content)

        if current_file and current_hunk:
            current_file.hunks.append(current_hunk)

        for f in files:
            f.pre_source = "\n".join(pre_lines_map.get(f.new_path, []))
            f.post_source = "\n".join(post_lines_map.get(f.new_path, []))

        return ParsedCommitDiff(
            files=files,
            total_additions=total_add,
            total_deletions=total_del
        )
