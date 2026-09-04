import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Remove the juttis HorizontalCatalog block
block_to_remove = """
          <HorizontalCatalog 
            title="Handcrafted Designer Juttis"
            subtitle="Walk in Elegance"
            description="Premium, handcrafted genuine leather juttis with intricate detailing for both casual and festive occasions."
            items={juttisCatalog}
            bgClass="bg-[#FAF8F5] dark:bg-[#0a0a0a]"
            accentColor="#E91E63"
          />
"""

content = content.replace(block_to_remove, "")

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
