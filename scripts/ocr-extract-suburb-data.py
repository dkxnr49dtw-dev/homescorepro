#!/usr/bin/env python3
"""
OCR Extraction Script for Suburb Data Screenshots

Purpose: Extract suburb data and metrics from screenshot files using OCR
Usage: python3 scripts/ocr-extract-suburb-data.py

Requirements:
- Python packages: pip install easyocr pillow opencv-python pandas

Note: EasyOCR will download models on first run (requires internet connection)
"""

import os
import sys
import json
import csv
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple

try:
    import easyocr
    from PIL import Image
    import cv2
    import numpy as np
    import pandas as pd
except ImportError as e:
    print(f"❌ Missing required Python package: {e}")
    print("\n📦 Install required packages:")
    print("   pip install easyocr pillow opencv-python pandas")
    sys.exit(1)

# Global OCR reader (initialized lazily)
OCR_READER = None

def get_ocr_reader():
    """Initialize and return EasyOCR reader (lazy loading)"""
    global OCR_READER
    if OCR_READER is None:
        print("🔄 Initializing EasyOCR (this may take a moment on first run)...")
        try:
            OCR_READER = easyocr.Reader(['en'], gpu=False)  # Use CPU mode
            print("✅ EasyOCR initialized successfully\n")
        except Exception as e:
            print(f"❌ Failed to initialize EasyOCR: {e}")
            sys.exit(1)
    return OCR_READER

# Configuration
SCREENSHOT_DIR = Path("extra suburb data")
OUTPUT_DIR = Path("data")
OUTPUT_JSON = OUTPUT_DIR / "extracted-suburb-data.json"
OUTPUT_CSV = OUTPUT_DIR / "extracted-suburb-data.csv"
REPORT_FILE = OUTPUT_DIR / "ocr-extraction-report.json"

# Suburb names for matching (load from suburbs.csv)
SUBURB_NAMES = []

def load_suburb_names():
    """Load suburb names from suburbs.csv for validation"""
    global SUBURB_NAMES
    suburbs_file = Path("data/suburbs.csv")
    if suburbs_file.exists():
        try:
            df = pd.read_csv(suburbs_file, comment='#')
            SUBURB_NAMES = df['suburb'].str.lower().tolist()
            print(f"✅ Loaded {len(SUBURB_NAMES)} suburb names for validation")
        except Exception as e:
            print(f"⚠️  Could not load suburbs.csv: {e}")
            SUBURB_NAMES = []

def preprocess_image(image_path: Path) -> np.ndarray:
    """
    Preprocess image for better OCR accuracy
    
    Steps:
    1. Load image
    2. Convert to grayscale
    3. Enhance contrast
    4. Reduce noise
    5. Sharpen text
    """
    try:
        # Load image
        img = cv2.imread(str(image_path))
        if img is None:
            raise ValueError(f"Could not load image: {image_path}")
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Enhance contrast using CLAHE (Contrast Limited Adaptive Histogram Equalization)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        
        # Reduce noise
        denoised = cv2.fastNlMeansDenoising(enhanced, h=10)
        
        # Sharpen
        kernel = np.array([[-1, -1, -1],
                          [-1,  9, -1],
                          [-1, -1, -1]])
        sharpened = cv2.filter2D(denoised, -1, kernel)
        
        # Resize if too small (improves OCR accuracy)
        height, width = sharpened.shape
        if height < 1000:
            scale = 1000 / height
            new_width = int(width * scale)
            sharpened = cv2.resize(sharpened, (new_width, 1000), interpolation=cv2.INTER_CUBIC)
        
        return sharpened
    except Exception as e:
        print(f"⚠️  Error preprocessing {image_path.name}: {e}")
        return None

