# OCR Extraction Setup Instructions

## Prerequisites

### 1. Install Tesseract OCR

**macOS:**
```bash
brew install tesseract
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
```

**Windows:**
- Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
- Add Tesseract to PATH

**Verify installation:**
```bash
tesseract --version
```

### 2. Install Python Dependencies

```bash
pip install pytesseract pillow opencv-python pandas
```

Or if using pip3:
```bash
pip3 install pytesseract pillow opencv-python pandas
```

### 3. Verify Setup

```bash
python3 scripts/ocr-extract-suburb-data.py
```

If Tesseract is not found, the script will display installation instructions.

## Usage

```bash
python3 scripts/ocr-extract-suburb-data.py
```

The script will:
1. Process all JPG files in `extra suburb data/` folder
2. Extract text using OCR
3. Parse suburb names and metrics
4. Output results to:
   - `data/extracted-suburb-data.json` - Structured data
   - `data/extracted-suburb-data.csv` - Tabular format
   - `data/ocr-extraction-report.json` - Extraction statistics

## Output Files

### extracted-suburb-data.json
Structured JSON with suburb names as keys, containing extracted metrics.

### extracted-suburb-data.csv
Tabular CSV format for easy review in spreadsheet applications.

### ocr-extraction-report.json
Detailed report with:
- Success/failure rates
- Quality scores
- New metrics identified
- Suburbs found
- Extraction statistics

## Troubleshooting

**Tesseract not found:**
- Verify installation: `tesseract --version`
- On macOS, ensure Homebrew is installed: `brew --version`
- Add Tesseract to PATH if needed

**Low OCR accuracy:**
- Screenshots may need better quality
- Try preprocessing images manually
- Consider using Google Cloud Vision API for higher accuracy

**Missing Python packages:**
- Install with: `pip install pytesseract pillow opencv-python pandas`
- Use `pip3` if `pip` points to Python 2

**No text extracted:**
- Check image quality
- Verify image format (JPG/PNG)
- Try preprocessing images manually

## Alternative: Google Cloud Vision API

For higher accuracy, you can use Google Cloud Vision API:

1. Set up Google Cloud account
2. Enable Vision API
3. Create API key
4. Install: `pip install google-cloud-vision`
5. Set environment variable: `export GOOGLE_APPLICATION_CREDENTIALS="path/to/key.json"`
6. Modify script to use Cloud Vision API (see script comments)


