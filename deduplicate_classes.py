import re

with open('src/app/dashboard/AdminPortal.tsx', 'r') as f:
    content = f.read()

# Replace any duplicated dark: text-white or bg-[...], etc
# Find sequences of space-separated classes and deduplicate adjacent ones
def dedupe(match):
    full_str = match.group(1)
    words = full_str.split()
    seen = []
    for w in words:
        if not seen or seen[-1] != w:
            if w not in seen:
                seen.append(w)
            # wait, if w is in seen, we just drop it (since it's a duplicate in the same class string)
    return 'className="' + " ".join(seen) + '"'

def dedupe_tick(match):
    full_str = match.group(1)
    words = full_str.split()
    seen = []
    for w in words:
        if w not in seen:
            seen.append(w)
    return 'className={`' + " ".join(seen) + '`}'

content = re.sub(r'className="([^"]+)"', dedupe, content)
content = re.sub(r'className={`([^`]+)`}', dedupe_tick, content)

with open('src/app/dashboard/AdminPortal.tsx', 'w') as f:
    f.write(content)
