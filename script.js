document.addEventListener('DOMContentLoaded', function() {
    const prayerTimes = {
        Fajr: '04:00',
        Dhuhr: '12:00',
        Asr: '15:30',
        Maghrib: '18:45',
        Isha: '20:00'
    };

    const prayerTimesTable = document.getElementById('prayer-times');

    const prayerNames = {
        Fajr: 'ফজর',
        Dhuhr: 'যোহর',
        Asr: 'আসর',
        Maghrib: 'মাগরিব',
        Isha: 'ইশা'
    };

    // ইকামাতের সময়সীমা নির্ধারণ (উদাহরণ স্বরূপ: নামাযের সময় থেকে 10 মিনিট পর)
    const iqamahOffsets = {
        Fajr: 10,
        Dhuhr: 10,
        Asr: 10,
        Maghrib: 10,
        Isha: 10
    };

    Object.keys(prayerTimes).forEach(prayer => {
        if (prayerNames[prayer]) {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = prayerNames[prayer];
            row.appendChild(nameCell);

            const timeCell = document.createElement('td');
            timeCell.textContent = convertToBangla(convertTo12HourFormat(prayerTimes[prayer]));
            row.appendChild(timeCell);

            // নামাযের সময়ের জন্য নতুন Date অবজেক্ট তৈরি
            const [prayerHour, prayerMinute] = prayerTimes[prayer].split(':').map(Number);
            const prayerTime = new Date();
            prayerTime.setHours(prayerHour, prayerMinute, 0, 0);

            // ইকামাতের সময় নির্ধারণ
            const iqamahTime = new Date(prayerTime);
            iqamahTime.setMinutes(iqamahTime.getMinutes() + iqamahOffsets[prayer]);
            const iqamahTimeString = convertToBangla(convertTo12HourFormat(iqamahTime.toTimeString().substring(0, 5)));
            const iqamahCell = document.createElement('td');
            iqamahCell.textContent = iqamahTimeString;
            row.appendChild(iqamahCell);

            prayerTimesTable.appendChild(row);

            // যদি পরের নামাযের জন্য কাউন্টডাউন করতে চান
            if (prayer === 'Fajr') {
                setCountdown(prayerTime, iqamahTime);
            }
        }
    });

    function updateClock() {
        const now = new Date();
        const currentTime = convertToBangla(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
        document.getElementById('clock').textContent = currentTime;
    }

    function convertTo12HourFormat(time) {
        let [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    }

    function convertToBangla(number) {
        const banglaNumbers = {
            '0': '০',
            '1': '১',
            '2': '২',
            '3': '৩',
            '4': '৪',
            '5': '৫',
            '6': '৬',
            '7': '৭',
            '8': '৮',
            '9': '৯'
        };
        return number.replace(/[0-9]/g, digit => banglaNumbers[digit]);
    }

    function setCountdown(prayerTime, iqamahTime) {
        const overlay = document.getElementById('overlay');
        const countdown = document.getElementById('countdown');

        function updateCountdown() {
            const now = new Date();
            const prayerDiff = prayerTime - now;
            const iqamahDiff = iqamahTime - now;

            if (prayerDiff <= 0 && iqamahDiff > 0) {
                overlay.style.display = 'flex';
                const hours = String(Math.floor((iqamahDiff % 86400000) / 3600000)).padStart(2, '0');
                const minutes = String(Math.floor((iqamahDiff % 3600000) / 60000)).padStart(2, '0');
                const seconds = String(Math.floor((iqamahDiff % 60000) / 1000)).padStart(2, '0');
                const countdownTime = `${hours}:${minutes}:${seconds}`;
                countdown.textContent = `ইকামাত পর্যন্ত অবশিষ্ট: ${convertToBangla(countdownTime)}`;
            } else if (iqamahDiff <= 0) {
                overlay.style.display = 'none';
            }
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    setInterval(updateClock, 1000);
    updateClock(); // Initial call to display clock immediately

    // কুরআনের আয়াতের জন্য কোড
    const quranVerses = [
        "নামায কায়েম কর; নিশ্চয়ই নামায অশ্লীলতা ও মন্দ কাজ থেকে বিরত রাখে। (সূরা আল-আনকাবুত: ৪৫)",
        "তোমরা নামায কায়েম কর এবং যাকাত দাও এবং রুকুকারীদের সাথে রুকু কর। (সূরা আল-বাকারা: ৪৩)",
        "নিশ্চয়ই আমি তোমাদেরকে সৎ কাজের আদেশ দেই এবং নামায কায়েম কর। (সূরা হুদ: ৮৭)"
    ];

    function displayQuranVerse() {
        const verseElement = document.getElementById('quran-verse');
        const randomVerse = quranVerses[Math.floor(Math.random() * quranVerses.length)];
        verseElement.textContent = randomVerse;
    }

    displayQuranVerse();
    setInterval(displayQuranVerse, 60000); // প্রতি মিনিটে একটি নতুন আয়াত প্রদর্শন

    // কুরআনের আয়াত স্ক্রল করার জন্য কোড
    function startScrolling() {
        const verseElement = document.getElementById('quran-verse');
        const verseWidth = verseElement.clientWidth;
        const containerWidth = verseElement.parentElement.clientWidth;
        verseElement.style.animation = `scroll ${15 + (verseWidth / 100)}s linear infinite`;
    }

    startScrolling();
    window.addEventListener('resize', startScrolling); // Window রিসাইজ হলে পুনরায় স্ক্রলিং সেটআপ
});
