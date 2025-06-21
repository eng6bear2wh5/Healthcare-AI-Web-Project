import sys
import os
import tempfile
import json
from PIL import Image
import pytesseract
from pdf2image import convert_from_path
from docx2pdf import convert as docx2pdf_convert
from dotenv import load_dotenv
import google.generativeai as genai

# --- PHẦN CẤU HÌNH API ---
# Load API key từ .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Ghi lỗi ra stderr để Node.js có thể bắt được
    print(json.dumps({"success": False, "error": "GEMINI_API_KEY not found"}), file=sys.stderr)
    sys.exit(1)
genai.configure(api_key=api_key)

# --- PHẦN OCR ---
def ocr_images(images):
    """OCR a list of images and concatenate the text."""
    text = ""
    for img in images:
        # Dùng cả tiếng Anh và tiếng Việt để có độ chính xác cao nhất
        text += pytesseract.image_to_string(img, lang='eng+vie')
    return text

def get_text_from_file(file_path):
    """Extract raw text from various file types using OCR."""
    ext = os.path.splitext(file_path)[-1].lower()

    if ext in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']:
        image = Image.open(file_path)
        return pytesseract.image_to_string(image, lang='eng+vie')

    elif ext == '.pdf':
        images = convert_from_path(file_path, dpi=300)
        return ocr_images(images)

    elif ext == '.docx':
        with tempfile.TemporaryDirectory() as tmpdir:
            docx2pdf_convert(file_path, tmpdir)
            pdf_files = [f for f in os.listdir(tmpdir) if f.endswith('.pdf')]
            if not pdf_files:
                raise RuntimeError("Failed to convert DOCX to PDF.")
            pdf_path = os.path.join(tmpdir, pdf_files[0])
            images = convert_from_path(pdf_path, dpi=300)
            return ocr_images(images)
            
    else:
        raise ValueError("Unsupported file format. Only image, PDF, or DOCX allowed.")

