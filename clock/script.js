document.addEventListener('DOMContentLoaded', () => {
    const clockElement = document.getElementById('clock');
    const timelineElement = document.getElementById('timeline');
    const activitiesListElement = document.getElementById('activities-list');
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
    db.version(3).stores({
        activities: '++id, nombre, HoraInicio, HoraFin, ico, checked, *days',
        settings: '&key'
    });
    function updateUI(activities) {
        allActivities = activities;
        const today = new Date().getDay();
        const weekDays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const todayStr = weekDays[today];
        todayActivities = activities.filter(act => act.days.includes("todos") || act.days.includes(todayStr));

        renderTimeline(todayActivities);
        updateTimelinePosition();
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
        syncMobileUI();
    }
    function syncMobileUI() {
        const clockMobile = document.getElementById("clock-mobile");
        const currentMobile = document.getElementById("current-activity-mobile");
        const nextMobile = document.getElementById("next-activity-mobile");

        const clockDesktop = document.getElementById("clock");
        const currentDesktop = document.getElementById("current-activity");
        const nextDesktop = document.getElementById("next-activity-details");

        if (clockMobile && clockDesktop) {
            clockMobile.innerHTML = clockDesktop.innerHTML;
        }

        if (currentMobile && currentDesktop) {
            currentMobile.innerHTML = currentDesktop.innerHTML;
        }

        if (nextMobile && nextDesktop) {
            nextMobile.innerHTML = nextDesktop.innerHTML;
        }
    }

    function layoutActivities(activities) {
        if (!activities || activities.length === 0) {
            return { activitiesWithLayout: [], totalLanes: 0 };
        }

        const processedActivities = activities.map(act => ({
            ...act,
            startTime: parseTime(act.HoraInicio),
            endTime: parseTime(act.HoraFin)
        })).sort((a, b) => a.startTime - b.startTime);

        const lanes = [];

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

        if (!todayActivities.length) return;

        const mobile = isMobile();

        renderVerticalTimeline(todayActivities);
        if (!mobile) {
            renderHorizontalTimeline(todayActivities);
        }
    }

    function renderHorizontalTimeline(todayActivities) {
        //Timeline
        timelineElement.style.width = `${MINUTES_IN_A_DAY * PIXELS_PER_MINUTE}px`;
        timelineElement.style.height = `100%`;
        timelineElement.style.left = "0px";

        const { activitiesWithLayout, totalLanes } = layoutActivities(todayActivities);
        const laneHeight = 100 / totalLanes;

        activitiesWithLayout.forEach((activity, index) => {

            const startMinutes = getMinutesFromMidnight(activity.startTime);
            const durationMinutes = (activity.endTime - activity.startTime) / 60000;

            const block = document.createElement('div');
            block.className = 'activity-block color-' + ((index % 6) + 1);

            block.style.position = "absolute";
            block.style.left = `${startMinutes * PIXELS_PER_MINUTE}px`;
            block.style.width = `${durationMinutes * PIXELS_PER_MINUTE}px`;
            block.style.top = `${activity.lane * laneHeight}%`;
            block.style.height = `${laneHeight}%`;

            block.innerHTML = `
            <div class="activity-name">${activity.nombre}</div>
            <div class="activity-time">${activity.HoraInicio} - ${activity.HoraFin}</div>
        `;

            timelineElement.appendChild(block);
        });
    }
    function renderVerticalTimeline(todayActivities) {
        //activities-list
        activitiesListElement.innerHTML = '';
        const sortedActivities = todayActivities
            .map(act => ({
                ...act,
                startTime: parseTime(act.HoraInicio),
                endTime: parseTime(act.HoraFin)
            }))
            .sort((a, b) => a.startTime - b.startTime);

        sortedActivities.forEach((activity, index) => {

            const state = getActivityState(activity);

            const block = document.createElement('div');
            block.className = `activity-block color-${(index % 6) + 1} state-${state}`;

            block.innerHTML = `
            <div class="activity-main">
                <div class="activity-name">${activity.nombre}</div>
                <div class="activity-time">${activity.HoraInicio} - ${activity.HoraFin}</div>
            </div>
            <div class="activity-check">
                <input type="checkbox" ${activity.checked ? "checked" : ""} data-id="${activity.id}">
            </div>
          `;

            activitiesListElement.appendChild(block);
        });
    }


    function updateTimelinePosition() {
        if (isMobile()) return; // ⬅️ clave
        const now = new Date();
        const minutesSinceMidnight = getMinutesFromMidnight(now);
        const timelineOffset = minutesSinceMidnight * PIXELS_PER_MINUTE;

        const containerWidth = document.querySelector('.timeline-container').offsetWidth;

        timelineElement.style.left = `${containerWidth / 2 - timelineOffset}px`;
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


        setInterval(updateTimelinePosition, 1000);
        setInterval(catAnimation, 30000);
        setInterval(() => {
            if (PIXELS_PER_MINUTE != 5) {
                PIXELS_PER_MINUTE = 5;
                updateUI(allActivities);
            }
        }, 60000);
        updateClock();
        setInterval(updateClock, 1000);


        allActivities = await db.activities.toArray();
        const today = new Date().getDay();
        const weekDays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const todayStr = weekDays[today];

        activitiesListElement.addEventListener('change', async (e) => {
            if (e.target.type === 'checkbox') {
                const id = Number(e.target.dataset.id);
                await db.activities.update(id, { checked: e.target.checked });
            }
        });

        setInterval(checkActivityEnd, 1000);
    }
    function isMobile() {
        return window.innerWidth < 768;
    }
    function getActivityState(activity) {
        const now = new Date();
        const start = parseTime(activity.HoraInicio);
        const end = parseTime(activity.HoraFin);

        if (activity.checked) return "completed";
        if (end <= now) return "past";
        if (start <= now && end > now) return "current";
        return "upcoming";
    }
    document.addEventListener('resize', () => {
        isMobile();
        updateUI(allActivities);
    });

    initialize();
});