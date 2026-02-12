document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = document.querySelector('.deli-board');
    if (!boardContainer) return;

    // Fetch the Manager's Menu List
    fetch('deli.json')
        .then(response => response.json())
        .then(data => {
            renderDeliBoard(data.tiers);
        })
        .catch(err => console.error('Error loading Deli Menu:', err));

    function renderDeliBoard(tiers) {
        boardContainer.innerHTML = ''; // Clear any placeholder HTML

        tiers.forEach(tier => {
            // Generate the Tier Card
            const article = document.createElement('article');
            article.className = `deli-tier tier--${tier.color_theme}`;
            
            // Build the Strains List HTML
            const strainsHtml = tier.strains.map(strain => `
                <div class="strain-row">
                    <span class="s-name">${strain.name}</span>
                    <span class="s-tag ${strain.tag_class}">${strain.tag}</span>
                </div>
            `).join('');

            // Assemble the full card
            article.innerHTML = `
                <div class="tier-head">
                    <h3 class="tier-name">${tier.title}</h3>
                    <div class="tier-price">
                        <span class="p-big">${tier.price_oz}</span><span class="p-unit">/oz</span>
                    </div>
                    <div class="tier-breakdown">${tier.breakdown}</div>
                </div>
                <div class="tier-strains">
                    ${strainsHtml}
                </div>
            `;

            boardContainer.appendChild(article);
        });
    }
});
