/**
 * CharmDrop - Extension Popup Controller
 */

import { charms, getCharmById } from '../data/charms.js';

document.addEventListener('DOMContentLoaded', async () => {
  const masterToggle = document.getElementById('masterToggle');
  const soundToggle = document.getElementById('soundToggle');
  const activeCharmImg = document.getElementById('activeCharmImg');
  const activeCharmName = document.getElementById('activeCharmName');
  const activeCharmDesc = document.getElementById('activeCharmDesc');
  const soundBadge = document.getElementById('soundBadge');
  const presetGroup = document.getElementById('presetGroup');
  const charmsGrid = document.getElementById('charmsGrid');
  const charmCount = document.getElementById('charmCount');

  // 1. Fetch current settings
  let data = await chrome.storage.local.get({
    enabled: true,
    selectedCharmId: 'nimbu-mirchi',
    positionMode: 'top-right',
    customPercentX: 85,
    soundEffectsEnabled: true
  });

  // 2. Render UI with current state
  function updateUI() {
    masterToggle.checked = !!data.enabled;
    soundToggle.checked = !!data.soundEffectsEnabled;

    const currentCharm = getCharmById(data.selectedCharmId);
    activeCharmImg.src = `../${currentCharm.image}`;
    activeCharmImg.alt = currentCharm.name;
    activeCharmName.textContent = currentCharm.name;
    activeCharmDesc.textContent = currentCharm.description || 'Hanging talisman';

    if (currentCharm.sound) {
      soundBadge.classList.remove('is-hidden');
    } else {
      soundBadge.classList.add('is-hidden');
    }

    // Position presets
    const presetBtns = presetGroup.querySelectorAll('.preset-btn');
    presetBtns.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.preset === data.positionMode);
    });

    // Charm grid items
    renderCharmsGrid();
  }

  function renderCharmsGrid() {
    charmsGrid.innerHTML = '';
    charmCount.textContent = `${charms.length} Charms`;

    charms.forEach((charm) => {
      const isSelected = charm.id === data.selectedCharmId;
      const card = document.createElement('div');
      card.className = `charm-item-card ${isSelected ? 'is-selected' : ''}`;
      card.title = `${charm.name}${charm.sound ? ' (Sound enabled)' : ''}`;

      const soundDot = charm.sound ? `<span class="sound-mini-dot">🔔</span>` : '';

      card.innerHTML = `
        ${soundDot}
        <div class="charm-thumb-box">
          <img src="../${charm.image}" alt="${charm.name}" class="charm-item-img" draggable="false" />
        </div>
        <span class="charm-item-title">${charm.name}</span>
      `;

      card.addEventListener('click', async () => {
        data.selectedCharmId = charm.id;
        await chrome.storage.local.set({ selectedCharmId: charm.id });
        updateUI();
      });

      charmsGrid.appendChild(card);
    });
  }

  // 3. Event Listeners
  masterToggle.addEventListener('change', async () => {
    data.enabled = masterToggle.checked;
    await chrome.storage.local.set({ enabled: data.enabled });
  });

  soundToggle.addEventListener('change', async () => {
    data.soundEffectsEnabled = soundToggle.checked;
    await chrome.storage.local.set({ soundEffectsEnabled: data.soundEffectsEnabled });
  });

  presetGroup.addEventListener('click', async (e) => {
    const btn = e.target.closest('.preset-btn');
    if (btn && btn.dataset.preset) {
      data.positionMode = btn.dataset.preset;
      await chrome.storage.local.set({ positionMode: data.positionMode });
      updateUI();
    }
  });

  // Initial render
  updateUI();
});
