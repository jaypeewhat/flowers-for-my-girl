// Our special start date: September 23, 2021
const START_DATE = new Date(2021, 8, 23); // months are 0-indexed (September = 8)

// Mobile detection for performance optimization
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// Beautiful flower collection that cycles through the days
const FLOWERS = [
	{ emoji: '🌹', name: 'Rose' },
	{ emoji: '🌷', name: 'Tulip' },
	{ emoji: '🌼', name: 'Daisy' },
	{ emoji: '🌻', name: 'Sunflower' },
	{ emoji: '🌸', name: 'Cherry Blossom' },
	{ emoji: '�', name: 'Hibiscus' },
	{ emoji: '💮', name: 'Camellia' },
	{ emoji: '�️', name: 'Rosette' },
	{ emoji: '🪻', name: 'Lavender' },
	{ emoji: '🪷', name: 'Lotus' },
	{ emoji: '🌹', name: 'Red Rose' },
	{ emoji: '🌼', name: 'White Daisy' },
	{ emoji: '🌻', name: 'Bright Sunflower' },
	{ emoji: '🌷', name: 'Pink Tulip' }
];

// Calculate days between two dates
function daysBetween(from, to) {
	const msPerDay = 1000 * 60 * 60 * 24;
	const fromTime = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
	const toTime = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
	return Math.max(0, Math.floor((toTime - fromTime) / msPerDay));
}

// Get flower for specific day
function getFlowerForDay(dayIndex) {
	return FLOWERS[dayIndex % FLOWERS.length];
}

// Main render function
function render() {
	const now = new Date();
	const daysTogether = daysBetween(START_DATE, now);

	// Set time-based background and effects
	setTimeBasedBackground(now);
	setSeasonalEffects(now, daysTogether);

	// Update counters with animation
	animateCounter('daysTogether', daysTogether);
	
	// Calculate flowers (each day gets a flower, cycling through the 3 types)
	const flowerCount = daysTogether;
	animateCounter('flowersCount', flowerCount);

	// Update anniversary countdown
	updateAnniversaryCountdown(now);

	// Apply milestone effects
	applyMilestoneEffects(daysTogether);

	// Create the bouquet with staggered animations
	createBouquet(daysTogether);
	
	// Update the note
	updateNote(daysTogether);

	// Initialize particle systems
	initializeParticles();
}

// Set background based on time of day
function setTimeBasedBackground(date) {
	const hour = date.getHours();
	const body = document.body;
	
	// Remove all time classes
	body.classList.remove('dawn', 'morning', 'afternoon', 'evening', 'night');
	
	if (hour >= 5 && hour < 8) {
		body.classList.add('dawn');
	} else if (hour >= 8 && hour < 12) {
		body.classList.add('morning');
	} else if (hour >= 12 && hour < 17) {
		body.classList.add('afternoon');
	} else if (hour >= 17 && hour < 20) {
		body.classList.add('evening');
	} else {
		body.classList.add('night');  // 8 PM to 5 AM is night time
	}
}

// Animate number counting up
function animateCounter(elementId, targetValue) {
	const element = document.getElementById(elementId);
	const currentValue = parseInt(element.textContent) || 0;
	
	if (currentValue === targetValue) return;
	
	const duration = 2000; // 2 seconds
	const steps = 60;
	const increment = (targetValue - currentValue) / steps;
	let current = currentValue;
	let step = 0;
	
	const timer = setInterval(() => {
		step++;
		current += increment;
		
		if (step >= steps) {
			current = targetValue;
			clearInterval(timer);
		}
		
		element.textContent = Math.round(current).toLocaleString();
	}, duration / steps);
}

function createBouquet(days) {
	const bouquetEl = document.getElementById('bouquet');
	const MAX_VISIBLE_FLOWERS = 25; // Limit for visual appeal
	
	// Clear existing bouquet
	bouquetEl.innerHTML = '';
	
	// Calculate how many flowers to show
	const flowersToShow = Math.min(Math.max(days, 1), MAX_VISIBLE_FLOWERS);
	
	// Create flower stems
	for (let i = 0; i < flowersToShow; i++) {
		createFlowerStem(bouquetEl, i, flowersToShow);
	}
	
	// Add bouquet accessories
	addBouquetAccessories(bouquetEl, days);
}

