const canvas = document.getElementById('boidCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Boid {
    constructor() {
        this.position = new Vector(Math.random() * canvas.width, Math.random() * canvas.height);
        this.velocity = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
        this.acceleration = new Vector(0, 0);
        this.maxForce = 0.2;
        this.maxSpeed = 4;
    }

    separate(boids) {
        let desiredSeparation = 25;
        let steer = new Vector(0, 0);
        let count = 0;
        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (d > 0 && d < desiredSeparation) {
                let diff = Vector.sub(this.position, other.position);
                diff.normalize();
                diff.div(d);
                steer.add(diff);
                count++;
            }
        }
        if (count > 0) {
            steer.div(count);
        }
        if (steer.mag() > 0) {
            steer.normalize();
            steer.mult(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    align(boids) {
        let neighborDist = 50;
        let sum = new Vector(0, 0);
        let count = 0;
        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (d > 0 && d < neighborDist) {
                sum.add(other.velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxSpeed);
            let steer = Vector.sub(sum, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return new Vector(0, 0);
        }
    }

    cohesion(boids) {
        let neighborDist = 50;
        let sum = new Vector(0, 0);
        let count = 0;
        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (d > 0 && d < neighborDist) {
                sum.add(other.position);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            return this.seek(sum);
        } else {
            return new Vector(0, 0);
        }
    }

    seek(target) {
        let desired = Vector.sub(target, this.position);
        desired.normalize();
        desired.mult(this.maxSpeed);
        let steer = Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    avoidPredators(predators) {
        let steer = new Vector(0, 0);
        let count = 0;
        for (let predator of predators) {
            let d = this.position.dist(predator.position);
            if (d < 50) { // Flee distance
                let diff = Vector.sub(this.position, predator.position);
                diff.normalize();
                diff.div(d);
                steer.add(diff);
                count++;
            }
        }
        if (count > 0) {
            steer.div(count);
            steer.normalize();
            steer.mult(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce * 3); // Strong avoidance
        }
        return steer;
    }


    update(boids, predators) {
        let sep = this.separate(boids);
        let ali = this.align(boids);
        let coh = this.cohesion(boids);
	let avd = this.avoidPredators(predators);


        sep.mult(1.5);
        ali.mult(1.0);
        coh.mult(1.0);
	avd.mult(2.0);

        this.acceleration.add(sep);
        this.acceleration.add(ali);
        this.acceleration.add(coh);
	this.acceleration.add(avd);

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        
        this.borders();
    }

    borders() {
        if (this.position.x < -5) this.position.x = canvas.width + 5;
        if (this.position.y < -5) this.position.y = canvas.height + 5;
        if (this.position.x > canvas.width + 5) this.position.x = -5;
        if (this.position.y > canvas.height + 5) this.position.y = -5;
    }

    draw() {
        let angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.fillStyle = 'rgba(256, 164, 4, 0.8)';
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angle);
        ctx.beginPath();
	ctx.moveTo(16, 0);
	ctx.lineTo(-8, 8);
	ctx.lineTo(-8, -8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

class Predator extends Boid {
    constructor() {
        super();
        this.maxSpeed = 4.5; // Faster than regular boids
        this.maxForce = 0.3; // Stronger steering force
        this.perceptionRadius = 100; // Larger perception radius
        this.color = 'rgba(255, 0, 0, 0.8)'; // Red color for predators
    }

    hunt(boids) {
        let closest = null;
        let closestDist = Infinity;
        
        for (let boid of boids) {
            let d = this.position.dist(boid.position);
            if (d < this.perceptionRadius && d < closestDist) {
                closest = boid;
                closestDist = d;
            }
        }
        
        if (closest) {
            return this.seek(closest.position);
        } else {
            return new Vector(0, 0);
        }
    }

    update(boids, predators) {
        let hunt = this.hunt(boids);
        let sep = this.separate(predators); // Avoid other predators

        hunt.mult(1.5);
        sep.mult(1.0);

        this.acceleration.add(hunt);
        this.acceleration.add(sep);

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        
        this.borders();
    }

    draw() {
        let angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-10, 10);
        ctx.lineTo(-10, -10);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
    }

    div(n) {
        this.x /= n;
        this.y /= n;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let m = this.mag();
        if (m != 0) {
            this.div(m);
        }
    }

    limit(max) {
        if (this.mag() > max) {
            this.normalize();
            this.mult(max);
        }
    }

    dist(v) {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
}

const boids = [];
const predators = [];
const numBoids = 80;
const MAX_PREDATORS = 10;

for (let i = 0; i < numBoids; i++) {
    boids.push(new Boid());
}

document.addEventListener('click', spawnPredator);

function spawnPredator(event) {
    if (predators.length >= MAX_PREDATORS) {
        console.log("Maximum number of predators reached");
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const predator = new Predator();
    predator.position = new Vector(x, y);
    predators.push(predator);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let boid of boids) {
        boid.update(boids, predators);
        boid.draw();
    }
	
    for (let predator of predators) {
        predator.update(boids, predators);
        predator.draw();
    }
    
    requestAnimationFrame(animate);
}

animate();

document.addEventListener('click', (e) => {
	console.log('Click registered at:', e.clientX, e.clientY);
});
