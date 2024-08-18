document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.dvd-link');
    const mainTitle = document.getElementById('title');
    
    let animationFrames = [];
    let isAnimating = true;

    function setupLink(link) {
        // Set initial position to center
        const linkRect = link.getBoundingClientRect();
        link.style.left = `${(window.innerWidth - linkRect.width) / 2}px`;
        link.style.top = `${(window.innerHeight - linkRect.height) / 2}px`;

        // Set random direction
        const speed = 3; // You can adjust this value
        link.dataset.speedX = (Math.random() - 0.5) * speed * 2;
        link.dataset.speedY = (Math.random() - 0.5) * speed * 2;

        let speedX = parseFloat(link.dataset.speedX);
        let speedY = parseFloat(link.dataset.speedY);
        
        function animate() {
            if (!isAnimating) return;

            let rect = link.getBoundingClientRect();
            let newLeft = rect.left + speedX;
            let newTop = rect.top + speedY;

            if (newLeft <= 0 || newLeft + rect.width >= window.innerWidth) {
                speedX = -speedX;
                newLeft = newLeft <= 0 ? 0 : window.innerWidth - rect.width;
            }
            if (newTop <= 0 || newTop + rect.height >= window.innerHeight) {
                speedY = -speedY;
                newTop = newTop <= 0 ? 0 : window.innerHeight - rect.height;
            }

            link.style.left = `${newLeft}px`;
            link.style.top = `${newTop}px`;
            
            link.dataset.speedX = speedX;
            link.dataset.speedY = speedY;
            
            animationFrames[link.dataset.animationIndex] = requestAnimationFrame(animate);
        }
        
        return animate;
    }

    function startAnimations() {
        isAnimating = true;
        links.forEach((link, index) => {
            link.dataset.animationIndex = index;
            const animateFunction = setupLink(link);
            animationFrames[index] = requestAnimationFrame(animateFunction);
        });
    }

    function stopAnimations() {
        isAnimating = false;
        animationFrames.forEach(frame => cancelAnimationFrame(frame));
    }

    window.addEventListener('resize', startAnimations);

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
