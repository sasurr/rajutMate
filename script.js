function addBasicItem() {
    const container = document.getElementById('basic-items');
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row';
    itemRow.innerHTML = `
                <input type="text" placeholder="Nama Barang" class="item-name">
                <input type="number" placeholder="Jumlah" class="item-quantity">
                <input type="number" placeholder="Harga" class="item-price">
                <button type="button" class="remove-btn" onclick="removeItem(this)">✕</button>
            `;
    container.appendChild(itemRow);
}

function addAdditionalItem() {
    const container = document.getElementById('additional-items');
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row';
    itemRow.innerHTML = `
                <input type="text" placeholder="Nama Barang" class="item-name">
                <input type="number" placeholder="Jumlah" class="item-quantity">
                <input type="number" placeholder="Harga" class="item-price">
                <button type="button" class="remove-btn" onclick="removeItem(this)">✕</button>
            `;
    container.appendChild(itemRow);
}

function removeItem(button) {
    button.parentElement.remove();
}

function calculateTotal() {
    const basicItems = document.querySelectorAll('#basic-items .item-row');
    const additionalItems = document.querySelectorAll('#additional-items .item-row');
    const hourlyWage = parseInt(document.getElementById('hourly-wage').value) || 0;
    const workTime = parseInt(document.getElementById('work-time').value) || 0;

    let basicTotal = 0;
    let additionalTotal = 0;
    let resultHTML = '';

    // Calculate basic items
    resultHTML += '<div class="result-section-title">Barang Pokok:</div>';
    basicItems.forEach(item => {
        const name = item.querySelector('.item-name').value;
        const quantity = parseInt(item.querySelector('.item-quantity').value) || 0;
        const price = parseInt(item.querySelector('.item-price').value) || 0;
        const subtotal = quantity * price;

        if (name && quantity > 0 && price > 0) {
            basicTotal += subtotal;
            resultHTML += `<div class="result-line">
                        ${name} (${quantity} × Rp ${price.toLocaleString('id-ID')}) - Rp ${subtotal.toLocaleString('id-ID')}
                    </div>`;
        }
    });

    // Calculate additional items
    resultHTML += '<div class="result-section-title">Barang Pelengkap:</div>';
    additionalItems.forEach(item => {
        const name = item.querySelector('.item-name').value;
        const quantity = parseInt(item.querySelector('.item-quantity').value) || 0;
        const price = parseInt(item.querySelector('.item-price').value) || 0;
        const subtotal = quantity * price;

        if (name && quantity > 0 && price > 0) {
            additionalTotal += subtotal;
            resultHTML += `<div class="result-line">
                        ${name} (${quantity} × Rp ${price.toLocaleString('id-ID')}) - Rp ${subtotal.toLocaleString('id-ID')}
                    </div>`;
        }
    });

    // Calculate labor cost
    const laborCost = (hourlyWage * workTime) / 60;
    resultHTML += '<div class="result-section-title">Biaya Tenaga Kerja:</div>';
    resultHTML += `<div class="result-line">
                Upah kerja (${workTime} menit × Rp ${hourlyWage.toLocaleString('id-ID')}/jam) - Rp ${laborCost.toLocaleString('id-ID')}
            </div>`;

    // Calculate total
    const grandTotal = basicTotal + additionalTotal + laborCost;

    resultHTML += `
                <div class="result-totals">
                    <div class="result-line">Total Bahan Pokok: Rp ${basicTotal.toLocaleString('id-ID')}</div>
                    <div class="result-line">Total Bahan Pelengkap: Rp ${additionalTotal.toLocaleString('id-ID')}</div>
                    <div class="result-line">Total Biaya Tenaga Kerja: Rp ${laborCost.toLocaleString('id-ID')}</div>
                    <div class="result-final">TOTAL HPP: Rp ${grandTotal.toLocaleString('id-ID')}</div>
                </div>
            `;

    document.getElementById('result-content').innerHTML = resultHTML;
    document.getElementById('result-content').classList.add('show');
}

function downloadResult() {
    const resultArea = document.getElementById('result-area');

    // Create a canvas to render the result
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add header
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('RajutMate - Hasil Perhitungan HPP', 50, 50);

    // Add timestamp
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666666';
    const now = new Date();
    ctx.fillText(`Tanggal: ${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')}`, 50, 80);

    // Extract and render result content
    const resultContent = document.getElementById('result-content');
    if (resultContent.classList.contains('show')) {
        let y = 120;
        const lineHeight = 25;

        // Simple text extraction and rendering
        const text = resultContent.innerText;
        const lines = text.split('\n').filter(line => line.trim());

        ctx.font = '16px Arial';
        ctx.fillStyle = '#333333';

        lines.forEach(line => {
            if (line.includes('TOTAL HPP:')) {
                ctx.font = 'bold 20px Arial';
                ctx.fillStyle = '#e74c3c';
            } else if (line.includes(':') && !line.includes('Rp')) {
                ctx.font = 'bold 16px Arial';
                ctx.fillStyle = '#2c3e50';
            } else {
                ctx.font = '16px Arial';
                ctx.fillStyle = '#333333';
            }

            ctx.fillText(line, 50, y);
            y += lineHeight;
        });
    } else {
        ctx.font = '18px Arial';
        ctx.fillStyle = '#999999';
        ctx.fillText('Silakan hitung HPP terlebih dahulu', 50, 150);
    }

    // Download the canvas as PNG
    canvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RajutMate_HPP_${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});