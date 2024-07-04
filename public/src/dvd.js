document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.dvd-link');
    const content = document.querySelector('.content-layer');
    const mainTitle = document.getElementById('title');
    
    let animationFrames = [];
    let isAnimating = true;

    function setupLink(link) {
        const minX = 100;
        const minY = 50;
	const padding = 20; // Padding from screen edges
        
        if (!link.dataset.speedX) {
            link.style.left = `${Math.random() * (window.innerWidth - 2 * padding) + padding}px`;
            link.style.top = `${Math.random() * (window.innerHeight - 2 * padding) + padding}px`;
            
            const minSpeed = 2;
            link.dataset.speedX = (Math.random() - 0.5) * 4 + (Math.random() < 0.5 ? minSpeed : -minSpeed);
            link.dataset.speedY = (Math.random() - 0.5) * 4 + (Math.random() < 0.5 ? minSpeed : -minSpeed);
        }

        let speedX = parseFloat(link.dataset.speedX);
        let speedY = parseFloat(link.dataset.speedY);
        
        function animate() {
            if (!isAnimating) return;

            let linkRect = link.getBoundingClientRect();
            let contentRect = content.getBoundingClientRect();
            if (linkRect.left <= padding || linkRect.right >= window.innerWidth - padding) {
    speedX = -speedX;
}
	    if (linkRect.top <= padding || linkRect.bottom >= window.innerHeight - padding) {
    speedY = -speedY;
}
            
            if (linkRect.left < contentRect.right && linkRect.right > contentRect.left &&
                linkRect.top < contentRect.bottom && linkRect.bottom > contentRect.top) {
                if (Math.abs(linkRect.left - contentRect.right) < 10 || Math.abs(linkRect.right - contentRect.left) < 10) {
                    speedX = -speedX;
                }
                if (Math.abs(linkRect.top - contentRect.bottom) < 10 || Math.abs(linkRect.bottom - contentRect.top) < 10) {
                    speedY = -speedY;
                }
            }
            
            link.style.left = `${linkRect.left + speedX}px`;
            link.style.top = `${linkRect.top + speedY}px`;
            
            link.dataset.speedX = speedX;
            link.dataset.speedY = speedY;
            
            animationFrames[link.dataset.animationIndex] = requestAnimationFrame(animate);
        }
        
        return animate;
    }

    function startAnimations() {
        isAnimating = true;
        links.forEach((link, index) => {
            if (!link.dataset.animationIndex) {
                link.dataset.animationIndex = index;
            }
            const animateFunction = setupLink(link);
            animationFrames[index] = requestAnimationFrame(animateFunction);
        });
    }

    function stopAnimations() {
        isAnimating = false;
        animationFrames.forEach(frame => cancelAnimationFrame(frame));
    }

	window.addEventListener('resize', () => {
	    links.forEach(link => {
		const linkRect = link.getBoundingClientRect();
		const padding = 20;

		// Calculate new position proportionally
		let newLeft = (linkRect.left / window.innerWidth) * window.innerWidth;
		let newTop = (linkRect.top / window.innerHeight) * window.innerHeight;

		// Ensure the new position is within bounds
		newLeft = Math.max(padding, Math.min(newLeft, window.innerWidth - linkRect.width - padding));
		newTop = Math.max(padding, Math.min(newTop, window.innerHeight - linkRect.height - padding));

		link.style.left = `${newLeft}px`;
		link.style.top = `${newTop}px`;
	    });
	});

    startAnimations(); // Start animations initially

    mainTitle.addEventListener('click', () => {
        if (isAnimating) {
            stopAnimations();
            mainTitle.classList.add('paused');
        } else {
            startAnimations();
            mainTitle.classList.remove('paused');
        }
    });
});
