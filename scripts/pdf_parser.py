#!/usr/bin/env python3
import sys
import os
import re
import json

# Ensure user site-packages are in sys.path
user_site = os.path.expanduser('~/Library/Python/3.9/lib/python/site-packages')
if os.path.exists(user_site) and user_site not in sys.path:
    sys.path.insert(0, user_site)

def strip_pdf_coordinate_noise(text: str) -> str:
    """
    Strips PDF floating-point coordinate numbers (e.g. 429.6679545971678Bangalore -> Bangalore, 00043.44 -> "")
    and font matrix positioning noise.
    """
    if not text:
        return ""
    cleaned = text
    # 1. Strip zero-padded or standard float coordinate numbers e.g. 00043.44, 00364.15, 00394.87, 000041.4, 429.66795
    cleaned = re.sub(r'\b0*\d{1,5}\.\d{1,15}\b', ' ', cleaned)
    # 2. Strip attached float numbers prefixed to text e.g. 00043.44Indrani, 45.011716Python, 000041.4Experience
    cleaned = re.sub(r'0*\d{1,5}\.\d{1,15}(?=[a-zA-Z•+\/])', ' ', cleaned)
    # 3. Strip standalone multi-digit integer coordinate prefixes on lines
    cleaned = re.sub(r'^\d{4,}\s+\d+\.\d+', '', cleaned, flags=re.MULTILINE)
    # 4. Normalise duplicate spaces & multi-newlines
    cleaned = re.sub(r'[ \t]+', ' ', cleaned)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    return cleaned.strip()

def parse_pdf_pdfplumber(pdf_path: str):
    import pdfplumber
    text_chunks = []
    tables = []
    
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            page_text = page.extract_text(layout=True) or page.extract_text() or ""
            if page_text:
                text_chunks.append(page_text)
            
            # Extract tables if present
            page_tables = page.extract_tables()
            for tbl in page_tables:
                clean_tbl = [[cell.strip() if cell else "" for cell in row] for row in tbl if any(row)]
                if clean_tbl:
                    tables.append(clean_tbl)
                    
    combined_text = "\n\n".join(text_chunks)
    cleaned_text = strip_pdf_coordinate_noise(combined_text)
    return {
        "text": cleaned_text,
        "tables": tables,
        "pages_count": len(pdf.pages) if 'pdf' in locals() else 1,
        "method": "pdfplumber"
    }

def parse_pdf_fitz(pdf_path: str):
    import fitz # PyMuPDF
    doc = fitz.open(pdf_path)
    text_chunks = []
    
    for page in doc:
        blocks = page.get_text("blocks")
        if not blocks:
            continue
            
        midpoint = page.rect.width / 2.0
        has_left = any(b[0] < midpoint - 20 for b in blocks if len(b) > 4 and b[4].strip())
        has_right = any(b[0] >= midpoint - 20 for b in blocks if len(b) > 4 and b[4].strip())

        if has_left and has_right:
            top_blocks = [b for b in blocks if (b[2] - b[0]) > (page.rect.width * 0.75)]
            other_blocks = [b for b in blocks if b not in top_blocks]
            left_blocks = [b for b in other_blocks if b[0] < midpoint]
            right_blocks = [b for b in other_blocks if b[0] >= midpoint]
            
            top_blocks.sort(key=lambda b: b[1])
            left_blocks.sort(key=lambda b: b[1])
            right_blocks.sort(key=lambda b: b[1])
            
            ordered = top_blocks + left_blocks + right_blocks
            page_text = "\n".join(b[4] for b in ordered if len(b) > 4 and b[4].strip())
        else:
            page_text = page.get_text("text") or ""
            
        if page_text:
            text_chunks.append(page_text)
            
    combined_text = "\n\n".join(text_chunks)
    cleaned_text = strip_pdf_coordinate_noise(combined_text)
    return {
        "text": cleaned_text,
        "tables": [],
        "pages_count": len(doc),
        "method": "pymupdf"
    }

def parse_pdf_pypdf(pdf_path: str):
    import pypdf
    reader = pypdf.PdfReader(pdf_path)
    text_chunks = []
    
    for page in reader.pages:
        page_text = page.extract_text() or ""
        if page_text:
            text_chunks.append(page_text)
            
    combined_text = "\n\n".join(text_chunks)
    cleaned_text = strip_pdf_coordinate_noise(combined_text)
    return {
        "text": cleaned_text,
        "tables": [],
        "pages_count": len(reader.pages),
        "method": "pypdf"
    }

def parse_pdf(pdf_path: str):
    if not os.path.exists(pdf_path):
        return {"success": False, "error": f"File not found: {pdf_path}"}
        
    methods = [parse_pdf_pdfplumber, parse_pdf_fitz, parse_pdf_pypdf]
    last_error = None
    
    for method in methods:
        try:
            res = method(pdf_path)
            if res.get("text") and len(res["text"].strip()) > 30:
                res["success"] = True
                return res
        except Exception as e:
            last_error = str(e)
            continue
            
    return {"success": False, "error": f"Failed to parse PDF with all Python methods: {last_error}"}

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Usage: python3 pdf_parser.py <path_to_pdf>"}))
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    result = parse_pdf(pdf_path)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