# --- PHẦN TRÍCH XUẤT THÔNG TIN BẰNG AI ---
def extract_medical_info(text: str) -> str:
    """Sends text to Gemini to extract medical info into a JSON object."""
    system_prompt = (
        "You are an expert-level medical document parsing engine. Your mission is to meticulously analyze raw text from a Vietnamese medical record and convert it into a perfectly structured JSON object. Adherence to all rules is mandatory.\n\n"
        "**=== CORE INSTRUCTIONS ===**\n"
        "1.  **Analyze Input:** The provided text is in Vietnamese. It may contain OCR errors (e.g., missing accents). Analyze the context to understand the meaning.\n"
        "2.  **Strict JSON Output:** Your entire output MUST be a single, valid JSON object. Do not include any text, explanations, or markdown (like ```json) outside the JSON structure.\n"
        "3.  **Handle Missing Data:** If any piece of information is not found in the text, its corresponding JSON value MUST be `null`.\n"
        "4.  **Data Type Conversion (CRITICAL):** All numerical values (height, weight, lab results) MUST be of the `number` type (integer or float). Do not use strings for numbers.\n"
        "5.  **Text Formatting Rule:** For any field that contains multi-line text (like `diet_description`, `notes`, `drugs`), if the source text uses bullet points (e.g., '-', '•', '*'), you MUST remove the bullet character and any leading space. The final string should be clean text with items separated only by a newline character (`\\n`).\n\n"
        "--- JSON OUTPUT SPECIFICATION ---\n\n"
        "**1. `personal_profile` (Object):** Static personal and lifestyle information.\n"
        "   - `full_name` (string|null): The patient's full name.\n"
        "   - `birth_date` (string|null): Format as **YYYY-MM-DD**.\n"
        "   - `height` (number|null): Height in centimeters.\n"
        "   - `weight` (number|null): Weight in kilograms.\n"
        "   - `gender` (string|null): Must be one of: **'male'**, **'female'**, **'other'**.\n"
        "   - `blood_type` (string|null): Must be one of: **'A'**, **'B'**, **'AB'**, **'O'**, **'A-'**, **'B-'**, **'AB-'**, **'O-'**. Use 'other' if non-standard.\n"
        "   - `diet_description` (string|null): Summary of current diet. Apply the text formatting rule.\n"
        "   - `activity_level_description` (string|null): Description of physical activity level.\n"
        "   - `daily_routine_description` (string|null): Description of daily routine.\n\n"
        "**2. `health_metrics` (Object):** Recent health measurements.\n"
        "   - `bmi` (number|null)\n"
        "   - `heart_rate` (number|null)\n"
        "   - `blood_glucose` (number|null)\n"
        "   - `body_fat` (number|null)\n"
        "   - `blood_pressure` (Object|null): { `systolic`: number|null, `diastolic`: number|null }\n"
        "   - `cholesterol` (Object|null): { `ldl`: number|null, `hdl`: number|null }\n"
        "   - `liver_enzymes` (Object|null): { `sgpt`: number|null, `sgot`: number|null }\n"
        "   - `kidney_index` (Object|null): { `creatinine`: number|null, `eGFR`: number|null }\n\n"
        "**3. `medical_conditions` (Array of Objects):** A list of diagnosed diseases. If no diseases are mentioned, return an empty array `[]`.\n"
        "   - Each object in the array represents one disease and must contain:\n"
        "     - `disease_name` (string): The name of the condition (e.g., 'Tăng huyết áp', 'Tiểu đường type 2').\n"
        "     - `diagnosis_date` (string|null): Date of diagnosis, formatted as **YYYY-MM-DD**.\n"
        "     - `notes` (string|null): General notes about the condition (e.g., status, duration) *excluding the specific drug names used for treatment*. Apply the text formatting rule.\n"
        "     - `drugs` (string|null): A newline-separated list of medications *specifically used to treat this condition*. If multiple drugs are used for one condition, list them all here, separated by `\\n`. Apply the text formatting rule.\n\n"
        "**=== EXAMPLE OF A PERFECT OUTPUT ===**\n"
        "```json\n"
        "{\n"
        "  \"personal_profile\": {\n"
        "    \"full_name\": \"NGUYEN QUOC VUONG\",\n"
        "    \"birth_date\": \"2005-07-16\",\n"
        "    \"height\": 178,\n"
        "    \"weight\": 82,\n"
        "    \"gender\": \"male\",\n"
        "    \"blood_type\": \"O\",\n"
        "    \"diet_description\": \"Ăn nhạt (giảm muối <5g/ngày), ít dầu mỡ động vật\\nHạn chế tinh bột nhanh, ưu tiên rau xanh, cá, đạm thực vật\\nUống khoảng 2 lít nước/ngày\\nKhông uống rượu bia, cà phê chỉ uống 1 lần/ngày\\nTránh đồ chiên rán, thức ăn nhanh, nước ngọt có gas\",\n"
        "    \"activity_level_description\": null,\n"
        "    \"daily_routine_description\": null\n"
        "  },\n"
        "  \"health_metrics\": {\n"
        "    \"bmi\": 25.9,\n"
        "    \"heart_rate\": 75,\n"
        "    \"blood_glucose\": 174,\n"
        "    \"body_fat\": 18,\n"
        "    \"blood_pressure\": {\n"
        "      \"systolic\": 120,\n"
        "      \"diastolic\": 80\n"
        "    },\n"
        "    \"cholesterol\": {\n"
        "      \"ldl\": 96.7,\n"
        "      \"hdl\": 50.3\n"
        "    },\n"
        "    \"liver_enzymes\": {\n"
        "      \"sgpt\": 25,\n"
        "      \"sgot\": 22\n"
        "    },\n"
        "    \"kidney_index\": {\n"
        "      \"creatinine\": 1.0,\n"
        "      \"eGFR\": 98\n"
        "    }\n"
        "  },\n"
        "  \"medical_conditions\": [\n"
        "    {\n"
        "      \"disease_name\": \"Tăng huyết áp\",\n"
        "      \"diagnosis_date\": null,\n"
        "      \"notes\": \"Đã phát hiện 3 năm, đang điều trị ổn định.\",\n"
        "      \"drugs\": \"Amlodipin 5mg/ngày (sáng)\"\n"
        "    },\n"
        "    {\n"
        "      \"disease_name\": \"Tiểu đường type 2\",\n"
        "      \"diagnosis_date\": null,\n"
        "      \"notes\": \"Phát hiện gần đây, kiểm soát bằng chế độ ăn và thuốc.\",\n"
        "      \"drugs\": \"Metformin 500mg x 2 viên/ngày (sáng và tối)\"\n"
        "    },\n"
        "    {\n"
        "      \"disease_name\": \"Mỡ máu cao (rối loạn lipid máu)\",\n"
        "      \"diagnosis_date\": null,\n"
        "      \"notes\": null,\n"
        "      \"drugs\": \"Simvastatin 10mg/ngày (tối)\"\n"
        "    }\n"
        "  ]\n"
        "}\n"
        "```"
    )

    model = genai.GenerativeModel("gemini-2.0-flash") # gemini-1.5-flash is newer and often better/cheaper
    
    # Gửi thẳng văn bản đã OCR cho AI, không cần "làm sạch" ở đây.
    response = model.generate_content(
        f"{system_prompt}\n\nInput Text:\n{text}",
        generation_config={"temperature": 0.0, "response_mime_type": "application/json"}
    )

    return response.text.strip()

# --- HÀM MAIN ĐIỀU PHỐI ---
def main():
    final_result = {
        "success": False,
        "extracted_data": None,
        "raw_text": None,
        "error": None
    }

    if len(sys.argv) < 2:
        final_result["error"] = "Usage: python your_script_name.py <file_path>"
        # In lỗi ra stdout để Node.js bắt được JSON lỗi
        print(json.dumps(final_result, indent=2, ensure_ascii=False))
        sys.exit(1)

    file_path = sys.argv[1]

    try:
        raw_text = get_text_from_file(file_path)
        if not raw_text.strip():
            raise RuntimeError("OCR process did not extract any text.")
        
        final_result["raw_text"] = raw_text
        json_string_from_ai = extract_medical_info(raw_text)
        extracted_data = json.loads(json_string_from_ai)
        
        final_result["success"] = True
        final_result["extracted_data"] = extracted_data

    except Exception as e:
        final_result["error"] = str(e)
    
    # Chuyển đối tượng Python thành chuỗi JSON, giữ nguyên ký tự tiếng Việt (UTF-8)
    output_string = json.dumps(final_result, indent=2, ensure_ascii=False)
    
    # === PHẦN SỬA LỖI QUAN TRỌNG NHẤT ===
    # Ghi trực tiếp chuỗi đã được mã hóa UTF-8 vào luồng stdout buffer.
    # Cách này đảm bảo không bị lỗi UnicodeEncodeError trên Windows console.
    sys.stdout.buffer.write(output_string.encode('utf-8'))

if __name__ == "__main__":
    main()