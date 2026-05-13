#!/usr/bin/env python3
"""Scan MDX files for ASCII substitutes that should be typographic symbols."""
import os
import re
import sys

base = "/home/noire/Cyclopean/Glass-Empires/SRD-astro/src/content"

dirs_to_scan = [
    "rules/factions",
    "rules/magic",
    "rules/combat",
    "rules/adventure",
]

files_to_scan = [
    "rules/magic.mdx",
    "rules/combat.mdx",
    "rules/factions.mdx",
    "rules/adventure.mdx",
]

issues = []

pat_ge = re.compile(r'(?<!\w)>=')
pat_le = re.compile(r'(?<!\w)<=')
pat_mult = re.compile(r'[0-9]+\s*x\s*[0-9]+|×\s*[0-9]+\s*x\s*[0-9]+')

# Find any bare hyphen in range context (two small numbers)
pat_en = re.compile(r'(?<!\*)(\d{1,2})-(\d{1,2})(?!\*)')

found_any = False

for subdir in dirs_to_scan:
    path = os.path.join(base, subdir)
    if not os.path.isdir(path):
        print(f"SKIP: {path}")
        continue
    for fname in sorted(os.listdir(path)):
        if not fname.endswith('.mdx'):
            continue
        fpath = os.path.join(path, fname)
        with open(fpath) as f:
            content = f.read()
        
        file_issues = []
        lines = content.split('\n')
        
        # Check >=
        for m in pat_ge.finditer(content):
            ln = content[:m.start()].count('\n') + 1
            file_issues.append(f"  L{ln}: '>=' -- should be '≥'")
        
        # Check <=
        for m in pat_le.finditer(content):
            ln = content[:m.start()].count('\n') + 1
            file_issues.append(f"  L{ln}: '<=' -- should be '≤'")
        
        # Check x as multiply (number x number context)
        for i, line in enumerate(lines, 1):
            # Skip lines that look like regular prose (contain "x" in words)
            if re.search(r'[0-9]\s*x\s*[0-9]', line):
                # Only flag if it's clearly a multiply: $5 x 3d6, number x number in a formula
                if re.search(r'\$\s*[0-9]+\s*x\s*[0-9]|(\b[0-9]+\s*x\s*[0-9]+\b(?![\'\"a-zA-Z]))', line):
                    # Exclude things like "3 x 2 = 6" that might be multiplication tables in prose
                    ctx = line.strip()
                    if not re.search(r'[a-z][a-z\s]*\d+\s*x\s*\d+', ctx):
                        file_issues.append(f"  L{i}: possible multiply 'x' -- should be '×'")
        
        # Check en dash ranges
        for i, line in enumerate(lines, 1):
            # Look for patterns like "4-6" "8-11" "3-6" "1-2" near table contexts
            if re.search(r'\d-\d', line):
                # Check if line contains table characters
                if '|' in line or 'br' in line:
                    for m in pat_en.finditer(line):
                        a, b = int(m.group(1)), int(m.group(2))
                        if a < b and 1 <= a <= 20 and 1 <= b <= 20:
                            file_issues.append(f"  L{i}: range '{m.group()}' -- should use '–' (en dash)")
        
        if file_issues:
            found_any = True
            print(f"\n=== {subdir}/{fname} ===")
            for issue in file_issues:
                print(issue)

# Also scan individual files
for frel in files_to_scan:
    fpath = os.path.join(base, frel)
    if not os.path.isfile(fpath):
        continue
    with open(fpath) as f:
        content = f.read()
    
    file_issues = []
    lines = content.split('\n')
    
    for m in pat_ge.finditer(content):
        ln = content[:m.start()].count('\n') + 1
        file_issues.append(f"  L{ln}: '>=' -- should be '≥'")
    for m in pat_le.finditer(content):
        ln = content[:m.start()].count('\n') + 1
        file_issues.append(f"  L{ln}: '<=' -- should be '≤'")
    for i, line in enumerate(lines, 1):
        if re.search(r'[0-9]\s*x\s*[0-9]', line):
            if re.search(r'\$\s*[0-9]+\s*x\s*[0-9]|\b[0-9]+\s*x\s*[0-9]+\b', line):
                if not re.search(r'[a-z][a-z\s]*\d+\s*x\s*\d+', line):
                    file_issues.append(f"  L{i}: possible multiply 'x' -- should be '×'")
        if re.search(r'\d-\d', line) and ('|' in line or 'br' in line):
            for m in pat_en.finditer(line):
                a, b = int(m.group(1)), int(m.group(2))
                if a < b and 1 <= a <= 20 and 1 <= b <= 20:
                    file_issues.append(f"  L{i}: range '{m.group()}' -- should use '–' (en dash)")
    
    if file_issues:
        found_any = True
        print(f"\n=== {frel} ===")
        for issue in file_issues:
            print(issue)

if not found_any:
    print("No issues found.")