function createFlowerStem(container, index, total) {
	const img = document.createElement('img');
	
	// Cycle through the 3 flower images
	const imageNames = ['Style1.png', 'style2.png', 'style3.png'];
	img.src = `flowers/${imageNames[index % 3]}`;
	img.alt = 'Flower stem';
	img.className = 'stem-img';
	
	// Calculate positioning for natural bouquet look
	const progress = total > 1 ? index / (total - 1) : 0.5;
	const angle = -30 + progress * 60; // Spread from -30° to +30°
	const scale = 0.8 + 0.4 * Math.sin(progress * Math.PI); // Larger in middle
	const offset = (progress - 0.5) * 80; // Horizontal spread
	
	// Apply styling
	img.style.height = `${200 * scale}px`;
	img.style.left = '50%';
	img.style.transform = `translateX(calc(-50% + ${offset}px)) rotate(${angle}deg)`;
	img.style.zIndex = String(10 + index);
	
	// Store values for hover effect and animations
	img.style.setProperty('--offset', `${offset}px`);
	img.style.setProperty('--angle', `${angle}deg`);
	
	// Staggered animation delay for growth
	img.style.animationDelay = `${0.15 * index}s`;
	
	container.appendChild(img);
}

function addBouquetAccessories(container, days) {
	// Ribbon tie
	const tie = document.createElement('div');
	tie.className = 'tie';
	container.appendChild(tie);
	
	// String
	const string = document.createElement('div');
	string.className = 'string';
	container.appendChild(string);
	
	// Tag with day count
	const tag = document.createElement('div');
	tag.className = 'tag';
	tag.textContent = `${days} ${days === 1 ? 'day' : 'days'}`;
	container.appendChild(tag);
}

function updateNote(days) {
	const noteEl = document.getElementById('note');
	const MAX_VISIBLE = 25;
	
	if (days === 0) {
		noteEl.textContent = "Today is our beginning ✨";
	} else if (days === 1) {
		noteEl.textContent = "One day, one flower 💕";
	} else if (days > MAX_VISIBLE) {
		noteEl.textContent = `${MAX_VISIBLE} flowers shown of ${days.toLocaleString()} days`;
	} else {
		noteEl.textContent = `Each flower represents our love 🌸`;
	}
}

// Schedule updates at midnight
function scheduleMidnightUpdate() {
	const now = new Date();
	const tomorrow = new Date(now);
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0, 0, 0, 0);
	
	const timeUntilMidnight = tomorrow - now;
	
	setTimeout(() => {
		render();
		scheduleMidnightUpdate(); // Schedule the next update
	}, timeUntilMidnight);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
	render();
	scheduleMidnightUpdate();
	
	// Update background every hour to catch time changes
	setInterval(() => {
		setTimeBasedBackground(new Date());
	}, 60000); // Check every minute for smooth transitions
});

// Also update when tab becomes visible (in case user left it open overnight)
document.addEventListener('visibilitychange', () => {
	if (!document.hidden) {
		render();
	}
});

// Anniversary Countdown Functions
function updateAnniversaryCountdown(currentDate) {
	const currentYear = currentDate.getFullYear();
	let nextAnniversary = new Date(currentYear, 8, 23); // Sep 23 of current year
	
	// If this year's anniversary has passed, use next year
	if (currentDate > nextAnniversary) {
		nextAnniversary = new Date(currentYear + 1, 8, 23);
	}
	
	const daysToAnniversary = daysBetween(currentDate, nextAnniversary);
	const anniversaryYear = nextAnniversary.getFullYear() - 2021;
	
	document.getElementById('daysToAnniversary').textContent = daysToAnniversary;
	document.getElementById('nextAnniversaryDate').textContent = 
		`${anniversaryYear} Year${anniversaryYear !== 1 ? 's' : ''} - September 23, ${nextAnniversary.getFullYear()}`;
}

