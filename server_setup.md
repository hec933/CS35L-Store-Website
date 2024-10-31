# Server Setup
Andy Alcazar, Gregory Weinrod, Hector Gil-Morales, Taewook Park

------
## Apache on BSD
This file documents the steps required to deploy a live next app using the BSD OS and Apache webserver.

------
## Outline
- Configure the BSD VM
- Register DNS
- Setup users
- Install and configure Apache
- Configure firewall
- Proceed with Project Setup
  
------
## Users
- **for each admin, setting groups to wheel and www**:
```
>su adduser
  username?>NAME RET
  fullname?>NAME NAME RET
  UID?>RET
  group?>wheel RET 
  more?>www RET
  class?>RET
  shell?>bash RET
  home?>RET
  permissions?>RET
  usepw?>RET
  emptypw?>RET
  randompw?>RET
  enterpw:>NAME RET
	again:>NAME RET
  lock?>RET
  OK?>y RET
```

------
# Apache
- **Install the package**
```
>pkg install apache24 -y
```

------
## Edit the main configuration file
```
>emacs /usr/local/etc/apahce24/httpd.conf
```

- **Set root for apache server files**
```
ServerRoot = "/usr/local"
```

- **Set the port for apache to listen at**
```
Listen 80
```

- **Uncomment all desired modules including proxy pass and ssl**
```
LoadModule headers_module libexec/apache24/mod_headers.so
LoadModule proxy_module libexec/apache24/mod_proxy.so
LoadModule proxy_http_module libexec/apache24/mod_proxy_http.so
LoadModule ssl_module libexec/apache24/mod_ssl.so
LoadModule ssl_module libexec/apache24/mod_ssl.so
```

- **Set apache user, group**
```
<IfModule unixd_module>
			User www
			Group www
</IfModule>
```

- **Set the port for apache to listen at**
```
Listen 80
```

- **Set server admin email**
```
ServerAdmin EMAIL@DOMAIN.com
```

- **Deny access to root by default**
```
<Directory />
    			AllowOverride none
    			Require all denied
</Directory>
```

- **Set location of web files**
```
DocumentRoot "/usr/local/www/apache24/data"
```

- **Set permissions of web files**
```
<Directory "/usr/local/www/apache24/data">
			Options -Indexes +FollowSymLinks
			AllowOverride None
			<LimitExcept GET POST HEAD>
				  deny from all
			</LimitExcept>
			Require all granted
</Directory>
```

- **Enable / Listen to SSL**
```
<IfModule mod_ssl.c>
			Listen 443
</IfModule>
```

- **Include virtual hosts configuration**
```
		Include etc/apache24/extra/httpd-vhosts.conf
		Include etc/apache24/Includes/*.conf
    Include /usr/local/etc/apache24/extra/httpd-vhosts-le-ssl.conf
```

- **Set security policies**
```
<IfModule mod_headers.c>
        		Header set Content-Security-Policy "default-src 'self'; upgrade-insecure-requests; frame-ancestors 'none'; script-src 'unsafe-inline' *.edgefonts.net https://www.googl\
etagmanager.com/gtag/ https://www.google.com/recaptcha/api.js https://www.gstatic.com/recaptcha/releases/; object-src 'none'; base-uri 'self'; frame-src https://www.google.com\
/;"
        		Header always edit Set-Cookie (.*) "$1; HttpOnly; Secure"
        		Header always set Permissions-Policy "accelerometer=(),ambient-light-sensor=(),attribution-reporting=(),autoplay=(),battery=(),bluetooth=(),browsing-topics=(),camera=(\
),ch-device-memory=(),ch-downlink=(),ch-dpr=(),ch-ect=(),ch-lang=(),ch-prefers-color-scheme=(),ch-rtt=(),ch-save-data=(),ch-ua=(),ch-ua-arch=(),ch-ua-bitness=(),ch-ua-full=(),\
ch-ua-full-version=(),ch-ua-full-version-list=(),ch-ua-mobile=(),ch-ua-model=(),ch-ua-platform=(),ch-ua-platform-version=(),ch-ua-reduced=(),ch-ua-wow64=(),ch-viewport-height=\
(),ch-viewport-width=(),ch-width=(),clipboard-read=(),clipboard-write=(),conversion-measurement=(),cross-origin-isolated=(),direct-sockets=(),display-capture=(),document-domai\
n=(),encrypted-media=(),execution-while-not-rendered=(),execution-while-out-of-viewport=(),federated-credentials=(),focus-without-user-activation=(),fullscreen=(),gamepad=(),g\
eolocation=(),gyroscope=(),hid=(),idle-detection=(),interest-cohort=(),join-ad-interest-group=(),keyboard-map=(),local-fonts=(),magnetometer=(),microphone=(),midi=(),navigatio\
n-override=(),otp-credentials=(),payment=(),picture-in-picture=(),publickey-credentials-get=(),run-ad-auction=(),screen-wake-lock=(),serial=(),shared-autofill=(),shared-storag\
e=(),speaker-selection=(),storage-access-api=(),sync-script=(),sync-xhr=(),trust-token-redemption=(),unload=(),usb=(),vertical-scroll=(),wake-lock=(),web-share=(),window-place\
ment=(),xr-spatial-tracking=()"
        		Header set X-Content-Type-Options "nosniff"
        		Header set X-XSS-Protection "0"
        		#Header set X-XSS-Protection "1; mode=block"
        		Header set Referrer-Policy "strict-origin"
        		Header always set X-Frame-Options: "SAMEORIGIN"
        		Header always set Strict-Transport-Security: "max-age=63072000; includeSubDomains; preload"
        		SetEnv modHeadersAvailable true
		</IfModule>

		#Enable rules
		<IfModule security2_module>
       			SecRuleEngine on
        		ServerTokens Full
        		SecServerSignature " "
		</IfModule>
```

- **Set server name**
```
ServerName 127.0.0.1
```

- **Set location of web files**
```
DocumentRoot "/usr/local/www/apache24/data"
```

------
## Edit the vhosts configuration file
```
>emacs /usr/local/etc/apache24/extra/httpd-vhosts.conf
```

- **Configure as follows**
```
<VirtualHost *:80>
       			ServerAdmin     stayrange@gmail.com
       		 	DocumentRoot    /usr/local/www/apache24/data/handy35l
			
			      #override default directory permissions
       		 	<Directory "/usr/local/www/apache24/data/handy35l">
                   		AllowOverride All
      		        	  Require all granted
				              DirectoryIndex index.html
        		</Directory>

        		# Proxy configuration for API requests
        		ProxyPass "/api" "http://localhost:3535/api"
        		ProxyPassReverse "/api" "http://localhost:3535/api"
	
        		ServerName      handy35l.com
        		ServerAlias     www.handy35l.com
        		ErrorLog        /var/log/handy35l.com-error_log
       		 	CustomLog       /var/log/handy35l.com-access_log common
        		RewriteEngine on
        		RewriteCond %{SERVER_NAME} =handy35l.com [OR]
        		RewriteCond %{SERVER_NAME} =www.handy35l.com
        		RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
		</VirtualHost>
```

------
# With your DNS provider
- **Set your A record name to**
```
@
```
- **Set your A record value to**
```
MACHINEIP
```

------
# Certbot for SSL
- **mostly automated**
```
>pkg install certbot
>certbot --apache
```

------
# Certbot for SSL
- **mostly automated**
```
>pkg install certbot
>certbot --apache
```
