#!/bin/bash
# Runs after each file edit — catches design system violations instantly.

FILE=$(echo "$CLAUDE_TOOL_INPUT" | grep -oP '"file_path"\s*:\s*"\K[^"]+' 2>/dev/null)

if [ -z "$FILE" ]; then exit 0; fi
if [[ "$FILE" != *.tsx ]] && [[ "$FILE" != *.ts ]]; then exit 0; fi
if [ ! -f "$FILE" ]; then exit 0; fi

FOUND=0

# 8px grid violations
SPACING=$(grep -n '\bp-3\b\|\bp-5\b\|\bp-6\b\|\bp-7\b\|\bpx-3\b\|\bpx-5\b\|\bpx-6\b\|\bpy-3\b\|\bpy-5\b\|\bpy-6\b\|\bmt-3\b\|\bmt-5\b\|\bmt-6\b\|\bmb-3\b\|\bmb-5\b\|\bmb-6\b\|\bm-3\b\|\bm-5\b\|\bm-6\b\|\bgap-3\b\|\bgap-5\b\|\bgap-6\b' "$FILE" 2>/dev/null)
if [ -n "$SPACING" ]; then
  echo "⚠  8px grid violation in $(basename "$FILE"):"
  echo "$SPACING"
  FOUND=1
fi

# TypeScript `any`
ANY=$(grep -n ': any\b\|as any\b\|Array<any>' "$FILE" 2>/dev/null)
if [ -n "$ANY" ]; then
  echo "⚠  TypeScript 'any' in $(basename "$FILE"):"
  echo "$ANY"
  FOUND=1
fi

# Forbidden colors
COLORS=$(grep -n '\bbg-blue-\|\bbg-gray-\|\bbg-zinc-\|\bbg-neutral-\|\btext-blue-\|\btext-gray-\|\btext-zinc-\|\btext-green-\|\btext-red-' "$FILE" 2>/dev/null)
if [ -n "$COLORS" ]; then
  echo "⚠  Off-palette color in $(basename "$FILE"):"
  echo "$COLORS"
  FOUND=1
fi

if [ "$FOUND" -eq 0 ]; then
  echo "✓ $(basename "$FILE") — no violations"
fi

exit 0
