with open('src/app/bulk-order/page.tsx', 'r') as f:
    bulk = f.read()

# Remove the line with 7011917290
lines = bulk.split('\n')
bulk = '\n'.join([line for line in lines if '7011917290' not in line])

with open('src/app/bulk-order/page.tsx', 'w') as f:
    f.write(bulk)

with open('src/components/home/Footer.tsx', 'r') as f:
    footer = f.read()

# Replace 07011917290 and 070119 17290 with 9716299990 and +91 97162 99990
footer = footer.replace('tel:07011917290', 'tel:+919716299990')
footer = footer.replace('070119 17290', '+91 97162 99990')

with open('src/components/home/Footer.tsx', 'w') as f:
    f.write(footer)

