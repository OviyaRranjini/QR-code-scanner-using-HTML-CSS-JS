// script.js

const video = document.getElementById('qr-video');
const output = document.getElementById('output');

function startScanner() {
    const constraints = {
        video: {
            facingMode: 'environment'
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            video.setAttribute('playsinline', true);
            video.play();
            requestAnimationFrame(scan);
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
        });
}

function scan() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            output.textContent = 'QR code detected: ' + code.data;
            // Perform action based on scanned content (e.g., open URL)
            if (isValidUrl(code.data)) {
                window.location.href = code.data;
            }
        }

    } catch (error) {
        console.error('Error scanning QR code:', error);
    }

    requestAnimationFrame(scan);
}

function isValidUrl(url) {
    // Simple check for URL validity (adjust as needed)
    return url.startsWith('http://') || url.startsWith('https://');
}

// Start the QR code scanner
startScanner();
