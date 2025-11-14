#!/usr/bin/env python3
"""
Generate Open Graph image with dark blue background for WhatsApp previews.
"""

from PIL import Image, ImageDraw
import sys
import os

def create_og_image():
    # Open Graph optimal size for WhatsApp
    width = 1200
    height = 630
    
    # Dark blue background (slate-950)
    bg_color = (15, 23, 42)  # #0f172a
    
    # Create new image with dark blue background
    img = Image.new('RGB', (width, height), bg_color)
    
    # Try to open the existing logo
    logo_path = 'public/stella-logo-variation.png'
    
    if not os.path.exists(logo_path):
        print(f"Error: {logo_path} not found")
        sys.exit(1)
    
    # Open and resize logo
    logo = Image.open(logo_path)
    
    # Convert to RGBA if needed
    if logo.mode != 'RGBA':
        logo = logo.convert('RGBA')
    
    # Calculate new logo size (fit within 80% of image, maintain aspect ratio)
    max_logo_width = int(width * 0.8)
    max_logo_height = int(height * 0.8)
    
    logo_aspect = logo.width / logo.height
    
    if logo.width > logo.height:
        new_logo_width = max_logo_width
        new_logo_height = int(new_logo_width / logo_aspect)
    else:
        new_logo_height = max_logo_height
        new_logo_width = int(new_logo_height * logo_aspect)
    
    # Ensure it doesn't exceed height limit
    if new_logo_height > max_logo_height:
        new_logo_height = max_logo_height
        new_logo_width = int(new_logo_height * logo_aspect)
    
    logo_resized = logo.resize((new_logo_width, new_logo_height), Image.Resampling.LANCZOS)
    
    # Center the logo
    x = (width - new_logo_width) // 2
    y = (height - new_logo_height) // 2
    
    # Paste logo onto background (with alpha channel for transparency)
    img.paste(logo_resized, (x, y), logo_resized)
    
    # Save the new image
    output_path = 'public/stella-og-image.png'
    img.save(output_path, 'PNG', optimize=True)
    print(f"✅ Created {output_path}")
    print(f"   Size: {width}x{height}")
    print(f"   Background: Dark blue (#0f172a)")
    print(f"   Logo: Centered at {new_logo_width}x{new_logo_height}")

if __name__ == '__main__':
    try:
        create_og_image()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
