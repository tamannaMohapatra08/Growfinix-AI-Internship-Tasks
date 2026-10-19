
import json
import re

def extract_information(text):
    name_match = re.search(
        r"my name is ([A-Za-z ]+)",
        text,
        re.IGNORECASE
    )

    destination_match = re.search(
        r"in ([A-Za-z ]+?) on ",
        text,
        re.IGNORECASE
    )

    date_match = re.search(
        r"on (\d{1,2} [A-Za-z]+)",
        text,
        re.IGNORECASE
    )

    result = {
        "customer_name": name_match.group(1).strip()
        if name_match else None,
        "requested_date": date_match.group(1).strip()
        if date_match else None,
        "destination": destination_match.group(1).strip()
        if destination_match else None
    }

    return result

sample_text = (
    "Hi, my name is chitu. "
    "I need a hotel booking in Delhi on 25 November."
)

extracted_data = extract_information(sample_text)

print(json.dumps(extracted_data, indent=4))