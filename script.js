const journeyData = {
    totalDays: 30,
    currentDayIndex: 0, 
    
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

function initApp() {
    renderTracker();
    renderVideos();
}

function renderTracker() {
    const graphContainer = document.getElementById('contribution-graph');
    
    for (let i = 1; i <= journeyData.totalDays; i++) {
        const box = document.createElement('div');
        box.className = 'commit-box';
        box.title = `Day ${i}`;
        
        const dayRecord = journeyData.records.find(r => r.dayNumber === i);
        if (dayRecord && dayRecord.videos.length >= 3) {
            box.classList.add('active');
        }
        
        graphContainer.appendChild(box);
    }
}

function renderVideos() {
    const currentRecord = journeyData.records[journeyData.currentDayIndex];
    if (!currentRecord) return;

    document.getElementById('current-day-title').innerText = currentRecord.title;
    document.getElementById('current-day-date').innerText = currentRecord.date;

    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = ''; // আগের কন্টেন্ট ক্লিয়ার করা হলো
    
    currentRecord.videos.forEach(vid => {
        videoContainer.innerHTML += `
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
}

document.addEventListener('DOMContentLoaded', initApp);

// --- BUG FIX & POSTER ZOOM LOGIC ---
document.addEventListener('play', function(e) {
    
    // ১. ভিডিও প্লে হলে poster-mode ক্লাস সরিয়ে দাও, যাতে ভিডিওটি তার আসল সাইজে ফিরে আসে
    if(e.target.classList.contains('poster-mode')){
        e.target.classList.remove('poster-mode');
    }

    // ২. একসাথে একাধিক ভিডিও প্লে না হতে দেওয়া
    const videos = document.getElementsByTagName('video');
    for (let i = 0; i < videos.length; i++) {
        if (videos[i] !== e.target) {
            videos[i].pause();
        }
    }
}, true);