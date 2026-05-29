#!/usr/bin/env python3
"""Validate repository SVG diagrams.

The article guidelines intentionally avoid SVG features that have caused
rendering failures in browser previews and static builds. This script is a
small guardrail for those rules: all diagrams must be parseable XML and must
not rely on CSS custom properties.
"""

from __future__ import annotations

import argparse
import re
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path


ROOT = Path("public/diagrams")
CSS_VARIABLE_PATTERN = re.compile(r"\bvar\(")
XML_DECLARATION = "<?xml"


@dataclass(frozen=True)
class SvgIssue:
    path: Path
    message: str


@dataclass(frozen=True)
class SvgWarning:
    path: Path
    message: str


def iter_svg_paths() -> list[Path]:
    if not ROOT.exists():
        return []
    return sorted(path for path in ROOT.rglob("*.svg") if path.is_file())


def validate_svg(path: Path) -> list[SvgIssue]:
    issues: list[SvgIssue] = []
    try:
        source = path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        return [SvgIssue(path, f"not valid UTF-8: {exc}")]

    if CSS_VARIABLE_PATTERN.search(source):
        issues.append(SvgIssue(path, "uses CSS custom properties via var(...); use explicit colors"))

    try:
        ET.fromstring(source)
    except ET.ParseError as exc:
        issues.append(SvgIssue(path, f"invalid XML: {exc}"))

    return issues


def warn_svg(path: Path) -> list[SvgWarning]:
    source = path.read_text(encoding="utf-8")
    warnings: list[SvgWarning] = []
    if source.lstrip().startswith(XML_DECLARATION):
        warnings.append(SvgWarning(path, "contains XML declaration; safe but unnecessary for static assets"))
    return warnings


def normalize_svg(path: Path) -> bool:
    source = path.read_text(encoding="utf-8")
    normalized = source.replace("\r\n", "\n").replace("\r", "\n")
    if normalized and not normalized.endswith("\n"):
        normalized += "\n"
    if normalized == source:
        return False
    path.write_text(normalized, encoding="utf-8")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate SVG diagrams used by articles.")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true", help="validate SVGs without changing files")
    mode.add_argument("--fix", action="store_true", help="normalize line endings, then validate SVGs")
    args = parser.parse_args()

    paths = iter_svg_paths()
    if not paths:
        print(f"No SVG files found under {ROOT}")
        return 0

    changed = 0
    if args.fix:
        for path in paths:
            if normalize_svg(path):
                changed += 1

    issues: list[SvgIssue] = []
    warnings: list[SvgWarning] = []
    for path in paths:
        issues.extend(validate_svg(path))
        warnings.extend(warn_svg(path))

    if issues:
        print(f"SVG validation failed: {len(issues)} issue(s) across {len(paths)} file(s)")
        for issue in issues:
            print(f"- {issue.path}: {issue.message}")
        return 1

    if warnings:
        print(f"SVG validation warnings: {len(warnings)} non-blocking warning(s)")
        for warning in warnings[:25]:
            print(f"- {warning.path}: {warning.message}")
        if len(warnings) > 25:
            print(f"- ... {len(warnings) - 25} more warning(s)")

    suffix = f"; normalized {changed} file(s)" if args.fix else ""
    print(f"SVG validation passed for {len(paths)} file(s){suffix}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
