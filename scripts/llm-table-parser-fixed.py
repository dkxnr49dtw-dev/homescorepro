#!/usr/bin/env python3
"""
LLM-Based Table Parser for Suburb Data Screenshots

Uses OpenAI's GPT-4 to intelligently parse OCR text from suburb comparison tables.
Handles complex table structures, fixes OCR errors, and extracts structured data.

Requirements:
- pip install openai python-dotenv pandas

Usage: python3 scripts/llm-table-parser-fixed.py
"""

import os
import sys
import json
import pandas as pd
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
import re

try:
    import openai
    from openai import OpenAI
except ImportError:
    print("❌ Missing OpenAI package")
    print("Install with: pip install openai")
    sys.exit(1)

# Configuration
INPUT_JSON = Path("data/extracted-suburb-data.json")
OUTPUT_JSON = Path("data/llm-parsed-suburb-data.json")
OUTPUT_CSV = Path("data/llm-parsed-suburb-data.csv")
REPORT_FILE = Path("data/llm-parsing-report.json")

def init_openai_client():
    """Initialize OpenAI client with API key"""
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        env_path = Path('.env')
        if env_path.exists():
            from dotenv import load_dotenv
            load_dotenv()
            api_key = os.getenv('OPENAI_API_KEY')

    if not api_key:
        print("❌ No OpenAI API key found!")
        print("\nSet up your API key:")
        print("1. Get key from: https://platform.openai.com/api-keys")
        print("2. Set environment variable: export OPENAI_API_KEY='your-key'")
        print("3. Or create .env file with: OPENAI_API_KEY=your-key")
        print("\n💰 Estimated cost: ~$0.50 for 32 screenshots")
        sys.exit(1)

    return OpenAI(api_key=api_key)

def load_ocr_data() -> Dict:
    """Load OCR extraction results"""
    if not INPUT_JSON.exists():
        print(f"❌ Input file not found: {INPUT_JSON}")
        print("Run OCR extraction first: python3 scripts/ocr-extract-suburb-data.py")
        sys.exit(1)

    with open(INPUT_JSON, 'r') as f:
        return json.load(f)

def create_parsing_prompt(ocr_text: str, target_suburb: str) -> str:
    """Create LLM prompt for parsing suburb data"""
    return f"""You are an expert data analyst specializing in Australian real estate data.

Parse this OCR text from a suburb comparison table and extract data for the suburb "{target_suburb}". Look through all the suburb entries in the table.

The table contains columns like:
- Suburb Name
- Local Government Area (LGA)
- State (usually Victoria)
- Median House Price (format: $X,XXX,XXX)
- Rental Yield (percentage)
- Weekly Rent (format: $XXX)
- CBD Distance (in km)
- Household percentage (demographic data)

OCR TEXT:
{ocr_text}

INSTRUCTIONS:
1. Find the row for suburb "{target_suburb}" (case insensitive, fuzzy match)
2. Extract ALL available metrics for that suburb
3. Fix any OCR errors (e.g., "51,710,000" should be "$1,710,000")
4. Convert prices to numbers (remove $ and commas)
5. Convert percentages to decimals (e.g., "4.0%" becomes 0.04)
6. Convert distances to numbers (remove "km")
7. Be precise with the data - don't guess missing values

Return ONLY a JSON object with these fields (use null for missing data):
{{
    "suburb_name": "exact suburb name from data",
    "lga": "local government area",
    "state": "state/territory",
    "median_price": number or null,
    "rental_yield": decimal (0.04 for 4%) or null,
    "weekly_rent": number or null,
    "cbd_distance_km": number or null,
    "household_percentage": decimal (0.479 for 47.9%) or null,
    "confidence": "high/medium/low",
    "notes": "any issues or corrections made"
}}

If the suburb is not found in the text, return: {{"error": "suburb_not_found"}}"""

def parse_suburb_with_llm(client: OpenAI, ocr_text: str, target_suburb: str) -> Dict:
    """Use LLM to parse suburb data from OCR text"""
    prompt = create_parsing_prompt(ocr_text, target_suburb)

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a precise data extraction specialist. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=1000
        )

        content = response.choices[0].message.content.strip()
        content = re.sub(r'^```json\s*', '', content)
        content = re.sub(r'\s*```$', '', content)

        result = json.loads(content)

        if "error" in result and result["error"] == "suburb_not_found":
            return {"error": "suburb_not_found", "suburb": target_suburb}

        required_fields = ["suburb_name", "confidence"]
        for field in required_fields:
            if field not in result:
                result[field] = None

        return result

    except json.JSONDecodeError as e:
        print(f"⚠️  JSON parsing error for {target_suburb}: {e}")
        return {"error": "json_parse_error", "suburb": target_suburb}

    except Exception as e:
        print(f"⚠️  LLM error for {target_suburb}: {e}")
        return {"error": "llm_error", "suburb": target_suburb}

