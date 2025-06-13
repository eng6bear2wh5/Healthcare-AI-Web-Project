import os
import sys
import json
from dotenv import load_dotenv
import google.generativeai as genai

# Load API key từ .env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def extract_medical_info(text: str) -> str:
    system_prompt = (
        "You are a helpful assistant specialized in medical document parsing. "
        "Given a raw text from a patient's medical record, extract exactly the following fields into a flat JSON object:\n"
        "- full_name (string)\n"
        "- date_of_birth (string, format: YYYY-MM-DD if available, or raw date string)\n"
        "- gender (string)\n"
        "- blood_type (string)\n"
        "- height (string, no unit)\n"
        "- weight (string, no unit)\n"
        "- blood_pressure (string, format systolic/diastolic)\n"
        "- heart_rate (string, no unit)\n"
        "- BMI (string, no unit)\n"
        "- blood_sugar (string, no unit)\n"
        "- body_fat_percentage (string, no unit)\n"
        "- cholesterol_ldl (string, no unit)\n"
        "- cholesterol_hdl (string, no unit)\n"
        "- liver_sgpt (string, no unit)\n"
        "- liver_sgot (string, no unit)\n"
        "- kidney_creatinine (string, no unit)\n"
        "- kidney_egfr (string, no unit)\n"
        "- diet (string, a brief description of the current diet)\n"
        "- medications (string, list or description of medications used)\n"
        "- underlying_conditions (string, description of chronic or past medical conditions)\n"
        "- recommended_diet (string, suggested dietary recommendation if mentioned)\n\n"
        "If any field is missing or unclear, set its value to null.\n"
        "Return only a valid JSON object. Do not include any explanation, markdown, or formatting like code blocks.\n"
        "Use only double quotes for all keys and string values. No units should be included in the values."
    )


    model = genai.GenerativeModel("gemini-2.0-flash")
    chat = model.start_chat()

    response = chat.send_message(
        f"{system_prompt}\n\n{text}",
        generation_config={"temperature": 0.0}
    )

    return response.text.strip()

if __name__ == "__main__":
    raw_text = sys.stdin.read()
    try:
        result = extract_medical_info(raw_text)

        # Clean up any leftover markdown markers (just in case)
        cleaned = result.replace("```json", "").replace("```", "").strip()

        # Try parse to ensure it's valid JSON
        json_obj = json.loads(cleaned)

        print(json.dumps(json_obj))  # Output clean JSON string
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