def extract_text_with_easyocr(image_path: Path) -> Tuple[str, float]:
    """
    Extract text from image using EasyOCR
    
    Returns:
        (extracted_text, confidence_score)
    """
    try:
        # Preprocess image
        processed_img = preprocess_image(image_path)
        if processed_img is None:
            return "", 0.0
        
        # Run OCR
        reader = get_ocr_reader()
        results = reader.readtext(processed_img)
        
        # Extract text and calculate average confidence
        text_parts = []
        confidences = []
        
        for (bbox, text, confidence) in results:
            if text.strip():
                text_parts.append(text)
                confidences.append(confidence)
        
        extracted_text = ' '.join(text_parts)
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
        
        return extracted_text, avg_confidence
    except Exception as e:
        print(f"⚠️  Error extracting text from {image_path.name}: {e}")
        return "", 0.0

def extract_suburb_name(text: str) -> Optional[str]:
    """
    Extract suburb name from OCR text
    
    Uses fuzzy matching against known suburb names
    """
    text_lower = text.lower()
    
    # Look for common patterns
    patterns = [
        r'suburb[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        r'^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+VIC',
        r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+\d{4}',  # Suburb with postcode
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            suburb = match.group(1).strip()
            # Try to match against known suburbs
            suburb_lower = suburb.lower()
            if suburb_lower in SUBURB_NAMES:
                return suburb
            # Fuzzy match (simple - check if suburb name contains or is contained)
            for known_suburb in SUBURB_NAMES:
                if suburb_lower in known_suburb or known_suburb in suburb_lower:
                    # Return the known suburb name (proper case)
                    df = pd.read_csv("data/suburbs.csv", comment='#')
                    return df[df['suburb'].str.lower() == known_suburb]['suburb'].iloc[0]
    
    # If no pattern match, try to find any known suburb name in text
    for known_suburb in SUBURB_NAMES:
        if known_suburb in text_lower:
            df = pd.read_csv("data/suburbs.csv", comment='#')
            return df[df['suburb'].str.lower() == known_suburb]['suburb'].iloc[0]
    
    return None

def extract_metrics(text: str) -> Dict[str, any]:
    """
    Extract metrics from OCR text
    
    Looks for common metric patterns:
    - Key: Value
    - Metric Name: Number
    - Tables with metric names and values
    """
    metrics = {}
    
    # Common metric patterns
    metric_patterns = {
        # Prices
        r'(?:median\s+)?price[:\s]+[\$]?([\d,]+)': 'medianPrice',
        r'price[:\s]+[\$]?([\d,]+)': 'price',
        
        # Growth
        r'growth[:\s]+([\d.-]+)%?': 'growth1yr',
        r'capital\s+growth[:\s]+([\d.-]+)%?': 'growth1yr',
        
        # Rental yield
        r'rental\s+yield[:\s]+([\d.]+)%?': 'rentalYield',
        r'yield[:\s]+([\d.]+)%?': 'rentalYield',
        
        # Scores
        r'walk\s+score[:\s]+(\d+)': 'walkScore',
        r'transit\s+score[:\s]+(\d+)': 'transitScore',
        r'bike\s+score[:\s]+(\d+)': 'bikeScore',
        r'school\s+rating[:\s]+([\d.]+)': 'schoolRating',
        
        # Crime
        r'crime\s+rate[:\s]+([\d.]+)': 'crimeRate',
        
        # Amenities
        r'parks?[:\s]+(\d+)': 'parksDensity',
        r'childcare[:\s]+(\d+)': 'childcareCenters',
        r'shopping[:\s]+(\d+)': 'shoppingCenters',
        r'cafes?[:\s]+(\d+)': 'cafesRestaurants',
        r'restaurants?[:\s]+(\d+)': 'cafesRestaurants',
        r'medical[:\s]+(\d+)': 'medicalCenters',
        
        # Schools
        r'schools?[:\s]+(\d+)': 'schoolCount',
        r'primary\s+schools?[:\s]+(\d+)': 'primarySchools',
        r'secondary\s+schools?[:\s]+(\d+)': 'secondarySchools',
        
        # Distance
        r'cbd\s+distance[:\s]+([\d.]+)\s*km': 'cbdDistance',
        r'distance\s+to\s+cbd[:\s]+([\d.]+)': 'cbdDistance',
        
        # SEIFA scores
        r'irsd[:\s]+(\d+)': 'irsd_score',
        r'ier[:\s]+(\d+)': 'ier_score',
        r'ieo[:\s]+(\d+)': 'ieo_score',
    }
    
    text_lower = text.lower()
    
    for pattern, metric_name in metric_patterns.items():
        matches = re.finditer(pattern, text_lower, re.IGNORECASE)
        for match in matches:
            value_str = match.group(1).replace(',', '')
            try:
                # Try to parse as number
                if '.' in value_str:
                    value = float(value_str)
                else:
                    value = int(value_str)
                
                # Only store if we don't have this metric yet or if new value is more specific
                if metric_name not in metrics:
                    metrics[metric_name] = value
            except ValueError:
                pass
    
    # Also look for key-value pairs in format "Key: Value"
    kv_pattern = r'([A-Za-z\s]+)[:\s]+([\d.,$%]+)'
    for match in re.finditer(kv_pattern, text):
        key = match.group(1).strip().lower()
        value_str = match.group(2).strip()
        
        # Try to identify metric from key
        for metric_key, metric_name in metric_patterns.items():
            if re.search(metric_key.split('[')[0], key):
                try:
                    value = float(value_str.replace(',', '').replace('$', '').replace('%', ''))
                    if metric_name not in metrics:
                        metrics[metric_name] = value
                except ValueError:
                    pass
    
    return metrics

def map_to_existing_fields(metrics: Dict[str, any]) -> Tuple[Dict[str, any], Dict[str, any]]:
    """
    Separate metrics into existing fields and new metrics
    
    Returns:
        (existing_metrics, new_metrics)
    """
    # Fields from suburbs.csv
    existing_fields = {
        'medianPrice', 'growth1yr', 'rentalYield', 'crimeRate', 'schoolRating',
        'schoolCount', 'primarySchools', 'secondarySchools', 'transitScore',
        'walkScore', 'bikeScore', 'parksDensity', 'childcareCenters',
        'shoppingCenters', 'cafesRestaurants', 'medicalCenters', 'cbdDistance',
        'irsd_score', 'ier_score', 'ieo_score'
    }
    
    existing_metrics = {}
    new_metrics = {}
    
    for key, value in metrics.items():
        if key in existing_fields:
            existing_metrics[key] = value
        else:
            new_metrics[key] = value
    
    return existing_metrics, new_metrics

def process_screenshot(image_path: Path) -> Dict:
    """
    Process a single screenshot file
    
    Returns extraction result dictionary
    """
    print(f"📸 Processing: {image_path.name}")
    
    # Extract text
    extracted_text, confidence = extract_text_with_easyocr(image_path)
    
    if not extracted_text:
        return {
            'source_file': image_path.name,
            'status': 'failed',
            'error': 'No text extracted',
            'confidence': 0.0
        }
    
    # Extract suburb name
    suburb_name = extract_suburb_name(extracted_text)
    
    # Extract metrics
    metrics = extract_metrics(extracted_text)
    
    # Separate existing vs new metrics
    existing_metrics, new_metrics = map_to_existing_fields(metrics)
    
    return {
        'source_file': image_path.name,
        'status': 'success' if suburb_name else 'partial',
        'suburb_name': suburb_name,
        'extracted_text': extracted_text[:500] + '...' if len(extracted_text) > 500 else extracted_text,  # Truncate for storage
        'full_text_length': len(extracted_text),
        'parsed_metrics': existing_metrics,
        'new_metrics': new_metrics,
        'confidence': confidence,
        'extraction_method': 'easyocr',
        'extraction_date': datetime.now().isoformat()
    }

def generate_report(results: List[Dict]) -> Dict:
    """Generate extraction report with statistics"""
    total = len(results)
    successful = sum(1 for r in results if r['status'] == 'success')
    partial = sum(1 for r in results if r['status'] == 'partial')
    failed = sum(1 for r in results if r['status'] == 'failed')
    
    avg_confidence = sum(r.get('confidence', 0) for r in results) / total if total > 0 else 0
    
    # Collect all new metrics found
    all_new_metrics = set()
    for result in results:
        all_new_metrics.update(result.get('new_metrics', {}).keys())
    
    # Collect all suburbs found
    suburbs_found = [r['suburb_name'] for r in results if r.get('suburb_name')]
    
    return {
        'extraction_date': datetime.now().isoformat(),
        'total_screenshots': total,
        'successful_extractions': successful,
        'partial_extractions': partial,
        'failed_extractions': failed,
        'success_rate': successful / total if total > 0 else 0,
        'average_confidence': avg_confidence,
        'suburbs_found': list(set(suburbs_found)),
        'new_metrics_identified': list(all_new_metrics),
        'results': results
    }

def main():
    """Main extraction function"""
    print("🔍 OCR Extraction from Suburb Data Screenshots\n")
    
    # Load suburb names for validation
    load_suburb_names()
    
    # Check screenshot directory
    if not SCREENSHOT_DIR.exists():
        print(f"❌ Screenshot directory not found: {SCREENSHOT_DIR}")
        sys.exit(1)
    
    # Find all JPG files
    screenshot_files = list(SCREENSHOT_DIR.glob("*.jpg"))
    if not screenshot_files:
        print(f"❌ No JPG files found in {SCREENSHOT_DIR}")
        sys.exit(1)
    
    print(f"📁 Found {len(screenshot_files)} screenshot files\n")
    
    # Ensure output directory exists
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    # Process each screenshot
    results = []
    for i, image_path in enumerate(screenshot_files, 1):
        print(f"[{i}/{len(screenshot_files)}] ", end="")
        result = process_screenshot(image_path)
        results.append(result)
        
        if result['status'] == 'success':
            print(f"✅ {result['suburb_name']} (confidence: {result['confidence']:.2f})")
        elif result['status'] == 'partial':
            print(f"⚠️  Partial (confidence: {result['confidence']:.2f})")
        else:
            print(f"❌ Failed: {result.get('error', 'Unknown error')}")
    
    print("\n" + "="*60)
    print("📊 Generating reports...\n")
    
    # Generate report
    report = generate_report(results)
    
    # Save JSON output
    output_data = {}
    for result in results:
        if result.get('suburb_name'):
            suburb = result['suburb_name']
            if suburb not in output_data:
                output_data[suburb] = []
            output_data[suburb].append({
                'source_file': result['source_file'],
                'parsed_metrics': result['parsed_metrics'],
                'new_metrics': result['new_metrics'],
                'confidence': result['confidence']
            })
    
    with open(OUTPUT_JSON, 'w') as f:
        json.dump(output_data, f, indent=2)
    print(f"✅ Saved extracted data: {OUTPUT_JSON}")
    
    # Save CSV output
    csv_rows = []
    for result in results:
        if result.get('suburb_name'):
            row = {
                'source_file': result['source_file'],
                'suburb_name': result['suburb_name'],
                'confidence': result['confidence'],
                **result['parsed_metrics'],
                **{f'new_{k}': v for k, v in result['new_metrics'].items()}
            }
            csv_rows.append(row)
    
    if csv_rows:
        df = pd.DataFrame(csv_rows)
        df.to_csv(OUTPUT_CSV, index=False)
        print(f"✅ Saved CSV output: {OUTPUT_CSV}")
    
    # Save report
    with open(REPORT_FILE, 'w') as f:
        json.dump(report, f, indent=2)
    print(f"✅ Saved extraction report: {REPORT_FILE}")
    
    # Print summary
    print("\n" + "="*60)
    print("📈 EXTRACTION SUMMARY")
    print("="*60)
    print(f"Total screenshots: {report['total_screenshots']}")
    print(f"Successful: {report['successful_extractions']} ({report['success_rate']*100:.1f}%)")
    print(f"Partial: {report['partial_extractions']}")
    print(f"Failed: {report['failed_extractions']}")
    print(f"Average confidence: {report['average_confidence']:.2f}")
    print(f"Suburbs found: {len(report['suburbs_found'])}")
    print(f"New metrics identified: {len(report['new_metrics_identified'])}")
    if report['new_metrics_identified']:
        print(f"  - {', '.join(report['new_metrics_identified'])}")
    print("\n✅ Extraction complete!")

if __name__ == "__main__":
    main()


