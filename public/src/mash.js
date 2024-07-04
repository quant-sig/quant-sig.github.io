class MashText {
    constructor(pElement) {
        this.pElement = pElement;
        this.text = pElement.textContent;
        this.href = pElement.href;
        this.target = pElement.target;
        this.segments = [];
        this.segmentDistance = 15;
        this.numSegments = this.text.length;
        this.leadX = 0;
        this.leadY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 2;
        this.maxForce = 0.10;
        this.padding = 125;
        this.wiggleAmount = 5;
        this.wiggleSpeed = 0.01;
        this.time = 0;
        this.waveLength = 10;
    }

    init() {
        this.pElement.style.display = 'none';
        
        // Create a container for all segments
        this.container = document.createElement('a');
        this.container.href = this.href;
        this.container.target = this.target;
        this.container.style.position = 'fixed';
        this.container.style.textDecoration = 'none';
        document.body.appendChild(this.container);

        // Initialize segments
        for (let i = 0; i < this.numSegments; i++) {
            const segment = document.createElement('span');
            segment.textContent = this.text[i];
            segment.style.position = 'absolute';
            segment.style.fontSize = '20px';
            segment.style.fontWeight = 'bold';
            segment.style.color = '#ffac04'; //`hsl(${i * 360 / this.numSegments}, 100%, 50%)`;
            this.container.appendChild(segment);
            this.segments.push({
                element: segment,
                x: 0,
                y: 0
            });
        }

        this.leadX = Math.random() * (window.innerWidth - 2 * this.padding) + this.padding;
        this.leadY = Math.random() * (window.innerHeight - 2 * this.padding) + this.padding;
        
        const angle = Math.random() * Math.PI * 2;
        this.velocityX = Math.cos(angle) * this.speed;
        this.velocityY = Math.sin(angle) * this.speed;

        this.animate();
    }

    animate() {
        const steer = this.avoidBorders();
        
        this.velocityX += steer.x;
        this.velocityY += steer.y;
        
        const currentSpeed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        if (currentSpeed > 0) {
            this.velocityX = (this.velocityX / currentSpeed) * this.speed;
            this.velocityY = (this.velocityY / currentSpeed) * this.speed;
        }

        this.leadX += this.velocityX;
        this.leadY += this.velocityY;

        let prevX = this.leadX;
        let prevY = this.leadY;

        this.time += this.wiggleSpeed;

        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            const dx = prevX - segment.x;
            const dy = prevY - segment.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > this.segmentDistance) {
                const ratio = this.segmentDistance / distance;
                segment.x = prevX - dx * ratio;
                segment.y = prevY - dy * ratio;
            }

            const waveOffset = (this.time - i / this.waveLength) * Math.PI * 2;
            const wiggleOffset = Math.sin(waveOffset) * this.wiggleAmount;
            const wiggleX = segment.x + wiggleOffset * Math.cos(Math.atan2(dy, dx) + Math.PI/2);
            const wiggleY = segment.y + wiggleOffset * Math.sin(Math.atan2(dy, dx) + Math.PI/2);

            segment.element.style.left = `${wiggleX - this.leadX}px`;
            segment.element.style.top = `${wiggleY - this.leadY}px`;

            prevX = segment.x;
            prevY = segment.y;
        }

        this.container.style.left = `${this.leadX}px`;
        this.container.style.top = `${this.leadY}px`;

        requestAnimationFrame(() => this.animate());
    }

	
    avoidBorders() {
        let steerX = 0;
        let steerY = 0;

        if (this.leadX < this.padding) {
            steerX = this.padding - this.leadX;
        } else if (this.leadX > window.innerWidth - this.padding) {
            steerX = window.innerWidth - this.padding - this.leadX;
        }

        if (this.leadY < this.padding) {
            steerY = this.padding - this.leadY;
        } else if (this.leadY > window.innerHeight - this.padding) {
            steerY = window.innerHeight - this.padding - this.leadY;
        }

        // Normalize and scale the steering force
        const steerMagnitude = Math.sqrt(steerX * steerX + steerY * steerY);
        if (steerMagnitude > 0) {
            steerX = (steerX / steerMagnitude) * this.maxForce;
            steerY = (steerY / steerMagnitude) * this.maxForce;
        }

        return { x: steerX, y: steerY };
    }
}

function initMashText(pElement) {
    const mash = new MashText(pElement);
    mash.init();
}
