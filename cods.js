window.addEventListener('load', () => {
    const canvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');

    // Mouse position tracking
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Resize canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Configurações do efeito
    const cellSize = 50; // Tamanho da célula da grade
    const particles = []; // "Chuva" de luz

    // Criar chuva inicial
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 1 + Math.random() * 3,
            len: 10 + Math.random() * 30,
            color: Math.random() > 0.5 ? '#beff1b' : '#8559ff' // Verde ou Roxo
        });
    }

    function animate() {
        // Limpar canvas com um rastro (Cria o efeito de 'fading')
        ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- DESENHAR GRADE ---
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'; // Grade quase invisível
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.width; y += cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // --- REALCE DO RATO ---
        // Desenha uma célula acesa onde o rato está
        ctx.fillStyle = 'rgba(190, 255, 27, 0.15)'; // Verde Neon sutil
        const cellX = Math.floor(mouseX / cellSize) * cellSize;
        const cellY = Math.floor(mouseY / cellSize) * cellSize;
        ctx.fillRect(cellX, cellY, cellSize, cellSize);
        
        // Glow effect no realce
        ctx.shadowColor = '#beff1b';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#beff1b';
        ctx.strokeRect(cellX, cellY, cellSize, cellSize);
        ctx.shadowBlur = 0; // Reset blur

        // --- DESENHAR CHUVA ---
        particles.forEach(p => {
            // Desenhar rastro da chuva
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y - p.len);
            ctx.stroke();

            // Glow na cabeça da chuva
            ctx.fillStyle = 'white';
            ctx.fillRect(p.x - 1, p.y - 1, 2, 2);

            // Mover chuva
            p.y += p.speed;

            // Resetar chuva quando sai da tela
            if (p.y > canvas.height + p.len) {
                p.x = Math.random() * canvas.width;
                p.y = -p.len;
                p.speed = 1 + Math.random() * 3;
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
});