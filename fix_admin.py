import re

with open('src/app/dashboard/AdminPortal.tsx', 'r') as f:
    content = f.read()

# Fix the K-Clustering section
content = content.replace(
    'className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4"',
    'className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30 flex flex-col md:flex-row items-center justify-between gap-4"'
)
content = content.replace(
    'className="font-semibold text-blue-900 text-lg mb-1"',
    'className="font-semibold text-blue-900 dark:text-blue-300 text-lg mb-1"'
)
content = content.replace(
    'className="text-sm text-blue-800"',
    'className="text-sm text-blue-800 dark:text-blue-200/70"'
)

# Fix hover:text-gray-900 dark:text-white dark:text-white
# The bug is that hover:text-gray-900 does not have a dark equivalent, AND dark:text-white is repeated.
# Actually, the user says "hovering over them makes them white with white text".
# Let's see the tabs: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-white dark:text-white'
# It should be: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
content = content.replace(
    "text-gray-600 dark:text-gray-300 dark:text-gray-300 hover:text-gray-900 dark:text-white dark:text-white",
    "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
)

# Fix duplicated dark:bg-[#141414]
content = content.replace('bg-white dark:bg-[#141414] dark:bg-[#141414]', 'bg-white dark:bg-[#141414]')
content = content.replace('dark:bg-[#0a0a0a] dark:bg-[#0a0a0a]', 'dark:bg-[#0a0a0a]')
content = content.replace('dark:border-white/5 dark:border-white/5', 'dark:border-white/5')
content = content.replace('dark:border-white/10 dark:border-white/10', 'dark:border-white/10')
content = content.replace('dark:text-gray-300 dark:text-gray-300', 'dark:text-gray-300')
content = content.replace('dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500', 'dark:text-gray-500')
content = content.replace('dark:text-gray-500 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500', 'dark:text-gray-500')
content = content.replace('dark:text-gray-200 dark:text-gray-200', 'dark:text-gray-200')
content = content.replace('dark:bg-white/10 dark:bg-white dark:bg-[#141414]/10', 'dark:bg-white/10')

# For the rows in table: hover:bg-gray-50 dark:bg-[#0a0a0a] dark:bg-[#0a0a0a]
# It should be hover:bg-gray-50 dark:hover:bg-[#1a1a1a] dark:bg-transparent or similar.
# Wait, if the row is dark:bg-[#0a0a0a], then hover should be dark:hover:bg-[#1a1a1a]
content = content.replace(
    'hover:bg-gray-50 dark:bg-[#0a0a0a]',
    'hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
)


with open('src/app/dashboard/AdminPortal.tsx', 'w') as f:
    f.write(content)

