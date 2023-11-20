from bs4 import BeautifulSoup
from flask import Flask, redirect, url_for, session, jsonify, request
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from linkedin_api import Linkedin
import requests
from serpapi import GoogleSearch
import re
import os
from dotenv import load_dotenv
import openai
load_dotenv() 

app = Flask(__name__)
CORS(app) 

# Set a secret key for the session
app.secret_key = os.urandom(24)  # In production, use a persistent secret key

# SERP_API_KEY = "7fc993c43e2c3a4cb0b674decf645e4a3f1b2cfd8c35d4e2a1d89f88988d2e2c"
SERP_API_KEY= "9223799ec01c832b53f808fddda368e01fbaa667039f9efa124ae7bfc9fd98c1"
CLEARBIT_API_KEY ="sk_07f73ef8cddcd33ecab47f2049a8c78c"
openai.api_key='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'
GPT_MODEL = 'gpt-3.5-turbo'


# OAuth Configuration
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id='473194738997-rujhd47090og9hssg84bvvvo1mnmm72h.apps.googleusercontent.com',
    client_secret='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',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'openid email profile https://www.googleapis.com/auth/calendar'}
)

@app.route('/')
def home():
    return "Welcome to the home page after successful login!"

@app.route('/login/google')
def google_login():
    google = oauth.create_client('google')
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    google = oauth.create_client('google')
    token = google.authorize_access_token()
    access_token = token.get('access_token')
    resp = google.get('userinfo')
    user_info = resp.json()
    # Handle user_info (e.g., create user session)
    return redirect(f"http://localhost:3001?token={access_token}")

@app.route('/get_linkedin_profile', methods=['POST'])
def get_linkedin_profile():
    data = request.get_json()
    profile_name = data.get('profile_name')

    EMAIL = "mdomerkhan8000@gmail.com"
    PASSWORD = "SB4@mrkhan"

    api = Linkedin(EMAIL, PASSWORD)
    profile_data = api.get_profile(profile_name)

    return jsonify(profile_data)

def summarize_with_openai(text):
    openai.api_key =""

    response = openai.Completion.create(
        engine="davinci",
        prompt=text,
        max_tokens=50,  # Adjust this value for the desired summary length
    )

    return response.choices[0].text

@app.route('/get_linkedin_id_from_google', methods=['POST'])
def get_linkedin_id_from_google_endpoint():
    data = request.get_json()
    email = data.get('email')

    serp_api_key = SERP_API_KEY

    params = {
        "engine": "google",
        "q": f"Linkedin profile {email}",
        "api_key": serp_api_key
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    organic_results = results.get("organic_results", [])[:1]

    linkedin_id = None
    for result in organic_results:
        print("Title:", result["title"])
        print("URL:", result["link"])

        match = re.search(r"/in/([^/?]+)", result["link"])
        if match:
            linkedin_id = match.group(1)
            print("LinkedIn ID:", linkedin_id)

    return jsonify({"linkedin_id": linkedin_id})

@app.route('/company/<domain>', methods=['GET'])
def get_company(domain):
    clearbit_api_key = os.environ.get('CLEARBIT_API_KEY')
    if not clearbit_api_key:
        print("Clearbit API key is missing")
        return jsonify({"error": "Server configuration error"}), 500

    headers = {'Authorization': f'Bearer {clearbit_api_key}'}

    response = requests.get(
        'https://company.clearbit.com/v2/companies/find',
        params={'domain': domain},
        headers=headers
    )

    print("Status Code:", response.status_code)
    print("Response:", response.json())

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Company not found"}), response.status_code

    
@app.route('/company_details', methods=['POST'])
def get_company_details():
    company_urn = request.args.get('company_urn')

    EMAIL = "mdomerkhan8000@gmail.com"
    PASSWORD = "SB4@mrkhan"

    api = Linkedin(EMAIL, PASSWORD)
    company_details = api.get_company(company_urn)

    return jsonify(company_details)

@app.route('/search-news', methods=['GET'])
def search_news():
    domain = request.args.get('domain')

    if not domain:
        return jsonify({"error": "Domain is required"}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4", 
            messages=[{"role": "system", "content": "You are a helpful assistant. With provides and Summarize the news about the companies in the best pretty way. You can provide Old news if you dont have latest"}, 
                      {"role": "user", "content": f"Get the old news for {domain}"}]
        )

        news = response.choices[0].message['content']  

        return jsonify({"news": news})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def generate_response(text):
    openai.api_key ='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'
    response = openai.ChatCompletion.create(
        messages=[
            {'role': 'system', 'content': 'Summarize the content in the most pretty format'},
            {'role': 'user', 'content': text},
        ],
        model=GPT_MODEL,
        temperature=0,
    )
    
    return response.choices[0].message['content']


@app.route('/summarize', methods=['POST'])
def summarize_news():
    try:
        domain = request.json.get('domain')
        
        serpapi_params = {
            'engine': 'google',
            'q': 'News about ${domain}',
            'api_key': SERP_API_KEY
        }
        serpapi_response = requests.get('https://serpapi.com/search', params=serpapi_params)
        serpapi_data = serpapi_response.json()
        
        headlines = [result['title'] for result in serpapi_data['organic_results']]
        urls = [result['link'] for result in serpapi_data['organic_results']]
        
        summaries = []
        
        for url in urls:
            article_response = requests.get(url)
            article_html = article_response.text
            soup = BeautifulSoup(article_html, 'html.parser')
            paragraphs = soup.find_all('p')
            article_text = '\n'.join([p.get_text() for p in paragraphs])
            
            summary = summarize_with_openai(article_text)
            summaries.append(summary)
        
        response_data = {
            'domain': domain,
            'headlines': headlines,
            'summaries': summaries
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
