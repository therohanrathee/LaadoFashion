import re

with open('src/app/layout.tsx', 'r') as f:
    content = f.read()

# Fix the garbage left behind
content = re.sub(r'\s*\{\s*url:\s*\'/apple-icon\.png\'\s*\}\s*\],\s*\},', '', content)

with open('src/app/layout.tsx', 'w') as f:
    f.write(content)

