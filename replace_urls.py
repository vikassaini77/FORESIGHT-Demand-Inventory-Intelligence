import os

frontend_src = r'c:\Users\hp\Desktop\Retail system\frontend\src'
for root, _, files in os.walk(frontend_src):
    for f in files:
        if f.endswith('.jsx') or f.endswith('.js'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = content.replace("'http://localhost:8000", "import.meta.env.VITE_API_URL + '")
            new_content = new_content.replace("'ws://localhost:8000", "import.meta.env.VITE_WS_URL + '")
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f'Updated {path}')
