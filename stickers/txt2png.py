from PIL import Image, ImageDraw, ImageFont

# Read ASCII text from file
text_fp = "./sticker2.txt"
with open(text_fp, 'r') as f:
    ascii_text = f.read()

# Create a new Image
# Make sure the dimensions (W and H) are big enough for the ASCII art
W, H = (3000, 3000)
im = Image.new("RGBA", (W, H), "white")

# Load a font
# Ensure you have the appropriate font file, e.g., "arial.ttf"
font_path = "Arial"  # Change this to the correct path
font_size = 15  # Adjust the size as needed
try:
    font = ImageFont.truetype(font_path, font_size)
except IOError:
    print(f"Font file not found: {font_path}")
    exit(1)

# Draw text to image
draw = ImageDraw.Draw(im)

# Calculate text size using textbbox
bbox = draw.textbbox((0, 0), ascii_text, font=font)
w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]

# Draw the text in the center of the image
draw.text(((W - w) / 2, (H - h) / 2), ascii_text, font=font, fill="black")

# Save Image
im.save("sticker2.png", "PNG")
