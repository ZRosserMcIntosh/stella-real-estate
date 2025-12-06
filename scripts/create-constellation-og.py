#!/usr/bin/env python3
"""
Generate Constellation OG Image for WhatsApp/Social sharing
Creates a 1200x630 image with:
- Dark slate background (matching #020617)
- Constellation star logo centered
- "CONSTELLATION" text below
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Get the script directory
script_dir = os.path.dirname(os.path.abspath(__file__))
public_dir = os.path.join(script_dir, '..', 'public')

# Image dimensions (OG standard)
WIDTH = 1200
HEIGHT = 630

# Colors
BG_COLOR = (2, 6, 23)  # slate-950 (#020617)
TEXT_COLOR = (199, 210, 254)  # indigo-200

# Create base image
img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
draw = ImageDraw.Draw(img)

# Load and paste Constellation logo
logo_path = os.path.join(public_dir, 'tech-icons', 'contellation-logo.png')
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert('RGBA')
    
    # Resize logo to fit nicely (about 200px height)
    logo_height = 180
    aspect = logo.width / logo.height
    logo_width = int(logo_height * aspect)
    logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
    
    # Center the logo horizontally, position it in upper-middle area
    logo_x = (WIDTH - logo_width) // 2
    logo_y = (HEIGHT - logo_height) // 2 - 60  # Slightly above center
    
    # Create a new image with alpha channel for compositing
    img_rgba = img.convert('RGBA')
    img_rgba.paste(logo, (logo_x, logo_y), logo)
    img = img_rgba.convert('RGB')
    draw = ImageDraw.Draw(img)

# Add "CONSTELLATION" text below logo
try:
    # Try to use a system font
    font_size = 48
    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
except:
    # Fallback to default
    font = ImageFont.load_default()

text = "CONSTELLATION"
# Get text bounding box
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

text_x = (WIDTH - text_width) // 2
text_y = HEIGHT // 2 + 60  # Below the logo

# Add letter spacing effect by drawing each character
spacing = 12
total_width = sum(draw.textbbox((0, 0), c, font=font)[2] - draw.textbbox((0, 0), c, font=font)[0] + spacing for c in text) - spacing
start_x = (WIDTH - total_width) // 2

for char in text:
    char_bbox = draw.textbbox((0, 0), char, font=font)
    char_width = char_bbox[2] - char_bbox[0]
    draw.text((start_x, text_y), char, fill=TEXT_COLOR, font=font)
    start_x += char_width + spacing

# Add subtle tagline
try:
    tagline_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
except:
    tagline_font = ImageFont.load_default()

tagline = "Plataforma Profissional para Corretores"
tagline_bbox = draw.textbbox((0, 0), tagline, font=tagline_font)
tagline_width = tagline_bbox[2] - tagline_bbox[0]
tagline_x = (WIDTH - tagline_width) // 2
tagline_y = text_y + 70

draw.text((tagline_x, tagline_y), tagline, fill=(148, 163, 184), font=tagline_font)  # slate-400

# Save the image
output_path = os.path.join(public_dir, 'constellation-og-image.png')
img.save(output_path, 'PNG', quality=95)
print(f"✅ Created: {output_path}")
print(f"   Size: {WIDTH}x{HEIGHT}")
