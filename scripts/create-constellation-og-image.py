#!/usr/bin/env python3
"""
Generate Constellation Open Graph image with branded gradient background for social shares.
"""

from PIL import Image, ImageDraw, ImageFont
import sys
import os

def create_constellation_og_image():
    # Open Graph optimal size
    width = 1200
    height = 630
    
    # Create gradient background (slate-950 to indigo-950)
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    # Create gradient from dark slate to dark indigo
    for y in range(height):
        # Interpolate from slate-950 (#020617) to indigo-950 (#1e1b4b)
        r = int(2 + (30 - 2) * (y / height))
        g = int(6 + (27 - 6) * (y / height))
        b = int(23 + (75 - 23) * (y / height))
        draw.rectangle([(0, y), (width, y + 1)], fill=(r, g, b))
    
    # Try to open the Constellation logo
    logo_path = 'public/contellation-logo.png'
    
    if not os.path.exists(logo_path):
        print(f"Warning: {logo_path} not found, creating text-only version")
        # Add fallback text
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 120)
        except:
            font = ImageFont.load_default()
        
        text = "Constellation"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (width - text_width) // 2
        y = (height - text_height) // 2 - 50
        
        # Draw text with gradient effect
        draw.text((x, y), text, fill=(147, 197, 253), font=font)  # brand-300
        
        # Add subtitle
        try:
            subtitle_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 48)
        except:
            subtitle_font = ImageFont.load_default()
        
        subtitle = "Plataforma Imobiliária para Corretores"
        bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
        subtitle_width = bbox[2] - bbox[0]
        subtitle_x = (width - subtitle_width) // 2
        subtitle_y = y + text_height + 30
        draw.text((subtitle_x, subtitle_y), subtitle, fill=(203, 213, 225), font=subtitle_font)  # slate-300
        
    else:
        # Open and resize logo
        logo = Image.open(logo_path)
        
        # Convert to RGBA if needed
        if logo.mode != 'RGBA':
            logo = logo.convert('RGBA')
        
        # Calculate new logo size (fit within 70% of image, maintain aspect ratio)
        max_logo_width = int(width * 0.7)
        max_logo_height = int(height * 0.6)
        
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
        
        # Center the logo (slightly higher)
        x = (width - new_logo_width) // 2
        y = (height - new_logo_height) // 2 - 40
        
        # Paste logo onto background (with alpha channel for transparency)
        img.paste(logo_resized, (x, y), logo_resized)
        
        # Add subtitle below logo
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 42)
        except:
            font = ImageFont.load_default()
        
        subtitle = "Plataforma Imobiliária Completa para Corretores"
        bbox = draw.textbbox((0, 0), subtitle, font=font)
        subtitle_width = bbox[2] - bbox[0]
        subtitle_x = (width - subtitle_width) // 2
        subtitle_y = y + new_logo_height + 30
        draw.text((subtitle_x, subtitle_y), subtitle, fill=(203, 213, 225), font=font)  # slate-300
    
    # Save the new image
    output_path = 'public/constellation-og-image.png'
    img.save(output_path, 'PNG', optimize=True)
    print(f"✅ Created {output_path}")
    print(f"   Size: {width}x{height}")
    print(f"   Background: Gradient (slate-950 to indigo-950)")
    print(f"   Optimized for social media sharing")

if __name__ == '__main__':
    try:
        create_constellation_og_image()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
