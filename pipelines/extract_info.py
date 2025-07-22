import spacy

def parse_info(text):
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    data = {"vendor": None, "date": None, "amount": None}
    for ent in doc.ents:
        if ent.label_ == "ORG" and not data["vendor"]:
            data["vendor"] = ent.text
        elif ent.label_ == "DATE" and not data["date"]:
            data["date"] = ent.text
        elif ent.label_ == "MONEY" and not data["amount"]:
            data["amount"] = ent.text
    return data

parsed_data = parse_info(f'Total is 1245$ from ABC store')
print("extracted info from spacy :", parsed_data)