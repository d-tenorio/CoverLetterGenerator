from os import environ
import google.generativeai as genai

GOOGLE_API_KEY = environ.get('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
  raise ValueError("Please set the GOOGLE_API_KEY environment variable.")

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_text(prompt, model=model, temperature=0.1):
    return model.generate_content(prompt, generation_config={'temperature': temperature})

from flask import Flask, request, render_template

app = Flask(__name__)

prompt_template = """
You are a professional cover letter writer. Your goal is to compose a 
professional cover letter demonstrating how my abilities align with the 
requirements for the {position} position at {company}. The role has the 
description of {role_desc} Use the {resume} below as a guide.

The length of the cover letter should be strictly no more than {length}. If {length} 
does not contain a length of a document, use a single page. If the length is greater than two pages, 
truncate it down to no more than two pages.

When needed, use {name} as the name of the person applying. Here are the key 
details to incorporate:

1. My relevant experience: [list 2-3 key achievements or roles, with specific 
metrics if possible]
2. Key skills that match the job requirements: [list 3-4 skills]
3. Why I'm interested in this company: [1-2 specific reasons, e.g. their 
recent projects, company culture, or industry leadership]
4. A specific understanding of the company's: 
[recent achievement/initiative/product]

Please write in a confident but warm tone. Include a specific coding challenge 
or technical problem I solved that demonstrates my problem-solving abilities. 
Emphasize my collaborative approach and experience with agile development 
practices. Show enthusiasm for continuous learning and staying current with 
new technologies. Make clear connections between my experience and the 
company's needs.  Format it 
professionally. Avoid generic phrases like 'I am writing to express my interest.' 
Focus on specific contributions I could make to the company. End with a clear 
call to action expressing interest in an interview. Do not make up any details 
about the company. You can refer to {company_details} if you are unsure. 
Do not mention any skills I do not have. If it is not listed on the resume, 
do not lie and say that I have that particular skill.
"""

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        position = request.form['position']
        company = request.form['company']
        company_details = request.form['company_details']
        role_desc = request.form['role_description']
        resume = request.form['resume']
        name = request.form['name']
        length = request.form['length']
        
        completion = generate_text(
            prompt=prompt_template.format(
                position=position,
                company=company,
                company_details=company_details,
                role_desc=role_desc,
                resume=resume,
                name=name,
                length=length
            )
        )
        cover_letter = completion.text
        return render_template('index.html', cover_letter=cover_letter)
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)