// Milestone Effects
function applyMilestoneEffects(days) {
	const milestones = [100, 365, 500, 730, 1000, 1095, 1460, 1825]; // 100 days, 1yr, etc.
	const body = document.body;
	
	// Remove existing milestone classes
	body.classList.remove('milestone-glow');
	
	if (milestones.includes(days)) {
		body.classList.add('milestone-glow');
		// Create special celebration effect
		createCelebrationBurst();
	}
}

// Seasonal Weather Effects
function setSeasonalEffects(date, days) {
	const month = date.getMonth();
	const weatherContainer = document.getElementById('weather');
	
	// Clear existing weather
	weatherContainer.innerHTML = '';
	
	// Determine season and weather (reduced effects for mobile)
	if (month >= 2 && month <= 4) { // Spring
		createFloatingPetals(isMobile ? 5 : 15);
	} else if (month >= 5 && month <= 7) { // Summer
		createSunshine();
		createFloatingPetals(isMobile ? 3 : 8);
	} else if (month >= 8 && month <= 10) { // Fall
		createFloatingPetals(isMobile ? 4 : 12, true); // autumn colors
	} else { // Winter
		createSnowfall();
	}
	
	// Special weather for milestones
	if ([100, 365, 500, 730, 1000].includes(days)) {
		createCelebrationWeather();
	}
}

// Particle Systems
function initializeParticles() {
	// Skip heavy particle effects on mobile
	if (!isMobile) {
		createInteractiveParticles();
	}
	
	// Add click effect to flowers (reduced on mobile)
	const flowers = document.querySelectorAll('.stem-img');
	flowers.forEach((flower, index) => {
		flower.addEventListener('click', () => {
			if (!isMobile) {
				createHeartBurst(flower);
			}
		});
	});
}

function createFloatingPetals(count, autumn = false) {
	const container = document.getElementById('petals');
	
	// Reduce particle count on mobile devices
	const adjustedCount = isMobile ? Math.max(1, Math.floor(count / 3)) : count;
	
	for (let i = 0; i < adjustedCount; i++) {
		const petal = document.createElement('div');
		petal.className = 'petal';
		
		// Random positioning and timing
		petal.style.left = Math.random() * 100 + 'vw';
		petal.style.animationDelay = Math.random() * 10 + 's';
		petal.style.animationDuration = (6 + Math.random() * 4) + 's';
		
		if (autumn) {
			const colors = ['#ff6b47', '#ff9500', '#ffb347', '#d2691e'];
			const color = colors[Math.floor(Math.random() * colors.length)];
			petal.style.background = `radial-gradient(circle, ${color}88, ${color}44)`;
		}
		
		container.appendChild(petal);
		
		// Clean up after animation to prevent memory leaks
		setTimeout(() => {
			if (petal && petal.parentNode) {
				petal.remove();
			}
		}, isMobile ? 15000 : 10000);
	}
}

function createSnowfall() {
	const container = document.getElementById('weather');
	
	// Reduce snowflakes on mobile
	const snowflakeCount = isMobile ? 20 : 50;
	
	for (let i = 0; i < snowflakeCount; i++) {
		const snowflake = document.createElement('div');
		snowflake.className = 'snow-flake';
		snowflake.style.left = Math.random() * 100 + 'vw';
		snowflake.style.animationDelay = Math.random() * 5 + 's';
		snowflake.style.animationDuration = (4 + Math.random() * 3) + 's';
		container.appendChild(snowflake);
	}
}

function createSunshine() {
	const container = document.getElementById('weather');
	
	for (let i = 0; i < 5; i++) {
		const ray = document.createElement('div');
		ray.className = 'sunshine-ray';
		ray.style.top = Math.random() * 50 + '%';
		ray.style.left = Math.random() * 100 + 'vw';
		ray.style.transform = `rotate(${Math.random() * 360}deg)`;
		ray.style.animationDelay = Math.random() * 10 + 's';
		container.appendChild(ray);
	}
}

