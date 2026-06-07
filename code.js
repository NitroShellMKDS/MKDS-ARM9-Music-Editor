(() => {
    'use strict';
    let arm9FileName = null;
    let armDataView = null;
    const ARM_OFFSETS = {
        "game intro": 0x153231,
        "singleplayer menu": 0x153235,
        "multiplayer menu": 0x153225,
        "wi-fi menu": 0x153221,
        "records menu": 0x153229,
        "grand prix flyover": 0x153171,
        "grand prix flyover (figure-8 circuit, gcn luigi circuit, mario circuit)": 0x153175,
        "grand prix flyover (waluigi pinball)": 0x15317D,
        "wario stadium flyover": 0x153179,
        "battle mode flyover": 0x153181,
        "boss intro": 0x153185,
        "figure-8 circuit": 0x153189,
        "yoshi falls": 0x153199,
        "cheep cheep beach": 0x153195,
        "luigi's mansion": 0x1531BD,
        "desert hills": 0x1531E9,
        "delfino square": 0x1531A9,
        "waluigi pinball": 0x1531ED,
        "shroom ridge": 0x1531D9,
        "dk pass": 0x1531E5,
        "tick tock clock": 0x1531F1,
        "mario circuit": 0x1531F5,
        "airship fortress": 0x1531AD,
        "wario stadium": 0x1531B1,
        "peach gardens": 0x1531B9,
        "bowser castle": 0x153201,
        "rainbow road": 0x1531F9,
        "snes mario circuit 1": 0x1531C1,
        "n64 moo moo farm": 0x1531A1,
        "gba peach circuit": 0x1531D1,
        "gcn luigi circuit": 0x15318D,
        "snes donut plains 1": 0x1531C9,
        "n64 frappe snowland": 0x1531A5,
        "gba bowser castle 2": 0x1531FD,
        "gcn baby park": 0x15319D,
        "snes koopa beach 2": 0x1531C5,
        "n64 choco mountain": 0x1531DD,
        "gba luigi circuit": 0x1531D5,
        "gcn mushroom bridge": 0x1531B5,
        "snes choco island 2": 0x1531CD,
        "n64 banshee boardwalk": 0x1531E1,
        "gba sky garden": 0x153205,
        "gcn yoshi circuit": 0x153191,
        "grand prix results": 0x153215,
        "battle mode": 0x153209,
        "boss battle": 0x15320D,
        "new reward": 0x153211,
        "credits (50cc + 100cc)": 0x153219,
        "credits (150cc + mirror)": 0x15321D
    };
    const elements = {
        fileInput: document.getElementById('fileInput'),
        btnOpen: document.getElementById('btnOpen'),
        btnSave: document.getElementById('btnSave'),
        btnHelp: document.getElementById('btnHelp'),
        btnRepo: document.getElementById('btnRepo'),
        trackList: document.getElementById('trackList'),
        mainContent: document.getElementById('mainContent')
    };
    function init() {
        bindEvents();
    }
    function bindEvents() {
        elements.btnOpen.addEventListener('click', () => elements.fileInput.click());
        elements.btnSave.addEventListener('click', saveFile);
        elements.btnHelp.addEventListener('click', showHelp);
        elements.btnRepo.addEventListener('click', () => window.open('https://github.com/NitroShellMKDS/MKDS-ARM9-Music-Editor', '_blank'));
        elements.fileInput.addEventListener('change', handleFileOpen);
        elements.trackList.addEventListener('change', handleSlotSelection);
    }
    function refreshTrackList() {
        elements.trackList.innerHTML = '';
        for (const [trackName, offset] of Object.entries(ARM_OFFSETS)) {
            const currentVal = armDataView ? armDataView[offset] : '?';
            const option = document.createElement('option');
            option.value = offset;
            option.text = `${trackName} (current seq id: ${currentVal})`;
            elements.trackList.add(option);
        }
    }
    async function handleFileOpen(event) {
        const file = event.target.files[0];
        if (!file) return;
        arm9FileName = file.name;
        try {
            const arrayBuffer = await file.arrayBuffer();
            armDataView = new Uint8Array(arrayBuffer);
            refreshTrackList();
            elements.btnSave.disabled = false;
            elements.mainContent.classList.remove('hidden');
        } catch (error) {
            alert('Failed to read file: ' + error.message);
        }
        event.target.value = '';
    }
    function handleSlotSelection(event) {
        const selectedOption = event.target.options[event.target.selectedIndex];
        if (!selectedOption) return;
        const offset = parseInt(selectedOption.value, 10);
        const trackName = Object.keys(ARM_OFFSETS).find(key => ARM_OFFSETS[key] === offset);
        const currentVal = armDataView[offset];
        const input = prompt(`Enter new SEQ value (0-75) for ${trackName}:`, currentVal);
        if (input !== null) {
            const intValue = parseInt(input, 10);
            if (!isNaN(intValue) && intValue >= 0 && intValue <= 75) {
                armDataView[offset] = intValue;
                alert(`Success! SEQ value for ${trackName} changed to ${intValue}`);
            } else {
                alert('Invalid SEQ value. Value must be between 0 and 75.');
            }
        }
        refreshTrackList();
        elements.trackList.selectedIndex = -1;
    }
    function saveFile() {
        if (!armDataView || !arm9FileName) return;
        const blob = new Blob([armDataView], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = arm9FileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    function showHelp() {
        alert(
            "MKDS ARM9 Music Table Editor\n\n" +
            "1. Click 'Open arm9.bin' and select your file.\n" +
            "2. Click on a track in the list to change its SEQ ID.\n" +
            "3. Enter a valid value between 0 and 75.\n" +
            "4. Click 'Save' to download your modified file.\n\n" +
            "Original Code: Ermelber, Yami, MkDasher\nFixed and made into a Web app by NitroShell"
        );
    }
    init();
})();