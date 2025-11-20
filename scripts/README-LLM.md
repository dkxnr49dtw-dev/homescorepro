# LLM-Based Suburb Data Parser

Uses OpenAI's GPT-4 to intelligently parse suburb data from OCR text, providing much higher accuracy than regex-based parsing.

## Setup

### 1. Install Dependencies

```bash
pip install openai python-dotenv pandas
```

### 2. Get OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Set as environment variable:
   ```bash
   export OPENAI_API_KEY='your-api-key-here'
   ```
   Or create `.env` file:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

## Usage

```bash
python3 scripts/llm-table-parser.py
```

The script will:
1. Load OCR extraction results from `data/extracted-suburb-data.json`
2. Send each OCR text to GPT-4 for intelligent parsing
3. Extract structured data (prices, yields, distances, etc.)
4. Fix OCR errors automatically
5. Save results to multiple formats

## Output Files

### llm-parsed-suburb-data.json
Detailed results with LLM responses and metadata for each suburb.

### llm-parsed-suburb-data.csv
Clean CSV with structured suburb data - ready for analysis.

### llm-parsing-report.json
Statistics on parsing success rates, data completeness, and confidence levels.

## Cost Estimate

- **Model:** GPT-4o-mini (~$0.15 per 1M input tokens, $0.60 per 1M output tokens)
- **Per screenshot:** ~$0.01-0.02
- **32 screenshots:** ~$0.32-$0.64 total
- **Batch processing:** Even lower cost

## Advantages over OCR Regex

✅ **Intelligent parsing** - Understands context and table structure
✅ **Error correction** - Fixes OCR mistakes (e.g., "51,710,000" → "$1,710,000")
✅ **Flexible format** - Handles variations in table layout
✅ **Multiple suburbs** - Can extract all suburbs from comparison tables
✅ **Data validation** - Applies reasonable constraints and formatting

## Data Fields Extracted

- `suburb_name` - Exact suburb name
- `lga` - Local Government Area
- `state` - State/Territory
- `median_price` - Median house price (numeric)
- `rental_yield` - Rental yield as decimal (e.g., 0.04 for 4%)
- `weekly_rent` - Weekly rent amount (numeric)
- `cbd_distance_km` - Distance to CBD in km (numeric)
- `household_percentage` - Household demographic data (decimal)
- `llm_confidence` - LLM confidence in extraction (high/medium/low)
- `notes` - Any corrections or issues noted

## Troubleshooting

### No API Key Found
```
❌ No OpenAI API key found!
```
- Set `OPENAI_API_KEY` environment variable
- Or create `.env` file with the key

### Rate Limiting
If you hit OpenAI's rate limits, the script will show errors. Wait a few minutes and try again.

### Low Success Rate
If parsing success is low (<80%), the OCR text quality might be poor. Consider:
- Re-running OCR with better preprocessing
- Using a different OCR engine
- Manual review of failed cases

### Cost Too High
Switch to GPT-3.5-turbo for lower cost (modify the model in the script):
```python
model="gpt-3.5-turbo"  # Instead of gpt-4o-mini
```

## Comparison with Previous OCR Approach

| Method | Success Rate | Data Accuracy | Cost | Time |
|--------|-------------|---------------|------|------|
| Regex OCR | 6% (2/32) | Low (OCR errors) | Free | Fast |
| LLM Parsing | ~90% expected | High (error correction) | ~$0.50 | Medium |

## Next Steps

After LLM parsing:
1. Review the CSV output for data quality
2. Compare with existing suburbs.csv data
3. Integrate new metrics into your data model
4. Update data-dictionary.md with new fields
5. Consider adding data validation rules
