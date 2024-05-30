<html>
<head>
    <title>SimPaud</title>
    <style type="text/css" data-inline="true">
        body {
            -webkit-text-size-adjust: none;
            background-color: #edf2f7;
            color: #000;
            height: 100%;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            width: 100% !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        }

        .header {
            padding: 25px 0;
            text-align: center;
        }

        .header a {
            color: #3d4852;
            font-size: 19px;
            font-weight: bold;
            text-decoration: none;
        }

        .content {
            background-color: #ffffff; 
            padding:45px;
        }

        .content p {
            font-size: 14px;
        }

        .button {
            -webkit-text-size-adjust: none;
            border-radius: 4px;
            background-color: #000;
            color: #fff;
            display: inline-block;
            overflow: hidden;
            text-decoration: none;
        }

        .footer {
            margin: 0 auto;
            padding: 25px 0;
            text-align: center;
        }

        .footer p {
            color: #b0adc5;
            font-size: 12px;
            text-align: center;
        }
    </style>
</head>
<body style="-webkit-text-size-adjust: none;
            background-color: #edf2f7;
            color: #74787e;
            height: 100%;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            width: 100% !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">

    <table width="600" cellpadding="0" cellspacing="0" align="center">
        <tr>
            <td class="header" style="padding: 25px 0;
            text-align: center; "><a href="{{ $mailData['base_url'] }}" style="display: inline-block; color: #3d4852;
            font-size: 19px;
            font-weight: bold;
            text-decoration: none; ">SimPaud</a></td>
        </tr>
        <tr>
            <td class="content" style="background-color: #ffffff; 
            padding: 25px 40px; font-size: 17px; line-height: 21px; ">

            <h2 style="color: #000; ">{{ $mailData['title'] }}</h2>
            <p>{{ $mailData['body'] }}</p>
            <p align="center"><a href="{{ $mailData['base_url'] }}/konfirmasi-akun/{{ $mailData['enkripsi'] }}" class="button" style="-webkit-text-size-adjust: none;
            padding: 10px 15px;
            background-color: #000;
            color: #fff;
            display: inline-block;
            overflow: hidden;
            text-decoration: none; border-radius: 4px; margin: 30px auto; font-size: 12px; ">Aktivasi Akun</a></p>
            <hr>
            <p>Jika Anda kesulitan mengeklik tombol "Aktivasi Akun", salin dan tempel URL di bawah ini ke browser web Anda: <a href="{{ $mailData['base_url'] }}/konfirmasi-akun/{{ $mailData['enkripsi'] }}">{{ $mailData['base_url'] }}/konfirmasi-akun/{{ $mailData['enkripsi'] }}</a></p>
        
            </td>
        </tr>
        <tr>
            <td class="footer" style="padding: 25px 0;
            text-align: center; color: #b0adc5;
            font-size: 12px; "><p>© {{ date('Y') }} SimPaud. @lang('All rights reserved.')</p></td>
        </tr>
    </table>
    <!-- <h1>{{ $mailData['title'] }}</h1>
    <p>{{ $mailData['body'] }}</p>
    <p><a href="{{ $mailData['base_url'] }}/konfirmasi-akun/{{ $mailData['enkripsi'] }}">Aktivasi Akun</a></p>
    <p>{{ $mailData['footer'] }}</p>
     
    <p>Terima kasih.</p> -->
</body>
</html>