document.addEventListener('DOMContentLoaded', () => {
    const clockElement = document.getElementById('clock');
    const timelineElement = document.getElementById('timeline');
    const nextActivityDetailsElement = document.getElementById('next-activity-details');

    let PIXELS_PER_MINUTE = 5;
    const MINUTES_IN_A_DAY = 24 * 60;

    const ZOOM_STEP = 1;
    const MIN_ZOOM = 1;
    const MAX_ZOOM = 15;

    const dingSound = new Audio('ding.mp3');
    let currentDay = new Date().getDate();

    let todayActivities = [];
    let allActivities = [];

    const db = new Dexie("scheduleDatabase");
    db.version(2).stores({
        activities: '++id, nombre, HoraInicio, HoraFin, ico, *days',
        settings: '&key'
    });
    function updateUI(activities) {
        allActivities = activities;
        const today = new Date().getDay();
        const weekDays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const todayStr = weekDays[today];
        todayActivities = activities.filter(act => act.days.includes("todos") || act.days.includes(todayStr));

        renderTimeline(todayActivities);
        updateTimelineAndStickyContent();
        updateNextActivity(activities);
    }

    function parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    function getMinutesFromMidnight(date) {
        return date.getHours() * 60 + date.getMinutes();
    }

    function updateClock() {
        const now = new Date();
        if (now.getDate() !== currentDay) {
            window.location.reload();
        }
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Function to calculate layout for overlapping activities
    function layoutActivities(activities) {
        if (!activities || activities.length === 0) {
            return { activitiesWithLayout: [], totalLanes: 0 };
        }

        const processedActivities = activities.map(act => ({
            ...act,
            startTime: parseTime(act.HoraInicio),
            endTime: parseTime(act.HoraFin)
        })).sort((a, b) => a.startTime - b.startTime);

        const lanes = []; // Each inner array will represent a vertical lane of activities

        processedActivities.forEach(activity => {
            let placed = false;
            for (const lane of lanes) {
                const lastInLane = lane[lane.length - 1];
                if (activity.startTime >= lastInLane.endTime) {
                    lane.push(activity);
                    activity.lane = lanes.indexOf(lane); // Assign lane index
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                const newLane = [activity];
                activity.lane = lanes.length; // New lane index
                lanes.push(newLane);
            }
        });

        return {
            activitiesWithLayout: lanes.flat(),
            totalLanes: lanes.length || 1 // Avoid division by zero
        };
    }

    function renderTimeline(todayActivities) {
        timelineElement.innerHTML = '';
        timelineElement.style.width = `${MINUTES_IN_A_DAY * PIXELS_PER_MINUTE}px`;

        if (!todayActivities.length) return;

        const { activitiesWithLayout, totalLanes } = layoutActivities(todayActivities);
        const colorClasses = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6'];

        activitiesWithLayout.forEach((activity, index) => {
            const startMinutes = getMinutesFromMidnight(activity.startTime);
            const durationMinutes = (activity.endTime - activity.startTime) / 60000;

            const block = document.createElement('div');
            block.className = 'activity-block';
            block.classList.add(colorClasses[index % colorClasses.length]);


            block.style.left = `${startMinutes * PIXELS_PER_MINUTE}px`;
            block.style.width = `${durationMinutes * PIXELS_PER_MINUTE}px`;
            block.style.top = `${(activity.lane / totalLanes) * 100}%`;
            block.style.height = `${100 / totalLanes}%`;

            block.innerHTML = `
            <div class="activity-content">
                <div class="activity-icon"><i class="${activity.ico}" alt="${activity.nombre}"></i></div>
                <div class="activity-name">${activity.nombre}</div>
                <div class="activity-time">${activity.HoraInicio} - ${activity.HoraFin}</div>
            </div>
        `;
            timelineElement.appendChild(block);
        });
    }


    function updateTimelineAndStickyContent() {
        const now = new Date();
        const minutesSinceMidnight = getMinutesFromMidnight(now);
        const timelineOffset = minutesSinceMidnight * PIXELS_PER_MINUTE;

        timelineElement.style.left = `calc(50% - ${timelineOffset}px)`;

        const container = document.querySelector('.timeline-container');
        const containerRect = container.getBoundingClientRect();
        const activityBlocks = document.querySelectorAll('.activity-block');

        activityBlocks.forEach(block => {
            const content = block.querySelector('.activity-content');
            if (!content) return;

            const blockRect = block.getBoundingClientRect();

            const isPartiallyOffscreenLeft = blockRect.left < containerRect.left;
            const isStillVisibleOnScreen = blockRect.right > containerRect.left;

            if (isPartiallyOffscreenLeft && isStillVisibleOnScreen) {
                // The block has started to move off-screen to the left
                // Calculate how far off-screen it is and apply a transform to push the content back into view
                const offset = containerRect.left - blockRect.left;
                content.style.transform = `translateX(${offset}px)`;
            } else {
                // The block is either fully on-screen or fully off-screen, so remove the transform
                content.style.transform = 'none';
            }
        });
    }

    function updateNextActivity(activities) {
        const now = new Date();
        const today = now.getDay();
        const weekDays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const todayStr = weekDays[today];

        const upcomingActivities = activities
            .filter(act => (act.days.includes("todos") || act.days.includes(todayStr)) && parseTime(act.HoraInicio) > now)
            .sort((a, b) => parseTime(a.HoraInicio) - parseTime(b.HoraInicio));

        const nextActivity = upcomingActivities[0];
        if (nextActivity) {
            nextActivityDetailsElement.innerHTML = `<p style="margin: 0;"><strong>${nextActivity.nombre}</strong> a las ${nextActivity.HoraInicio}</p>`;
        } else {
            nextActivityDetailsElement.innerHTML = `<p style="margin: 0;">No más actividades por hoy.</p>`;
        }

        const currentActivityContainer = document.getElementById('current-activity');
        const currentActivity = activities.find(act =>
            (act.days.includes("todos") || act.days.includes(todayStr)) &&
            parseTime(act.HoraInicio) <= now &&
            parseTime(act.HoraFin) > now
        );

        if (currentActivity) {
            currentActivityContainer.innerHTML = `<p><strong>Es momento de:</strong> <i class="${currentActivity.ico}"></i> ${currentActivity.nombre} (${currentActivity.HoraInicio} - ${currentActivity.HoraFin})</p>`;
        } else {
            currentActivityContainer.innerHTML = `<p><strong>Actualmente no hay actividades.</strong></p>`;
        }
    }

    function checkActivityEnd() {
        const now = new Date();
        todayActivities.forEach(activity => {
            if (!activity.dingPlayed) {
                const endTime = parseTime(activity.HoraFin);
                const timeDifference = now - endTime;
                if (timeDifference >= 0 && timeDifference < 1000) {
                    dingSound.play();
                    activity.dingPlayed = true;
                }
            }
        });
    }

    function catAnimation() {
        const catSprite = document.getElementById('cat-sprite');
        if (Math.random() < 0.2) {
            const animRnd = Math.floor(Math.random() * 10) + 1;
            catSprite.className = `cat-sprite anim${animRnd}`;
        }
    }

    async function initialize() {
        const zoomInBtn = document.getElementById('zoom-in-btn');
        const zoomOutBtn = document.getElementById('zoom-out-btn');
        const settingsBtn = document.getElementById('settings-button');

        zoomInBtn.addEventListener('click', () => {
            PIXELS_PER_MINUTE = Math.min(MAX_ZOOM, PIXELS_PER_MINUTE + ZOOM_STEP);
            updateUI(allActivities);
        });

        zoomOutBtn.addEventListener('click', () => {
            PIXELS_PER_MINUTE = Math.max(MIN_ZOOM, PIXELS_PER_MINUTE - ZOOM_STEP);
            updateUI(allActivities);
        });

        settingsBtn.addEventListener('click', () => {
            window.location.href = 'backend.html';
        });


        const activitiesObservable = Dexie.liveQuery(() => db.activities.toArray());
        try {
            const setting = await db.settings.get('selectedTheme');
            if (setting && setting.value) {
                document.body.className = setting.value;
            }
        } catch (error) {
            console.error("Failed to load theme from the database:", error);
        }

        activitiesObservable.subscribe({
            next: activities => {
                console.log("Database changed, updating UI.");
                if (activities && activities.length > 0) {
                    updateUI(activities);

                } else {
                    // Handle the case where there are no activities
                    timelineElement.innerHTML = `<div style="padding: 20px;">No hay actividades.</div>`;
                    nextActivityDetailsElement.innerHTML = `<p style="margin: 0;">No hay actividades.</p>`;
                    document.getElementById('current-activity').innerHTML = `<p><strong>Actualmente no hay actividades.</strong></p>`;
                }
            },
            error: error => {
                console.error("Error with live query:", error);
                const timelineElement = document.querySelector('.timeline-container');
                if (timelineElement) {
                    timelineElement.innerHTML = `<div style="padding: 20px; color: red;">Error: No se pudieron cargar las actividades.</div>`;
                }
            }
        });


        setInterval(updateTimelineAndStickyContent, 1000);
        setInterval(catAnimation, 30000);
        setInterval(() => {
            PIXELS_PER_MINUTE = 5;
            updateUI(allActivities);
        }, 60000);
        updateClock();
        setInterval(updateClock, 1000);


        const allActivities = await db.activities.toArray();
        const today = new Date().getDay();
        const weekDays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const todayStr = weekDays[today];
        setInterval(() => checkActivityEnd, 1000);
    }

    initialize();
});