export function generateOtp(){
    return Math.floor(100000 + Math.random() * 900000);
}

export function getOtpHtml(otp){
    return `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 24px;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .otp-box {
            background-color: #e9ecef;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            display: inline-block;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 4px;
        }
        .note {
            color: #999;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🔐</div>
        <h1>OTP Verification</h1>
        <p>Thank you for registering! Please use the code below to verify your email address.</p>
        
        <div class="otp-box">
            <span class="otp-code">${otp}</span>
        </div>
        
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't create this account, please ignore this email.</p>
        
        <div class="note">
            Sent by Your Company Name
        </div>
    </div>
</body>
</html>

    `
}