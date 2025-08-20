document.addEventListener('DOMContentLoaded', () => {

    const db = new Dexie("scheduleDatabase");
    db.version(2).stores({
        activities: '++id, nombre, HoraInicio, HoraFin, ico, *days',
        settings: '&key'
    });

    const activitiesList = document.getElementById('activities-list');
    const showAddDialogBtn = document.getElementById('show-add-dialog-btn');
    const activityDialog = document.getElementById('activity-dialog');
    const activityForm = document.getElementById('activity-form');
    const dialogTitle = document.getElementById('dialog-title');
    const cancelBtn = document.getElementById('cancel-btn');
    const themeSwitcher = document.getElementById('theme-switcher');

    const renderActivities = async () => {
        const allActivities = await db.activities.orderBy('HoraInicio').toArray();
        activitiesList.innerHTML = '';
        allActivities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.className = 'activity';
            activityElement.innerHTML = `
                <h3><i class="${activity.ico}"></i> ${activity.nombre}</h3>
                <p><strong>Horario:</strong> ${activity.HoraInicio} - ${activity.HoraFin}</p>
                <p><strong>Días:</strong> ${activity.days.join(', ')}</p>
                <button class="btn btn-edit" data-id="${activity.id}">Editar</button>
                <button class="btn btn-delete" data-id="${activity.id}">Eliminar</button>
            `;
            activitiesList.appendChild(activityElement);
        });
    };

    const openAddDialog = () => {
        dialogTitle.textContent = 'Agregar Nueva Actividad';
        activityForm.reset();
        activityForm['activity-id'].value = '';
        $('.icp-dd').data('iconpicker').update('fas fa-search');
        activityDialog.showModal();
    };

    const openEditDialog = async (id) => {
        const activity = await db.activities.get(id);
        if (!activity) return;
        dialogTitle.textContent = 'Editar Actividad';
        activityForm['activity-id'].value = activity.id;
        activityForm['nombre'].value = activity.nombre;
        activityForm['HoraInicio'].value = activity.HoraInicio;
        activityForm['HoraFin'].value = activity.HoraFin;
        activityForm['ico'].value = activity.ico;
        const dayCheckboxes = activityForm.querySelectorAll('#activity-days-checkboxes input[type="checkbox"]');
        dayCheckboxes.forEach(checkbox => {
            checkbox.checked = activity.days.includes(checkbox.value);
        });
        activityDialog.showModal();
        $('.icp-dd').data('iconpicker').update(activity.ico);
    };


    function applyTheme(theme) {
        document.body.className = theme;
    }

    async function saveTheme(theme) {
        try {
            await db.settings.put({ key: 'selectedTheme', value: theme });
        } catch (error) {
            console.error("Failed to save theme to the database:", error);
        }
    }

    async function loadTheme() {
        try {
            const setting = await db.settings.get('selectedTheme');
            if (setting && setting.value) {
                applyTheme(setting.value);
                themeSwitcher.value = setting.value;
            }
        } catch (error) {
            console.error("Failed to load theme from the database:", error);
        }
    }


    function setupEventListeners() {
        showAddDialogBtn.addEventListener('click', openAddDialog);

        cancelBtn.addEventListener('click', () => {
            activityDialog.close();
        });

        activitiesList.addEventListener('click', async (event) => {
            const target = event.target;
            const id = Number(target.dataset.id);
            if (target.classList.contains('btn-edit')) {
                openEditDialog(id);
            } else if (target.classList.contains('btn-delete')) {
                if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
                    await db.activities.delete(id);
                    renderActivities();
                }
            }
        });

        activityForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const id = Number(activityForm['activity-id'].value);
            const days = Array.from(activityForm.querySelectorAll('#activity-days-checkboxes input:checked')).map(cb => cb.value);
            if (days.length === 0) {
                alert('Por favor, selecciona al menos un día.');
                return;
            }
            const activityData = {
                nombre: activityForm['nombre'].value,
                HoraInicio: activityForm['HoraInicio'].value,
                HoraFin: activityForm['HoraFin'].value,
                ico: activityForm['ico'].value,
                days: days
            };
            if (id) {
                await db.activities.update(id, activityData);
            } else {
                await db.activities.add(activityData);
            }
            activityDialog.close();
            renderActivities();
        });

        themeSwitcher.addEventListener('change', (event) => {
            const selectedTheme = event.target.value;
            applyTheme(selectedTheme);
            saveTheme(selectedTheme);
        });
    }


    const initializeApp = async () => {
        await loadTheme();

        setupEventListeners();

        renderActivities();
    };

    initializeApp();

});