function createInteractiveParticles() {
	const container = document.getElementById('particles');
	
	// Reduce interactive particles on mobile
	const particleCount = isMobile ? 8 : 20;
	
	for (let i = 0; i < particleCount; i++) {
		const particle = document.createElement('div');
		particle.className = 'particle';
		particle.style.left = Math.random() * 100 + 'vw';
		particle.style.top = Math.random() * 100 + 'vh';
		particle.style.animationDelay = Math.random() * 3 + 's';
		container.appendChild(particle);
	}
}

function createHeartBurst(element) {
	const rect = element.getBoundingClientRect();
	
	// Reduce heart particles on mobile
	const heartCount = isMobile ? 3 : 6;
	
	for (let i = 0; i < heartCount; i++) {
		const heart = document.createElement('div');
		heart.innerHTML = '💖';
		heart.style.position = 'fixed';
		heart.style.left = rect.left + rect.width/2 + 'px';
		heart.style.top = rect.top + rect.height/2 + 'px';
		heart.style.fontSize = '20px';
		heart.style.pointerEvents = 'none';
		heart.style.zIndex = '1000';
		
		const angle = (i / 6) * Math.PI * 2;
		const distance = 80 + Math.random() * 40;
		
		heart.animate([
			{ 
				transform: 'translate(-50%, -50%) scale(0)', 
				opacity: 1 
			},
			{ 
				transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(1)`, 
				opacity: 0 
			}
		], {
			duration: 1000,
			easing: 'ease-out'
		}).addEventListener('finish', () => heart.remove());
		
		document.body.appendChild(heart);
	}
}

function createCelebrationBurst() {
	// Create golden particle explosion for milestones
	for (let i = 0; i < 30; i++) {
		const particle = document.createElement('div');
		particle.style.position = 'fixed';
		particle.style.left = '50vw';
		particle.style.top = '50vh';
		particle.style.width = '6px';
		particle.style.height = '6px';
		particle.style.background = '#ffd700';
		particle.style.borderRadius = '50%';
		particle.style.pointerEvents = 'none';
		particle.style.zIndex = '999';
		
		const angle = (i / 30) * Math.PI * 2;
		const distance = 200 + Math.random() * 100;
		
		particle.animate([
			{ 
				transform: 'translate(-50%, -50%) scale(0)', 
				opacity: 1 
			},
			{ 
				transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(1)`, 
				opacity: 0 
			}
		], {
			duration: 2000,
			easing: 'ease-out'
		}).addEventListener('finish', () => particle.remove());
		
		document.body.appendChild(particle);
	}
}

function createCelebrationWeather() {
	// Special celebratory effects
	createFloatingPetals(25);
	setTimeout(() => createCelebrationBurst(), 1000);
}

// Music Control Functionality
const ambientMusic = document.getElementById('ambientMusic');
const musicToggle = document.getElementById('musicToggle');
let isPlaying = false;

// Initialize music controls
function initMusic() {
	ambientMusic.volume = 0.3; // Set volume to 30%
	
	musicToggle.addEventListener('click', toggleMusic);
	
	// Skip autoplay on mobile for better performance
	if (!isMobile) {
		// Try to autoplay (modern browsers may block this)
		ambientMusic.play().then(() => {
			isPlaying = true;
			musicToggle.classList.add('playing');
			musicToggle.textContent = '🎵';
		}).catch(() => {
			// Autoplay blocked, user needs to click
			isPlaying = false;
			musicToggle.classList.remove('playing');
			musicToggle.textContent = '🔇';
		});
	} else {
		// On mobile, start muted for better performance
		isPlaying = false;
		musicToggle.classList.remove('playing');
		musicToggle.textContent = '🔇';
	}
}

function toggleMusic() {
	if (isPlaying) {
		ambientMusic.pause();
		isPlaying = false;
		musicToggle.classList.remove('playing');
		musicToggle.textContent = '🔇';
	} else {
		ambientMusic.play().then(() => {
			isPlaying = true;
			musicToggle.classList.add('playing');
			musicToggle.textContent = '🎵';
		}).catch(error => {
			console.log('Could not play music:', error);
		});
	}
}

// Initialize music when page loads
document.addEventListener('DOMContentLoaded', () => {
	setTimeout(initMusic, 1000); // Delay to let other elements load first
});

