# Digital Marketplace Category Images

This directory contains the image curation system for the Digital Marketplace platform. The system automatically sources, downloads, and optimizes royalty-free images for each product category.

## Categories

The system curates images for the following categories:

1. **Digital Art** - Creative digital artwork and illustrations
2. **Software** - Software development and programming tools
3. **E-books** - Educational content and e-books
4. **Templates** - Design templates and layouts
5. **Music** - Music and audio content

## Features

- **Royalty-free sourcing** - Uses reliable placeholder services and supports Unsplash API
- **Web optimization** - Automatically converts to WebP format (400x300px, 85% quality)
- **Metadata generation** - Creates detailed metadata files for each category
- **Batch processing** - Processes all categories in one run
- **Quality control** - Ensures consistent aspect ratios and file sizes

## Quick Start

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the image curator:
   ```bash
   python image_curator.py
   ```

3. The script will:
   - Download 3 images per category (15 total)
   - Optimize them for web use
   - Generate metadata files
   - Create a summary report

## File Structure

After running the curator, you'll have:

```
├── digital_art_1.webp
├── digital_art_2.webp
├── digital_art_3.webp
├── digital_art_metadata.json
├── software_1.webp
├── software_2.webp
├── software_3.webp
├── software_metadata.json
├── ... (similar for other categories)
└── curation_report.json
```

## Image Specifications

All images are optimized with the following specifications:

- **Format**: WebP (modern, efficient format)
- **Dimensions**: 400x300 pixels (4:3 aspect ratio)
- **Quality**: 85% (good balance of quality and file size)
- **Optimization**: Enabled for smaller file sizes

## Using Unsplash (Optional)

For higher quality images, you can use the Unsplash API:

1. Get a free API key from [Unsplash Developers](https://unsplash.com/developers)
2. Edit `image_curator.py` and set your API key:
   ```python
   curator.unsplash_access_key = "YOUR_API_KEY_HERE"
   ```

## Metadata Format

Each category gets a metadata file with:

```json
{
  "category": "digital_art",
  "description": "Creative digital artwork and illustrations",
  "web_specs": {
    "width": 400,
    "height": 300,
    "format": "WebP",
    "quality": 85,
    "aspect_ratio": "4:3"
  },
  "images": [
    {
      "filename": "digital_art_1.webp",
      "path": "/path/to/image",
      "original_info": {
        "url": "...",
        "author": "...",
        "source": "..."
      },
      "optimized_specs": {...}
    }
  ],
  "generated_at": "2025-01-18 17:30:00"
}
```

## Customization

You can customize the system by modifying:

- **Categories**: Edit the `categories` dictionary in `ImageCurator`
- **Web specs**: Modify the `web_specs` dictionary
- **Image count**: Change the `count` parameter in `curate_category_images`
- **Color scheme**: Update `category_colors` for placeholder images

## Best Practices

1. **Review images** - Always review generated images before use
2. **Backup originals** - Keep copies of original images if needed
3. **Update regularly** - Refresh images periodically for variety
4. **Check licenses** - Ensure all images are properly licensed
5. **Test performance** - Verify WebP format works in your target browsers

## Troubleshooting

- **Network errors**: Check internet connection and retry
- **Pillow errors**: Ensure Pillow is properly installed
- **API rate limits**: Use delays between requests
- **File permissions**: Ensure write permissions in output directory

## License

This curation system is provided as-is. All downloaded images maintain their original licenses (typically CC0 for placeholder services, Unsplash License for Unsplash images).

## Support

For issues or questions about the image curation system, please check:
1. The error messages in the console output
2. The generated metadata files
3. The curation_report.json file
