#!/bin/bash

# Video Optimization Script
# Compresses video files to reduce bandwidth and cache usage

set -e

echo "🎥 Video Optimization Script"
echo "=============================="
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ Error: ffmpeg is not installed"
    echo ""
    echo "Install ffmpeg:"
    echo "  macOS:   brew install ffmpeg"
    echo "  Ubuntu:  sudo apt-get install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

VIDEO_DIR="public/video"
INPUT_FILE="$VIDEO_DIR/office-3D.mp4"
BACKUP_FILE="$VIDEO_DIR/office-3D-original.mp4"
OPTIMIZED_FILE="$VIDEO_DIR/office-3D-optimized.mp4"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Error: Video file not found: $INPUT_FILE"
    exit 1
fi

# Get original file size
ORIGINAL_SIZE=$(du -h "$INPUT_FILE" | cut -f1)
echo "📊 Original file size: $ORIGINAL_SIZE"
echo ""

# Backup original file
if [ ! -f "$BACKUP_FILE" ]; then
    echo "💾 Creating backup..."
    cp "$INPUT_FILE" "$BACKUP_FILE"
    echo "✅ Backup created: $BACKUP_FILE"
else
    echo "⚠️  Backup already exists, skipping..."
fi
echo ""

# Optimize video
echo "🔄 Optimizing video..."
echo "   - Codec: H.264"
echo "   - Quality: CRF 28 (good quality, smaller size)"
echo "   - Resolution: Max 1280px width"
echo "   - Fast start enabled (for web streaming)"
echo ""

ffmpeg -i "$INPUT_FILE" \
    -vcodec libx264 \
    -crf 28 \
    -preset medium \
    -vf "scale='min(1280,iw):-2'" \
    -movflags +faststart \
    -y \
    "$OPTIMIZED_FILE"

echo ""
echo "✅ Optimization complete!"
echo ""

# Get optimized file size
OPTIMIZED_SIZE=$(du -h "$OPTIMIZED_FILE" | cut -f1)
echo "📊 Results:"
echo "   Original:  $ORIGINAL_SIZE"
echo "   Optimized: $OPTIMIZED_SIZE"
echo ""

# Calculate savings
ORIGINAL_BYTES=$(du -b "$INPUT_FILE" | cut -f1)
OPTIMIZED_BYTES=$(du -b "$OPTIMIZED_FILE" | cut -f1)
SAVINGS=$(( 100 - (OPTIMIZED_BYTES * 100 / ORIGINAL_BYTES) ))
echo "   Savings: ${SAVINGS}%"
echo ""

# Ask to replace original
read -p "Replace original with optimized version? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    mv "$OPTIMIZED_FILE" "$INPUT_FILE"
    echo "✅ Original file replaced!"
    echo "   Backup available at: $BACKUP_FILE"
else
    echo "⏭️  Skipped replacement"
    echo "   Optimized file: $OPTIMIZED_FILE"
    echo "   Original file: $INPUT_FILE"
fi

echo ""
echo "🎉 Done!"
