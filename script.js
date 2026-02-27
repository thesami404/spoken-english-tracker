const journeyData = {
    totalDays: 60, 
    
    records: [
        {
            dayNumber: 1,
            date: "1 March 2026",
            title: "Day 1 Conversations",
            videos: [
                { 
                    title: "Part 1: Self Introduction", 
                    url: "https://res.cloudinary.com/dehpayl0i/video/upload/v1772220870/WhatsApp_Video_2026-02-28_at_1.27.59_AM_x6giut.mp4",
                    poster: "https://res.cloudinary.com/dehpayl0i/image/upload/v1772221468/610666321_122155969100933995_8486771794326258421_n_mt8obb.jpg" 
                },
                { 
                    title: "Part 2: Hobby & Interests", 
                    url: "https://res.cloudinary.com/dehpayl0i/video/upload/v1772220871/WhatsApp_Video_2026-02-28_at_1.31.24_AM_hxn6qv.mp4",
                    poster: "https://res.cloudinary.com/dehpayl0i/image/upload/v1772221463/596695208_122299336574211857_2674595021488794835_n_dpn9s8.jpg" 
                },
                { 
                    title: "Part 3: Daily Routine", 
                    url: "https://res.cloudinary.com/dehpayl0i/video/upload/v1772220886/WhatsApp_Video_2026-02-28_at_1.30.42_AM_xkaizh.mp4",
                    poster: "https://res.cloudinary.com/dehpayl0i/image/upload/v1772221462/457561162_911919170975595_6813016065224803783_n_843ebbe15c_ibvrbi.webp" 
                }
            ]
        }
    ]
};

// LocalStorage থেকে ডেটা লোড করা
let trackerStatus = JSON.parse(localStorage.getItem('ieltsTrackerApp')) || Array(journeyData.totalDays).fill('empty');
let currentEditIndex = -1;

function initApp() {
    renderTracker();
    renderVideos();
}

function renderTracker() {
    const graphContainer = document.getElementById('contribution-graph');
    graphContainer.innerHTML = '';
    
    for (let i = 0; i < journeyData.totalDays; i++) {
        const box = document.createElement('div');
        box.className = 'commit-box';
        box.id = `box-${i}`; // আইডি দিলাম আপডেট করার জন্য
        box.title = `Day ${i + 1} - Click to update`;
        
        // বক্সগুলো এক এক করে পপ হয়ে আসার অ্যানিমেশন
        box.style.animationDelay = `${i * 0.02}s`;
        box.classList.add('box-anim');
        
        const status = trackerStatus[i];
        if (status === 'done') {
            box.classList.add('active'); box.innerHTML = '✔';
        } else if (status === 'missed') {
            box.classList.add('missed'); box.innerHTML = '✖';
        }

        // ক্লিক করলে পপ-আপ মেনু ওপেন হবে
        box.addEventListener('click', function(e) {
            e.stopPropagation(); // ক্লিক যেন বাইরে না ছড়ায়
            openPopup(e, i);
        });
        
        graphContainer.appendChild(box);
    }
}

// পপ-আপ মেনু ওপেন করার ফাংশন
function openPopup(event, index) {
    currentEditIndex = index;
    const popup = document.getElementById('status-popup');
    const box = event.target;
    
    // বক্সের পজিশন অনুযায়ী পপ-আপ বসানো
    const rect = box.getBoundingClientRect();
    popup.style.left = `${rect.left + window.scrollX + (rect.width / 2)}px`;
    popup.style.top = `${rect.top + window.scrollY - 10}px`;
    
    popup.classList.remove('hidden');
}

// পপ-আপ মেনু থেকে অপশন সিলেক্ট করলে এই ফাংশন চলবে
function setStatus(status) {
    if(currentEditIndex === -1) return;

    // ডেটা আপডেট এবং LocalStorage এ সেভ
    trackerStatus[currentEditIndex] = status;
    localStorage.setItem('ieltsTrackerApp', JSON.stringify(trackerStatus));

    // UI (বক্স) আপডেট করা এবং বাউন্স অ্যানিমেশন দেওয়া
    const box = document.getElementById(`box-${currentEditIndex}`);
    box.className = 'commit-box update-anim'; // Reset and add bounce animation
    
    if (status === 'done') {
        box.classList.add('active'); box.innerHTML = '✔';
    } else if (status === 'missed') {
        box.classList.add('missed'); box.innerHTML = '✖';
    } else {
        box.innerHTML = '';
    }

    // অ্যানিমেশন শেষ হলে ক্লাস রিমুভ করা
    setTimeout(() => { box.classList.remove('update-anim'); }, 400);

    // পপ-আপ মেনু হাইড করা
    document.getElementById('status-popup').classList.add('hidden');
}

// স্ক্রিনের বাইরে ক্লিক করলে পপ-আপ মেনু বন্ধ হয়ে যাবে
document.addEventListener('click', function(e) {
    const popup = document.getElementById('status-popup');
    if (!popup.classList.contains('hidden') && !popup.contains(e.target)) {
        popup.classList.add('hidden');
    }
});

function renderVideos() {
    const mainContainer = document.getElementById('all-days-container');
    if (!mainContainer) return; 
    mainContainer.innerHTML = ''; 
    
    journeyData.records.forEach((record, index) => {
        let videoCardsHTML = '';
        
        record.videos.forEach(vid => {
            videoCardsHTML += `
                <div class="video-card">
                    <video class="poster-mode" controls poster="${vid.poster}" preload="metadata">
                        <source src="${vid.url}" type="video/mp4">
                    </video>
                    <div class="video-info">
                        <h3>${vid.title}</h3>
                    </div>
                </div>
            `;
        });

        const sectionHTML = `
            <section class="video-section card fade-in-up" style="animation-delay: ${0.4 + (index * 0.1)}s">
                <div class="section-header">
                    <h2>${record.title}</h2>
                    <span class="subtitle">${record.date}</span>
                </div>
                <div class="video-grid">
                    ${videoCardsHTML}
                </div>
            </section>
        `;
        mainContainer.innerHTML += sectionHTML;
    });
}

document.addEventListener('DOMContentLoaded', initApp);

document.addEventListener('play', function(e) {
    if(e.target.classList.contains('poster-mode')){
        e.target.classList.remove('poster-mode');
    }

    const videos = document.getElementsByTagName('video');
    for (let i = 0; i < videos.length; i++) {
        if (videos[i] !== e.target) {
            videos[i].pause();
        }
    }
}, true);