// Function to set a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to check consent
function checkConsent() {
    return getCookie('consent');
}

// Show consent banner if no consent is given
window.onload = function() {
    if (!checkConsent()) {
        document.getElementById('consent-banner').style.display = 'block';
    } else {
        loadGoogleAnalytics();
    }
};

// Event listener for Accept button
document.getElementById('accept-cookies').addEventListener('click', function() {
    setCookie('consent', 'yes', 365);
    document.getElementById('consent-banner').style.display = 'none';
    loadGoogleAnalytics();
});

// Event listener for Decline button
document.getElementById('decline-cookies').addEventListener('click', function() {
    setCookie('consent', 'no', 365);
    document.getElementById('consent-banner').style.display = 'none';
});

// Function to load Google Analytics
function loadGoogleAnalytics() {
    var script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=YOUR_TRACKING_ID';
    script.async = true;
    document.head.appendChild(script);

    script.onload = function() {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'YOUR_TRACKING_ID');
    };
}