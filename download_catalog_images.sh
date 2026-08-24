urls=(
    "public/images/catalog/women/trouser.jpg|https://image.pollinations.ai/prompt/elegant%20women%20formal%20trousers%20flat%20on%20white%20background%20studio%20lighting%20apparel%20photography?width=800&height=1000&nologo=true"
    "public/images/catalog/women/dress.jpg|https://image.pollinations.ai/prompt/elegant%20women%20western%20evening%20dress%20hanging%20on%20wooden%20hanger%20white%20background%20studio%20lighting%20apparel%20photography?width=800&height=1000&nologo=true"
    "public/images/catalog/women/blazer.jpg|https://image.pollinations.ai/prompt/sharp%20tailored%20women%20blazer%20jacket%20hanging%20elegantly%20on%20wooden%20hanger%20white%20background%20studio%20lighting?width=800&height=1000&nologo=true"
    "public/images/catalog/men/shirt.jpg|https://image.pollinations.ai/prompt/crisp%20men%20formal%20dress%20shirt%20neatly%20folded%20white%20background%20studio%20lighting?width=800&height=1000&nologo=true"
    "public/images/catalog/men/trouser.jpg|https://image.pollinations.ai/prompt/men%20tailored%20formal%20suit%20trousers%20neatly%20folded%20white%20background%20studio%20lighting?width=800&height=1000&nologo=true"
    "public/images/catalog/men/suit.jpg|https://image.pollinations.ai/prompt/sharp%20tailored%20men%20blazer%20suit%20jacket%20hanging%20elegantly%20on%20wooden%20hanger%20white%20background?width=800&height=1000&nologo=true"
    "public/images/catalog/men/waistcoat.jpg|https://image.pollinations.ai/prompt/elegant%20men%20tailored%20waistcoat%20Nehru%20jacket%20hanging%20on%20wooden%20hanger%20white%20background?width=800&height=1000&nologo=true"
    "public/images/catalog/men/kurta.jpg|https://image.pollinations.ai/prompt/traditional%20Indian%20men%20Kurta%20tunic%20hanging%20elegantly%20on%20wooden%20hanger%20white%20background?width=800&height=1000&nologo=true"
    "public/images/catalog/men/sherwani.jpg|https://image.pollinations.ai/prompt/ornate%20Indian%20men%20Sherwani%20wedding%20jacket%20intricate%20embroidery%20hanging%20elegantly%20on%20wooden%20hanger%20white%20background?width=800&height=1000&nologo=true"
)

for item in "${urls[@]}"; do
    path="${item%%|*}"
    url="${item#*|}"
    if [ ! -s "$path" ]; then
        echo "Downloading $path..."
        curl -s -L -A "Mozilla/5.0" "$url" -o "$path"
        sleep 2
    fi
done
