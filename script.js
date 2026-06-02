// Spotify Web Player Clone - JavaScript Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle (for mobile)
    const sidebar = document.querySelector('.sidebar');
    let sidebarOpen = false;

    // Add toggle button for mobile (we'll add it to the top nav)
    const topNav = document.querySelector('.top-nav');
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'nav-btn toggle-btn';
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.style.display = 'none'; // Hidden on desktop
    topNav.insertBefore(toggleBtn, topNav.firstChild);

    toggleBtn.addEventListener('click', function() {
        sidebarOpen = !sidebarOpen;
        if (sidebarOpen) {
            sidebar.style.transform = 'translateX(0)';
        } else {
            sidebar.style.transform = 'translateX(-100%)';
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024 && sidebarOpen && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebarOpen = false;
            sidebar.style.transform = 'translateX(-100%)';
        }
    });

    // Navigation buttons (back/forward)
    const backBtn = document.getElementById('back-btn');
    const forwardBtn = document.getElementById('forward-btn');

    backBtn.addEventListener('click', function() {
        // Simulate navigation
        console.log('Navigate back');
        // In a real app, this would change the page content
    });

    forwardBtn.addEventListener('click', function() {
        // Simulate navigation
        console.log('Navigate forward');
        // In a real app, this would change the page content
    });

    // Card hover effects (already handled in CSS, but we can add more interactivity)
    const cards = document.querySelectorAll('.card, .playlist-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle animation
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Song item interactions
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            songItems.forEach(si => si.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');

            // Update player bar with selected song
            const songImg = this.querySelector('img').src;
            const songTitle = this.querySelector('h5').textContent;
            const songArtist = this.querySelector('p').textContent;

            updatePlayerBar(songImg, songTitle, songArtist);
        });
    });

    // Player controls
    const playBtn = document.querySelector('.play-btn');
    const progressBar = document.querySelector('.progress');
    const progressFill = document.querySelector('.progress-fill');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeFill = document.querySelector('.volume-fill');

    let isPlaying = false;
    let currentTime = 0;
    let totalTime = 200; // 3:20 in seconds

    playBtn.addEventListener('click', function() {
        isPlaying = !isPlaying;
        const icon = this.querySelector('i');
        if (isPlaying) {
            icon.className = 'fas fa-pause';
            startProgress();
        } else {
            icon.className = 'fas fa-play';
            stopProgress();
        }
    });

    // Progress bar interaction
    progressBar.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        currentTime = percentage * totalTime;
        updateProgress();
    });

    // Volume slider interaction
    volumeSlider.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        volumeFill.style.width = percentage * 100 + '%';
    });

    // Control buttons (shuffle, previous, next, repeat)
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-random')) {
                // Toggle shuffle
                this.classList.toggle('active');
            } else if (icon.classList.contains('fa-repeat')) {
                // Toggle repeat
                this.classList.toggle('active');
            } else if (icon.classList.contains('fa-step-backward')) {
                // Previous song
                playPreviousSong();
            } else if (icon.classList.contains('fa-step-forward')) {
                // Next song
                playNextSong();
            }
        });
    });

    // Responsive adjustments
    function handleResize() {
        if (window.innerWidth <= 1024) {
            toggleBtn.style.display = 'flex';
            if (!sidebarOpen) {
                sidebar.style.transform = 'translateX(-100%)';
            }
        } else {
            toggleBtn.style.display = 'none';
            sidebar.style.transform = 'translateX(0)';
            sidebarOpen = false;
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    // Utility functions
    function updatePlayerBar(imgSrc, title, artist) {
        const playerImg = document.querySelector('.current-song img');
        const playerTitle = document.querySelector('.song-details h5');
        const playerArtist = document.querySelector('.song-details p');

        playerImg.src = imgSrc;
        playerTitle.textContent = title;
        playerArtist.textContent = artist;

        // Reset progress
        currentTime = 0;
        updateProgress();
    }

    function startProgress() {
        progressInterval = setInterval(() => {
            currentTime += 1;
            if (currentTime >= totalTime) {
                currentTime = 0;
                isPlaying = false;
                playBtn.querySelector('i').className = 'fas fa-play';
                clearInterval(progressInterval);
            }
            updateProgress();
        }, 1000);
    }

    function stopProgress() {
        clearInterval(progressInterval);
    }

    function updateProgress() {
        const percentage = (currentTime / totalTime) * 100;
        progressFill.style.width = percentage + '%';

        const currentTimeDisplay = document.querySelector('.current-time');
        const totalTimeDisplay = document.querySelector('.total-time');

        currentTimeDisplay.textContent = formatTime(currentTime);
        totalTimeDisplay.textContent = formatTime(totalTime);
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function playPreviousSong() {
        const activeSong = document.querySelector('.song-item.active');
        if (activeSong) {
            const prevSong = activeSong.previousElementSibling;
            if (prevSong) {
                prevSong.click();
            }
        }
    }

    function playNextSong() {
        const activeSong = document.querySelector('.song-item.active');
        if (activeSong) {
            const nextSong = activeSong.nextElementSibling;
            if (nextSong) {
                nextSong.click();
            }
        }
    }

    // Add some dynamic content loading simulation
    function loadMoreContent() {
        // Simulate loading more playlists
        const playlistsGrid = document.querySelector('.playlists-grid');
        const newCard = document.createElement('div');
        newCard.className = 'playlist-card';
        newCard.innerHTML = `
            <img src="https://via.placeholder.com/200x200/1DB954/FFFFFF?text=New" alt="New Playlist">
            <h4>New Playlist</h4>
            <p>Discover new music curated for you.</p>
        `;
        playlistsGrid.appendChild(newCard);

        // Add hover effect to new card
        newCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        newCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Load more content on scroll (simulate infinite scroll)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                loadMoreContent();
            }
        }, 100);
    });

    // Initialize first song as active
    if (songItems.length > 0) {
        songItems[0].classList.add('active');
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            playBtn.click();
        } else if (e.code === 'ArrowLeft') {
            playPreviousSong();
        } else if (e.code === 'ArrowRight') {
            playNextSong();
        }
    });

    console.log('Spotify Web Player Clone loaded successfully!');
});