#!/usr/bin/env python3
"""
Script to generate extension icons for the Job Post Date Chrome extension.
Requires Pillow: pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size):
    """Create a calendar icon of the specified size."""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Define colors
    gradient_color1 = (102, 126, 234)  # #667eea
    gradient_color2 = (118, 75, 162)   # #764ba2
    # Use middle color for simplicity
    bg_color = tuple((a + b) // 2 for a, b in zip(gradient_color1, gradient_color2))
    white = (255, 255, 255, 255)
    
    # Draw rounded rectangle background
    margin = size // 10
    draw.rounded_rectangle(
        [(0, 0), (size, size)],
        radius=size // 6,
        fill=bg_color
    )
    
    # Calculate calendar dimensions
    cal_size = int(size * 0.6)
    offset_x = (size - cal_size) // 2
    offset_y = (size - cal_size) // 2
    
    # Draw calendar body (white rounded rectangle)
    header_height = cal_size // 5
    draw.rounded_rectangle(
        [(offset_x, offset_y + header_height),
         (offset_x + cal_size, offset_y + cal_size)],
        radius=cal_size // 10,
        fill=white
    )
    
    # Draw calendar header (white rectangle at top)
    draw.rectangle(
        [(offset_x, offset_y + header_height),
         (offset_x + cal_size, offset_y + header_height + cal_size // 7)],
        fill=white
    )
    
    # Draw calendar rings (binding rings at top)
    ring_width = cal_size // 10
    ring_height = int(cal_size * 0.25)
    # Left ring
    draw.rectangle(
        [(offset_x + cal_size // 5 - ring_width // 2, offset_y),
         (offset_x + cal_size // 5 + ring_width // 2, offset_y + ring_height)],
        fill=white
    )
    # Right ring
    draw.rectangle(
        [(offset_x + cal_size * 4 // 5 - ring_width // 2, offset_y),
         (offset_x + cal_size * 4 // 5 + ring_width // 2, offset_y + ring_height)],
        fill=white
    )
    
    # Draw date number (15) if size is large enough
    if size >= 48:
        try:
            # Try to use a default font
            font_size = int(cal_size * 0.35)
            try:
                # Try to load a system font
                font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
            except:
                try:
                    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
                except:
                    font = ImageFont.load_default()
            
            text = "15"
            # Get text bounding box
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            # Center the text in the lower part of the calendar
            text_x = offset_x + (cal_size - text_width) // 2
            text_y = offset_y + header_height + (cal_size - header_height - text_height) // 2
            
            draw.text((text_x, text_y), text, fill=bg_color, font=font)
        except Exception as e:
            print(f"Could not add text to {size}x{size} icon: {e}")
    
    return img

def main():
    """Generate all required icon sizes."""
    sizes = [16, 48, 128]
    
    print("Generating icons for Job Post Date Chrome Extension...")
    
    for size in sizes:
        filename = f"icon{size}.png"
        print(f"Creating {filename}...")
        
        icon = create_icon(size)
        icon.save(filename, 'PNG')
        
        print(f"✓ {filename} created successfully")
    
    print("\n✓ All icons generated successfully!")
    print("\nYour extension is ready to load in Chrome:")
    print("1. Open Chrome and go to chrome://extensions/")
    print("2. Enable 'Developer mode' (toggle in top right)")
    print("3. Click 'Load unpacked' and select this directory")

if __name__ == "__main__":
    main()

