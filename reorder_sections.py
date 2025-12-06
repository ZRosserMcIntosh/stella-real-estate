#!/usr/bin/env python3
"""
Script to reorder sections in Constellation.tsx
Moves Pricing section (line 433-730) to before Founding 100 section (line 199)
"""

# Read the file
with open('src/pages/Constellation.tsx', 'r') as f:
    lines = f.readlines()

# Extract sections (using 0-based indexing, so subtract 1 from line numbers)
# 3D Maps ends at line 198 (index 197)
# Founding 100 starts at line 199 (index 198), ends around line 284 (index 283)
# Pricing starts at line 433 (index 432), ends at line 730 (index 729)

before_pricing = lines[:432]  # Everything before Pricing (lines 1-432)
pricing_section = lines[432:730]  # Pricing section (lines 433-730)
after_pricing = lines[730:]  # Everything after Pricing (lines 731+)

# Now split before_pricing into before_founding and founding sections
before_founding = lines[:198]  # Lines 1-198 (up to and including 3D Maps section end)
founding_to_pricing = lines[198:432]  # Lines 199-432 (Founding 100, Key Benefits, How It Works)

# Reconstruct in new order: before_founding + pricing + founding_to_pricing + after_pricing
new_lines = before_founding + pricing_section + founding_to_pricing + after_pricing

# Write back
with open('src/pages/Constellation.tsx', 'w') as f:
    f.writelines(new_lines)

print("✅ Successfully reordered sections!")
print("   - Moved Pricing section from line 433 to line 199 (before Founding 100)")
