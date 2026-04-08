from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai # Mudança na importação


app = Flask(__name__)
CORS(app)

# Sua chave
API_KEY = "AIzaSyDXV6Bf0IhSk3OE_yZwo-RyRy5_jt7rYq0" 

# Inicializa o cliente da nova forma
client = genai.Client(api_key=API_KEY)

def build_system_prompt(data):
    return f"""
    Você é um Consultor Financeiro Sênior e Economista.
    CONTEXTO FINANCEIRO (ABRIL/2026):
    - Selic: 10,75% a.a. | CDI: 10,65% a.a.
    
    DADOS DO USUÁRIO:
    - Receita: R$ {data.get('receita', 0)}
    - Gastos: R$ {data.get('gastos', 0)}
    - Investimentos: R$ {data.get('investimentos', 0)}
    """

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_data = request.json or {}
        user_message = user_data.get('message', '')

        if user_message.lower() in ["oi", "olá"]:
            return jsonify({"reply": "Conexão ativa! Como posso ajudar hoje?"})

        # Nova forma de gerar conteúdo com a google-genai
        prompt_final = f"{build_system_prompt(user_data)}\n\nPergunta: {user_message}"
        
        # Usando o modelo 2.0-flash que apareceu no seu teste
        response = client.models.generate_content(
            model='gemini-flash-latest', 
            contents=prompt_final
        )

        return jsonify({"reply": response.text})

    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({"reply": f"Erro na conexão: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)