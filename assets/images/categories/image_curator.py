#!/usr/bin/env python3
"""
Image Curator for Digital Marketplace Categories
Downloads and optimizes royalty-free images for each category
"""

import os
import requests
from PIL import Image
import json
from urllib.parse import urlparse
import hashlib
import time

class ImageCurator:
    def __init__(self, output_dir="./"):
        self.output_dir = output_dir
        self.categories = {
            "digital_art": {
                "keywords": ["digital art", "illustration", "graphic design", "creative art"],
                "description": "Creative digital artwork and illustrations"
            },
            "software": {
                "keywords": ["software", "code", "programming", "development"],
                "description": "Software development and programming tools"
            },
            "ebooks": {
                "keywords": ["books", "reading", "education", "learning"],
                "description": "Educational content and e-books"
            },
            "templates": {
                "keywords": ["templates", "design", "layout", "business"],
                "description": "Design templates and layouts"
            },
            "music": {
                "keywords": ["music", "audio", "sound", "headphones"],
                "description": "Music and audio content"
            }
        }
        
        # Recommended image specs for web
        self.web_specs = {
            "width": 400,
            "height": 300,
            "format": "WebP",
            "quality": 85,
            "aspect_ratio": "4:3"
        }
        
        # Unsplash API (requires API key)
        self.unsplash_access_key = None  # Set this if you have an Unsplash API key
        
    def get_unsplash_images(self, category, count=3):
        """Get images from Unsplash API"""
        if not self.unsplash_access_key:
            print("Unsplash API key not configured. Skipping Unsplash images.")
            return []
            
        images = []
        keywords = self.categories[category]["keywords"]
        
        for keyword in keywords[:2]:  # Limit to 2 keywords to avoid rate limiting
            url = f"https://api.unsplash.com/search/photos"
            params = {
                "query": keyword,
                "per_page": count,
                "orientation": "landscape",
                "client_id": self.unsplash_access_key
            }
            
            try:
                response = requests.get(url, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    for photo in data.get("results", []):
                        images.append({
                            "url": photo["urls"]["regular"],
                            "download_url": photo["links"]["download"],
                            "author": photo["user"]["name"],
                            "description": photo.get("description", ""),
                            "source": "unsplash"
                        })
                time.sleep(1)  # Rate limiting
            except Exception as e:
                print(f"Error fetching from Unsplash: {e}")
                
        return images
    
    def get_curated_placeholder_images(self, category):
        """Get curated placeholder images from reliable sources"""
        images = []
        
        # Picsum (Lorem Picsum) - high quality placeholder images
        picsum_urls = [
            f"https://picsum.photos/800/600?random={i}" for i in range(1, 4)
        ]
        
        # Placeholder.com with category-specific colors
        category_colors = {
            "digital_art": "6c5ce7",  # Purple
            "software": "2d3436",     # Dark gray
            "ebooks": "00b894",       # Teal
            "templates": "e17055",    # Orange
            "music": "fd79a8"         # Pink
        }
        
        color = category_colors.get(category, "74b9ff")
        placeholder_urls = [
            f"https://via.placeholder.com/800x600/{color}/ffffff?text={category.replace('_', '+').title()}+{i}"
            for i in range(1, 3)
        ]
        
        all_urls = picsum_urls + placeholder_urls
        
        for i, url in enumerate(all_urls):
            images.append({
                "url": url,
                "download_url": url,
                "author": "Placeholder Service",
                "description": f"{category} placeholder image {i+1}",
                "source": "placeholder"
            })
            
        return images
    
    def download_image(self, image_info, category, filename):
        """Download an image from URL"""
        try:
            response = requests.get(image_info["download_url"], timeout=30)
            if response.status_code == 200:
                filepath = os.path.join(self.output_dir, f"{category}_{filename}")
                with open(filepath, "wb") as f:
                    f.write(response.content)
                return filepath
        except Exception as e:
            print(f"Error downloading image: {e}")
        return None
    
    def optimize_image(self, input_path, output_path):
        """Optimize image for web use"""
        try:
            with Image.open(input_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    # Create a white background
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background
                
                # Resize to web specifications
                img.thumbnail((self.web_specs["width"], self.web_specs["height"]), Image.Resampling.LANCZOS)
                
                # Save as WebP
                webp_path = output_path.replace('.jpg', '.webp').replace('.png', '.webp')
                img.save(webp_path, 'WebP', quality=self.web_specs["quality"], optimize=True)
                
                return webp_path
        except Exception as e:
            print(f"Error optimizing image: {e}")
        return None
    
    def generate_image_metadata(self, category, images_info):
        """Generate metadata file for images"""
        metadata = {
            "category": category,
            "description": self.categories[category]["description"],
            "web_specs": self.web_specs,
            "images": images_info,
            "generated_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        metadata_path = os.path.join(self.output_dir, f"{category}_metadata.json")
        with open(metadata_path, "w") as f:
            json.dump(metadata, f, indent=2)
        
        return metadata_path
    
    def curate_category_images(self, category, count=3):
        """Curate images for a specific category"""
        print(f"\n🎨 Curating images for category: {category.upper()}")
        print(f"Description: {self.categories[category]['description']}")
        
        # Get images from available sources
        images = []
        
        # Try Unsplash first if API key is available
        if self.unsplash_access_key:
            images.extend(self.get_unsplash_images(category, count))
        
        # Get placeholder images as fallback or supplement
        if len(images) < count:
            placeholder_images = self.get_curated_placeholder_images(category)
            images.extend(placeholder_images[:count - len(images)])
        
        # Download and optimize images
        optimized_images = []
        for i, image_info in enumerate(images[:count]):
            print(f"  📥 Downloading image {i+1}/{count}...")
            
            # Download original
            temp_filename = f"temp_{i+1}.jpg"
            downloaded_path = self.download_image(image_info, category, temp_filename)
            
            if downloaded_path:
                # Optimize for web
                optimized_filename = f"{category}_{i+1}.webp"
                optimized_path = os.path.join(self.output_dir, optimized_filename)
                
                final_path = self.optimize_image(downloaded_path, optimized_path)
                
                if final_path:
                    optimized_images.append({
                        "filename": os.path.basename(final_path),
                        "path": final_path,
                        "original_info": image_info,
                        "optimized_specs": self.web_specs
                    })
                    print(f"  ✅ Optimized: {optimized_filename}")
                
                # Clean up temporary file
                try:
                    os.remove(downloaded_path)
                except:
                    pass
        
        # Generate metadata
        metadata_path = self.generate_image_metadata(category, optimized_images)
        print(f"  📄 Metadata saved: {os.path.basename(metadata_path)}")
        
        return optimized_images
    
    def curate_all_categories(self):
        """Curate images for all categories"""
        print("🚀 Starting image curation for all categories...")
        print(f"Output directory: {self.output_dir}")
        print(f"Web specifications: {self.web_specs}")
        
        all_results = {}
        
        for category in self.categories.keys():
            try:
                result = self.curate_category_images(category)
                all_results[category] = result
                print(f"✅ Completed {category}: {len(result)} images")
            except Exception as e:
                print(f"❌ Error processing {category}: {e}")
                all_results[category] = []
        
        # Generate summary report
        self.generate_summary_report(all_results)
        
        return all_results
    
    def generate_summary_report(self, results):
        """Generate a summary report of all curated images"""
        report = {
            "summary": {
                "total_categories": len(self.categories),
                "total_images": sum(len(images) for images in results.values()),
                "web_specs": self.web_specs,
                "categories": list(self.categories.keys())
            },
            "results": results,
            "generated_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        report_path = os.path.join(self.output_dir, "curation_report.json")
        with open(report_path, "w") as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📊 Summary Report:")
        print(f"  Total Categories: {report['summary']['total_categories']}")
        print(f"  Total Images: {report['summary']['total_images']}")
        print(f"  Report saved: {os.path.basename(report_path)}")
        
        return report_path


def main():
    """Main function to run the image curator"""
    # Initialize curator
    curator = ImageCurator(output_dir="./")
    
    # Set Unsplash API key if available (recommended for higher quality images)
    # curator.unsplash_access_key = "YOUR_UNSPLASH_ACCESS_KEY_HERE"
    
    print("🎨 Digital Marketplace Image Curator")
    print("=====================================")
    print("This script will curate royalty-free images for each category")
    print("and optimize them for web use (WebP format, 400x300px)")
    print()
    
    # Curate all categories
    results = curator.curate_all_categories()
    
    print("\n🎉 Image curation completed!")
    print("\nNext steps:")
    print("1. Review the generated images in the current directory")
    print("2. Check the metadata files for image details")
    print("3. Review the curation_report.json for a complete summary")
    print("4. Consider getting an Unsplash API key for higher quality images")
    
    return results


if __name__ == "__main__":
    main()
