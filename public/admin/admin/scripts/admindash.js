
    (() => {
      // Utility to format date/time nicely
      function formatDate(date) {
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      }
      function formatTime(date) {
        return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      }
      function nowISO() {
        return new Date().toISOString();
      }

      // Save/load data helpers
      const STORAGE_KEYS = {
        announcements: 'church_announcements',
        events: 'church_events',
        communities: 'church_communities',
        gallery: 'church_gallery',
        contact: 'church_contact',
        messages: 'church_messages',
        lastUpdate: 'church_last_update'
      };

      // Load data from localStorage or default empty arrays/objects
      let announcements = JSON.parse(localStorage.getItem(STORAGE_KEYS.announcements)) || [];
      let events = JSON.parse(localStorage.getItem(STORAGE_KEYS.events)) || [];
      let communities = JSON.parse(localStorage.getItem(STORAGE_KEYS.communities)) || [];
      let gallery = JSON.parse(localStorage.getItem(STORAGE_KEYS.gallery)) || [];
      let contact = JSON.parse(localStorage.getItem(STORAGE_KEYS.contact)) || {
        phone: '',
        email: '',
        address: '',
        facebook: '',
        twitter: '',
        instagram: ''
      };
      let messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.messages)) || [];

      // Last update time
      let lastUpdate = localStorage.getItem(STORAGE_KEYS.lastUpdate);

      // DOM Elements
      const announcementsList = document.getElementById('announcements-list');
      const announcementForm = document.getElementById('announcement-form');
      const announcementText = document.getElementById('announcement-text');

      const eventsList = document.getElementById('events-list');
      const eventForm = document.getElementById('event-form');
      const eventTitle = document.getElementById('event-title');
      const eventDate = document.getElementById('event-date');
      const eventTime = document.getElementById('event-time');
      const eventLocation = document.getElementById('event-location');
      const eventDescription = document.getElementById('event-description');

      const communitiesList = document.getElementById('communities-list');
      const jumuiyaForm = document.getElementById('community-form');
      const jumuiyaName = document.getElementById('community-name');
      const jumuiyaLeader = document.getElementById('community-leader');
      const jumuiyaTime = document.getElementById('community-time');

      const galleryGrid = document.getElementById('gallery-grid');
      const galleryUpload = document.getElementById('gallery-upload');

      const contactForm = document.getElementById('contact-form');
      const contactPhone = document.getElementById('contact-phone');
      const contactEmail = document.getElementById('contact-email');
      const contactAddress = document.getElementById('contact-address');
      const contactFacebook = document.getElementById('contact-facebook');
      const contactTwitter = document.getElementById('contact-twitter');
      const contactInstagram = document.getElementById('contact-instagram');

      const messagesList = document.getElementById('messages-list');

      const statAnnouncements = document.getElementById('stat-announcements').querySelector('h3');
      const statEvents = document.getElementById('stat-events').querySelector('h3');
      const statcommunities = document.getElementById('stat-communities').querySelector('h3');
      const statLastUpdate = document.getElementById('stat-last-update').querySelector('h3');

      // Update last update time
      function updateLastUpdate() {
        lastUpdate = new Date().toLocaleString();
        localStorage.setItem(STORAGE_KEYS.lastUpdate, lastUpdate);
        statLastUpdate.textContent = lastUpdate;
      }

      // Render functions
      function renderAnnouncements() {
        announcementsList.innerHTML = '';
        if (announcements.length === 0) {
          announcementsList.innerHTML = '<li>No announcements yet.</li>';
          statAnnouncements.textContent = '0';
          return;
        }
        announcements.forEach((a, i) => {
          const li = document.createElement('li');
          li.textContent = a.text;
          li.setAttribute('tabindex', '0');
          const btnEdit = document.createElement('button');
          btnEdit.className = 'edit-btn';
          btnEdit.title = 'Edit announcement';
          btnEdit.textContent = '✏️';
          btnEdit.addEventListener('click', () => editAnnouncement(i));
          const btnDelete = document.createElement('button');
          btnDelete.className = 'delete-btn';
          btnDelete.title = 'Delete announcement';
          btnDelete.textContent = '🗑️';
          btnDelete.addEventListener('click', () => deleteAnnouncement(i));
          li.appendChild(btnEdit);
          li.appendChild(btnDelete);
          announcementsList.appendChild(li);
        });
        statAnnouncements.textContent = announcements.length;
      }
      function renderEvents() {
        eventsList.innerHTML = '';
        if (events.length === 0) {
          eventsList.innerHTML = '<li>No upcoming events.</li>';
          statEvents.textContent = '0';
          return;
        }
        events.forEach((e, i) => {
          const li = document.createElement('li');
          let dt = new Date(e.date + 'T' + e.time);
          li.innerHTML = `<strong>${e.title}</strong> - ${formatDate(dt)} @ ${formatTime(dt)}<br>
            <small>${e.location} | ${e.description}</small>`;
          li.setAttribute('tabindex', '0');
          const btnEdit = document.createElement('button');
          btnEdit.className = 'edit-btn';
          btnEdit.title = 'Edit event';
          btnEdit.textContent = '✏️';
          btnEdit.addEventListener('click', () => editEvent(i));
          const btnDelete = document.createElement('button');
          btnDelete.className = 'delete-btn';
          btnDelete.title = 'Delete event';
          btnDelete.textContent = '🗑️';
          btnDelete.addEventListener('click', () => deleteEvent(i));
          li.appendChild(btnEdit);
          li.appendChild(btnDelete);
          eventsList.appendChild(li);
        });
        statEvents.textContent = events.length;
      }
      function rendercommunities() {
        communitiesList.innerHTML = '';
        if (communities.length === 0) {
          communitiesList.innerHTML = '<li>No communities added yet.</li>';
          statcommunities.textContent = '0';
          return;
        }
        communities.forEach((j, i) => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${j.name}</strong> - Leader: ${j.leader}<br><small>Meeting: ${j.time}</small>`;
          li.setAttribute('tabindex', '0');
          const btnEdit = document.createElement('button');
          btnEdit.className = 'edit-btn';
          btnEdit.title = 'Edit community';
          btnEdit.textContent = '✏️';
          btnEdit.addEventListener('click', () => editJumuiya(i));
          const btnDelete = document.createElement('button');
          btnDelete.className = 'delete-btn';
          btnDelete.title = 'Delete community';
          btnDelete.textContent = '🗑️';
          btnDelete.addEventListener('click', () => deleteJumuiya(i));
          li.appendChild(btnEdit);
          li.appendChild(btnDelete);
          communitiesList.appendChild(li);
        });
        statcommunities.textContent = communities.length;
      }
      function renderGallery() {
        galleryGrid.innerHTML = '';
        if (gallery.length === 0) {
          galleryGrid.innerHTML = '<p style="color:#7f8c8d; font-style: italic;">No photos uploaded yet.</p>';
          return;
        }
        gallery.forEach((img, i) => {
          const wrapper = document.createElement('div');
          wrapper.style.position = 'relative';
          const image = document.createElement('img');
          image.src = img.data;
          image.alt = img.alt || `Church event photo ${i+1}`;
          image.loading = 'lazy';
          const btnDelete = document.createElement('button');
          btnDelete.className = 'delete-btn';
          btnDelete.title = 'Delete photo';
          btnDelete.textContent = '×';
          btnDelete.addEventListener('click', () => deletePhoto(i));
          wrapper.appendChild(image);
          wrapper.appendChild(btnDelete);
          galleryGrid.appendChild(wrapper);
        });
      }
      function renderContact() {
        contactPhone.value = contact.phone || '';
        contactEmail.value = contact.email || '';
        contactAddress.value = contact.address || '';
        contactFacebook.value = contact.facebook || '';
        contactTwitter.value = contact.twitter || '';
        contactInstagram.value = contact.instagram || '';
      }
      function renderMessages() {
        messagesList.innerHTML = '';
        if (messages.length === 0) {
          messagesList.innerHTML = '<li>No messages received yet.</li>';
          return;
        }
        messages.forEach((m, i) => {
          const li = document.createElement('li');
          li.setAttribute('tabindex', '0');
          li.innerHTML = `<strong>${m.name || 'Anonymous'}</strong> (${m.email || 'No email'})<br>
            <small>${new Date(m.date).toLocaleString()}</small><br>
            <em>${m.message}</em>`;
          messagesList.appendChild(li);
        });
      }

      // Save all data to localStorage
      function saveAll() {
        localStorage.setItem(STORAGE_KEYS.announcements, JSON.stringify(announcements));
        localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
        localStorage.setItem(STORAGE_KEYS.communities, JSON.stringify(communities));
        localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(gallery));
        localStorage.setItem(STORAGE_KEYS.contact, JSON.stringify(contact));
        localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
        updateLastUpdate();
      }

      // Announcements - Add/Edit/Delete
      function addAnnouncement(text) {
        announcements.push({ text });
        saveAll();
        renderAnnouncements();
      }
      function editAnnouncement(index) {
        const current = announcements[index];
        const newText = prompt('Edit announcement:', current.text);
        if (newText !== null && newText.trim() !== '') {
          announcements[index].text = newText.trim();
          saveAll();
          renderAnnouncements();
        }
      }
      function deleteAnnouncement(index) {
        if (confirm('Delete this announcement?')) {
          announcements.splice(index, 1);
          saveAll();
          renderAnnouncements();
        }
      }

      announcementForm.addEventListener('submit', e => {
        e.preventDefault();
        const text = announcementText.value.trim();
        if (text) {
          addAnnouncement(text);
          announcementText.value = '';
          announcementText.focus();
        }
      });

      // Events - Add/Edit/Delete
      function addEvent(event) {
        events.push(event);
        saveAll();
        renderEvents();
      }
      function editEvent(index) {
        const e = events[index];
        const title = prompt('Edit event title:', e.title);
        if (!title) return;
        const date = prompt('Edit event date (YYYY-MM-DD):', e.date);
        if (!date) return;
        const time = prompt('Edit event time (HH:MM):', e.time);
        if (!time) return;
        const location = prompt('Edit event location:', e.location);
        if (!location) return;
        const description = prompt('Edit event description:', e.description);
        if (!description) return;
        events[index] = { title, date, time, location, description };
        saveAll();
        renderEvents();
      }
      function deleteEvent(index) {
        if (confirm('Delete this event?')) {
          events.splice(index, 1);
          saveAll();
          renderEvents();
        }
      }
      eventForm.addEventListener('submit', e => {
        e.preventDefault();
        const newEvent = {
          title: eventTitle.value.trim(),
          date: eventDate.value,
          time: eventTime.value,
          location: eventLocation.value.trim(),
          description: eventDescription.value.trim()
        };
        if (
          newEvent.title &&
          newEvent.date &&
          newEvent.time &&
          newEvent.location &&
          newEvent.description
        ) {
          addEvent(newEvent);
          eventForm.reset();
          eventTitle.focus();
        }
      });

      // communities - Add/Edit/Delete
      function addJumuiya(j) {
        communities.push(j);
        saveAll();
        rendercommunities();
      }
      function editJumuiya(index) {
        const j = communities[index];
        const name = prompt('Edit community name:', j.name);
        if (!name) return;
        const leader = prompt('Edit leader name:', j.leader);
        if (!leader) return;
        const time = prompt('Edit meeting time:', j.time);
        if (!time) return;
        communities[index] = { name, leader, time };
        saveAll();
        rendercommunities();
      }
      function deleteJumuiya(index) {
        if (confirm('Delete this community?')) {
          communities.splice(index, 1);
          saveAll();
          rendercommunities();
        }
      }
      jumuiyaForm.addEventListener('submit', e => {
        e.preventDefault();
        const newJumuiya = {
          name: jumuiyaName.value.trim(),
          leader: jumuiyaLeader.value.trim(),
          time: jumuiyaTime.value.trim()
        };
        if (newJumuiya.name && newJumuiya.leader && newJumuiya.time) {
          addJumuiya(newJumuiya);
          jumuiyaForm.reset();
          jumuiyaName.focus();
        }
      });

      // Gallery - Upload and Delete
      function addPhotos(files) {
        const readerPromises = [];
        for (const file of files) {
          if (!file.type.startsWith('image/')) continue;
          readerPromises.push(
            new Promise((res) => {
              const reader = new FileReader();
              reader.onload = () => res({ data: reader.result, alt: file.name });
              reader.readAsDataURL(file);
            })
          );
        }
        Promise.all(readerPromises).then(images => {
          gallery.push(...images);
          saveAll();
          renderGallery();
        });
      }
      function deletePhoto(index) {
        if (confirm('Delete this photo?')) {
          gallery.splice(index, 1);
          saveAll();
          renderGallery();
        }
      }
      galleryUpload.addEventListener('change', e => {
        addPhotos(e.target.files);
        galleryUpload.value = '';
      });

      // Contact Info - Save
      contactForm.addEventListener('submit', e => {
        e.preventDefault();
        contact = {
          phone: contactPhone.value.trim(),
          email: contactEmail.value.trim(),
          address: contactAddress.value.trim(),
          facebook: contactFacebook.value.trim(),
          twitter: contactTwitter.value.trim(),
          instagram: contactInstagram.value.trim()
        };
        saveAll();
        alert('Contact information saved!');
      });

      // Messages - For demo, add some dummy messages (in real app, messages come from backend)
      if (messages.length === 0) {
        messages.push(
          { name: 'John Doe', email: 'john@example.com', date: nowISO(), message: 'Can I volunteer for choir?' },
          { name: 'Mary Jane', email: 'maryj@example.com', date: nowISO(), message: 'When is the next fundraiser?' }
        );
        saveAll();
      }

      // Initial render
      renderAnnouncements();
      renderEvents();
      rendercommunities();
      renderGallery();
      renderContact();
      renderMessages();
      statLastUpdate.textContent = lastUpdate || 'Never';

    })();
  