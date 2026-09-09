import re

with open('src/app/layout.tsx', 'r') as f:
    content = f.read()

# Use regex to remove the entire icons: { ... } block
content = re.sub(r'\s*icons:\s*\{[^}]+\},', '', content)
# In case it's the last item
content = re.sub(r'\s*icons:\s*\{[^}]+\}', '', content)

with open('src/app/layout.tsx', 'w') as f:
    f.write(content)

