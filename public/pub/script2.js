
// Events data - normally this would come from a database
const events = {
    "2025-05-05": { title: "Team Meeting", time: "10:00 AM", description: "Discuss quarterly goals and project timelines" },
    "2025-05-10": { title: "Product Launch", time: "2:00 PM", description: "Release of new product line with press conference" },
    "2025-05-15": { title: "Client Presentation", time: "11:30 AM", description: "Present project progress to key stakeholders" },
    "2025-05-20": { title: "Training Workshop", time: "9:00 AM - 4:00 PM", description: "Full-day training on new software implementation" },
    "2025-05-25": { title: "Board Meeting", time: "3:00 PM", description: "Monthly review with board of directors" },
    "2025-06-02": { title: "Conference", time: "All Day", description: "Annual industry conference in Chicago" },
    "2025-06-15": { title: "Team Building", time: "2:00 PM", description: "Afternoon team building activities and dinner" },
    "2025-06-22": { title: "Project Deadline", time: "5:00 PM", description: "Final submission for Q2 project deliverables" },
    "2025-04-10": { title: "Budget Review", time: "1:00 PM", description: "Review Q2 budget allocations" },
    "2025-04-18": { title: "Department Lunch", time: "12:00 PM", description: "Team lunch at La Trattoria restaurant" }
};

// Calendar state
let currentDate = new Date();
let currentMonth = 4; // Start with May (month is 0-indexed in JavaScript)
let currentYear = 2025;

// DOM elements
const calendarGrid = document.getElementById('calendar-grid');
const monthYearElement = document.getElementById('month-year');
const prevButton = document.getElementById('prev-month');
const nextButton = document.getElementById('next-month');
const eventTooltip = document.getElementById('event-tooltip');

// Month names
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];

// Initialize calendar
function initCalendar() {
    renderCalendar();
    
    // Event listeners for navigation
    prevButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    nextButton.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // Handle tooltip positioning and hide when not hovering
    document.addEventListener('mousemove', (e) => {
        // Adjust tooltip position based on available space
        const tooltipWidth = eventTooltip.offsetWidth;
        const tooltipHeight = eventTooltip.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let left = e.pageX + 15;
        let top = e.pageY + 15;
        
        // Check if tooltip goes beyond right edge
        if (left + tooltipWidth > viewportWidth - 10) {
            left = e.pageX - tooltipWidth - 15;
        }
        
        // Check if tooltip goes beyond bottom edge
        if (top + tooltipHeight > viewportHeight - 10) {
            top = e.pageY - tooltipHeight - 15;
        }
        
        eventTooltip.style.top = top + 'px';
        eventTooltip.style.left = left + 'px';
    });
    
    // Handle touch events for mobile devices
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
}

// Touch handling for swipe navigation
let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }
    
    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;
    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;
    
    // Only respond to horizontal swipes
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 10) {
            // Swipe left - next month
            nextButton.click();
        } else if (xDiff < -10) {
            // Swipe right - previous month
            prevButton.click();
        }
    }
    
    // Reset values
    xDown = null;
    yDown = null;
}

// Render the calendar grid
function renderCalendar() {
    // Update header
    monthYearElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear grid
    calendarGrid.innerHTML = '';
    
    // Calculate first day of month and days in month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Create empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Create cells for each day in month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Check if there's an event for this day
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (events[dateString]) {
            // Add event dot indicator
            const eventDot = document.createElement('div');
            eventDot.className = 'event-dot';
            dayElement.appendChild(eventDot);
            
            // Add event preview
            const eventPreview = document.createElement('div');
            eventPreview.className = 'event-preview';
            eventPreview.textContent = events[dateString].title;
            dayElement.appendChild(eventPreview);
            
            // Add event functionality for both hover and touch
            const showEvent = () => {
                // Populate tooltip
                document.getElementById('event-title').textContent = events[dateString].title;
                document.getElementById('event-time').textContent = events[dateString].time;
                document.getElementById('event-description').textContent = events[dateString].description;
                
                // Show tooltip
                eventTooltip.style.display = 'block';
            };
            
            const hideEvent = () => {
                // Hide tooltip
                eventTooltip.style.display = 'none';
            };
            
            // Mouse events
            dayElement.addEventListener('mouseenter', showEvent);
            dayElement.addEventListener('mouseleave', hideEvent);
            
            // Touch events
            dayElement.addEventListener('touchstart', (e) => {
                // Hide any previously shown tooltips
                eventTooltip.style.display = 'none';
                
                // Show this event tooltip
                showEvent();
                
                // Position tooltip near the touch point
                const touch = e.touches[0];
                let left = touch.pageX - 110; // Center the tooltip
                const top = touch.pageY + 30;
                
                // Ensure tooltip stays within viewport
                if (left < 10) left = 10;
                if (left > window.innerWidth - 230) left = window.innerWidth - 230;
                
                eventTooltip.style.left = left + 'px';
                eventTooltip.style.top = top + 'px';
                
                // Prevent default to avoid triggering other events
                e.preventDefault();
            });
            
            // Close tooltip when touching elsewhere
            document.addEventListener('touchstart', (e) => {
                if (!dayElement.contains(e.target) && !eventTooltip.contains(e.target)) {
                    hideEvent();
                }
            });
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Mark today if viewing current month
    const today = new Date();
    if (today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
        const todayCell = calendarGrid.children[firstDay + today.getDate() - 1];
        if (todayCell) {
            todayCell.style.backgroundColor = 'rgba(74, 111, 165, 0.1)';
            todayCell.style.border = '2px solid #4a6fa5';
        }
    }
}

// Add meta viewport for better mobile experience
if (!document.querySelector('meta[name="viewport"]')) {
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(metaViewport);
}

// Start the calendar
initCalendar();