def process_all_screenshots(client: OpenAI, ocr_data: Dict) -> List[Dict]:
    """Process all screenshots through LLM parsing"""
    results = []
    print(f"\n🔄 Processing {len(ocr_data)} suburbs through LLM...\n")

    for suburb_name, entries in ocr_data.items():
        print(f"📊 Processing: {suburb_name}")

        best_entry = None
        best_confidence = 0

        for entry in entries:
            confidence = entry.get('confidence', 0)
            if confidence > best_confidence:
                best_confidence = confidence
                best_entry = entry

        if not best_entry or 'extracted_text' not in best_entry:
            print(f"  ⚠️  No OCR text found for {suburb_name}")
            continue

        ocr_text = best_entry['extracted_text']
        source_file = best_entry['source_file']

        parsed_data = parse_suburb_with_llm(client, ocr_text, suburb_name)

        result = {
            "suburb_name": suburb_name,
            "source_file": source_file,
            "ocr_confidence": best_confidence,
            "llm_parsed_data": parsed_data,
            "processing_date": datetime.now().isoformat()
        }

        results.append(result)

        if "error" not in parsed_data:
            confidence = parsed_data.get("confidence", "unknown")
            price = parsed_data.get("median_price", "N/A")
            yield_pct = parsed_data.get("rental_yield", "N/A")
            if yield_pct and isinstance(yield_pct, (int, float)):
                yield_pct = f"{yield_pct:.1%}"
            print(f"  ✅ {confidence} confidence | Price: ${price:,} | Yield: {yield_pct}")
        else:
            print(f"  ❌ {parsed_data['error']}")

    return results

def create_consolidated_dataset(results: List[Dict]) -> pd.DataFrame:
    """Create consolidated dataset from LLM results"""
    rows = []

    for result in results:
        suburb_name = result["suburb_name"]
        llm_data = result["llm_parsed_data"]

        if "error" in llm_data:
            row = {
                "suburb_name": suburb_name,
                "source_file": result["source_file"],
                "ocr_confidence": result["ocr_confidence"],
                "parsing_success": False,
                "error_type": llm_data["error"],
                "lga": None,
                "state": None,
                "median_price": None,
                "rental_yield": None,
                "weekly_rent": None,
                "cbd_distance_km": None,
                "household_percentage": None,
                "llm_confidence": None,
                "notes": None
            }
        else:
            row = {
                "suburb_name": suburb_name,
                "source_file": result["source_file"],
                "ocr_confidence": result["ocr_confidence"],
                "parsing_success": True,
                "error_type": None,
                "lga": llm_data.get("lga"),
                "state": llm_data.get("state"),
                "median_price": llm_data.get("median_price"),
                "rental_yield": llm_data.get("rental_yield"),
                "weekly_rent": llm_data.get("weekly_rent"),
                "cbd_distance_km": llm_data.get("cbd_distance_km"),
                "household_percentage": llm_data.get("household_percentage"),
                "llm_confidence": llm_data.get("confidence"),
                "notes": llm_data.get("notes")
            }

        rows.append(row)

    return pd.DataFrame(rows)

def generate_report(results: List[Dict], df: pd.DataFrame) -> Dict:
    """Generate comprehensive parsing report"""
    total_suburbs = len(results)
    successful_parses = sum(1 for r in results if "error" not in r["llm_parsed_data"])
    failed_parses = total_suburbs - successful_parses

    completeness = {}
    for col in ['median_price', 'rental_yield', 'weekly_rent', 'cbd_distance_km', 'household_percentage']:
        non_null = df[col].notna().sum()
        completeness[col] = {
            "available": non_null,
            "percentage": non_null / total_suburbs if total_suburbs > 0 else 0
        }

    confidence_counts = df['llm_confidence'].value_counts().to_dict()

    return {
        "processing_date": datetime.now().isoformat(),
        "total_suburbs_processed": total_suburbs,
        "successful_parses": successful_parses,
        "failed_parses": failed_parses,
        "success_rate": successful_parses / total_suburbs if total_suburbs > 0 else 0,
        "data_completeness": completeness,
        "confidence_distribution": confidence_counts,
        "results_summary": results
    }

def main():
    """Main LLM parsing function"""
    print("🤖 LLM-Based Suburb Data Parser")
    print("=" * 50)

    client = init_openai_client()

    print("📂 Loading OCR extraction data...")
    ocr_data = load_ocr_data()
    print(f"✅ Loaded data for {len(ocr_data)} suburbs")

    OUTPUT_JSON.parent.mkdir(exist_ok=True)

    results = process_all_screenshots(client, ocr_data)

    print("\n📊 Creating consolidated dataset...")
    df = create_consolidated_dataset(results)

    print("💾 Saving results...")

    with open(OUTPUT_JSON, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    print(f"✅ Saved detailed results: {OUTPUT_JSON}")

    df.to_csv(OUTPUT_CSV, index=False)
    print(f"✅ Saved CSV dataset: {OUTPUT_CSV}")

    report = generate_report(results, df)
    with open(REPORT_FILE, 'w') as f:
        json.dump(report, f, indent=2, default=str)
    print(f"✅ Saved parsing report: {REPORT_FILE}")

    print("\n" + "=" * 50)
    print("📈 LLM PARSING RESULTS")
    print("=" * 50)
    print(f"Total suburbs processed: {report['total_suburbs_processed']}")
    print(f"Successful parses: {report['successful_parses']} ({report['success_rate']*100:.1f}%)")
    print(f"Failed parses: {report['failed_parses']}")

    print("\n📊 Data Completeness:")
    for metric, stats in report['data_completeness'].items():
        print(f"  {metric}: {stats['available']}/{total_suburbs} ({stats['percentage']:.1f}%)")

    if report['confidence_distribution']:
        print("\n🎯 Confidence Distribution:")
        for conf, count in report['confidence_distribution'].items():
            print(f"  {conf.title()}: {count}")

    print("\n✅ LLM parsing complete!")
    print("Check the CSV file for the structured suburb data.")

if __name__ == "__main__":
    main()
